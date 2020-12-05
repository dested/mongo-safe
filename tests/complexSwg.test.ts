/// <reference path="../mongodb.d.ts"/>
import {Aggregator} from '../src';
import {DBCar} from './models/dbCar';
import {assert, AssertFalse, AssertTrue, Has, IsExact} from 'conditional-type-checks';
import {DBWindow} from './models/dbWindow';
import {DBTire} from './models/dbTire';
import {ObjectID} from 'mongodb';

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};
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

test('complex.socialwargames', async () => {
  const generationsPerDay = (24 * 60 * 60 * 1000) / 600;
  const valuableGenerations = generationsPerDay * 2.5;
  const gameId = 'abc';
  const currentGeneration = 10;

  const aggregator = Aggregator.start<DBUserRoundStats>()
    .$match({
      gameId,
    })
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
});
