/*
import {assert, Has} from 'conditional-type-checks';
import {ObjectID} from 'bson';
import {Aggregator} from '../src';

class DBEventTester {
  _id!: ObjectID;
  relationshipId!: ObjectID;
  user1Id!: ObjectID;
  user2Id!: ObjectID;
}

export class DBRelationshipTester extends MongoDocument {
  static collectionName = 'relationship';

  user1: DBRelationshipUser;
  user2: DBRelationshipUser;
}

export class DBUserTester {
  _id!: ObjectID;
  static collectionName = 'user';

  name!: string;
  email?: string;
  profile!: DBUserProfile;
  userState!: DBUserState;
  relationshipDetails!: DBUserRelationshipDetails;
  createdDate!: FullDate;
  realCreatedDate!: Date;
  phoneDetails?: DBPhoneDetails;
  settings!: DBUserSettings;
  lastActivity!: Date;
  bannedState?: DBUserBannedState;
}

test('complex1', async () => {
  const params: any = {};
  const perPage: any = 0;

  const result = await Aggregator.start<DBEventTester>()
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
        relationshipId: {$ne: ObjectID.createFromHexString('abc')},
        $nor: [
          {'relationshipsInterested.chosen': true},
          // {'relationshipsInterested.relationshipId': params.myRelationshipId},
          // {'relationshipsInterested.relationshipId': params.myRelationshipId},
          // {'relationshipsMaybeInterested.relationshipId': params.myRelationshipId},
        ],
        'date.stamp': 1,
      },
    })
    .$addFields({
      otherUser1Ida: {$sum: '$nasdfjasdf'},
      otherUser1Idb: {$sum: 1},
      otherUser2Idd: 8,
      otherField3: '$when',

      otherUser1Id: 1,
      otherUser2Id: 2,
    })
    .$lookup<DBRelationshipTester, 'relationship'>({
      from: 'relationship',
      localField: 'relationshipId',
      foreignField: '_id',
      as: 'relationship',
    })
    .$lookup<DBUserTester, 'user1'>({
      from: 'user',
      localField: 'user1Id',
      foreignField: '_id',
      as: 'user1',
    })
    .$lookup<DBUserTester, 'user2'>({
      from: 'user',
      localField: 'user2Id',
      foreignField: '_id',
      as: 'user2',
    })
    .$lookup<DBUserTester, 'otherUser1'>({
      from: 'user',
      localField: 'otherUser1Id',
      foreignField: '_id',
      as: 'otherUser1',
    })
    .$lookup<DBUserTester, 'otherUser2'>({
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
          input: '$user1.profile.personalityLinks',
          as: 'link',
          in: {answerId: '$$link.answerId', decision: '$$link.decision'},
        },
      },
      user2Links: {
        $map: {
          input: '$user2.profile.personalityLinks',
          as: 'link',
          in: {answerId: '$$link.answerId', decision: '$$link.decision'},
        },
      },
      otherUser1Links: {
        $map: {
          input: '$otherUser1.profile.personalityLinks',
          as: 'link',
          in: {answerId: '$$link.answerId', decision: '$$link.decision'},
        },
      },
      otherUser2Links: {
        $map: {
          input: '$otherUser2.profile.personalityLinks',
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
    .$limit(perPage)
    .result(undefined!);
  result[0].score = 1;
  result[0].agePenalty = 5;
  // const [result] = await aggregator.result(mockCollection);
  assert<true>(true);
});
*/
import {assert} from 'conditional-type-checks';

test('complex2', async () => {
  assert<true>(true);
});
