import {SafeFilterQuery, MongoAltQuery, QuerySelector} from './typeSafeFilter';
import {Collection, ObjectID, ObjectId} from 'mongodb';
import {DeepKeys, DeepKeysResult, DeepKeysValue} from './deepQuery';

type RawTypes = number | boolean | string | ObjectID;
type OnlyArrayFieldsKeys<T> = {[key in keyof T]: T[key] extends Array<any> ? key : never}[keyof T];

type OnlyArrayFields<T> = {[key in keyof T]: T[key] extends Array<infer J> ? key : never}[keyof T];

export type UnArray<T> = T extends Array<infer U> ? U : T;
export type ReplaceKey<T, TKey, TValue> = {[key in keyof T]: key extends TKey ? TValue : T[key]};
/*
export type MongoPseudoArray<T> = T extends Array<infer J> ? (T extends J ? true : false) : false;

export type UnwrapMongoPseudoArrayDeep<T> = {
  [key in keyof T]: MongoPseudoArray<T[key]> extends true
    ? T[key] extends Array<infer J>
      ? UnwrapMongoPseudoArrayDeep<J>[]
      : never
    : T[key] extends {}
    ? UnwrapMongoPseudoArrayDeep<T[key]>
    : T[key];
};*/
type DeReferenceExpression<TRootValue, TRef> = TRef extends ExpressionStringReferenceKey<TRootValue>
  ? TRef extends `$${infer TRawKey}`
    ? DeepKeysResult<TRootValue, TRawKey>
    : never
  : TRef extends {}
  ? {[key in keyof TRef]: DeReferenceExpression<TRootValue, TRef[key]>}
  : TRef;

/*
export type FlattenArray<T> = {
  [key in keyof T]: T[key] extends Array<infer J>
    ? Arrayish<FlattenArray<J>> & FlattenArray<J>
    : T[key] extends ObjectID
    ? T[key]
    : T[key] extends {}
    ? FlattenArray<T[key]>
    : T[key];
};
*/

// export type UnwarpArrayish<T> = T extends Arrayish<infer J> ? J[] : T;

/*
export type UnwarpArrayishObject<T> = {
  [key in keyof T]: T[key] extends Arrayish<infer J>
    ? UnwarpArrayishObject<J>[]
    : T[key] extends {}
    ? UnwarpArrayishObject<T[key]>
    : T[key];
};
*/
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

type InterpretOperator<TRootValue, TValue, TProjectObject> = {
  $dateToString?: {
    date: ExpressionType<TRootValue, Date>;
    format?: string;
  };
  $sum?: ExpressionType<TRootValue, number>;
  $cond?: {
    if: ExpressionOrAny<LookupKey<LookupKey<TValue, '$cond'>, 'if'>, TRootValue>;
    then: ExpressionOrAny<LookupKey<LookupKey<TValue, '$cond'>, 'then'>, TRootValue>;
    else: ExpressionOrAny<LookupKey<LookupKey<TValue, '$cond'>, 'else'>, TRootValue>;
  };

  $eq?: LookupKey<TValue, '$eq'> extends [
    InterpretProjectExpression<TRootValue, infer TLeft, TProjectObject>,
    InterpretProjectExpression<TRootValue, infer TRight, TProjectObject>
  ]
    ? [
        InterpretProjectExpression<TRootValue, TLeft, TProjectObject>,
        InterpretProjectExpression<TRootValue, TRight, TProjectObject>
      ]
    : never;
  /*$map?: LookupKey<TValue, '$map'> extends {
    input: ExpressionStringKey<infer TInput>;
    as: infer TAs;
    in: ProjectObject<infer TIn>;
  }
    ? {input: ExpressionStringKey<TInput>; as: TAs; in: ProjectObject<TIn>}
    : never;

  $abs?: InterpretExpressionForceType<TValue, TProjectObject, '$abs', number>;*/
  $acos?: NotImplementedYet;
  $acosh?: NotImplementedYet;
  $add?: NotImplementedYet;
  $addToSet?: LookupKey<TValue, '$addToSet'> extends InterpretProjectExpression<
    TRootValue,
    infer TAddToSet,
    TProjectObject
  >
    ? InterpretProjectExpression<TRootValue, TAddToSet, TProjectObject>
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
  $concat?: LookupKey<TValue, '$concat'> extends InterpretProjectExpression<TRootValue, infer TConcat, TProjectObject>[]
    ? InterpretProjectExpression<TRootValue, TConcat, TProjectObject>[]
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
  $first?: NotImplementedYet;
  $floor?: NotImplementedYet;
  $gt?: NotImplementedYet;
  $gte?: NotImplementedYet;
  $hour?: NotImplementedYet;
  $ifNull?: NotImplementedYet;
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
  $multiply?: NotImplementedYet;
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

type Values<T> = T[keyof T];

export type ExpressionStringReferenceKey<T, ForceValue = any> = keyof {
  [key in DeepKeys<T> as DeepKeysValue<T, key> extends ForceValue
    ? DeepKeysValue<T, key> extends never
      ? never
      : `$${key}`
    : never]: 1;
};

export type InterpretProjectExpression<TRootValue, TValue, TProjectObject> = /*
 */ /*TValue extends ExpressionStringReferenceKey<FlattenArray<infer JA>>
  ? ExpressionStringReferenceKey<JA>
  : */ TValue extends ExpressionStringReferenceKey<
  infer J
>
  ? ExpressionStringReferenceKey<J>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? InterpretOperator<TRootValue, TValue, TProjectObject>
  : TValue extends {}
  ? TProjectObject
  : never;

export type ProjectObject<TRootValue, TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<
    TRootValue,
    TProject[key],
    ProjectObject<TRootValue, TProject[key]>
  >;
};

type AllAccumulateOperators = '$sum' | '$addToSet';

type ProjectResult<TRootValue, TValue> = TValue extends ExpressionStringReferenceKey<infer J>
  ? J
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
        $map: DeReferenceExpression<TRootValue, LookupKey<LookupKey<TValue, '$map'>, 'in'>>[];
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
        $first: NotImplementedYet;
        $floor: NotImplementedYet;
        $gt: NotImplementedYet;
        $gte: NotImplementedYet;
        $hour: NotImplementedYet;
        $ifNull: NotImplementedYet;
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
        $multiply: NotImplementedYet;
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

type AccumulateResult<TValue> = TValue extends ExpressionStringReferenceKey<infer J>
  ? J
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllAccumulateOperators
  ? LookupKey<
      {
        $sum: number;
        $addToSet: DeReferenceExpression<LookupKey<TValue, '$addToSet'>>[];
      },
      keyof TValue
    >
  : TValue extends {}
  ? AccumulateObjectResult<TValue>
  : never;

export type ProjectObjectResult<TRootValue, TObj> = {
  [key in keyof TObj]: ProjectResult<TRootValue, TObj[key]>;
};

export type LookupKey<T, TKey> = {[key in keyof T]: key extends TKey ? T[key] : never}[keyof T];

export type InterpretAccumulateExpression<TRootValue, TValue, TProjectObject> = /*
 */ /* TValue extends ExpressionStringReferenceKey<FlattenArray<infer JA>>
  ? ExpressionStringReferenceKey<JA>
  :*/ TValue extends ExpressionStringReferenceKey<
  infer J
>
  ? ExpressionStringReferenceKey<J>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllAccumulateOperators
  ? InterpretOperator<TRootValue, TValue, TProjectObject>
  : TValue extends {}
  ? TProjectObject
  : never;

export type AccumulateObject<TRootValue, TAccumulateObject> = {
  [key in keyof TAccumulateObject]: InterpretAccumulateExpression<
    TRootValue,
    TAccumulateObject[key],
    AccumulateObject<TRootValue, TAccumulateObject[key]>
  >;
};
export type AccumulateObjectResult<TObj> = {
  [key in keyof TObj]: AccumulateResult<TObj[key]>;
};

export class Aggregator<T> /*extends AggregatorLookup<T>*/ {
  private currentPipeline?: {};

  private constructor(private parent?: Aggregator<any>) {
    // super(parent?.variableLookupLevel ?? 1);
    // this.variableLookupLevel = parent?.variableLookupLevel ?? 1;
  }

  /* $addFields<T2>(fields: ProjectObject<T2>): Aggregator<T & ProjectObjectResult<T2>> {
    this.currentPipeline = {$addFields: fields};
    return new Aggregator<T & ProjectObjectResult<T2>>(this);
  }

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
  $graphLookup<
    TOther,
    TAs extends string,
    TStartsWith,
    TConnectFromField,
    TConnectToField,
    TDepthField extends string = never
  >(
    callback: (
      aggregator: AggregatorLookup<T>,
      aggregatorLookup: AggregatorLookup<TOther>
    ) => {
      collectionName: string;
      startWith: ExpressionStringReferenceKey<TStartsWith>;
      connectFromField: ExpressionStringKey<TConnectFromField>;
      connectToField: ExpressionStringKey<TConnectToField>;
      as: TAs;
      maxDepth?: number;
      depthField?: TDepthField;
    }
  ): Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}> {
    this.currentPipeline = {$graphLookup: callback(this, new AggregatorLookup<TOther>(this.variableLookupLevel))};
    return new Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}>(this);
  }

  $group<TGroupId extends InterpretProjectExpression<T, any, ProjectObject<any>>, TAccumulator extends {}>(
    callback: (aggregator: AggregatorLookup<T>) => [TGroupId] | [TGroupId, AccumulateObject<T, TAccumulator>]
  ): Aggregator<ProjectObjectResult<{_id: TGroupId}> & AccumulateObjectResult<TAccumulator>> {
    const result = callback(this);
    this.currentPipeline = {$group: {_id: result[0], ...result[1]}};
    return new Aggregator<ProjectObjectResult<{_id: TGroupId}> & AccumulateObjectResult<TAccumulator>>(this);
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
  $lookupCallback<TLookupTable, TLocalType, TForeignType extends TLocalType, TAs extends string>(
    callback: (
      aggregator: AggregatorLookup<T>,
      aggregatorLookup: AggregatorLookup<TLookupTable>
    ) => {
      from: string;
      localField: ExpressionStringKey<TLocalType>;
      foreignField: ExpressionStringKey<TForeignType>;
      as: TAs;
    }
  ): Aggregator<T & {[key in TAs]: TLookupTable[]}> {
    const result = callback(this, new AggregatorLookup<TLookupTable>(this.variableLookupLevel));
    this.currentPipeline = {
      $lookup: {
        from: result.from,
        localField: result.localField,
        foreignField: result.foreignField,
        as: result.as,
      },
    };
    return new Aggregator<T & {[key in TAs]: TLookupTable[]}>(this);
  }

  $match(query: SafeFilterQuery<T>): Aggregator<T> {
    this.currentPipeline = {$match: query};
    return new Aggregator<T>(this);
  }

  $matchCallback(callback: (aggregator: AggregatorLookup<T>) => SafeFilterQuery<T>): Aggregator<T> {
    this.currentPipeline = {$match: callback(this)};
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
  }*/
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
  $sort(sorts: Distribute<T, keyof T, 1 | -1>): Aggregator<T> {
    this.currentPipeline = {$sort: sorts};
    return new Aggregator<T>(this);
  } /*
  $sortCallback(callback: (aggregator: AggregatorLookup<T>) => Distribute<T, keyof T, 1 | -1>): Aggregator<T> {
    this.currentPipeline = {$sort: callback(this)};
    return new Aggregator<T>(this);
  }*/
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

  query(): Object[] {
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
