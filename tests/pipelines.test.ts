/// <reference path="../mongodb.d.ts"/>
import {
  Aggregator,
  ExpressionStringReferenceKey,
  LookupKey,
  ProjectObjectResult,
  UnArray,
} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, NotHas, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';
import {ObjectID} from 'mongodb';
import {Combine, ReplaceKey} from './typeUtils';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('simple', async () => {
  const aggregator = Aggregator.start<DBCar>();
  expect(aggregator.query()).toEqual([]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});

test('$match', async () => {
  const aggregator = Aggregator.start<DBCar>().$match({color: 'black'});
  expect(aggregator.query()).toEqual([{$match: {color: 'black'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});

test('$match.deep', async () => {
  const aggregator = Aggregator.start<DBCar>().$match({'tailPipe.count': 4});
  expect(aggregator.query()).toEqual([{$match: {'tailPipe.count': 4}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});

test('$project.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: 'black'});
  expect(aggregator.query()).toEqual([{$project: {color: 'black'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: 'black'}, typeof result>>(true);
});

test('$project.callback', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: 'black'});
  expect(aggregator.query()).toEqual([{$project: {color: 'black'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: 'black'}, typeof result>>(true);
});

test('$project.nested', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: {foo: 12}});
  expect(aggregator.query()).toEqual([{$project: {color: {foo: 12}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: {foo: 12}}, typeof result>>(true);
});

test('$project.reference', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: '$color'});
  expect(aggregator.query()).toEqual([{$project: {color: '$color'}}]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{color: Color}, typeof result>>(true);
});

test('$project.nested-reference', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: {foo: '$color'}});
  expect(aggregator.query()).toEqual([{$project: {color: {foo: '$color'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: {foo: Color}}, typeof result>>(true);
});

test('$project.map', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    mappedDoors: {$map: {input: '$doors', as: 'door', in: {good: 'foo', side: '$$door.side'}}},
  });
  expect(aggregator.query()).toEqual([
    {$project: {mappedDoors: {$map: {input: '$doors', as: 'door', in: {good: 'foo', side: '$$door.side'}}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{mappedDoors: {good: 'foo'; side: 'left' | 'right'}[]}, typeof result>>(true);
});

test('$project.id', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({id: '$_id'});
  expect(aggregator.query()).toEqual([{$project: {id: '$_id'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{id: ObjectID}, typeof result>>(true);
});

test('$project.array', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    doorHeads: '$doors.bolts.type',
    carbHeads: '$carburetor.bolts.type',
  });

  expect(aggregator.query()).toEqual([
    {
      $project: {
        doorHeads: '$doors.bolts.type',
        carbHeads: '$carburetor.bolts.type',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{doorHeads: 'phillips' | 'flat'; carbHeads: 'phillips' | 'flat'}, typeof result>>(true);
});

test('$lookup', async () => {
  const aggregator = Aggregator.start<DBCar>().$lookup<DBWindow, 'windows'>({
    from: 'window',
    localField: '_id',
    foreignField: 'carId',
    as: 'windows',
  });

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

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {windows: DBWindow[]}, typeof result>>(true);
});

test('$addField.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$addFields({
    shoes: 'hi',
  });

  expect(aggregator.query()).toEqual([{$addFields: {shoes: 'hi'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {shoes: 'hi'}, typeof result>>(true);
});

test('$addField.complex', async () => {
  const aggregator = Aggregator.start<DBCar>().$addFields({shoes: '$doors.bolts'});

  expect(aggregator.query()).toEqual([{$addFields: {shoes: '$doors.bolts'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Bolt['type'], typeof result.shoes[0]['type']>>(true);
  assert<Has<DBCar & {shoes: Bolt[]}, typeof result>>(true);
  assert<NotHas<DBCar & {shoes: Bolt}, typeof result>>(true);
});

test('$unwind.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('doors');

  expect(aggregator.query()).toEqual([{$unwind: '$doors'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<ReplaceKey<DBCar, 'doors', Door>, typeof result>>(true);
});
test('$unwind.2', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('carburetor', 'bolts');

  expect(aggregator.query()).toEqual([{$unwind: '$carburetor.bolts'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<ReplaceKey<DBCar, 'carburetor', ReplaceKey<Carburetor, 'bolts', Bolt>>, typeof result>>(true);
});

test('$unwind.3', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('carburetor', 'base', 'bolts');

  expect(aggregator.query()).toEqual([{$unwind: '$carburetor.base.bolts'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      ReplaceKey<DBCar, 'carburetor', ReplaceKey<Carburetor, 'base', ReplaceKey<CarburetorBase, 'bolts', Bolt>>>,
      typeof result
    >
  >(true);
});

test('$graphLookup.otherTable', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup<DBWindow, 'shoes'>({
    collectionName: 'window',
    startWith: '$doors',
    as: 'shoes',
    connectFromField: 'someDate',
    connectToField: 'tint',
  });

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        collectionName: 'window',
        startWith: '$doors',
        as: 'shoes',
        connectFromField: 'someDate',
        connectToField: 'tint',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Combine<DBCar, 'shoes', DBWindow[]>, typeof result>>(true);
});

test('$graphLookup.sameTable', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup<DBCar, 'shoes'>({
    collectionName: 'car',
    startWith: '$color',
    as: 'shoes',
    connectFromField: 'carburetor',
    connectToField: 'doors',
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

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Combine<DBCar, 'shoes', DBCar[]>, typeof result>>(true);
});

test('$graphLookup.depthField', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup<DBWindow, 'shoes', 'numConnections'>({
    collectionName: 'window',
    startWith: '$color',
    as: 'shoes',
    connectFromField: 'carburetor',
    connectToField: 'tint',
    depthField: 'numConnections',
  });

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        collectionName: 'window',
        startWith: '$color',
        as: 'shoes',
        connectFromField: 'carburetor',
        connectToField: 'tint',
        depthField: 'numConnections',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Combine<DBCar, 'shoes', Combine<DBWindow, 'numConnections', number>[]>, typeof result>>(true);
});

test('$group.simple1', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: 8});

  expect(aggregator.query()).toEqual([{$group: {_id: 8}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: 8}, typeof result>>(true);
});

test('$group.groupThenAddField', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: 8}, {a: 1}).$addFields({
    shoes: '$a',
  });

  expect(aggregator.query()).toEqual([{$group: {_id: 8, a: 1}}, {$addFields: {shoes: '$a'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: 8; a: 1; shoes: 1}, typeof result>>(true);
});

test('$group.groupThenAddFieldDeep', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$group(
      {_id: 8},
      {
        numbersLeftArr: {
          $push: {
            boardId: '$_id',
            count: {
              $arrayElemAt: ['$doors', 0],
            },
          },
        },
      }
    )
    .$addFields({
      shoes: {
        $min: '$numbersLeftArr.count.someNumber',
      },
    });

  expect(aggregator.query()).toEqual([
    {
      $group: {
        _id: 8,
        numbersLeftArr: {
          $push: {
            boardId: '$_id',
            count: {
              $arrayElemAt: ['$doors', 0],
            },
          },
        },
      },
    },
    {
      $addFields: {
        shoes: {
          $min: '$numbersLeftArr.count.someNumber',
        },
      },
    },
  ]);

  const result = await aggregator.result(mockCollection);
  const j = result.map((a) => a.numbersLeftArr.map((b) => b.count)); // should not be excesively deep
  assert<Has<{_id: 8; numbersLeftArr: {boardId: ObjectID; count: Door}[]; shoes: number}, typeof result[0]>>(true);
});

test('$group.simple2', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: {simple: true}});

  expect(aggregator.query()).toEqual([{$group: {_id: {simple: true}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: {simple: true}}, typeof result>>(true);
});

test('$group.simple-key', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: '$color'});

  expect(aggregator.query()).toEqual([{$group: {_id: '$color'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: Color}, typeof result>>(true);
});

test('$group.simple-ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: '$color'});

  expect(aggregator.query()).toEqual([{$group: {_id: '$color'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: Color}, typeof result>>(true);
});

test('$group.simple-nested-ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: {color: '$color'}});

  expect(aggregator.query()).toEqual([{$group: {_id: {color: '$color'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: {color: Color}}, typeof result>>(true);
});

test('$group.ref-and-keys', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: '$color'}, {side: {$sum: '$doors.someNumber'}});

  expect(aggregator.query()).toEqual([{$group: {_id: '$color', side: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: Color; side: number}, typeof result>>(true);
});

test('$project.ref-and-keyes', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    side: {$dateToString: {date: '$doors.someDate', format: 'shoes'}},
  });

  expect(aggregator.query()).toEqual([{$project: {side: {$dateToString: {date: '$doors.someDate', format: 'shoes'}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{side: string}, typeof result>>(true);
});

test('$project.$sum', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({side: {$sum: '$doors.someNumber'}});

  expect(aggregator.query()).toEqual([{$project: {side: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{side: number}, typeof result>>(true);
});

test('$count', async () => {
  const aggregator = Aggregator.start<DBCar>().$count('amount');

  expect(aggregator.query()).toEqual([{$count: 'amount'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{amount: number}, typeof result>>(true);
});
