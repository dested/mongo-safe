/// <reference path="../mongodb.d.ts"/>
import {Aggregator, Pipeline, PipelineResult, tableName} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, NotHas, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('simple', async () => {
  let dbCarAggregator = Aggregator.start<DBCar>();

  const aggregator = dbCarAggregator.pipe([
    {$project: {shoes: '$doors'}},
    {$group: {_id: 1, side: {$sum: 1}, ff: {$first: '$shoes'}}},
    {$addFields: {foo: '$ff.bolts'}},
    {
      $lookup: {
        from: tableName<DBWindow>('window'),
        localField: '_id',
        foreignField: 'carId',
        as: 'windows',
      },
    },
    {
      $lookup: {
        from: tableName<DBWindow>('window'),
        localField: '_id',
        foreignField: 'carId',
        as: 'windows2',
        let: {a: 1},
        pipeline: [{$project: {b: 'a'}}],
      },
    },
  ] as const);

  assert<
    IsExact<
      {
        readonly _id: 1;
        readonly side: number;
        readonly ff: Door[];
        foo: Bolt[];
        windows: DBWindow[];
        windows2: {b: 'a'}[];
      },
      typeof aggregator
    >
  >(true);
});
test('simple2', async () => {
  let dbCarAggregator = Aggregator.start<DBCar>();

  const aggregator = dbCarAggregator.pipe([
    {$project: {shoes: '$doors'}},
    {$group: {_id: 1, side: {$sum: 1}, ff: {$first: '$shoes'}}},
    {$addFields: {foo: '$ff.bolts'}},
    {
      $lookup: {
        from: tableName<DBWindow>('window'),
        localField: '_id',
        foreignField: 'carId',
        as: 'windows2',
        let: {a: 1},
      },
    },
  ] as const);

  assert<
    IsExact<
      {readonly _id: 1; readonly side: number; readonly ff: Door[]; foo: Bolt[]; windows2: {a: 1}[]},
      typeof aggregator
    >
  >(true);
});
test('simple3', async () => {
  let dbCarAggregator = Aggregator.start<DBCar>();

  const aggregator = dbCarAggregator.pipe([
    {$project: {shoes: '$doors'}},
    {$group: {_id: 1, side: {$sum: 1}, ff: {$first: '$shoes'}}},
    {$addFields: {foo: '$ff.bolts'}},
    {
      $lookup: {
        from: tableName<DBWindow>('window'),
        localField: '_id',
        foreignField: 'carId',
        as: 'windows2',
        let: {a: 1},
        pipeline: [
          {
            $project: {hi: '$$a'},
          },
        ],
      },
    },
  ] as const);

  assert<
    IsExact<
      {readonly _id: 1; readonly side: number; readonly ff: Door[]; foo: Bolt[]; windows2: {hi: 1}[]},
      typeof aggregator
    >
  >(true);
});
