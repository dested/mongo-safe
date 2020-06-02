import {Aggregator, AggregatorLookup, FlattenArray} from '../src/typeSafeAggregate';
import {DBCar} from './models/dbCar';
import {assert, AssertFalse, AssertTrue, Has, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';
import {DBTire} from './models/dbTire';
import {ObjectID} from 'mongodb';

test('complex1', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$lookupCallback((agg, aggLookup: AggregatorLookup<DBWindow>) => ({
      from: 'window',
      localField: agg.key((a) => a._id),
      foreignField: aggLookup.key((a) => a.carId),
      as: 'windows',
    }))
    .$lookupCallback((agg, aggLookup: AggregatorLookup<DBTire>) => ({
      from: 'tire',
      localField: agg.key((a) => a._id),
      foreignField: aggLookup.key((a) => a.carId),
      as: 'tires',
    }))
    .$matchCallback((agg) => ({
      $or: [{color: 'red'}, agg.keyFilter((a) => a.windows.tint, 'dark'), agg.keyFilter((a) => a.tires.size, 4)],
    }))
    .$projectCallback((agg) => {
      return {
        id: agg.referenceKey((a) => a._id),
        something: 7,
        color: agg.referenceKey((a) => a.color),
        tires: agg.operators.$map(
          agg.key((a) => a.tires),
          'tire',
          (innerAgg) => ({
            id: innerAgg.referenceKey((a) => a.tire._id),
            shoes: innerAgg.referenceKey((a) => a.tire.size),
          })
        ),
      };
    })
    .$sort({something: 1})
    .$sortCallback((agg) => ({[agg.keyLookup((a) => a.tires.shoes)]: 1}))
    .$skip(5)
    .$limit(6);

  expect(aggregator.query()).toEqual([
    {$lookup: {as: 'windows', foreignField: 'carId', from: 'window', localField: '_id'}},
    {$lookup: {as: 'tires', foreignField: 'carId', from: 'tire', localField: '_id'}},
    {$match: {$or: [{color: 'red'}, {'windows.tint': 'dark'}, {'tires.size': 4}]}},
    {
      $project: {
        color: '$color',
        id: '$_id',
        something: 7,
        tires: {$map: {as: 'tire', in: {id: '$$tire._id', shoes: '$$tire.size'}, input: 'tires'}},
      },
    },
    {$sort: {something: 1}},
    {$sort: {'tires.shoes': 1}},
    {$skip: 5},
    {$limit: 6},
  ]);

  const [result] = await aggregator.result();
  assert<
    IsExact<
      typeof result,
      {
        id: ObjectID;
        something: number;
        color: 'black' | 'red';
        tires: {id: ObjectID; shoes: number}[];
      }
    >
  >(false);
});
