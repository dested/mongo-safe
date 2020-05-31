import {Aggregator, AggregatorLookup} from '../src/typeSafeAggregate';
import {DBCar} from './models/dbCar';
import {assert, AssertFalse, AssertTrue, Has, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';

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
