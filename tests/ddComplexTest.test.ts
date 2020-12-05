import {assert, Has} from 'conditional-type-checks';
import {ObjectID} from 'bson';
import {Aggregator} from '../src';
export class MongoDocument {
  _id!: ObjectID;
}

class DBEventTester {
  _id!: ObjectID;
  relationshipId!: ObjectID;
  user1Id!: ObjectID;
  user2Id!: ObjectID;
  date!: {stamp: number};
  isPrivate!: boolean;
  test!: number;
  eventDetails!: DBEventDetails;
  when!: 'a' | 'b' | 'c';
  relationshipsInterested!: DBEventInterestedRelationship[];
}

export interface DBFlag {
  userId: ObjectID;
  flagDate: Date;
}

export interface DBEventDetails {
  cancelled: boolean;
  user1Approved: boolean;
  user2Approved: boolean;
}

export class DBRelationship extends MongoDocument {
  flags!: DBFlag[];
}
export interface DBEventInterestedRelationship {
  chosen: boolean;
}
export class DBUser {
  _id!: ObjectID;
  static collectionName = 'user';

  name!: string;
  email?: string;
  profile!: DBUserProfile;
}
export interface DBUserProfile {
  links: DBLink[];
  birthday: {stamp: number};
}

export interface DBLink {
  linkId: ObjectID;
  answerId: ObjectID;
  decision: 1 | -1;
}

const mockCollection: any = {
  aggregate: () => ({
    toArray: () => [],
  }),
};

test('complex1', async () => {
  const params: any = {};
  const perPage: any = 0;

  const aggregator = Aggregator.start<DBEventTester>()
    .$geoNear({
      near: {
        type: 'Point',
        coordinates: [1, 2],
      },
      minDistance: 0,
      maxDistance: 1609.34 * Math.max(3, 50),
      distanceField: 'distance',
      spherical: true,
      query: {
        'eventDetails.cancelled': false,
        'eventDetails.user1Approved': true,
        'eventDetails.user2Approved': true,
        isPrivate: false,
        relationshipId: {$ne: new ObjectID()},
        $nor: [{'relationshipsInterested.chosen': true}],
        'date.stamp': 1,
      },
    })
    .$addFields({
      otherUser1Ida: {$sum: 'test'},
      otherUser1Idb: {$sum: 1},
      otherUser2Idd: 8,
      otherField3: '$when',

      otherUser1Id: 1,
      otherUser2Id: 2,
    })
    .$lookup<DBRelationship, 'relationship'>({
      from: 'relationship',
      localField: 'relationshipId',
      foreignField: '_id',
      as: 'relationship',
    })
    .$lookup<DBUser, 'user1'>({
      from: 'user',
      localField: 'user1Id',
      foreignField: '_id',
      as: 'user1',
    })
    .$lookup<DBUser, 'user2'>({
      from: 'user',
      localField: 'user2Id',
      foreignField: '_id',
      as: 'user2',
    })
    .$lookup<DBUser, 'otherUser1'>({
      from: 'user',
      localField: 'otherUser1Id',
      foreignField: '_id',
      as: 'otherUser1',
    })
    .$lookup<DBUser, 'otherUser2'>({
      from: 'user',
      localField: 'otherUser2Id',
      foreignField: '_id',
      as: 'otherUser2',
    })
    .$unwind('$user1')
    .$unwind('$user2')
    .$unwind('$otherUser1')
    .$unwind('$otherUser2')
    .$unwind('$relationship')
    .$unwind('$relationship.flags')

    .$addFields({
      user1Links: {
        $map: {
          input: '$user1.profile.links',
          as: 'link',
          in: {answerId: '$$link.answerId', decision: '$$link.decision'},
        },
      },
      user2Links: {
        $map: {
          input: '$user2.profile.links',
          as: 'link',
          in: {answerId: '$$link.answerId', decision: '$$link.decision'},
        },
      },
      otherUser1Links: {
        $map: {
          input: '$otherUser1.profile.links',
          as: 'link',
          in: {answerId: '$$link.answerId', decision: '$$link.decision'},
        },
      },
      otherUser2Links: {
        $map: {
          input: '$otherUser2.profile.links',
          as: 'link',
          in: {answerId: '$$link.answerId', decision: '$$link.decision'},
        },
      },
    })
    .$addFields({
      ageDiff: {
        $abs: {
          $subtract: [
            {
              $subtract: [
                new Date().getFullYear() - 1900,
                {$divide: [{$add: ['$user1.profile.birthday.stamp', '$user2.profile.birthday.stamp']}, 365 * 2]},
              ],
            },
            {
              $subtract: [
                new Date().getFullYear() - 1900,
                {
                  $divide: [
                    {$add: ['$otherUser1.profile.birthday.stamp', '$otherUser2.profile.birthday.stamp']},
                    365 * 2,
                  ],
                },
              ],
            },
          ],
        },
      },
    })
    .$addFields({
      agePenalty: {
        $switch: {
          branches: [
            {case: {$lte: ['$ageDiff', 2]}, then: -5},
            {case: {$lte: ['$ageDiff', 5]}, then: 0},
            {case: {$lte: ['$ageDiff', 8]}, then: 5},
            {case: {$lte: ['$ageDiff', 12]}, then: 10},
          ],
          default: 15,
        },
      },
    })
    .$addFields({
      score: {
        $add: [
          {
            $multiply: [
              {
                $divide: [
                  {
                    $add: [
                      {
                        $divide: [
                          {$size: {$setIntersection: ['$user1Links', '$otherUser1Links']}},
                          {$size: '$user1Links'},
                        ],
                      },
                      {
                        $divide: [
                          {$size: {$setIntersection: ['$user1Links', '$otherUser2Links']}},
                          {$size: '$user1Links'},
                        ],
                      },
                      {
                        $divide: [
                          {$size: {$setIntersection: ['$user2Links', '$otherUser1Links']}},
                          {$size: '$user2Links'},
                        ],
                      },
                      {
                        $divide: [
                          {$size: {$setIntersection: ['$user2Links', '$otherUser2Links']}},
                          {$size: '$user2Links'},
                        ],
                      },
                    ],
                  },
                  4,
                ],
              },
              100,
            ],
          },
          '$agePenalty',
        ],
      },
    })
    .$sort({
      score: -1,
      distance: 1,
    })
    .$skip(params.page * perPage)
    .$limit(perPage);

  console.log(aggregator.query());
  // expect(aggregator.query()).toEqual([{}]);

  const [result] = await aggregator.result(mockCollection);

  assert<Has<typeof result, {score: number; agePenalty: number}>>(true);
  assert<true>(true);
});
