import {
  DeepKeys,
  DeepKeysResult,
  DeepKeysValue,
  FilterQuery,
  NumericTypes,
  Collection,
  ObjectID,
  ObjectId,
  DeepKeyArray,
  AggregationCursor,
  QuerySelector,
  RootQuerySelector,
  MongoAltQuery,
  BSONType,
} from 'mongodb';
import {assert, Has, NotHas, IsExact} from 'conditional-type-checks';

export type TwitchCheermoteSize = '1' | '1.5' | '2' | '3' | '4';
export type TwitchSubscriberBadgeCount = '0' | '3' | '6' | '12' | '24' | '36' | '48' | '60' | '72' | '84' | '96';
export type TwitchBitsCheerCount = '1' | '100' | '1000' | '5000' | '10000';
export type TwitchBitsBadgeCount =
  | '1000'
  | '5000'
  | '10000'
  | '25000'
  | '50000'
  | '75000'
  | '100000'
  | '200000'
  | '300000'
  | '400000'
  | '500000'
  | '600000'
  | '700000'
  | '800000'
  | '900000'
  | '1000000';
export type TwitchEmoteResult = {
  base_set_id: string;
  bits_badges: {[numberOfBits in TwitchBitsBadgeCount]: TwitchImage};
  broadcaster_type: string;
  channel_id: string;
  channel_name: string;
  cheermotes: {[numberOfBits in TwitchBitsCheerCount]: {[twitchCheermoteSize: string]: string}};
  display_name: string;
  emotes: {code: string; emoticon_set: number; id: number}[];
  generated_at: Date;
  plans: {[price: string]: string};
  subscriber_badges: {[months in TwitchSubscriberBadgeCount]: TwitchImage};
};

export type TwitchImage = {
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  title: string;
};

export type DbChannelModel = {
  _id: ObjectId;
  emoteSet: {lastUpdated: Date; result?: TwitchEmoteResult};
  socketConnectionDate?: Date;
  socketConnectionId?: string;
  twitchChannelId: string;
};

test('notExcessive', async () => {
  const j: DeepKeys<DbChannelModel> = 'emoteSet.result.bits_badges.25000';
  assert(true);
});
