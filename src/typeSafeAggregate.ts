import {
  DeepKeys,
  DeepKeysResult,
  DeepKeysValue,
  FilterQuery,
  NumericTypes,
  Collection,
  ObjectID,
  ObjectId,
} from 'mongodb';

type RawTypes = number | boolean | string | ObjectID;
type OnlyArrayFieldsKeys<T> = {[key in keyof T]: T[key] extends Array<any> ? key : never}[keyof T];

type OnlyArrayFields<T> = {[key in keyof T]: T[key] extends Array<infer J> ? key : never}[keyof T];

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

type ExpressionOrAny<TTest, TRootValue, TForceValue = any> = TTest extends `$${infer J}`
  ? ExpressionStringReferenceKey<TRootValue>
  : any;

type InterpretExpressionForceType<TRootValue, TValue, TForcedType = any> = /*
 */ DeReferenceExpression<TRootValue, TValue> extends TForcedType
  ? InterpretProjectExpression<TRootValue, TValue>
  : ProjectResult<TRootValue, TValue> extends TForcedType
  ? InterpretProjectExpression<TRootValue, TValue>
  : never;

type InterpretOperator<TRootValue, TValue> = {
  $dateToString?: {
    date: ExpressionType<TRootValue, Date>;
    format?: string;
  };
  $sum?: InterpretExpressionForceType<TRootValue, LookupKey<TValue, '$sum'>, NumericTypes>;
  $cond?: {
    if: ExpressionOrAny<LookupKey<LookupKey<TValue, '$cond'>, 'if'>, TRootValue>;
    then: ExpressionOrAny<LookupKey<LookupKey<TValue, '$cond'>, 'then'>, TRootValue>;
    else: ExpressionOrAny<LookupKey<LookupKey<TValue, '$cond'>, 'else'>, TRootValue>;
  };

  $eq?: LookupKey<TValue, '$eq'> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
  ]
    ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>]
    : never;
  $map?: LookupKey<TValue, '$map'> extends {
    input: ExpressionStringReferenceKey<TRootValue>;
    as: string;
    in: infer TIn;
  }
    ? {
        input: ExpressionStringReferenceKey<TRootValue>;
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
      }
    : never;

  $abs?: InterpretExpressionForceType<TRootValue, LookupKey<TValue, '$abs'>, number>;
  $acos?: NotImplementedYet;
  $acosh?: NotImplementedYet;
  $add?: NotImplementedYet;
  $addToSet?: LookupKey<TValue, '$addToSet'> extends InterpretProjectExpression<TRootValue, infer TAddToSet>
    ? InterpretProjectExpression<TRootValue, TAddToSet>
    : never;
  $allElementsTrue?: NotImplementedYet;
  $and?: NotImplementedYet;
  $anyElementTrue?: NotImplementedYet;
  $arrayElemAt?: NotImplementedYet;
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
  $convert?: NotImplementedYet;
  $cos?: NotImplementedYet;
  $dateFromParts?: NotImplementedYet;
  $dateToParts?: NotImplementedYet;
  $dateFromString?: NotImplementedYet;
  $dayOfMonth?: NotImplementedYet;
  $dayOfWeek?: NotImplementedYet;
  $dayOfYear?: NotImplementedYet;
  $degreesToRadians?: NotImplementedYet;
  $divide?: NotImplementedYet;
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
  $in?: NotImplementedYet;
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
  $max?: NotImplementedYet;
  $mergeObjects?: NotImplementedYet;
  $meta?: NotImplementedYet;
  $min?: NotImplementedYet;
  $millisecond?: NotImplementedYet;
  $minute?: NotImplementedYet;
  $mod?: NotImplementedYet;
  $month?: NotImplementedYet;
  $multiply?: LookupKey<TValue, '$multiply'> extends InterpretProjectExpression<TRootValue, infer TMultiply>[]
    ? InterpretProjectExpression<TRootValue, TMultiply>[]
    : never;
  $ne?: NotImplementedYet;
  $not?: NotImplementedYet;
  $objectToArray?: NotImplementedYet;
  $or?: NotImplementedYet;
  $pow?: NotImplementedYet;
  $push?: NotImplementedYet;
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
  $size?: NotImplementedYet;
  $sin?: NotImplementedYet;
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
  $subtract?: NotImplementedYet;
  $switch?: NotImplementedYet;
  $tan?: NotImplementedYet;
  $toBool?: NotImplementedYet;
  $toDate?: NotImplementedYet;
  $toDecimal?: NotImplementedYet;
  $toDouble?: NotImplementedYet;
  $toInt?: NotImplementedYet;
  $toLong?: NotImplementedYet;
  $toObjectId?: NotImplementedYet;
  $toString?: NotImplementedYet;
  $toLower?: NotImplementedYet;
  $toUpper?: NotImplementedYet;
  $trim?: NotImplementedYet;
  $trunc?: NotImplementedYet;
  $type?: NotImplementedYet;
  $week?: NotImplementedYet;
  $year?: NotImplementedYet;
  $zip?: NotImplementedYet;
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
  ? InterpretOperator<TRootValue, TValue>
  : TValue extends {}
  ? ProjectObject<TRootValue, TValue>
  : never;

type ProjectObject<TRootValue, TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};

type AllAccumulateOperators = '$sum' | '$addToSet' | '$first';

type ProjectResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? LookupKey<
      {
        $dateToString: string;
        $cond:
          | DeReferenceExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>>
          | DeReferenceExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
        $eq: boolean;
        $map: LookupKey<LookupKey<TValue, '$map'>, 'as'> extends string
          ? DeReferenceExpression<
              TRootValue &
                {
                  [key in `$${LookupKey<LookupKey<TValue, '$map'>, 'as'>}`]: DeReferenceExpression<
                    TRootValue,
                    LookupKey<LookupKey<TValue, '$map'>, 'input'>
                  >;
                },
              LookupKey<LookupKey<TValue, '$map'>, 'in'>
            >[]
          : never;
        $sum: number;
        $abs: number;
        $acos: NotImplementedYet;
        $acosh: NotImplementedYet;
        $add: NotImplementedYet;
        $addToSet: DeReferenceExpression<TRootValue, LookupKey<TValue, '$addToSet'>>[];
        $allElementsTrue: NotImplementedYet;
        $and: NotImplementedYet;
        $anyElementTrue: NotImplementedYet;
        $arrayElemAt: NotImplementedYet;
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
        $convert: NotImplementedYet;
        $cos: NotImplementedYet;
        $dateFromParts: NotImplementedYet;
        $dateToParts: NotImplementedYet;
        $dateFromString: NotImplementedYet;
        $dayOfMonth: NotImplementedYet;
        $dayOfWeek: NotImplementedYet;
        $dayOfYear: NotImplementedYet;
        $degreesToRadians: NotImplementedYet;
        $divide: NotImplementedYet;
        $exp: NotImplementedYet;
        $filter: NotImplementedYet;
        $first: DeReferenceExpression<TRootValue, LookupKey<TValue, '$first'>>;
        $floor: NotImplementedYet;
        $gt: NotImplementedYet;
        $gte: NotImplementedYet;
        $hour: NotImplementedYet;
        $ifNull: DeReferenceExpression<TRootValue, LookupKey<TValue, '$ifNull'>>;
        $in: NotImplementedYet;
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
        $max: NotImplementedYet;
        $mergeObjects: NotImplementedYet;
        $meta: NotImplementedYet;
        $min: NotImplementedYet;
        $millisecond: NotImplementedYet;
        $minute: NotImplementedYet;
        $mod: NotImplementedYet;
        $month: NotImplementedYet;
        $multiply: number;
        $ne: NotImplementedYet;
        $not: NotImplementedYet;
        $objectToArray: NotImplementedYet;
        $or: NotImplementedYet;
        $pow: NotImplementedYet;
        $push: NotImplementedYet;
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
        $size: NotImplementedYet;
        $sin: NotImplementedYet;
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
        $subtract: NotImplementedYet;
        $switch: NotImplementedYet;
        $tan: NotImplementedYet;
        $toBool: NotImplementedYet;
        $toDate: NotImplementedYet;
        $toDecimal: NotImplementedYet;
        $toDouble: NotImplementedYet;
        $toInt: NotImplementedYet;
        $toLong: NotImplementedYet;
        $toObjectId: NotImplementedYet;
        $toString: NotImplementedYet;
        $toLower: NotImplementedYet;
        $toUpper: NotImplementedYet;
        $trim: NotImplementedYet;
        $trunc: NotImplementedYet;
        $type: NotImplementedYet;
        $week: NotImplementedYet;
        $year: NotImplementedYet;
        $zip: NotImplementedYet;
      },
      keyof TValue
    >
  : TValue extends {}
  ? ProjectObjectResult<TRootValue, TValue>
  : never;

type AccumulateResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllAccumulateOperators
  ? LookupKey<
      {
        $sum: number;
        $addToSet: DeReferenceExpression<TRootValue, LookupKey<TValue, '$addToSet'>>[];
        $first: DeReferenceExpression<TRootValue, LookupKey<TValue, '$first'>>;
      },
      keyof TValue
    >
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
  ? InterpretOperator<TRootValue, TValue>
  : never;

type AccumulateObject<TRootValue, TAccumulateObject> = {
  [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
type AccumulateObjectResult<TRootValue, TObj> = {
  [key in keyof TObj]: AccumulateResult<TRootValue, TObj[key]>;
};

type $LookupType<T, TLookupTable, TAs extends string> = {
  from: string;
  localField: DeepKeys<T>;
  foreignField: DeepKeys<TLookupTable>;
  as: TAs;
};

export class Aggregator<T> {
  private currentPipeline?: {};

  private constructor(private parent?: Aggregator<any>) {}

  $lookup<TLookupTable, TAs extends string>(
    props: $LookupType<T, TLookupTable, TAs>
  ): Aggregator<T & {[key in TAs]: TLookupTable[]}> {
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
  $addFields<TProject>(fields: ProjectObject<T, TProject>): Aggregator<T & ProjectObjectResult<T, TProject>> {
    this.currentPipeline = {$addFields: fields};
    return new Aggregator<T & ProjectObjectResult<T, TProject>>(this);
  }
  $count<TKey extends string>(key: TKey): Aggregator<{[cKey in TKey]: number}> {
    this.currentPipeline = {$count: key};
    return new Aggregator<{[cKey in TKey]: number}>(this);
  }
  $limit(limit: number): Aggregator<T> {
    this.currentPipeline = {$limit: limit};
    return new Aggregator<T>(this);
  }
  /*

  $addFieldsCallback<T2>(
    callback: (aggregator: AggregatorLookup<T>) => ProjectObject<T2>
  ): Aggregator<T & ProjectObjectResult<T2>> {
    this.currentPipeline = {$addFields: callback(this)};
    return new Aggregator<T & ProjectObjectResult<T2>>(this);
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

  $currentOp(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $facet(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $geoNear(): Aggregator<T> {
    throw new Error('Not Implemented');
  }


  $indexStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }

  $listLocalSessions(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $listSessions(): Aggregator<T> {
    throw new Error('Not Implemented');
  }



  $merge(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $out(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $planCacheStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }*/

  $group<TId, TAccumulator extends {}>(
    props: {
      _id: InterpretProjectExpression<T, TId>;
    },
    body?: AccumulateObject<T, TAccumulator>
  ): Aggregator<{_id: ProjectResult<T, TId>} & AccumulateObjectResult<T, TAccumulator>> {
    this.currentPipeline = {$group: {...props, ...body}};
    return new Aggregator<{_id: ProjectResult<T, TId>} & AccumulateObjectResult<T, TAccumulator>>(this);
  }

  $graphLookup<TOther, TAs extends string, TDepthField extends string = never>(props: {
    collectionName: string;
    startWith: ExpressionStringReferenceKey<T>;
    connectFromField: DeepKeys<T>;
    connectToField: DeepKeys<TOther>;
    as: TAs;
    maxDepth?: number;
    depthField?: TDepthField;
  }): Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}> {
    this.currentPipeline = {$graphLookup: props};
    return new Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}>(this);
  }

  $match(query: FilterQuery<T>): Aggregator<T> {
    this.currentPipeline = {$match: query};
    return new Aggregator<T>(this);
  }

  $project<TProject>(query: ProjectObject<T, TProject>): Aggregator<ProjectObjectResult<T, TProject>> {
    this.currentPipeline = {$project: query};
    return new Aggregator<ProjectObjectResult<T, TProject>>(this);
  }
  /*
  $projectCallback<TProject>(
    callback: (aggregator: AggregatorLookup<T>) => ProjectObject<TProject>
  ): Aggregator<ProjectObjectResult<TProject>> {
    this.currentPipeline = {$project: callback(this)};
    return new Aggregator<ProjectObjectResult<TProject>>(this);
  }
*/
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

  /*
   */
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

  async result<TDoc extends {_id: ObjectId}>(collection: Collection<TDoc>): Promise<T[]> {
    return collection.aggregate<T>(this.query()).toArray();
  }

  static start<T>(): Aggregator<T> {
    return new Aggregator<T>();
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
}

type Distribute<T, TKey extends keyof T = keyof T, TOverwrite = T[TKey]> = T extends unknown
  ? {[key in TKey]?: TOverwrite}
  : never;
