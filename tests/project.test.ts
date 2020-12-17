/// <reference path="../mongodb.d.ts"/>
import {Aggregator} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, IsExact, NotHas} from 'conditional-type-checks';
import {ObjectId} from 'bson';

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

test('project.optionalFiends', async () => {
  type T = {a?: number; b: number; c: {d: number; e?: number}};
  const aggregator = Aggregator.start<T>().$match({
    'c.d': 12,
    a: 15,
    b: 220,
    'c.e': 1010,
  });
  expect(aggregator.query()).toEqual([
    {
      $match: {
        'c.d': 12,
        a: 15,
        b: 220,
        'c.e': 1010,
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<T, typeof result>>(true);
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
      $cond: {if: '$doors.side', then: '$doors.side', else: '$doors.bolts'},
    },
  });
  expect(aggregator.query()).toEqual([
    {$project: {shoes: {$cond: {if: '$doors.side', then: '$doors.side', else: '$doors.bolts'}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{shoes: 'left' | 'right' | Bolt[]}, typeof result>>(true);
  assert<NotHas<{shoes: Bolt}, typeof result>>(true);
});

test('project.match array', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$project({
      shoes: [{a: 'abc'}],
    })
    .$match({
      'shoes.a': 'abc',
    });

  expect(aggregator.query()).toEqual([
    {
      $project: {
        shoes: [{a: 'abc'}],
      },
    },
    {$match: {'shoes.a': 'abc'}},
  ]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{shoes: {a: 'abc'}[]}, typeof result>>(true);
});

test('project.match array', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$project({
      shoes: '$doors',
    })
    .$sort({'shoes.someNumber': 1})
    .$match({'shoes.someNumber': 1});

  expect(aggregator.query()).toEqual([
    {$project: {shoes: '$doors'}},
    {$sort: {'shoes.someNumber': 1}},
    {$match: {'shoes.someNumber': 1}},
  ]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{shoes: Door[]}, typeof result>>(true);
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
test('project.$concatArray', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: {
      $concatArrays: [
        ['hello', ' '],
        [['world'], 'again'],
      ],
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        shoes: {
          $concatArrays: [
            ['hello', ' '],
            [['world'], 'again'],
          ],
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: ('hello' | ' ' | 'again' | 'world')[]}, typeof result>>(true);
});

test('project.$cmp', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    cmpTo250: {$cmp: ['$someRootNumber', 250]},
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        cmpTo250: {$cmp: ['$someRootNumber', 250]},
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{cmpTo250: number}, typeof result>>(true);
});
test('project.$dateFromParts', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    date: {
      $dateFromParts: {
        year: 12,
        month: '$someRootNumber',
      },
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        date: {
          $dateFromParts: {
            year: 12,
            month: '$someRootNumber',
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{date: Date}, typeof result>>(true);
});
test('project.$dateToParts', async () => {
  let date1 = new Date();
  const aggregator = Aggregator.start<DBCar>().$project({
    date: {
      $dateToParts: {
        date: date1,
      },
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        date: {
          $dateToParts: {
            date: date1,
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        date: {
          year: number;
          month: number;
          day: number;
          hour: number;
          minute: number;
          second: number;
          millisecond: number;
        };
      },
      typeof result
    >
  >(true);
});
test('project.$dateToParts.iso', async () => {
  let date1 = new Date();
  const aggregator = Aggregator.start<DBCar>().$project({
    date: {
      $dateToParts: {
        date: date1,
        iso8601: true,
      },
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        date: {
          $dateToParts: {
            date: date1,
            iso8601: true,
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        date: {
          isoWeekYear: number;
          isoWeek: number;
          isoDayOfWeek: number;
          hour: number;
          minute: number;
          second: number;
          millisecond: number;
        };
      },
      typeof result
    >
  >(true);
});
test('project.$dayOfYear.noTimezone', async () => {
  let date1 = new Date();
  const aggregator = Aggregator.start<DBCar>().$project({
    date: {
      $dayOfYear: {
        date: date1,
      },
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        date: {
          $dayOfYear: {
            date: date1,
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        date: number;
      },
      typeof result
    >
  >(true);
});
test('project.$dayOfYear.timezone', async () => {
  let date1 = new Date();
  const aggregator = Aggregator.start<DBCar>().$project({
    date: {
      $dayOfYear: {
        date: date1,
        timezone: 'timezone',
      },
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        date: {
          $dayOfYear: {
            date: date1,
            timezone: 'timezone',
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        date: number;
      },
      typeof result
    >
  >(true);
});
test('project.$dayOfYear', async () => {
  let date1 = new Date();
  const aggregator = Aggregator.start<DBCar>().$project({
    date: {
      $dayOfYear: date1,
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        date: {
          $dayOfYear: date1,
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        date: number;
      },
      typeof result
    >
  >(true);
});
test('project.$indexOfArray', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    date: {
      $indexOfArray: [[1, 2, 3], 1],
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        date: {
          $indexOfArray: [[1, 2, 3], 1],
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        date: number;
      },
      typeof result
    >
  >(true);
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

test('project.1', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    doors: 1,
  });
  expect(aggregator.query()).toEqual([{$project: {doors: 1}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{doors: Door[]}, typeof result>>(true);
});
test('project.1 objectid', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    _id: 1,
  });
  expect(aggregator.query()).toEqual([{$project: {_id: 1}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<{_id: ObjectId}, typeof result>>(true);
});
test('project.objectid', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    theId: '$_id',
  });
  expect(aggregator.query()).toEqual([{$project: {theId: '$_id'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<{theId: ObjectId}, typeof result>>(true);
});
test('project.switch', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    food: {
      $switch: {
        branches: [
          {case: {$lte: ['$someRootNumber', 2]}, then: -5},
          {case: {$lte: ['$someRootNumber', 5]}, then: 0},
          {case: {$lte: ['$someRootNumber', 8]}, then: 5},
          {case: {$lte: ['$someRootNumber', 12]}, then: 10},
        ],
        default: 15,
      },
    },
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        food: {
          $switch: {
            branches: [
              {case: {$lte: ['$someRootNumber', 2]}, then: -5},
              {case: {$lte: ['$someRootNumber', 5]}, then: 0},
              {case: {$lte: ['$someRootNumber', 8]}, then: 5},
              {case: {$lte: ['$someRootNumber', 12]}, then: 10},
            ],
            default: 15,
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<{food: -5 | 0 | 5 | 10 | 15}, typeof result>>(true);
});
test('project.fancyAdd', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$project({
      food: {
        $switch: {
          branches: [
            {case: {$lte: ['$someRootNumber', 2]}, then: -5},
            {case: {$lte: ['$someRootNumber', 5]}, then: 0},
            {case: {$lte: ['$someRootNumber', 8]}, then: 5},
            {case: {$lte: ['$someRootNumber', 12]}, then: 10},
          ],
          default: 15,
        },
      },
    })
    .$addFields({
      shoes: {
        $add: [
          {
            $multiply: [
              {
                $divide: [
                  {
                    $add: [
                      {$divide: ['$food', '$food']},
                      {$divide: ['$food', '$food']},
                      {$divide: ['$food', '$food']},
                      {$divide: ['$food', '$food']},
                    ],
                  },
                  '$food',
                ],
              },
              '$food',
            ],
          },
          '$food',
        ],
      },
    });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        food: {
          $switch: {
            branches: [
              {case: {$lte: ['$someRootNumber', 2]}, then: -5},
              {case: {$lte: ['$someRootNumber', 5]}, then: 0},
              {case: {$lte: ['$someRootNumber', 8]}, then: 5},
              {case: {$lte: ['$someRootNumber', 12]}, then: 10},
            ],
            default: 15,
          },
        },
      },
    },
    {
      $addFields: {
        shoes: {
          $add: [
            {
              $multiply: [
                {
                  $divide: [
                    {
                      $add: [
                        {$divide: ['$food', '$food']},
                        {$divide: ['$food', '$food']},
                        {$divide: ['$food', '$food']},
                        {$divide: ['$food', '$food']},
                      ],
                    },
                    '$food',
                  ],
                },
                '$food',
              ],
            },
            '$food',
          ],
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<typeof result['food'], number>>(true);
  assert<Has<typeof result['shoes'], number>>(true);
});

test('project.bad 1', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shmores: 1,
  });
  expect(aggregator.query()).toEqual([{$project: {shmores: 1}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{}, typeof result>>(true);
});

test('project.good _id', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    _id: 1,
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        _id: 1,
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: ObjectId}, typeof result>>(true);
});
test('project.exclude _id', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    _id: 0,
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<{}, typeof result>>(true);
});
test('project.exclude other1', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    shoes: 0,
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        shoes: 0,
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: 0}, typeof result>>(true);
});
test('project.exclude other2', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    doors: 0,
  });
  expect(aggregator.query()).toEqual([
    {
      $project: {
        doors: 0,
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{doors: 0}, typeof result>>(true);
});
