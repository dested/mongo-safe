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
import {FilterQueryMatch} from './filterQueryMatch';

type RawTypes = number | boolean | string | Date | ObjectID | NumericTypes;
type NonObjectValues = number | boolean | string | Date | ObjectID | NumericTypes;

type NumberTypeOrNever<TValue> = TValue extends NumericTypes ? (number extends TValue ? number : TValue) : never;
type DeepExcludeNever<T> = T extends NonObjectValues
  ? T
  : T extends Array<infer TArr>
  ? Array<DeepExcludeNever<T[number]>>
  : {
      [key in keyof T as T[key] extends never ? never : key]: DeepExcludeNever<T[key]>;
    };
type OnlyArrayFieldsKeys<T> = {[key in keyof T]: T[key] extends Array<any> ? key : never}[keyof T];
type OnlyArrayFields<T> = {[key in keyof T]: T[key] extends Array<infer J> ? key : never}[keyof T];

export type UnArray<T> = T extends Array<infer U> ? U : T;
type ReplaceKey<T, TKey, TValue> = {[key in keyof T]: key extends TKey ? TValue : T[key]};

type DeepReplaceKey<T, TKeys extends Array<any>, TValue> = TKeys extends [infer TCurrentKey, ...infer TRestKeys]
  ? TRestKeys extends []
    ? ReplaceKey<T, TKeys[0], TValue>
    : {
        [key in keyof T]: key extends TCurrentKey ? DeepReplaceKey<T[key], TRestKeys, TValue> : T[key];
      }
  : never;

export type DeReferenceExpression<TRootValue, TRef> = TRef extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TRef extends {}
  ? {[key in keyof TRef]: DeReferenceExpression<TRootValue, TRef[key]>}
  : TRef;

type NotImplementedYet = never;

type AllOperators =
  | '$dateToString'
  | '$cond'
  | '$eq'
  | '$map'
  | '$sum'
  | '$abs'
  | '$acos'
  | '$acosh'
  | '$add'
  | '$addToSet'
  | '$allElementsTrue'
  | '$and'
  | '$anyElementTrue'
  | '$arrayElemAt'
  | '$arrayToObject'
  | '$asin'
  | '$asinh'
  | '$atan'
  | '$atan2'
  | '$atanh'
  | '$avg'
  | '$ceil'
  | '$cmp'
  | '$concat'
  | '$concatArrays'
  | '$convert'
  | '$cos'
  | '$dateFromParts'
  | '$dateToParts'
  | '$dateFromString'
  | '$dayOfMonth'
  | '$dayOfWeek'
  | '$dayOfYear'
  | '$degreesToRadians'
  | '$divide'
  | '$exp'
  | '$filter'
  | '$first'
  | '$floor'
  | '$gt'
  | '$gte'
  | '$hour'
  | '$ifNull'
  | '$in'
  | '$indexOfArray'
  | '$indexOfBytes'
  | '$indexOfCP'
  | '$isArray'
  | '$isoDayOfWeek'
  | '$isoWeek'
  | '$isoWeekYear'
  | '$last'
  | '$let'
  | '$literal'
  | '$ln'
  | '$log'
  | '$log10'
  | '$lt'
  | '$lte'
  | '$ltrim'
  | '$max'
  | '$mergeObjects'
  | '$meta'
  | '$min'
  | '$millisecond'
  | '$minute'
  | '$mod'
  | '$month'
  | '$multiply'
  | '$ne'
  | '$not'
  | '$objectToArray'
  | '$or'
  | '$pow'
  | '$push'
  | '$radiansToDegrees'
  | '$range'
  | '$reduce'
  | '$regexFind'
  | '$regexFindAll'
  | '$regexMatch'
  | '$reverseArray'
  | '$round'
  | '$rtrim'
  | '$second'
  | '$setDifference'
  | '$setEquals'
  | '$setIntersection'
  | '$setIsSubset'
  | '$setUnion'
  | '$size'
  | '$sin'
  | '$slice'
  | '$split'
  | '$sqrt'
  | '$stdDevPop'
  | '$stdDevSamp'
  | '$strcasecmp'
  | '$strLenBytes'
  | '$strLenCP'
  | '$substr'
  | '$substrBytes'
  | '$substrCP'
  | '$subtract'
  | '$switch'
  | '$tan'
  | '$toBool'
  | '$toDate'
  | '$toDecimal'
  | '$toDouble'
  | '$toInt'
  | '$toLong'
  | '$toObjectId'
  | '$toString'
  | '$toLower'
  | '$toUpper'
  | '$trim'
  | '$trunc'
  | '$type'
  | '$week'
  | '$year'
  | '$zip';

// type ExpressionType<TRootValue, TForceValue> = ExpressionStringReferenceKey<TRootValue, TForceValue> | TForceValue;

/*
type ExpressionOrAny<TTest, TRootValue, TForceValue = any> = TTest extends `$${infer J}`
  ? ExpressionStringReferenceKey<TRootValue>
  : any;
*/

type InterpretProjectOperator<TRootValue, TValue> = {
  $abs?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$abs'>>;
  $acos?: NotImplementedYet;
  $acosh?: NotImplementedYet;
  $add?: LookupKey<TValue, '$add'> extends Array<InterpretProjectExpression<TRootValue, infer TAdds>>
    ? InterpretProjectExpression<TRootValue, TAdds>[]
    : never;
  $addToSet?: LookupKey<TValue, '$addToSet'> extends InterpretProjectExpression<TRootValue, infer TAddToSet>
    ? InterpretProjectExpression<TRootValue, TAddToSet>
    : never;
  $allElementsTrue?: NotImplementedYet;
  $and?: NotImplementedYet;
  $anyElementTrue?: NotImplementedYet;
  $arrayElemAt?: LookupKey<TValue, '$arrayElemAt'> extends [
    InterpretProjectExpression<TRootValue, infer TArray>,
    InterpretProjectExpression<TRootValue, infer TIndex>
  ]
    ? [InterpretProjectExpression<TRootValue, TArray>, InterpretProjectExpression<TRootValue, TIndex>]
    : never;
  $arrayToObject?: NotImplementedYet;
  $asin?: NotImplementedYet;
  $asinh?: NotImplementedYet;
  $atan?: NotImplementedYet;
  $atan2?: NotImplementedYet;
  $atanh?: NotImplementedYet;
  $avg?: NotImplementedYet;
  $ceil?: NotImplementedYet;
  $cmp?: NotImplementedYet;
  $concat?: LookupKey<TValue, '$concat'> extends InterpretProjectExpression<TRootValue, infer TConcat>[]
    ? InterpretProjectExpression<TRootValue, TConcat>[]
    : never;
  $concatArrays?: NotImplementedYet;
  $cond?:
    | [
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 0>>,
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 1>>,
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 2>>
      ]
    | {
        else: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
        if: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'if'>>;
        then: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>>;
      };
  $convert?: NotImplementedYet;
  $cos?: NotImplementedYet;
  $dateFromParts?: NotImplementedYet;
  $dateFromString?: NotImplementedYet;
  $dateToParts?: NotImplementedYet;
  $dateToString?: {
    date: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$dateToString'>, 'date'>>;
    format?: string;
  };
  $dayOfMonth?: NotImplementedYet;
  $dayOfWeek?: NotImplementedYet;
  $dayOfYear?: NotImplementedYet;
  $degreesToRadians?: NotImplementedYet;
  $divide?: LookupKey<TValue, '$divide'> extends Array<InterpretProjectExpression<TRootValue, infer TDivide>>
    ? InterpretProjectExpression<TRootValue, TDivide>[]
    : never;

  $eq?: LookupKey<TValue, '$eq'> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
  ]
    ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>]
    : never;
  $exp?: NotImplementedYet;
  $filter?: NotImplementedYet;
  $first?: LookupKey<TValue, '$first'> extends InterpretProjectExpression<TRootValue, infer TFirst>
    ? InterpretProjectExpression<TRootValue, TFirst>
    : never;

  $floor?: NotImplementedYet;
  $gt?: LookupKey<TValue, '$gt'> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
  ]
    ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>]
    : never;
  $gte?: LookupKey<TValue, '$gte'> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
  ]
    ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>]
    : never;
  $hour?: NotImplementedYet;
  $ifNull?: LookupKey<TValue, '$ifNull'> extends InterpretProjectExpression<TRootValue, infer TIfNull>[]
    ? InterpretProjectExpression<TRootValue, TIfNull>[]
    : never;
  $in?: LookupKey<TValue, '$in'> extends InterpretProjectExpression<TRootValue, infer TIn>
    ? InterpretProjectExpression<TRootValue, TIn>
    : never;
  $indexOfArray?: NotImplementedYet;
  $indexOfBytes?: NotImplementedYet;
  $indexOfCP?: NotImplementedYet;
  $isArray?: NotImplementedYet;
  $isoDayOfWeek?: NotImplementedYet;
  $isoWeek?: NotImplementedYet;
  $isoWeekYear?: NotImplementedYet;
  $last?: NotImplementedYet;
  $let?: NotImplementedYet;
  $literal?: NotImplementedYet;
  $ln?: NotImplementedYet;
  $log?: NotImplementedYet;
  $log10?: NotImplementedYet;
  $lt?: LookupKey<TValue, '$lt'> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
  ]
    ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>]
    : never;
  $lte?: LookupKey<TValue, '$lte'> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
  ]
    ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>]
    : never;
  $ltrim?: NotImplementedYet;
  $map?: LookupKey<TValue, '$map'> extends {
    as: string;
    in: infer TIn;
    input: ExpressionStringReferenceKey<TRootValue>;
  }
    ? {
        as: LookupKey<LookupKey<TValue, '$map'>, 'as'>;
        in: ProjectObject<
          TRootValue &
            {
              [key in `$${LookupKey<LookupKey<TValue, '$map'>, 'as'>}`]: DeReferenceExpression<
                TRootValue,
                LookupKey<LookupKey<TValue, '$map'>, 'input'>
              >;
            },
          TIn
        >;
        input: ExpressionStringReferenceKey<TRootValue>;
      }
    : never;
  $max?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$max'>>;
  $mergeObjects?: NotImplementedYet;
  $meta?: NotImplementedYet;
  $millisecond?: NotImplementedYet;
  $min?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$min'>>;
  $minute?: NotImplementedYet;
  $mod?: NotImplementedYet;
  $month?: NotImplementedYet;
  $multiply?: LookupKey<TValue, '$multiply'> extends Array<InterpretProjectExpression<TRootValue, infer TMultiply>>
    ? InterpretProjectExpression<TRootValue, TMultiply>[]
    : never;

  $ne?: NotImplementedYet;
  $not?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$not'>>;
  $objectToArray?: NotImplementedYet;
  $or?: NotImplementedYet;
  $pow?: NotImplementedYet;
  $push?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$push'>>;
  $radiansToDegrees?: NotImplementedYet;
  $range?: NotImplementedYet;
  $reduce?: NotImplementedYet;
  $regexFind?: NotImplementedYet;
  $regexFindAll?: NotImplementedYet;
  $regexMatch?: NotImplementedYet;
  $reverseArray?: NotImplementedYet;
  $round?: NotImplementedYet;
  $rtrim?: NotImplementedYet;
  $second?: NotImplementedYet;
  $setDifference?: NotImplementedYet;
  $setEquals?: NotImplementedYet;
  $setIntersection?: InterpretProjectExpression<
    TRootValue,
    LookupArray<LookupKey<TValue, '$setIntersection'>, number>
  >[];
  $setIsSubset?: NotImplementedYet;
  $setUnion?: NotImplementedYet;
  $sin?: NotImplementedYet;
  $size?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$size'>>;
  $slice?: NotImplementedYet;
  $split?: NotImplementedYet;
  $sqrt?: NotImplementedYet;
  $stdDevPop?: NotImplementedYet;
  $stdDevSamp?: NotImplementedYet;
  $strcasecmp?: NotImplementedYet;
  $strLenBytes?: NotImplementedYet;
  $strLenCP?: NotImplementedYet;
  $substr?: NotImplementedYet;
  $substrBytes?: NotImplementedYet;
  $substrCP?: NotImplementedYet;
  $subtract?: LookupKey<TValue, '$subtract'> extends Array<InterpretProjectExpression<TRootValue, infer TSubtract>>
    ? InterpretProjectExpression<TRootValue, TSubtract>[]
    : never;
  $sum?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$sum'>>;

  $switch?: LookupKey<TValue, '$switch'> extends {
    branches: {
      case: InterpretProjectExpression<TRootValue, infer TBranchCase>;
      then: InterpretProjectExpression<TRootValue, infer TBranchThen>;
    }[];
    default?: InterpretProjectExpression<TRootValue, infer TDefault>;
  }
    ? {
        branches: {
          case: InterpretProjectExpression<TRootValue, TBranchCase>;
          then: InterpretProjectExpression<TRootValue, TBranchThen>;
        }[];
        default: InterpretProjectExpression<TRootValue, TDefault>;
      }
    : never;

  $tan?: NotImplementedYet;
  $toBool?: NotImplementedYet;
  $toDate?: NotImplementedYet;
  $toDecimal?: NotImplementedYet;
  $toDouble?: NotImplementedYet;
  $toInt?: NotImplementedYet;
  $toLong?: NotImplementedYet;
  $toLower?: NotImplementedYet;
  $toObjectId?: NotImplementedYet;
  $toString?: NotImplementedYet;
  $toUpper?: NotImplementedYet;
  $trim?: NotImplementedYet;
  $trunc?:
    | [InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 0>>]
    | [
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 0>>,
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 1>>
      ]
    | InterpretProjectExpression<TRootValue, LookupKey<TValue, '$trunc'>>;
  $type?: NotImplementedYet;
  $week?: NotImplementedYet;
  $year?: NotImplementedYet;
  $zip?: NotImplementedYet;
};

type InterpretAccumulateOperator<TRootValue, TValue> = {
  $avg?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$avg'>>;
  $last?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$last'>>;
  $mergeObjects?: never;
  $stdDevPop?: never;
  $stdDevSamp?: never;

  $addToSet?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$addToSet'>>;
  $first?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$first'>>;
  $max?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$max'>>;
  $min?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$min'>>;
  $push?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$push'>>;
  $sum?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$sum'>>;
};

export type ExpressionStringReferenceKey<T> = `$${DeepKeys<T> | '$CURRENT'}`;
/*export type ExpressionStringReferenceKey<T, ForceValue = any> = keyof {
  [key in DeepKeys<T> as DeepKeysValue<T, key> extends ForceValue
    ? DeepKeysValue<T, key> extends never
      ? never
      : `$${key}`
    : never]: 1;
};*/

export type InterpretProjectExpression<TRootValue, TValue> = /* // you cant add one more here lol
 */ TValue extends `$${string}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? InterpretProjectOperator<TRootValue, TValue>
  : TValue extends Array<infer TValueArr>
  ? Array<ProjectObject<TRootValue, TValueArr>>
  : TValue extends {}
  ? ProjectObject<TRootValue, TValue>
  : never;

type ProjectObject<TRootValue, TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};

type AllAccumulateOperators =
  | '$addToSet'
  | '$avg'
  | '$first'
  | '$last'
  | '$max'
  | '$mergeObjects'
  | '$min'
  | '$push'
  | '$stdDevPop'
  | '$stdDevSamp'
  | '$sum';

type CheckProjectDeepKey<TKey extends string, TValue> = TValue extends 1 | true ? ([TKey] extends [never] ? 0 : 1) : 0;
type CheckProjectDeepKeyRemoveUnderscoreID<TKey extends string, TValue> = TValue extends 0 | false
  ? [TKey] extends ['_id']
    ? 1
    : 0
  : 0;

type ProjectResult<TRootValue, TValue> = TValue extends `$$CURRENT`
  ? TRootValue
  : TValue extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? ProjectResultOperators<TRootValue, TValue>[keyof TValue]
  : TValue extends Array<infer TValueArray>
  ? Array<ProjectResultObject<TRootValue, TValueArray>>
  : TValue extends {}
  ? ProjectResultObject<TRootValue, TValue>
  : never;

type ProjectResultRoot<TRootValue, TValue, TKey extends string = never> = TValue extends `$$CURRENT`
  ? TRootValue
  : TValue extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : CheckProjectDeepKey<TKey, TValue> extends 1
  ? DeepKeysResult<TRootValue, TKey>
  : CheckProjectDeepKeyRemoveUnderscoreID<TKey, TValue> extends 1
  ? never
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? ProjectResultOperators<TRootValue, TValue>[keyof TValue]
  : TValue extends Array<infer TValueArray>
  ? Array<ProjectResultRootObject<TRootValue, TValueArray, TKey>>
  : TValue extends {}
  ? ProjectResultRootObject<TRootValue, TValue, TKey>
  : never;

type ProjectResultOperators<TRootValue, TValue> = {
  $abs: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$abs'>>>;
  $acos: NotImplementedYet;
  $acosh: NotImplementedYet;
  $add: NumberTypeOrNever<ProjectResult<TRootValue, UnArray<LookupKey<TValue, '$add'>>>>;
  $addToSet: ProjectResult<TRootValue, LookupKey<TValue, '$addToSet'>>[];
  $allElementsTrue: NotImplementedYet;
  $and: NotImplementedYet;
  $anyElementTrue: NotImplementedYet;
  $arrayElemAt: UnArray<ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$arrayElemAt'>, 0>>>;
  $arrayToObject: NotImplementedYet;
  $asin: NotImplementedYet;
  $asinh: NotImplementedYet;
  $atan: NotImplementedYet;
  $atan2: NotImplementedYet;
  $atanh: NotImplementedYet;
  $avg: NotImplementedYet;
  $ceil: NotImplementedYet;
  $cmp: NotImplementedYet;
  $concat: string;
  $concatArrays: NotImplementedYet;
  $cond: LookupKey<TValue, '$cond'> extends Array<any>
    ?
        | ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 1>>
        | ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 2>>
    :
        | ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>>
        | ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
  $convert: NotImplementedYet;
  $cos: NotImplementedYet;
  $dateFromParts: NotImplementedYet;
  $dateFromString: NotImplementedYet;
  $dateToParts: NotImplementedYet;
  $dateToString: string;
  $dayOfMonth: NotImplementedYet;
  $dayOfWeek: NotImplementedYet;
  $dayOfYear: NotImplementedYet;
  $degreesToRadians: NotImplementedYet;
  $divide: NumberTypeOrNever<ProjectResult<TRootValue, UnArray<LookupKey<TValue, '$divide'>>>>;
  $eq: boolean;
  $exp: NotImplementedYet;
  $filter: NotImplementedYet;
  $first: ProjectResult<TRootValue, LookupKey<TValue, '$first'>>;
  $floor: NotImplementedYet;
  $gt: boolean;
  $gte: boolean;
  $hour: NotImplementedYet;
  $ifNull: ProjectResult<TRootValue, LookupKey<TValue, '$ifNull'>>;
  $in: ProjectResult<TRootValue, LookupKey<TValue, '$in'>>;
  $indexOfArray: NotImplementedYet;
  $indexOfBytes: NotImplementedYet;
  $indexOfCP: NotImplementedYet;
  $isArray: NotImplementedYet;
  $isoDayOfWeek: NotImplementedYet;
  $isoWeek: NotImplementedYet;
  $isoWeekYear: NotImplementedYet;
  $last: NotImplementedYet;
  $let: NotImplementedYet;
  $literal: NotImplementedYet;
  $ln: NotImplementedYet;
  $log: NotImplementedYet;
  $log10: NotImplementedYet;
  $lt: boolean;
  $lte: boolean;
  $ltrim: NotImplementedYet;
  $map: LookupKey<LookupKey<TValue, '$map'>, 'as'> extends string
    ? ProjectResult<
        TRootValue &
          {
            [key in `$${LookupKey<LookupKey<TValue, '$map'>, 'as'>}`]: ProjectResult<
              TRootValue,
              LookupKey<LookupKey<TValue, '$map'>, 'input'>
            >;
          },
        LookupKey<LookupKey<TValue, '$map'>, 'in'>
      >[]
    : never;
  $max: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$max'>>>>;
  $mergeObjects: NotImplementedYet;
  $meta: NotImplementedYet;
  $millisecond: NotImplementedYet;
  $min: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$min'>>>>;
  $minute: NotImplementedYet;
  $mod: NotImplementedYet;
  $month: NotImplementedYet;
  $multiply: NumberTypeOrNever<ProjectResult<TRootValue, UnArray<LookupKey<TValue, '$multiply'>>>>;
  $ne: boolean;
  $not: boolean;
  $objectToArray: NotImplementedYet;
  $or: NotImplementedYet;
  $pow: NotImplementedYet;
  $push: ProjectResult<TRootValue, LookupKey<TValue, '$push'>>[];
  $radiansToDegrees: NotImplementedYet;
  $range: NotImplementedYet;
  $reduce: NotImplementedYet;
  $regexFind: NotImplementedYet;
  $regexFindAll: NotImplementedYet;
  $regexMatch: NotImplementedYet;
  $reverseArray: NotImplementedYet;
  $round: NotImplementedYet;
  $rtrim: NotImplementedYet;
  $second: NotImplementedYet;
  $setDifference: NotImplementedYet;
  $setEquals: NotImplementedYet;
  $setIntersection: UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$setIntersection'>>>;
  $setIsSubset: NotImplementedYet;
  $setUnion: NotImplementedYet;
  $sin: NotImplementedYet;
  $size: number;
  $slice: NotImplementedYet;
  $split: NotImplementedYet;
  $sqrt: NotImplementedYet;
  $stdDevPop: NotImplementedYet;
  $stdDevSamp: NotImplementedYet;
  $strcasecmp: NotImplementedYet;
  $strLenBytes: NotImplementedYet;
  $strLenCP: NotImplementedYet;
  $substr: NotImplementedYet;
  $substrBytes: NotImplementedYet;
  $substrCP: NotImplementedYet;
  $subtract: NumberTypeOrNever<ProjectResult<TRootValue, UnArray<LookupKey<TValue, '$subtract'>>>>;
  $sum: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$sum'>>>>;
  $switch:
    | InterpretProjectExpression<
        TRootValue,
        LookupKey<LookupArray<LookupKey<LookupKey<TValue, '$switch'>, 'branches'>, number>, 'then'>
      >
    | InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$switch'>, 'default'>>;
  $tan: NotImplementedYet;
  $toBool: NotImplementedYet;
  $toDate: NotImplementedYet;
  $toDecimal: NotImplementedYet;
  $toDouble: NotImplementedYet;
  $toInt: NotImplementedYet;
  $toLong: NotImplementedYet;
  $toLower: NotImplementedYet;
  $toObjectId: NotImplementedYet;
  $toString: NotImplementedYet;
  $toUpper: NotImplementedYet;
  $trim: NotImplementedYet;
  $trunc: LookupKey<TValue, '$trunc'> extends Array<any>
    ? NumberTypeOrNever<ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 0>>>
    : NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$trunc'>>>;
  $type: NotImplementedYet;
  $week: NotImplementedYet;
  $year: NotImplementedYet;
  $zip: NotImplementedYet;
};

type AccumulateResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllAccumulateOperators
  ? {
      $avg: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$avg'>>>>;
      $last: ProjectResult<TRootValue, LookupKey<TValue, '$last'>>;
      $mergeObjects: never;
      $stdDevPop: never;
      $stdDevSamp: never;

      $sum: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$sum'>>>>;
      $addToSet: ProjectResult<TRootValue, LookupKey<TValue, '$addToSet'>>[];
      $first: ProjectResult<TRootValue, LookupKey<TValue, '$first'>>;
      $min: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$min'>>>>;
      $max: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$max'>>>>;
      $push: ProjectResult<TRootValue, LookupKey<TValue, '$push'>>[];
    }[keyof TValue]
  : never;

type GetProjectDeepKey<TDeepProjectKey extends string, key> = TDeepProjectKey extends never
  ? never
  : TDeepProjectKey extends ''
  ? key
  : key extends string
  ? `${TDeepProjectKey}.${key}`
  : '';

export type ProjectResultObject<TRootValue, TObj> = TObj extends infer T
  ? {
      [key in keyof T]: ProjectResult<TRootValue, T[key]>;
    }
  : never;

export type ProjectResultRootObject<TRootValue, TObj, TDeepProjectKey extends string = never> = TObj extends infer T
  ? {
      [key in keyof T]: ProjectResultRoot<TRootValue, T[key], GetProjectDeepKey<TDeepProjectKey, key>>;
    }
  : never;

export type LookupKey<T, TKey extends string> = TKey extends keyof T ? T[TKey] : never;
export type LookupArray<T, TIndex extends number> = T extends Array<any> ? T[TIndex] : never;

type InterpretAccumulateExpression<TRootValue, TValue> = /*
 */ TValue extends `$${infer TRawKey}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllAccumulateOperators
  ? InterpretAccumulateOperator<TRootValue, TValue>
  : never;

type AccumulateRootObject<TRootValue, TAccumulateObject> = {
  [key in keyof TAccumulateObject]: key extends '_id'
    ? InterpretProjectExpression<TRootValue, TAccumulateObject[key]>
    : InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
type AccumulateObject<TRootValue, TAccumulateObject> = {
  [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};

type AccumulateRootResultObject<TRootValue, TObj> = TObj extends infer T
  ? {
      [key in keyof T]: key extends '_id' ? ProjectResult<TRootValue, T[key]> : AccumulateResult<TRootValue, T[key]>;
    }
  : never;
type AccumulateResultObject<TRootValue, TObj> = TObj extends infer T
  ? {
      [key in keyof T]: AccumulateResult<TRootValue, T[key]>;
    }
  : never;

export type GraphDeep<TOther, TAs extends string, TDepthField extends string> = {
  [key in TAs]: (TOther & {[oKey in TDepthField]: number} & GraphDeep<TOther, TAs, TDepthField>)[];
};

export class Aggregator<T> {
  private currentPipeline?: {};

  private constructor(private parent?: any) {}

  static start<T>(): Aggregator<T> {
    return new Aggregator<T>();
  }
  $addFields<TProject>(fields: ProjectObject<T, TProject>): Aggregator<T & ProjectResultObject<T, TProject>> {
    this.currentPipeline = {$addFields: fields};
    return new Aggregator<T & ProjectResultObject<T, TProject>>(this);
  }

  $bucket(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $bucketAuto(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $collStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $count<TKey extends string>(key: TKey): Aggregator<{[cKey in TKey]: number}> {
    this.currentPipeline = {$count: key};
    return new Aggregator<{[cKey in TKey]: number}>(this);
  }

  $currentOp(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $facet<TItem>(
    props: {[key in keyof TItem]: (agg: Aggregator<T>) => Aggregator<TItem[key]>}
  ): Aggregator<{[key in keyof TItem]: TItem[key][]}> {
    this.currentPipeline = {$facet: {}};

    for (const safeKey of safeKeys(props)) {
      (this.currentPipeline as any).$facet[safeKey] = props[safeKey](new Aggregator<T>()).query();
    }

    return new Aggregator<{[key in keyof TItem]: TItem[key][]}>(this);
  }
  $geoNear<TDistanceField extends string>(props: {
    near: {
      type: 'Point';
      coordinates: [number, number];
    };
    query?: FilterQueryMatch<T, `$${DeepKeys<T>}`>;
    spherical?: boolean;
    maxDistance?: number;
    minDistance?: number;
    distanceMultiplier?: number;
    distanceField: TDistanceField;
  }): Aggregator<T & {[key in TDistanceField]: number}> {
    this.currentPipeline = {$geoNear: props};
    return new Aggregator<T & {[key in TDistanceField]: number}>(this);
  }
  $graphLookup<TOther, TAs extends string, TDepthField extends string = never>(props: {
    as: TAs;
    from: string;
    connectFromField: DeepKeys<T>;
    connectToField: DeepKeys<TOther>;
    depthField?: TDepthField;
    maxDepth?: number;
    startWith: ExpressionStringReferenceKey<T>;
  }): Aggregator<T & GraphDeep<TOther, TAs, TDepthField>> {
    this.currentPipeline = {$graphLookup: props};
    return new Aggregator<T & GraphDeep<TOther, TAs, TDepthField>>(this);
  }

  $group<TAccumulator>(
    props: AccumulateRootObject<T, TAccumulator>
  ): Aggregator<AccumulateRootResultObject<T, TAccumulator>> {
    this.currentPipeline = {$group: props};
    return new Aggregator<AccumulateRootResultObject<T, TAccumulator>>(this);
  }

  $indexStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $limit(limit: number): Aggregator<T> {
    this.currentPipeline = {$limit: limit};
    return new Aggregator<T>(this);
  }

  $listLocalSessions(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $listSessions(): Aggregator<T> {
    throw new Error('Not Implemented');
  }

  $lookup<TLookupTable, TAs extends string>(props: {
    from: string;
    localField: DeepKeys<T>;
    foreignField: DeepKeys<TLookupTable>;
    as: TAs;
  }): Aggregator<T & {[key in TAs]: TLookupTable[]}> {
    this.currentPipeline = {
      $lookup: {
        from: props.from,
        localField: props.localField,
        foreignField: props.foreignField,
        as: props.as,
      },
    };
    return new Aggregator<T & {[key in TAs]: TLookupTable[]}>(this);
  }

  $match(query: FilterQueryMatch<T, `$${DeepKeys<T>}`>): Aggregator<T> {
    this.currentPipeline = {$match: query};
    return new Aggregator<T>(this);
  }

  $merge(): Aggregator<T> {
    throw new Error('Not Implemented');
  }

  $out(tableName: string): Aggregator<void> {
    this.currentPipeline = {$out: tableName};
    return new Aggregator<void>(this);
  }

  $planCacheStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }

  $project<TProject>(
    query: ProjectObject<T, TProject>
  ): Aggregator<DeepExcludeNever<ProjectResultRootObject<T, TProject, ''>>> {
    this.currentPipeline = {$project: query};
    return new Aggregator<DeepExcludeNever<ProjectResultRootObject<T, TProject, ''>>>(this);
  }

  $redact(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $replaceRoot(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $replaceWith(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $sample(props: {size: number}): Aggregator<T> {
    this.currentPipeline = {$sample: props};
    return new Aggregator<T>(this);
  }
  $set(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $skip(skip: number): Aggregator<T> {
    this.currentPipeline = {$skip: skip};
    return new Aggregator<T>(this);
  }
  $sort(sorts: {[key in DeepKeys<T>]?: 1 | -1}): Aggregator<T> {
    this.currentPipeline = {$sort: sorts};
    return new Aggregator<T>(this);
  }

  $sortByCount(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $unset(): Aggregator<T> {
    throw new Error('Not Implemented');
  }

  $unwind<TKey extends DeepKeys<T>, TArrayIndexField extends string = never>(
    key: `$${TKey}` | {path: `$${TKey}`; preserveNullAndEmptyArrays?: boolean; includeArrayIndex?: TArrayIndexField}
  ): Aggregator<
    DeepReplaceKey<T & {[key in TArrayIndexField]: number}, DeepKeyArray<TKey>, UnArray<DeepKeysResult<T, TKey>>>
  > {
    this.currentPipeline = {$unwind: key};
    return new Aggregator<
      DeepReplaceKey<T & {[key in TArrayIndexField]: number}, DeepKeyArray<TKey>, UnArray<DeepKeysResult<T, TKey>>>
    >(this);
  }

  query(): {}[] {
    const pipelines = [];
    if (this.currentPipeline) {
      pipelines.push(this.currentPipeline!);
    }
    let parent = this.parent;
    while (parent) {
      pipelines.push(parent.currentPipeline!);
      parent = parent.parent;
    }
    return pipelines.reverse();
  }

  async result<TDoc extends {_id: ObjectId}>(collection: Collection<TDoc>): Promise<T[]> {
    const query = this.query();
    // console.log(JSON.stringify(q, null, 2));
    return collection.aggregate<T>(query).toArray();
  }

  async resultCursor<TDoc extends {_id: ObjectId}>(collection: Collection<TDoc>): Promise<AggregationCursor<T>> {
    const query = this.query();
    // console.log(JSON.stringify(q, null, 2));
    return collection.aggregate<T>(query);
  }
}
function safeKeys<T>(model: T): (keyof T)[] {
  return Object.keys(model) as (keyof T)[];
}
