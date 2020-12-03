/// <reference path="../mongodb.d.ts"/>
import {Aggregator} from '../src';
import {DBCar} from './models/dbCar';
import {assert, AssertFalse, AssertTrue, Has, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';
import {DBTire} from './models/dbTire';
import {ObjectID} from 'mongodb';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('complex1', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$lookup<DBWindow, 'windows'>({
      from: 'window',
      localField: '_id',
      foreignField: 'carId',
      as: 'windows',
    })
    .$lookup<DBTire, 'tires'>({
      from: 'tire',
      localField: '_id',
      foreignField: 'carId',
      as: 'tires',
    })
    .$match({
      $or: [{color: 'red'}, {'windows.tint': 'dark'}, {'tires.size': 4}],
    })
    .$project({
      id: '$_id',
      something: 7,
      color: '$color',
      tires: {
        $map: {
          input: '$tires',
          as: 'tire',
          in: {
            id: '$$tire._id',
            shoes: '$$tire.size',
          },
        },
      },
    })
    .$sort({something: 1})
    .$sort({'tires.shoes': 1})
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
        tires: {$map: {as: 'tire', in: {id: '$$tire._id', shoes: '$$tire.size'}, input: '$tires'}},
      },
    },
    {$sort: {something: 1}},
    {$sort: {'tires.shoes': 1}},
    {$skip: 5},
    {$limit: 6},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        id: ObjectID;
        something: number;
        color: 'black' | 'red';
        tires: {id: ObjectID; shoes: number}[];
      },
      typeof result
    >
  >(false);
});
