import {Aggregator, AggregatorLookup, UnArray} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, DBCar, Door} from './models/dbCar';
import {assert, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';
import {ObjectID} from 'mongodb';
import {Combine, ReplaceKey} from './typeUtils';

test('simple', async () => {
  const aggregator = Aggregator.start<DBCar>();
  expect(aggregator.query()).toEqual([]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, DBCar>>(true);
});

test('$match', async () => {
  const aggregator = Aggregator.start<DBCar>().$match({color: 'black'});
  expect(aggregator.query()).toEqual([{$match: {color: 'black'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, DBCar>>(true);
});

test('$match.deep', async () => {
  const aggregator = Aggregator.start<DBCar>().$matchCallback((agg) => ({
    ...agg.keyFilter((a) => a.tailPipe.count, 4),
  }));
  expect(aggregator.query()).toEqual([{$match: {'tailPipe.count': 4}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, DBCar>>(true);
});

test('$project.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: 'black'});
  expect(aggregator.query()).toEqual([{$project: {color: 'black'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {color: string}>>(true);
});

test('$project.callback', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({color: 'black'}));
  expect(aggregator.query()).toEqual([{$project: {color: 'black'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {color: string}>>(true);
});

test('$project.nested', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({color: {foo: 12}}));
  expect(aggregator.query()).toEqual([{$project: {color: {foo: 12}}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {color: {foo: number}}>>(true);
});

test('$project.nested-reference', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    color: {foo: agg.referenceKey((a) => a.color)},
  }));
  expect(aggregator.query()).toEqual([{$project: {color: {foo: '$color'}}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {color: {foo: 'black' | 'red'}}>>(true);
});

test('$project.reference', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({color: agg.referenceKey((a) => a.color)}));
  expect(aggregator.query()).toEqual([{$project: {color: '$color'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {color: 'black' | 'red'}>>(true);
});

test('$project.map', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    mappedDoors: agg.operators.$map(
      agg.key((a) => a.doors),
      'door',
      (innerAgg) => ({
        good: 'foo',
        side: innerAgg.referenceKey((a) => a.door.side),
      })
    ),
  }));
  expect(aggregator.query()).toEqual([
    {$project: {mappedDoors: {$map: {input: 'doors', as: 'door', in: {good: 'foo', side: '$$door.side'}}}}},
  ]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {mappedDoors: {good: string; side: 'left' | 'right'}[]}>>(true);
});

test('$project.id', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    id: agg.referenceKey((a) => a._id),
  }));
  expect(aggregator.query()).toEqual([{$project: {id: '$_id'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {id: ObjectID}>>(true);
});

test('$project.array', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    doorHeads: agg.referenceKey((a) => a.doors.bolts.type),
    carbHeads: agg.referenceKey((a) => a.carburetor.bolts.type),
  }));

  expect(aggregator.query()).toEqual([
    {
      $project: {
        doorHeads: '$doors.bolts.type',
        carbHeads: '$carburetor.bolts.type',
      },
    },
  ]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {doorHeads: 'phillips' | 'flat'; carbHeads: 'phillips' | 'flat'}>>(true);
});

test('$lookup', async () => {
  const aggregator = Aggregator.start<DBCar>().$lookupCallback((agg, aggLookup: AggregatorLookup<DBWindow>) => ({
    from: 'window',
    localField: agg.key((a) => a._id),
    foreignField: aggLookup.key((a) => a.carId),
    as: 'windows',
  }));

  expect(aggregator.query()).toEqual([
    {
      $lookup: {
        from: 'window',
        localField: '_id',
        foreignField: 'carId',
        as: 'windows',
      },
    },
  ]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, DBCar & {windows: DBWindow[]}>>(true);
});

test('$addField.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$addFields({
    shoes: 'hi',
  });

  expect(aggregator.query()).toEqual([{$addFields: {shoes: 'hi'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, DBCar & {shoes: string}>>(true);
});

test('$addField.complex', async () => {
  const aggregator = Aggregator.start<DBCar>().$addFieldsCallback((agg) => ({
    shoes: agg.referenceKey((a) => a.doors.bolts),
  }));

  expect(aggregator.query()).toEqual([{$addFields: {shoes: '$doors.bolts'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result.shoes[0]['type'], Bolt['type']>>(true);
  assert<IsExact<typeof result, DBCar & {shoes: Bolt[]}>>(true);
});

test('$unwind.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('doors');

  expect(aggregator.query()).toEqual([{$unwind: '$doors'}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, ReplaceKey<DBCar, 'doors', Door>>>(true);
});
test('$unwind.2', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('carburetor', 'bolts');

  expect(aggregator.query()).toEqual([{$unwind: '$carburetor.bolts'}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, ReplaceKey<DBCar, 'carburetor', ReplaceKey<Carburetor, 'bolts', Bolt>>>>(true);
});

test('$unwind.3', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('carburetor', 'base', 'bolts');

  expect(aggregator.query()).toEqual([{$unwind: '$carburetor.base.bolts'}]);

  const result = await aggregator.result();
  assert<
    IsExact<
      typeof result,
      ReplaceKey<DBCar, 'carburetor', ReplaceKey<Carburetor, 'base', ReplaceKey<CarburetorBase, 'bolts', Bolt>>>
    >
  >(true);
});

test('$graphLookup.otherTable', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup(
    (aggregator, aggregatorLookup: AggregatorLookup<DBWindow>) => {
      return {
        collectionName: 'window',
        startWith: aggregatorLookup.referenceKey((a) => a.tint),
        as: 'shoes',
        connectFromField: aggregator.key((a) => a.carburetor),
        connectToField: aggregator.key((a) => a.doors),
      };
    }
  );

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        collectionName: 'window',
        startWith: '$tint',
        as: 'shoes',
        connectFromField: 'carburetor',
        connectToField: 'doors',
      },
    },
  ]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, Combine<DBCar, 'shoes', DBWindow[]>>>(true);
});

test('$graphLookup.sameTable', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup((aggregator, aggregatorLookup: AggregatorLookup<DBCar>) => {
    return {
      collectionName: 'car',
      startWith: aggregatorLookup.referenceKey((a) => a.color),
      as: 'shoes',
      connectFromField: aggregator.key((a) => a.carburetor),
      connectToField: aggregator.key((a) => a.doors),
    };
  });

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        collectionName: 'car',
        startWith: '$color',
        as: 'shoes',
        connectFromField: 'carburetor',
        connectToField: 'doors',
      },
    },
  ]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, Combine<DBCar, 'shoes', DBCar[]>>>(true);
});

test('$graphLookup.depthField', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup(
    (aggregator, aggregatorLookup: AggregatorLookup<DBWindow>) => {
      return {
        collectionName: 'window',
        startWith: aggregatorLookup.referenceKey((a) => a.tint),
        as: 'shoes',
        connectFromField: aggregator.key((a) => a.carburetor),
        connectToField: aggregator.key((a) => a.doors),
        depthField: 'numConnections',
      };
    }
  );

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        collectionName: 'window',
        startWith: '$tint',
        as: 'shoes',
        connectFromField: 'carburetor',
        connectToField: 'doors',
        depthField: 'numConnections',
      },
    },
  ]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, Combine<DBCar, 'shoes', Combine<DBWindow, 'numConnections', number>[]>>>(true);
});

test('$group.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$group((agg) => ({
    _id: {simple: true},
  }));

  expect(aggregator.query()).toEqual([{$group: {_id: {simple: true}}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {_id: {simple: boolean}}>>(true);
});

test('$group.simple-key', async () => {
  const aggregator = Aggregator.start<DBCar>().$group((agg) => ({
    _id: agg.referenceKey((a) => a.color),
  }));

  expect(aggregator.query()).toEqual([{$group: {_id: '$color'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {_id: 'red' | 'black'}>>(true);
});

test('$group.simple-ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$group((agg) => ({
    _id: agg.referenceKey((a) => a.color),
  }));

  expect(aggregator.query()).toEqual([{$group: {_id: '$color'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {_id: 'black' | 'red'}>>(true);
});

test('$group.simple-nested-ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$group((agg) => ({
    _id: {color: agg.referenceKey((a) => a.color)},
  }));

  expect(aggregator.query()).toEqual([{$group: {_id: {color: '$color'}}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {_id: {color: 'black' | 'red'}}>>(true);
});

test('$group.ref-and-keys', async () => {
  const aggregator = Aggregator.start<DBCar>().$group((agg) => ({
    _id: agg.referenceKey((a) => a.color),
    side: agg.referenceKey((a) => a.doors.side),
  }));

  expect(aggregator.query()).toEqual([{$group: {_id: '$color', side: '$doors.side'}}]);

  const result = await aggregator.result();
  assert<IsExact<typeof result, {_id: 'black' | 'red'; side: UnArray<DBCar['doors']>['side']}>>(true);
});
