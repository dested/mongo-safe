import {
  DeepKeys,
  DeepKeysResult,
  DeepKeysValue,
  FilterQuery,
  NumericTypes,
  Collection,
  ObjectID,
  ObjectId,
  DeepRequired,
} from 'mongodb';
import {Decimal128, Double, Int32, Long} from 'bson';

type RawTypes = number | boolean | string | ObjectID | NumericTypes;

type NumberTypeOrNever<
  TValue
> = number; /*TValue extends number
  ? number
  : TValue extends Decimal128
  ? Decimal128
  : TValue extends Double
  ? Double
  : TValue extends Int32
  ? Int32
  : TValue extends Long
  ? Long
  : never*/

type OnlyArrayFieldsKeys<T> = {[key in keyof T]: T[key] extends Array<any> ? key : never}[keyof T];
type OnlyArrayFields<T> = {[key in keyof T]: T[key] extends Array<infer J> ? key : never}[keyof T];

type FirstTupleElement<T> = T extends [any, any] ? T[0] : never;
type SecondTupleElement<T> = T extends [any, any, any] ? T[1] : never;
type ThirdTupleElement<T> = T extends [any, any, any, any] ? T[2] : never;

export type UnArray<T> = T extends Array<infer U> ? U : T;
type ReplaceKey<T, TKey, TValue> = {[key in keyof T]: key extends TKey ? TValue : T[key]};

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

type ExpressionType<TRootValue, TForceValue> = ExpressionStringReferenceKey<TRootValue, TForceValue> | TForceValue;

/*
type ExpressionOrAny<TTest, TRootValue, TForceValue = any> = TTest extends `$${infer J}`
  ? ExpressionStringReferenceKey<TRootValue>
  : any;
*/

type InterpretProjectOperator<TRootValue, TValue> = {
  $abs?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$abs'>>;
  $acos?: NotImplementedYet;
  $acosh?: NotImplementedYet;
  $add?: NotImplementedYet;
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
  $cond?: {
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
  $divide?: NotImplementedYet;

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
  $gt?: NotImplementedYet;
  $gte?: NotImplementedYet;
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
  $lt?: NotImplementedYet;
  $lte?: NotImplementedYet;
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
        > /*| ExpressionStringReferenceKey<TRootValue & {dicks: true}>*/;
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
  $multiply?: LookupKey<TValue, '$multiply'> extends InterpretProjectExpression<TRootValue, infer TMultiply>[]
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
  $setIntersection?: NotImplementedYet;
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
  $subtract?: LookupKey<TValue, '$subtract'> extends InterpretProjectExpression<TRootValue, infer TSubtract>[]
    ? InterpretProjectExpression<TRootValue, TSubtract>[]
    : never;
  $sum?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$sum'>>;
  $switch?: NotImplementedYet;
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
  $trunc?: NotImplementedYet;
  $type?: NotImplementedYet;
  $week?: NotImplementedYet;
  $year?: NotImplementedYet;
  $zip?: NotImplementedYet;
};

type InterpretAccumulateOperator<TRootValue, TValue> = {
  $addToSet?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$addToSet'>>;
  $arrayElemAt?: LookupKey<TValue, '$arrayElemAt'> extends [
    InterpretAccumulateExpression<TRootValue, infer TArray>,
    InterpretAccumulateExpression<TRootValue, infer TIndex>
  ]
    ? [InterpretAccumulateExpression<TRootValue, TArray>, InterpretAccumulateExpression<TRootValue, TIndex>]
    : never;
  $cond?:
    | {
        else: InterpretAccumulateExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
        if: InterpretAccumulateExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'if'>>;
        then: InterpretAccumulateExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>>;
      }
    | [
        InterpretAccumulateExpression<TRootValue, FirstTupleElement<LookupKey<TValue, '$cond'>>>,
        InterpretAccumulateExpression<TRootValue, SecondTupleElement<LookupKey<TValue, '$cond'>>>,
        InterpretAccumulateExpression<TRootValue, ThirdTupleElement<LookupKey<TValue, '$cond'>>>
      ];
  $first?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$first'>>;
  $not?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$not'>>;
  $max?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$max'>>;
  $min?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$min'>>;
  $multiply?: LookupKey<TValue, '$multiply'> extends InterpretAccumulateExpression<TRootValue, infer TMultiply>[]
    ? InterpretAccumulateExpression<TRootValue, TMultiply>[]
    : never;
  $push?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$push'>>;
  $sum?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$sum'>>;
};

export type ExpressionStringReferenceKey<T, ForceValue = any> = keyof {
  [key in DeepKeys<T> as DeepKeysValue<T, key> extends ForceValue
    ? DeepKeysValue<T, key> extends never
      ? never
      : `$${key}`
    : never]: 1;
};

export type InterpretProjectExpression<TRootValue, TValue> = /*
 */ TValue extends `$${infer TRawKey}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? InterpretProjectOperator<TRootValue, TValue>
  : TValue extends {}
  ? ProjectObject<TRootValue, TValue>
  : never;

type ProjectObject<TRootValue, TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};

type AllAccumulateOperators =
  | '$sum'
  | '$addToSet'
  | '$first'
  | '$min'
  | '$multiply'
  | '$push'
  | '$arrayElemAt'
  | '$cond'
  | '$not';

type ProjectResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? {
      $abs: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$abs'>>>;
      $acos: NotImplementedYet;
      $acosh: NotImplementedYet;
      $add: NotImplementedYet;
      $addToSet: ProjectResult<TRootValue, LookupKey<TValue, '$addToSet'>>[];
      $allElementsTrue: NotImplementedYet;
      $and: NotImplementedYet;
      $anyElementTrue: NotImplementedYet;
      $arrayElemAt: UnArray<ProjectResult<TRootValue, FirstTupleElement<LookupKey<TValue, '$arrayElemAt'>>>>;
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
      $cond: LookupKey<TValue, '$cond'> extends /*[any, any]*/ [any, any, any]
        ?
            | ProjectResult<TRootValue, SecondTupleElement<LookupKey<TValue, '$cond'>>>
            | ProjectResult<TRootValue, ThirdTupleElement<LookupKey<TValue, '$cond'>>>
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
      $divide: NotImplementedYet;
      $eq: boolean;
      $exp: NotImplementedYet;
      $filter: NotImplementedYet;
      $first: ProjectResult<TRootValue, LookupKey<TValue, '$first'>>;
      $floor: NotImplementedYet;
      $gt: NotImplementedYet;
      $gte: NotImplementedYet;
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
      $lt: NotImplementedYet;
      $lte: NotImplementedYet;
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
      $multiply: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$multiply'>>>>;
      $ne: NotImplementedYet;
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
      $setIntersection: NotImplementedYet;
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
      $subtract: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$subtract'>>>;
      $sum: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$sum'>>>;
      $switch: NotImplementedYet;
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
      $trunc: NotImplementedYet;
      $type: NotImplementedYet;
      $week: NotImplementedYet;
      $year: NotImplementedYet;
      $zip: NotImplementedYet;
    }[keyof TValue]
  : TValue extends {}
  ? ProjectObjectResult<TRootValue, TValue>
  : never;

type AccumulateResult<TRootValue, TValue> = /*
 */ TValue extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllAccumulateOperators
  ? {
      $cond: LookupKey<TValue, '$cond'> extends /*[any, any] | */ [any, any, any]
        ?
            | AccumulateResult<TRootValue, SecondTupleElement<LookupKey<TValue, '$cond'>>>
            | AccumulateResult<TRootValue, ThirdTupleElement<LookupKey<TValue, '$cond'>>>
        :
            | AccumulateResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>>
            | AccumulateResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;

      $sum: NumberTypeOrNever<UnArray<AccumulateResult<TRootValue, LookupKey<TValue, '$sum'>>>>;
      $not: boolean;
      $addToSet: AccumulateResult<TRootValue, LookupKey<TValue, '$addToSet'>>[];
      $first: AccumulateResult<TRootValue, LookupKey<TValue, '$first'>>;
      $min: NumberTypeOrNever<UnArray<AccumulateResult<TRootValue, LookupKey<TValue, '$min'>>>>;
      $multiply: NumberTypeOrNever<UnArray<AccumulateResult<TRootValue, LookupKey<TValue, '$multiply'>>>>;
      $arrayElemAt: UnArray<AccumulateResult<TRootValue, FirstTupleElement<LookupKey<TValue, '$arrayElemAt'>>>>;
      $push: AccumulateResult<TRootValue, LookupKey<TValue, '$push'>>[];
    }[keyof TValue]
  : TValue extends {}
  ? AccumulateObjectResult<TRootValue, TValue>
  : never;

export type ProjectObjectResult<TRootValue, TObj> = {
  [key in keyof TObj]: ProjectResult<TRootValue, TObj[key]>;
};

export type LookupKey<T, TKey> = {[key in keyof T]: key extends TKey ? T[key] : never}[keyof T];

type InterpretAccumulateExpression<TRootValue, TValue> = /*
 */ TValue extends `$${infer TRawKey}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllAccumulateOperators
  ? InterpretAccumulateOperator<TRootValue, TValue>
  : TValue extends {}
  ? AccumulateObject<TRootValue, TValue>
  : never;

type AccumulateObject<TRootValue, TAccumulateObject> = {
  [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
type AccumulateObjectResult<TRootValue, TObj> = {
  [key in keyof TObj]: AccumulateResult<TRootValue, TObj[key]>;
};

export class Aggregator<T> {
  private currentPipeline?: {};

  private constructor(private parent?: Aggregator<any>) {}

  static start<T>(): Aggregator<DeepRequired<T>> {
    return new Aggregator<DeepRequired<T>>();
  }
  $addFields<TProject>(fields: ProjectObject<T, TProject>): Aggregator<T & ProjectObjectResult<T, TProject>> {
    this.currentPipeline = {$addFields: fields};
    return new Aggregator<T & ProjectObjectResult<T, TProject>>(this);
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
  $facet(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $geoNear(): Aggregator<T> {
    throw new Error('Not Implemented');
  }

  $graphLookup<TOther, TAs extends string, TDepthField extends string = never>(props: {
    as: TAs;
    collectionName: string;
    connectFromField: DeepKeys<T>;
    connectToField: DeepKeys<TOther>;
    depthField?: TDepthField;
    maxDepth?: number;
    startWith: ExpressionStringReferenceKey<T>;
  }): Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}> {
    this.currentPipeline = {$graphLookup: props};
    return new Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}>(this);
  }

  $group<TId, TAccumulator extends {}>(
    props: {
      _id: InterpretProjectExpression<T, TId>;
    },
    body?: AccumulateObject<T, TAccumulator>
  ): Aggregator<{_id: ProjectResult<T, TId>} & AccumulateObjectResult<T, TAccumulator>> {
    this.currentPipeline = {$group: {...props, ...body}};
    return new Aggregator<{_id: ProjectResult<T, TId>} & AccumulateObjectResult<T, TAccumulator>>(this);
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

  $match(query: FilterQuery<T>): Aggregator<T> {
    this.currentPipeline = {$match: query};
    return new Aggregator<T>(this);
  }

  $merge(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $out(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $planCacheStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }

  $project<TProject>(query: ProjectObject<T, TProject>): Aggregator<ProjectObjectResult<T, TProject>> {
    this.currentPipeline = {$project: query};
    return new Aggregator<ProjectObjectResult<T, TProject>>(this);
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
  $sample(): Aggregator<T> {
    throw new Error('Not Implemented');
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

  $unwind<TKey extends OnlyArrayFields<T>>(key: TKey): Aggregator<ReplaceKey<T, TKey, UnArray<T[TKey]>>>;

  $unwind<TKey extends keyof T, TKey2 extends OnlyArrayFields<T[TKey]>>(
    key: TKey,
    key2: TKey2
  ): Aggregator<ReplaceKey<T, TKey, ReplaceKey<T[TKey], TKey2, UnArray<T[TKey][TKey2]>>>>;

  $unwind<TKey extends keyof T, TKey2 extends keyof T[TKey], TKey3 extends OnlyArrayFields<T[TKey][TKey2]>>(
    key: TKey,
    key2: TKey2,
    key3: TKey3
  ): Aggregator<
    ReplaceKey<T, TKey, ReplaceKey<T[TKey], TKey2, ReplaceKey<T[TKey][TKey2], TKey3, UnArray<T[TKey][TKey2][TKey3]>>>>
  >;

  $unwind<TKey, TKey2 = undefined, TKey3 = undefined>(key: TKey, key2?: TKey2, key3?: TKey3): any {
    let result = '$';
    result += key;
    if (key2) {
      result += `.${key2}`;
    }
    if (key3) {
      result += `.${key3}`;
    }
    this.currentPipeline = {$unwind: result};
    return new Aggregator<T>(this);
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
    return collection.aggregate<T>(this.query()).toArray();
  }
}

type Distribute<T, TKey extends keyof T = keyof T, TOverwrite = T[TKey]> = T extends unknown
  ? {[key in TKey]?: TOverwrite}
  : never;
