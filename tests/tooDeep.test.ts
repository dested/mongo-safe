/// <reference path="../mongodb.d.ts"/>
import {Aggregator} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, NotHas, IsExact} from 'conditional-type-checks';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};
test('$group.notExcessive', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: 8, numbersLeftArr: 1});

  expect(aggregator.query()).toEqual([
    {
      $group: {
        _id: 8,
        numbersLeftArr: 1,
      },
    },
  ]);

  const result = await aggregator.result(mockCollection);
  const j = result.map((a) => a.numbersLeftArr); // should not be excessively deep
  assert<Has<{_id: 8; numbersLeftArr: 1}, typeof result[0]>>(true);
});
