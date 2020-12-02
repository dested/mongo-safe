import {Aggregator} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has} from 'conditional-type-checks';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('project.none', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: true,
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: true}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: true}, typeof result>>(true);
});

test('project.$dateToString', async () => {
  let date = new Date();
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $dateToString: {
        date: date,
        format: '',
      },
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$dateToString: {date: date, format: ''}}}}]);

  const [result] = await aggregator.result(mockCollection);
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

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: string}, typeof result>>(true);
});

test('project.$sum', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $sum: 7,
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: 7}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$sum.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $sum: agg.referenceKey((a) => a.doors.someNumber),
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
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

  const [result] = await aggregator.result(mockCollection);
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

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: ('left' | 'right') | Bolt[]}, typeof result>>(true);
});

test('project.$eq', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $eq: [true, true],
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$eq: [true, true]}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: boolean}, typeof result>>(true);
});

test('project.$eq.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $eq: [agg.referenceKey((a) => a.doors.side), agg.referenceKey((a) => a.doors.childLocks)],
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$eq: ['$doors.side', '$doors.childLocks']}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: boolean}, typeof result>>(true);
});

test('project.$map', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: agg.operators.$map(
      agg.key((a) => a.doors),
      'thing',
      (innerAgg) => ({
        a: true,
        b: 1,
      })
    ),
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$map: {input: 'doors', as: 'thing', in: {a: true, b: 1}}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: {a: true; b: number}[]}, typeof result>>(true);
});

test('project.$map.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: agg.operators.$map(
      agg.key((a) => a.doors),
      'thing',
      (innerAgg) => ({
        a: true,
        b: innerAgg.referenceKey((a) => a.thing.someNumber),
      })
    ),
  }));
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$map: {input: 'doors', as: 'thing', in: {a: true, b: '$$thing.someNumber'}}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: {a: true; b: number}[]}, typeof result>>(true);
});

test('project.$map.nested.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: agg.operators.$map(
      agg.key((a) => a.doors),
      'thing',
      (innerAgg) => ({
        a: true,
        b: {bar: innerAgg.referenceKey((a) => a.thing.someNumber)},
      })
    ),
  }));
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$map: {input: 'doors', as: 'thing', in: {a: true, b: {bar: '$$thing.someNumber'}}}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: {a: true; b: {bar: number}}[]}, typeof result>>(true);
});

test('project.$sum', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {$sum: 7},
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: 7}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$sum.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $sum: agg.referenceKey((a) => a.doors.someNumber),
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$sum.ref.nested', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $sum: {$sum: {$sum: agg.referenceKey((a) => a.doors.someNumber)}},
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: {$sum: {$sum: '$doors.someNumber'}}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$abs', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {$abs: 7},
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$abs: 7}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$abs.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$projectCallback((agg) => ({
    shoes: {
      $abs: agg.referenceKey((a) => a.doors.someNumber),
    },
  }));
  expect(aggregator.query()).toEqual([{$project: {shoes: {$abs: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});
