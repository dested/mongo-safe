/// <reference path="../mongodb.d.ts"/>
import {Aggregator, ExcludeNever} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, IsExact, NotHas} from 'conditional-type-checks';
import {ObjectId} from 'bson';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('project.none', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$project({someRootNumber: 1, doors: 1})
    .$unwind('$doors')
    .$facet({
      thing1: (agg) => agg.$group({_id: '$doors.side', count: {$sum: '$doors.someNumber'}}),
      thing2: (agg) =>
        agg.$group({_id: '$doors.someDate', counter: {$sum: '$doors.someNumber'}}).$match({counter: {$gt: 10}}),
    });
  expect(aggregator.query()).toEqual([
    {$project: {someRootNumber: 1, doors: 1}},
    {$unwind: '$doors'},
    {
      $facet: {
        thing1: [{$group: {_id: '$doors.side', count: {$sum: '$doors.someNumber'}}}],

        thing2: [
          {$group: {_id: '$doors.someDate', counter: {$sum: '$doors.someNumber'}}},
          {$match: {counter: {$gt: 10}}},
        ],
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<{thing1: {_id: 'left' | 'right'; count: number}[]; thing2: {_id: Date; counter: number}[]}, typeof result>
  >(true);
});

test('unset', async () => {
  const aggregator = Aggregator.start<DBCar>().$unset('carburetor');
  expect(aggregator.query()).toEqual([{$unset: 'carburetor'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<ExcludeNever<DBCar & {['carburetor']: never}>, typeof result>>(true);
});
