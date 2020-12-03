/// <reference path="../mongodb.d.ts"/>
import {Aggregator, ExpressionStringReferenceKey} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, NotHas} from 'conditional-type-checks';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('project.none', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({shoes: true});
  expect(aggregator.query()).toEqual([{$project: {shoes: true}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: true}, typeof result>>(true);
});

test('project.$dateToString', async () => {
  let date = new Date();
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $dateToString: {
        date: date,
        format: '',
      },
    },
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$dateToString: {date: date, format: ''}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: string}, typeof result>>(true);
});

const j: ExpressionStringReferenceKey<DBCar, Date> = '$someDate';
test('project.$dateToString.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $dateToString: {
        date: '$doors.someDate',
        format: '',
      },
    },
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$dateToString: {date: '$doors.someDate', format: ''}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: string}, typeof result>>(true);
});

test('project.$sum', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $sum: 7,
    },
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: 7}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: 7}, typeof result>>(true);
});

test('project.$sum.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $sum: '$doors.someNumber',
    },
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$cond', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $cond: {
        if: true,
        then: 1,
        else: 2,
      },
    },
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$cond: {if: true, then: 1, else: 2}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: 1 | 2}, typeof result>>(true);
});

test('project.$cond.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $cond: {
        if: '$doors.side',
        then: '$doors.side',
        else: '$doors.bolts',
      },
    },
  });
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$cond: {if: '$doors.side', then: '$doors.side', else: '$doors.bolts'}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{shoes: 'left' | 'right' | Bolt[]}, typeof result>>(true);
  assert<NotHas<{shoes: Bolt}, typeof result>>(true);
});

test('project.$eq', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $eq: [true, true],
    },
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$eq: [true, true]}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: boolean}, typeof result>>(true);
});

test('project.$eq.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $eq: ['$doors.side', '$doors.childLocks'],
    },
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$eq: ['$doors.side', '$doors.childLocks']}}}]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{shoes: boolean}, typeof result>>(true);
});

test('project.$map', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {$map: {input: '$doors', as: 'thing', in: {a: true, b: 1}}},
  });
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$map: {input: '$doors', as: 'thing', in: {a: true, b: 1}}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: {a: true; b: 1}[]}, typeof result>>(true);
});

test('project.$map.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {$map: {input: '$doors', as: 'thing', in: {a: true, b: '$$thing.someNumber'}}},
  } as const);
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$map: {input: '$doors', as: 'thing', in: {a: true, b: '$$thing.someNumber'}}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: {a: true; b: number}[]}, typeof result>>(true);
});

test('project.$map.nested.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {$map: {input: '$doors', as: 'thing', in: {a: true, b: {bar: '$$thing.someNumber'}}}},
  } as const);
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$map: {input: '$doors', as: 'thing', in: {a: true, b: {bar: '$$thing.someNumber'}}}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: {a: true; b: {bar: number}}[]}, typeof result>>(true);
});

/*
test('project.$map.double-nested.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $map: {
        input: '$doors',
        as: 'thing',
        in: {
          a: true,
          b: {
            $map: {
              input: '$$thing.bolts',
              as: 'bb',
              in: {
                fire: '$$bb.type',
              },
            },
          },
        },
      },
    },
  } as const);
  expect(aggregator.query()).toEqual([
    {
      $project: {
        shoes: {
          $map: {
            input: '$doors',
            as: 'thing',
            in: {
              a: true,
              b: {
                $map: {
                  input: '$$thing.bolts',
                  as: 'bb',
                  in: {
                    fire: '$$bb.type',
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  result.shoes[0].b[0].fire === 'phiull';
  assert<Has<{shoes: {a: true; b: {fire: 'phillips' | 'flat'}[]}[]}, typeof result>>(true);
});
*/

test('project.$sum', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {$sum: 7},
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: 7}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: 7}, typeof result>>(true);
});

test('project.$sum.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $sum: '$doors.someNumber',
    },
  } as const);
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$sum.ref.nested', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({shoes: {$sum: {$sum: {$sum: '$doors.someNumber'}}}} as const);
  expect(aggregator.query()).toEqual([{$project: {shoes: {$sum: {$sum: {$sum: '$doors.someNumber'}}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});

test('project.$abs', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {$abs: 7},
  });
  expect(aggregator.query()).toEqual([{$project: {shoes: {$abs: 7}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: 7}, typeof result>>(true);
});

test('project.$abs.ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({shoes: {$abs: '$doors.someNumber'}});
  expect(aggregator.query()).toEqual([{$project: {shoes: {$abs: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: number}, typeof result>>(true);
});
