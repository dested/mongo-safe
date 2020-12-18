/// <reference path="../mongodb.d.ts"/>
import {Aggregator, Pipeline, PipelineResult} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, NotHas, IsExact} from 'conditional-type-checks';

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
  ] as const);

  assert<IsExact<{readonly _id: 1; readonly side: number; readonly ff: Door[]; foo: Bolt[]}, typeof aggregator>>(true);
});
