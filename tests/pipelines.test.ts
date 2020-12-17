/// <reference path="../mongodb.d.ts"/>
import {Aggregator, GraphDeep, tableName} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, NotHas, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';
import {DeepKeys, ObjectID} from 'mongodb';
import {Combine, ReplaceKey} from './typeUtils';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('simple', async () => {
  const aggregator = Aggregator.start<DBCar>();
  expect(aggregator.query()).toEqual([]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});

test('$match', async () => {
  const aggregator = Aggregator.start<DBCar>().$match({color: 'black'});
  expect(aggregator.query()).toEqual([{$match: {color: 'black'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});

test('$match.deep', async () => {
  const aggregator = Aggregator.start<DBCar>().$match({'tailPipe.count': 4});
  expect(aggregator.query()).toEqual([{$match: {'tailPipe.count': 4}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});

test('$project.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: 'black'});
  expect(aggregator.query()).toEqual([{$project: {color: 'black'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: 'black'}, typeof result>>(true);
});

test('$project.callback', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: 'black'});
  expect(aggregator.query()).toEqual([{$project: {color: 'black'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: 'black'}, typeof result>>(true);
});

test('$project.nested', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: {foo: 12}});
  expect(aggregator.query()).toEqual([{$project: {color: {foo: 12}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: {foo: 12}}, typeof result>>(true);
});

test('$project.reference', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: '$color'});
  expect(aggregator.query()).toEqual([{$project: {color: '$color'}}]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{color: Color}, typeof result>>(true);
});

test('$project.nested-reference', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({color: {foo: '$color'}});
  expect(aggregator.query()).toEqual([{$project: {color: {foo: '$color'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{color: {foo: Color}}, typeof result>>(true);
});

test('$project.map', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    mappedDoors: {$map: {input: '$doors', as: 'door', in: {good: 'foo', side: '$$door.side'}}},
  });
  expect(aggregator.query()).toEqual([
    {$project: {mappedDoors: {$map: {input: '$doors', as: 'door', in: {good: 'foo', side: '$$door.side'}}}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{mappedDoors: {good: 'foo'; side: 'left' | 'right'}[]}, typeof result>>(true);
});

test('$project.id', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({id: '$_id'});
  expect(aggregator.query()).toEqual([{$project: {id: '$_id'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{id: ObjectID}, typeof result>>(true);
});

test('$project.array', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    doorHeads: '$doors.bolts.type',
    carbHeads: '$carburetor.bolts.type',
  });

  expect(aggregator.query()).toEqual([
    {
      $project: {
        doorHeads: '$doors.bolts.type',
        carbHeads: '$carburetor.bolts.type',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{doorHeads: 'phillips' | 'flat'; carbHeads: 'phillips' | 'flat'}, typeof result>>(true);
});

test('$lookup', async () => {
  const aggregator = Aggregator.start<DBCar>().$lookup({
    from: tableName<DBWindow>('window'),
    localField: '_id',
    foreignField: 'carId',
    as: 'windows',
  });

  expect(aggregator.query()).toEqual([
    {
      $lookup: {
        from: 'window',
        localField: '_id',
        foreignField: 'carId',
        as: 'windows',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {windows: DBWindow[]}, typeof result>>(true);
});

test('$lookup.let', async () => {
  const aggregator = Aggregator.start<DBCar>().$lookup({
    from: tableName<DBWindow>('window'),
    localField: '_id',
    foreignField: 'carId',
    as: 'windows',
    let: {a: 12},
  });

  expect(aggregator.query()).toEqual([
    {
      $lookup: {
        from: 'window',
        localField: '_id',
        foreignField: 'carId',
        as: 'windows',
        let: {a: 12},
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {windows: {a: 12}[]}, typeof result>>(true);
});
test('$lookup.letComplex', async () => {
  const aggregator = Aggregator.start<DBCar>().$lookup({
    from: tableName<DBWindow>('window'),
    localField: '_id',
    foreignField: 'carId',
    as: 'windows',
    let: {a: '$carId'},
  });

  expect(aggregator.query()).toEqual([
    {
      $lookup: {
        from: 'window',
        localField: '_id',
        foreignField: 'carId',
        as: 'windows',
        let: {a: '$carId'},
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {windows: {a: ObjectID}[]}, typeof result>>(true);
});
test('$lookup.pipeline.let', async () => {
  const aggregator = Aggregator.start<DBCar>().$lookup({
    from: tableName<DBWindow>('window'),
    localField: '_id',
    foreignField: 'carId',
    as: 'windows',
    let: {a: '$carId'},
    pipeline: (agg) => agg.$project({shoes: '$$a'}),
  });

  expect(aggregator.query()).toEqual([
    {
      $lookup: {
        from: 'window',
        localField: '_id',
        foreignField: 'carId',
        as: 'windows',
        let: {a: '$carId'},
        pipeline: [{$project: {shoes: '$$a'}}],
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {windows: {shoes: ObjectID}[]}, typeof result>>(true);
});

test('$addField.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$addFields({
    shoes: 'hi',
  });

  expect(aggregator.query()).toEqual([{$addFields: {shoes: 'hi'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {shoes: 'hi'}, typeof result>>(true);
});

test('$addField.complex', async () => {
  const aggregator = Aggregator.start<DBCar>().$addFields({shoes: '$doors.bolts'});

  expect(aggregator.query()).toEqual([{$addFields: {shoes: '$doors.bolts'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Bolt['type'], typeof result.shoes[0]['type']>>(true);
  assert<Has<DBCar & {shoes: Bolt[]}, typeof result>>(true);
  assert<NotHas<DBCar & {shoes: Bolt}, typeof result>>(true);
});
test('$set.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$set({
    shoes: 'hi',
  });

  expect(aggregator.query()).toEqual([{$set: {shoes: 'hi'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & {shoes: 'hi'}, typeof result>>(true);
});

test('$set.complex', async () => {
  const aggregator = Aggregator.start<DBCar>().$set({shoes: '$doors.bolts'});

  expect(aggregator.query()).toEqual([{$set: {shoes: '$doors.bolts'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Bolt['type'], typeof result.shoes[0]['type']>>(true);
  assert<Has<DBCar & {shoes: Bolt[]}, typeof result>>(true);
  assert<NotHas<DBCar & {shoes: Bolt}, typeof result>>(true);
});

test('$unwind.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('$doors');

  expect(aggregator.query()).toEqual([{$unwind: '$doors'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<ReplaceKey<DBCar, 'doors', Door>, typeof result>>(true);
});
test('$unwind.2', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('$carburetor.bolts');

  expect(aggregator.query()).toEqual([{$unwind: '$carburetor.bolts'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<ReplaceKey<DBCar, 'carburetor', ReplaceKey<Carburetor, 'bolts', Bolt>>, typeof result>>(true);
});

test('$unwind.3', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind('$carburetor.base.bolts');

  expect(aggregator.query()).toEqual([{$unwind: '$carburetor.base.bolts'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      ReplaceKey<DBCar, 'carburetor', ReplaceKey<Carburetor, 'base', ReplaceKey<CarburetorBase, 'bolts', Bolt>>>,
      typeof result
    >
  >(true);
});
test('$unwind.includeArrayIndex', async () => {
  const aggregator = Aggregator.start<DBCar>().$unwind({path: '$doors', includeArrayIndex: 'shoes'});

  expect(aggregator.query()).toEqual([{$unwind: {path: '$doors', includeArrayIndex: 'shoes'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<ReplaceKey<DBCar & {shoes: number}, 'doors', Door>, typeof result>>(true);
});

test('$graphLookup.otherTable', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup({
    from: tableName<DBWindow>('window'),
    startWith: '$doors',
    as: 'shoes',
    connectFromField: 'someDate',
    connectToField: 'tint',
  });

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        from: 'window',
        startWith: '$doors',
        as: 'shoes',
        connectFromField: 'someDate',
        connectToField: 'tint',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & GraphDeep<DBWindow, 'shoes', never>, typeof result>>(true);
});

test('$graphLookup.sameTable', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup({
    from: tableName<DBCar>('car'),
    startWith: '$color',
    as: 'shoes',
    connectFromField: 'carburetor',
    connectToField: 'doors',
  });

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        from: 'car',
        startWith: '$color',
        as: 'shoes',
        connectFromField: 'carburetor',
        connectToField: 'doors',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & GraphDeep<DBCar, 'shoes', never>, typeof result>>(true);
});
test('$graphLookup.double', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$graphLookup({
      from: tableName<DBCar>('car'),
      startWith: '$color',
      as: 'shoes',
      connectFromField: 'carburetor',
      connectToField: 'doors',
    })
    .$graphLookup({
      from: tableName<DBCar>('car'),
      startWith: '$color',
      as: 'shoes2',
      connectFromField: 'carburetor',
      connectToField: 'doors',
    })
    .$graphLookup({
      from: tableName<DBCar>('car'),
      startWith: '$color',
      as: 'shoes3',
      connectFromField: 'carburetor',
      connectToField: 'doors',
    });

  const [result] = await aggregator.result(mockCollection);
  //shouldnt overflow
  assert<true>(true);
});

test('$graphLookup.depthField', async () => {
  const aggregator = Aggregator.start<DBCar>().$graphLookup({
    from: tableName<DBWindow>('window'),
    startWith: '$color',
    as: 'shoes',
    connectFromField: 'carburetor',
    connectToField: 'tint',
    depthField: 'numConnections',
  });

  expect(aggregator.query()).toEqual([
    {
      $graphLookup: {
        from: 'window',
        startWith: '$color',
        as: 'shoes',
        connectFromField: 'carburetor',
        connectToField: 'tint',
        depthField: 'numConnections',
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar & GraphDeep<DBWindow, 'shoes', 'numConnections'>, typeof result>>(true);
});

test('$group.simple1', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: 8});

  expect(aggregator.query()).toEqual([{$group: {_id: 8}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: 8}, typeof result>>(true);
});

test('$group.groupThenAddField', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: 8, a: 1}).$addFields({
    shoes: '$a',
  });

  expect(aggregator.query()).toEqual([{$group: {_id: 8, a: 1}}, {$addFields: {shoes: '$a'}}]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<{_id: 8; a: 1; shoes: 1}, typeof result>>(true);
});

test('$group.groupThenAddFieldDeep', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$group({
      _id: 8,
      numbersLeftArr: {
        $push: {
          boardId: '$_id',
          count: {
            $arrayElemAt: ['$doors', 0],
          },
        },
      },
    })
    .$addFields({
      shoes: {
        $min: '$numbersLeftArr.count.someNumber',
      },
    });

  expect(aggregator.query()).toEqual([
    {
      $group: {
        _id: 8,
        numbersLeftArr: {
          $push: {
            boardId: '$_id',
            count: {
              $arrayElemAt: ['$doors', 0],
            },
          },
        },
      },
    },
    {
      $addFields: {
        shoes: {
          $min: '$numbersLeftArr.count.someNumber',
        },
      },
    },
  ]);

  const result = await aggregator.result(mockCollection);
  const j = result.map((a) => a.numbersLeftArr.map((b) => b.count)); // should not be excessively deep
  assert<Has<{_id: 8; numbersLeftArr: {boardId: ObjectID; count: Door}[]; shoes: number}, typeof result[0]>>(true);
});

test('$group.simple2', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: {simple: true}});

  expect(aggregator.query()).toEqual([{$group: {_id: {simple: true}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: {simple: true}}, typeof result>>(true);
});

test('$group.simple-key', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: '$color'});

  expect(aggregator.query()).toEqual([{$group: {_id: '$color'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: Color}, typeof result>>(true);
});

test('$group.simple-ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: '$color'});

  expect(aggregator.query()).toEqual([{$group: {_id: '$color'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: Color}, typeof result>>(true);
});

test('$group.simple-nested-ref', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: {color: '$color'}});

  expect(aggregator.query()).toEqual([{$group: {_id: {color: '$color'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: {color: Color}}, typeof result>>(true);
});
test('$group.nested-id', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$group({
      _id: {
        entityId: '$someDate',
        action: '$someRootNumber',
        hexId: '$color',
      },

      count: {$sum: 1},
    })
    .$group({
      _id: '$_id.entityId',
      actions: {
        $push: {
          action: '$_id.action',
          hexId: '$_id.hexId',
          count: '$count',
        },
      },
    });

  expect(aggregator.query()).toEqual([
    {
      $group: {
        _id: {
          entityId: '$someDate',
          action: '$someRootNumber',
          hexId: '$color',
        },
        count: {$sum: 1},
      },
    },

    {
      $group: {
        _id: '$_id.entityId',
        actions: {
          $push: {
            action: '$_id.action',
            hexId: '$_id.hexId',
            count: '$count',
          },
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: Date; actions: {action: number; hexId: Color; count: 1}[]}, typeof result>>(true);
});

test('$group.ref-and-keys', async () => {
  const aggregator = Aggregator.start<DBCar>().$group({_id: '$color', side: {$sum: '$doors.someNumber'}});

  expect(aggregator.query()).toEqual([{$group: {_id: '$color', side: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: Color; side: number}, typeof result>>(true);
});

test('$group.$$CURRENT', async () => {
  const aggregator = Aggregator.start<DBCar>()
    .$project({shoes: 'shoes'})

    .$group({_id: 1, side: {$push: '$$CURRENT'}});

  expect(aggregator.query()).toEqual([{$project: {shoes: 'shoes'}}, {$group: {_id: 1, side: {$push: '$$CURRENT'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: 1; side: {shoes: 'shoes'}[]}, typeof result>>(true);
});

test('$project.ref-and-keyes', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({
    side: {$dateToString: {date: '$doors.someDate', format: 'shoes'}},
  });

  expect(aggregator.query()).toEqual([{$project: {side: {$dateToString: {date: '$doors.someDate', format: 'shoes'}}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{side: string}, typeof result>>(true);
});

test('$project.$sum', async () => {
  const aggregator = Aggregator.start<DBCar>().$project({side: {$sum: '$doors.someNumber'}});

  expect(aggregator.query()).toEqual([{$project: {side: {$sum: '$doors.someNumber'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{side: number}, typeof result>>(true);
});

test('$count', async () => {
  const aggregator = Aggregator.start<DBCar>().$count('amount');

  expect(aggregator.query()).toEqual([{$count: 'amount'}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{amount: number}, typeof result>>(true);
});

test('$replaceRoot.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$replaceRoot({
    newRoot: '$someDate',
  });

  expect(aggregator.query()).toEqual([{$replaceRoot: {newRoot: '$someDate'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Date, typeof result>>(true);
});

test('$replaceRoot.complex', async () => {
  const aggregator = Aggregator.start<DBCar>().$replaceRoot({
    newRoot: {shoes: '$doors.someDate'},
  });

  expect(aggregator.query()).toEqual([{$replaceRoot: {newRoot: {shoes: '$doors.someDate'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: Date}, typeof result>>(true);
});
test('$replaceWith.simple', async () => {
  const aggregator = Aggregator.start<DBCar>().$replaceWith({
    newRoot: '$someDate',
  });

  expect(aggregator.query()).toEqual([{$replaceWith: {newRoot: '$someDate'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Date, typeof result>>(true);
});

test('$replaceWith.complex', async () => {
  const aggregator = Aggregator.start<DBCar>().$replaceWith({
    newRoot: {shoes: '$doors.someDate'},
  });

  expect(aggregator.query()).toEqual([{$replaceWith: {newRoot: {shoes: '$doors.someDate'}}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{shoes: Date}, typeof result>>(true);
});
test('$sample', async () => {
  const aggregator = Aggregator.start<DBCar>().$sample({size: 3});

  expect(aggregator.query()).toEqual([{$sample: {size: 3}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});
test('$sample', async () => {
  const aggregator = Aggregator.start<DBCar>().$sampleRate(0.33);

  expect(aggregator.query()).toEqual([{$sampleRate: 0.33}]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<DBCar, typeof result>>(true);
});

test('$bucket', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    nationality: string;
  };

  const aggregator = Aggregator.start<Artist>()
    .$bucket({
      groupBy: '$year_born', // Field to group by
      boundaries: [1840, 1850, 1860, 1870, 1880], // Boundaries for the buckets
      default: 'Other', // Bucket id for documents which do not fall into a bucket
      output: {
        // Output for each bucket
        count: {$sum: 1},
        artists: {
          $push: {
            name: {$concat: ['$first_name', ' ', '$last_name']},
            year_born: '$year_born',
          },
        },
      },
    })
    .$match({count: {$gt: 3}});

  expect(aggregator.query()).toEqual([
    {
      $bucket: {
        groupBy: '$year_born', // Field to group by
        boundaries: [1840, 1850, 1860, 1870, 1880], // Boundaries for the buckets
        default: 'Other', // Bucket id for documents which do not fall into a bucket
        output: {
          // Output for each bucket
          count: {$sum: 1},
          artists: {
            $push: {
              name: {$concat: ['$first_name', ' ', '$last_name']},
              year_born: '$year_born',
            },
          },
        },
      },
    },
    {$match: {count: {$gt: 3}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {_id: 1840 | 1850 | 1860 | 1870 | 1880 | 'Other'; count: number; artists: {name: string; year_born: number}[]},
      typeof result
    >
  >(true);
});

test('$bucket.noDefault', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    nationality: string;
  };

  const aggregator = Aggregator.start<Artist>()
    .$bucket({
      groupBy: '$year_born', // Field to group by
      boundaries: [1840, 1850, 1860, 1870, 1880], // Boundaries for the buckets
      output: {
        // Output for each bucket
        count: {$sum: 1},
        artists: {
          $push: {
            name: {$concat: ['$first_name', ' ', '$last_name']},
            year_born: '$year_born',
          },
        },
      },
    })
    .$match({count: {$gt: 3}});

  expect(aggregator.query()).toEqual([
    {
      $bucket: {
        groupBy: '$year_born', // Field to group by
        boundaries: [1840, 1850, 1860, 1870, 1880], // Boundaries for the buckets
        output: {
          // Output for each bucket
          count: {$sum: 1},
          artists: {
            $push: {
              name: {$concat: ['$first_name', ' ', '$last_name']},
              year_born: '$year_born',
            },
          },
        },
      },
    },
    {$match: {count: {$gt: 3}}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {_id: 1840 | 1850 | 1860 | 1870 | 1880; count: number; artists: {name: string; year_born: number}[]},
      typeof result
    >
  >(true);
});

test('bucketAuto', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };

  const aggregator = Aggregator.start<Artist>().$bucketAuto({
    groupBy: '$price',
    buckets: 4,
  });

  expect(aggregator.query()).toEqual([
    {
      $bucketAuto: {
        groupBy: '$price',
        buckets: 4,
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: {min: number; max: number}; count: number}, typeof result>>(true);
});
test('bucketAuto.output', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };

  const aggregator = Aggregator.start<Artist>().$bucketAuto({
    groupBy: '$price',
    buckets: 4,
    output: {
      count: {$sum: 1},
      shoes: '$year_born',
    },
  });

  expect(aggregator.query()).toEqual([
    {
      $bucketAuto: {
        groupBy: '$price',
        buckets: 4,
        output: {
          count: {$sum: 1},
          shoes: '$year_born',
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: {min: number; max: number}; count: number; shoes: number}, typeof result>>(true);
});
test('bucketAuto.outputNoCount', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };

  const aggregator = Aggregator.start<Artist>().$bucketAuto({
    groupBy: '$price',
    buckets: 4,
    output: {
      shoes: '$year_born',
    },
  });

  expect(aggregator.query()).toEqual([
    {
      $bucketAuto: {
        groupBy: '$price',
        buckets: 4,
        output: {
          shoes: '$year_born',
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: {min: number; max: number}; shoes: number}, typeof result>>(true);
});
test('$sortByCount', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };

  const aggregator = Aggregator.start<Artist>().$sortByCount('$price');

  expect(aggregator.query()).toEqual([
    {
      $sortByCount: '$price',
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: number; count: number}, typeof result>>(true);
});

test('$sortByCount.obj', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };

  const aggregator = Aggregator.start<Artist>().$sortByCount({$concat: ['$last_name', '$first_name']});

  expect(aggregator.query()).toEqual([
    {
      $sortByCount: {$concat: ['$last_name', '$first_name']},
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<{_id: string; count: number}, typeof result>>(true);
});

test('$unionWith', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$unionWith(tableName<Artist2>('artist2'));

  expect(aggregator.query()).toEqual([
    {
      $unionWith: 'artist2',
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<Has<Artist | Artist2, typeof result>>(true);
});

test('$unionWith.pipeline', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$unionWith({
    coll: tableName<Artist2>('artist2'),
    pipeline: (agg) =>
      agg.$project({
        shoes: '$first_name2',
      }),
  });

  expect(aggregator.query()).toEqual([
    {
      $unionWith: {
        coll: 'artist2',
        pipeline: [
          {
            $project: {
              shoes: '$first_name2',
            },
          },
        ],
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<Artist | {shoes: string}, typeof result>>(true);
});

test('$redact', async () => {
  const item = {
    _id: 1,
    title: '123 Department Report',
    tags: ['G', 'STLW'],
    year: 2014,
    subsections: [
      {
        subtitle: 'Section 1: Overview',
        tags: ['SI', 'G'],
        content: 'Section 1: This is the content of section 1.',
      },
      {
        subtitle: 'Section 2: Analysis',
        tags: ['STLW'],
        content: 'Section 2: This is the content of section 2.',
      },
      {
        subtitle: 'Section 3: Budgeting',
        tags: ['TK'],
        content: {
          text: 'Section 3: This is the content of section3.',
          tags: ['HCS'],
        },
      },
    ],
  };

  type Item = typeof item;
  var userAccess = ['STLW', 'G'];

  const aggregator = Aggregator.start<Item>()
    .$match({year: 2014})
    .$redact({
      $cond: {
        if: {$gt: [{$size: {$setIntersection: ['$tags', userAccess]}}, 0]},
        then: '$$DESCEND',
        else: '$$PRUNE',
      },
    });

  expect(aggregator.query()).toEqual([
    {$match: {year: 2014}},
    {
      $redact: {
        $cond: {
          if: {$gt: [{$size: {$setIntersection: ['$tags', userAccess]}}, 0]},
          then: '$$DESCEND',
          else: '$$PRUNE',
        },
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<Item, typeof result>>(true);
});

test('$merge', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$merge({
    into: tableName<Artist2>('artist2'),
  });

  expect(aggregator.query()).toEqual([{$merge: {into: 'artist2'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<void, typeof result>>(true);
});

test('$merge.on', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$merge({
    into: tableName<Artist2>('artist2'),
    on: 'last_name',
  });

  expect(aggregator.query()).toEqual([{$merge: {into: 'artist2', on: 'last_name'}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<void, typeof result>>(true);
});
test('$merge.on', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$merge({
    into: tableName<Artist2>('artist2'),
    on: ['_id', 'last_name'],
  });

  expect(aggregator.query()).toEqual([{$merge: {into: 'artist2', on: ['_id', 'last_name']}}]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<void, typeof result>>(true);
});
test('$merge.onWhenMatched', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$merge({
    into: tableName<Artist2>('artist2'),
    on: '_id',
    whenMatched: 'replace',
    whenNotMatched: 'discard',
  });

  expect(aggregator.query()).toEqual([
    {$merge: {into: 'artist2', on: '_id', whenMatched: 'replace', whenNotMatched: 'discard'}},
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<void, typeof result>>(true);
});

test('$merge.pipeline', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$merge({
    into: tableName<Artist2>('artist2'),
    on: '_id',
    let: {shoes: {test: '$nationality'}},
    whenMatched: (agg) =>
      agg.$addFields({
        thumbsup: {$concat: ['$nationality', '$$shoes.test']},
        thumbsdown: {$concat: ['$nationality', '$$shoes.test']},
      }),
  });

  expect(aggregator.query()).toEqual([
    {
      $merge: {
        into: 'artist2',
        on: '_id',
        let: {shoes: {test: '$nationality'}},
        whenMatched: [
          {
            $addFields: {
              thumbsup: {$concat: ['$nationality', '$$shoes.test']},
              thumbsdown: {$concat: ['$nationality', '$$shoes.test']},
            },
          },
        ],
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<void, typeof result>>(true);
});

test('$merge.pipeline.new', async () => {
  type Artist = {
    _id: number;
    last_name: string;
    first_name: string;
    year_born: number;
    year_died: number;
    price: number;
    nationality: string;
  };
  type Artist2 = {
    _id: number;
    last_name: string;
    first_name2: string;
    year_born2: number;
    year_died2: number;
    price2: number;
    nationality2: string;
  };

  const aggregator = Aggregator.start<Artist>().$merge({
    into: tableName<Artist2>('artist2'),
    on: '_id',
    whenMatched: (agg) =>
      agg.$addFields({
        thumbsup: {$concat: ['$nationality', '$$new.first_name']},
        thumbsdown: {$concat: ['$nationality', '$$new.first_name']},
      }),
  });

  expect(aggregator.query()).toEqual([
    {
      $merge: {
        into: 'artist2',
        on: '_id',
        whenMatched: [
          {
            $addFields: {
              thumbsup: {$concat: ['$nationality', '$$new.first_name']},
              thumbsdown: {$concat: ['$nationality', '$$new.first_name']},
            },
          },
        ],
      },
    },
  ]);

  const [result] = await aggregator.result(mockCollection);
  assert<IsExact<void, typeof result>>(true);
});
