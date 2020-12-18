/// <reference path="../mongodb.d.ts"/>
import {Aggregator, Pipeline, PipelineResult, tableName} from '../src/typeSafeAggregate';
import {Bolt, Carburetor, CarburetorBase, Color, DBCar, Door} from './models/dbCar';
import {assert, Has, NotHas, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';
import {ObjectID} from 'mongodb';

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
    {$match: {'foo.count': 12}},
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

type DBUserRoundStats = {
  _id: ObjectID;
  gameId: string;
  userId: string;
  userName: string;
  roundsParticipated: DBUserRoundStatDetails[];
};
type DBUserRoundStatDetails = {
  generation: number;
  votesCast: number;
  votesWon: number;
  damageDone: number;
  unitsDestroyed: number;
  unitsCreated: number;
  resourcesMined: number;
  distanceMoved: number;
};

test('swg', async () => {
  let dbCarAggregator = Aggregator.start<DBUserRoundStats>();
  const generationsPerDay = (24 * 60 * 60 * 1000) / 600;
  const valuableGenerations = generationsPerDay * 2.5;
  const gameId = 'abc';
  const currentGeneration = 10;

  const aggregator = dbCarAggregator.pipe([{$match: {gameId}}, {$unwind: {path: '$roundsParticipated'}}] as const);

  assert<IsExact<DBUserRoundStats, typeof aggregator>>(true);
});

/*

  const aggregator = Aggregator.start<DBUserRoundStats>()

    .$unwind({
      path: '$roundsParticipated',
    })
    .$project({
      _id: '$_id',
      userId: '$userId',
      gameId: '$gameId',
      userName: '$userName',
      score: {
        $trunc: {
          $divide: [
            {
              $add: [
                {$multiply: ['$roundsParticipated.votesCast', 0.1]},
                {$multiply: ['$roundsParticipated.votesWon', 0.5]},
                {$multiply: ['$roundsParticipated.damageDone', 3]},
                {$multiply: ['$roundsParticipated.unitsDestroyed', 6]},
                {$multiply: ['$roundsParticipated.unitsCreated', 4]},
                {$multiply: ['$roundsParticipated.resourcesMined', 3.5]},
                {$multiply: ['$roundsParticipated.distanceMoved', 1.2]},
              ],
            },
            {
              $divide: [
                {
                  $subtract: [valuableGenerations, {$subtract: [currentGeneration, '$roundsParticipated.generation']}],
                },
                valuableGenerations,
              ],
            },
          ],
        },
      },
    })
    .$group({
      _id: '$userId',
      userName: {$first: '$userName'},
      gameId: {$first: '$gameId'},
      score: {$sum: '$score'},
    })
    .$sort({score: -1})
    .$group({_id: 1, ranks: {$push: '$$CURRENT'}})
    .$unwind({path: '$ranks', includeArrayIndex: 'rank'})
    .$project({
      _id: '$ranks._id',
      gameId: '$ranks.gameId',
      userName: '$ranks.userName',
      score: '$ranks.score',
      rank: '$rank',
    });

  // expect(aggregator.query()).toEqual([{}]);

  const [result] = await aggregator.result(mockCollection);
  assert<
    Has<
      {
        _id: string;
        gameId: string;
        userName: string;
        rank: number;
        score: number;
      },
      typeof result
    >
  >(true);
*/
