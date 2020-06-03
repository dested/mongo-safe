import {Aggregator} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has} from 'conditional-type-checks';

test('project.none', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: true,
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: true}}]);

  const [result] = await aggregator.result();
  assert<Has<{shoes: true}, typeof result>>(true);
});

test('project.$dateToString', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $dateToString: {
        date: new Date(),
        format: '',
      },
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$dateToString: {date: new Date(), format: ''}}}}]);

  const [result] = await aggregator.result();
  assert<Has<{shoes: string}, typeof result>>(true);
});

test('project.$dateToString.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $dateToString: {
        date: agg.referenceKey((a) => a.doors.someDate),
        format: '',
      },
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$dateToString: {date: '$doors.someDate', format: ''}}}}]);

  const [result] = await aggregator.result();
  assert<Has<{shoes: string}, typeof result>>(true);
});

test('project.$sum', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $sum: 7,
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: 7}}}]);

  const [result] = await aggregator.result();
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$sum.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $sum: agg.referenceKey((a) => a.doors.someNumber),
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result();
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$cond', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $cond: {
        if: true,
        then: 1,
        else: 2,
      },
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$cond: {if: true, then: 1, else: 2}}}}]);

  const [result] = await aggregator.result();
  assert<Has<{shoes: 1 | 2}, typeof result>>(true);
});

test('project.$cond.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $cond: {
        if: agg.referenceKey((a) => a.doors.side),
        then: agg.referenceKey((a) => a.doors.side),
        else: agg.referenceKey((a) => a.doors.bolts),
      },
    },
  }));
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$cond: {if: '$doors.side', then: '$doors.side', else: '$doors.bolts'}}}},
  ]);

  const [result] = await aggregator.result();
  assert<Has<{shoes: ('left' | 'right') | Bolt[]}, typeof result>>(true);
});
