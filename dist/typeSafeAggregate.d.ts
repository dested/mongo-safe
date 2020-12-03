import { DeepKeys, DeepKeysResult, DeepKeysValue, FilterQuery, NumericTypes, Collection, ObjectID, ObjectId, DeepRequired } from 'mongodb';
declare type RawTypes = number | boolean | string | ObjectID | NumericTypes;
declare type OnlyArrayFields<T> = {
    [key in keyof T]: T[key] extends Array<infer J> ? key : never;
}[keyof T];
declare type FirstTupleElement<T> = T extends [infer Item, ...infer rest] ? Item : never;
export declare type UnArray<T> = T extends Array<infer U> ? U : T;
declare type ReplaceKey<T, TKey, TValue> = {
    [key in keyof T]: key extends TKey ? TValue : T[key];
};
export declare type DeReferenceExpression<TRootValue, TRef> = TRef extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TRef extends {} ? {
    [key in keyof TRef]: DeReferenceExpression<TRootValue, TRef[key]>;
} : TRef;
declare type NotImplementedYet = never;
declare type AllOperators = '$dateToString' | '$cond' | '$eq' | '$map' | '$sum' | '$abs' | '$acos' | '$acosh' | '$add' | '$addToSet' | '$allElementsTrue' | '$and' | '$anyElementTrue' | '$arrayElemAt' | '$arrayToObject' | '$asin' | '$asinh' | '$atan' | '$atan2' | '$atanh' | '$avg' | '$ceil' | '$cmp' | '$concat' | '$concatArrays' | '$convert' | '$cos' | '$dateFromParts' | '$dateToParts' | '$dateFromString' | '$dayOfMonth' | '$dayOfWeek' | '$dayOfYear' | '$degreesToRadians' | '$divide' | '$exp' | '$filter' | '$first' | '$floor' | '$gt' | '$gte' | '$hour' | '$ifNull' | '$in' | '$indexOfArray' | '$indexOfBytes' | '$indexOfCP' | '$isArray' | '$isoDayOfWeek' | '$isoWeek' | '$isoWeekYear' | '$last' | '$let' | '$literal' | '$ln' | '$log' | '$log10' | '$lt' | '$lte' | '$ltrim' | '$max' | '$mergeObjects' | '$meta' | '$min' | '$millisecond' | '$minute' | '$mod' | '$month' | '$multiply' | '$ne' | '$not' | '$objectToArray' | '$or' | '$pow' | '$push' | '$radiansToDegrees' | '$range' | '$reduce' | '$regexFind' | '$regexFindAll' | '$regexMatch' | '$reverseArray' | '$round' | '$rtrim' | '$second' | '$setDifference' | '$setEquals' | '$setIntersection' | '$setIsSubset' | '$setUnion' | '$size' | '$sin' | '$slice' | '$split' | '$sqrt' | '$stdDevPop' | '$stdDevSamp' | '$strcasecmp' | '$strLenBytes' | '$strLenCP' | '$substr' | '$substrBytes' | '$substrCP' | '$subtract' | '$switch' | '$tan' | '$toBool' | '$toDate' | '$toDecimal' | '$toDouble' | '$toInt' | '$toLong' | '$toObjectId' | '$toString' | '$toLower' | '$toUpper' | '$trim' | '$trunc' | '$type' | '$week' | '$year' | '$zip';
declare type InterpretProjectOperator<TRootValue, TValue> = {
    $abs?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$abs'>>;
    $acos?: NotImplementedYet;
    $acosh?: NotImplementedYet;
    $add?: NotImplementedYet;
    $addToSet?: LookupKey<TValue, '$addToSet'> extends InterpretProjectExpression<TRootValue, infer TAddToSet> ? InterpretProjectExpression<TRootValue, TAddToSet> : never;
    $allElementsTrue?: NotImplementedYet;
    $and?: NotImplementedYet;
    $anyElementTrue?: NotImplementedYet;
    $arrayElemAt?: LookupKey<TValue, '$arrayElemAt'> extends [
        InterpretProjectExpression<TRootValue, infer TArray>,
        InterpretProjectExpression<TRootValue, infer TIndex>
    ] ? [InterpretProjectExpression<TRootValue, TArray>, InterpretProjectExpression<TRootValue, TIndex>] : never;
    $arrayToObject?: NotImplementedYet;
    $asin?: NotImplementedYet;
    $asinh?: NotImplementedYet;
    $atan?: NotImplementedYet;
    $atan2?: NotImplementedYet;
    $atanh?: NotImplementedYet;
    $avg?: NotImplementedYet;
    $ceil?: NotImplementedYet;
    $cmp?: NotImplementedYet;
    $concat?: LookupKey<TValue, '$concat'> extends InterpretProjectExpression<TRootValue, infer TConcat>[] ? InterpretProjectExpression<TRootValue, TConcat>[] : never;
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
    ] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
    $exp?: NotImplementedYet;
    $filter?: NotImplementedYet;
    $first?: LookupKey<TValue, '$first'> extends InterpretProjectExpression<TRootValue, infer TFirst> ? InterpretProjectExpression<TRootValue, TFirst> : never;
    $floor?: NotImplementedYet;
    $gt?: NotImplementedYet;
    $gte?: NotImplementedYet;
    $hour?: NotImplementedYet;
    $ifNull?: LookupKey<TValue, '$ifNull'> extends InterpretProjectExpression<TRootValue, infer TIfNull>[] ? InterpretProjectExpression<TRootValue, TIfNull>[] : never;
    $in?: LookupKey<TValue, '$in'> extends InterpretProjectExpression<TRootValue, infer TIn> ? InterpretProjectExpression<TRootValue, TIn> : never;
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
    } ? {
        as: LookupKey<LookupKey<TValue, '$map'>, 'as'>;
        in: ProjectObject<TRootValue & {
            [key in `$${LookupKey<LookupKey<TValue, '$map'>, 'as'>}`]: DeReferenceExpression<TRootValue, LookupKey<LookupKey<TValue, '$map'>, 'input'>>;
        }, TIn>;
        input: ExpressionStringReferenceKey<TRootValue>;
    } : never;
    $max?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$max'>>;
    $mergeObjects?: NotImplementedYet;
    $meta?: NotImplementedYet;
    $millisecond?: NotImplementedYet;
    $min?: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$min'>>;
    $minute?: NotImplementedYet;
    $mod?: NotImplementedYet;
    $month?: NotImplementedYet;
    $multiply?: LookupKey<TValue, '$multiply'> extends InterpretProjectExpression<TRootValue, infer TMultiply>[] ? InterpretProjectExpression<TRootValue, TMultiply>[] : never;
    $ne?: NotImplementedYet;
    $not?: NotImplementedYet;
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
    $subtract?: LookupKey<TValue, '$subtract'> extends InterpretProjectExpression<TRootValue, infer TSubtract>[] ? InterpretProjectExpression<TRootValue, TSubtract>[] : never;
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
declare type InterpretAccumulateOperator<TRootValue, TValue> = {
    $addToSet?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$addToSet'>>;
    $arrayElemAt?: LookupKey<TValue, '$arrayElemAt'> extends [
        InterpretAccumulateExpression<TRootValue, infer TArray>,
        InterpretAccumulateExpression<TRootValue, infer TIndex>
    ] ? [InterpretAccumulateExpression<TRootValue, TArray>, InterpretAccumulateExpression<TRootValue, TIndex>] : never;
    $first?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$first'>>;
    $max?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$max'>>;
    $min?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$min'>>;
    $push?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$push'>>;
    $sum?: InterpretAccumulateExpression<TRootValue, LookupKey<TValue, '$sum'>>;
};
export declare type ExpressionStringReferenceKey<T, ForceValue = any> = keyof {
    [key in DeepKeys<T> as DeepKeysValue<T, key> extends ForceValue ? DeepKeysValue<T, key> extends never ? never : `$${key}` : never]: 1;
};
export declare type InterpretProjectExpression<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? ExpressionStringReferenceKey<TRootValue> : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? InterpretProjectOperator<TRootValue, TValue> : TValue extends {} ? ProjectObject<TRootValue, TValue> : never;
declare type ProjectObject<TRootValue, TProject> = {
    [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};
declare type AllAccumulateOperators = '$sum' | '$addToSet' | '$first' | '$min' | '$push' | '$arrayElemAt';
declare type ProjectResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? LookupKey<{
    $abs: number;
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
    $cond: ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>> | ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
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
    $map: LookupKey<LookupKey<TValue, '$map'>, 'as'> extends string ? ProjectResult<TRootValue & {
        [key in `$${LookupKey<LookupKey<TValue, '$map'>, 'as'>}`]: ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$map'>, 'input'>>;
    }, LookupKey<LookupKey<TValue, '$map'>, 'in'>>[] : never;
    $max: number;
    $mergeObjects: NotImplementedYet;
    $meta: NotImplementedYet;
    $millisecond: NotImplementedYet;
    $min: number;
    $minute: NotImplementedYet;
    $mod: NotImplementedYet;
    $month: NotImplementedYet;
    $multiply: number;
    $ne: NotImplementedYet;
    $not: NotImplementedYet;
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
    $subtract: number;
    $sum: number;
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
}, keyof TValue> : TValue extends {} ? ProjectObjectResult<TRootValue, TValue> : never;
declare type AccumulateResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TValue extends RawTypes ? TValue : keyof TValue extends AllAccumulateOperators ? LookupKey<{
    $sum: number;
    $addToSet: AccumulateResult<TRootValue, LookupKey<TValue, '$addToSet'>>[];
    $first: AccumulateResult<TRootValue, LookupKey<TValue, '$first'>>;
    $min: number;
    $arrayElemAt: UnArray<AccumulateResult<TRootValue, FirstTupleElement<LookupKey<TValue, '$arrayElemAt'>>>>;
    $push: AccumulateResult<TRootValue, LookupKey<TValue, '$push'>>[];
}, keyof TValue> : TValue extends {} ? AccumulateObjectResult<TRootValue, TValue> : never;
export declare type ProjectObjectResult<TRootValue, TObj> = {
    [key in keyof TObj]: ProjectResult<TRootValue, TObj[key]>;
};
export declare type LookupKey<T, TKey> = {
    [key in keyof T]: key extends TKey ? T[key] : never;
}[keyof T];
declare type InterpretAccumulateExpression<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? ExpressionStringReferenceKey<TRootValue> : TValue extends RawTypes ? TValue : keyof TValue extends AllAccumulateOperators ? InterpretAccumulateOperator<TRootValue, TValue> : TValue extends {} ? AccumulateObject<TRootValue, TValue> : never;
declare type AccumulateObject<TRootValue, TAccumulateObject> = {
    [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
declare type AccumulateObjectResult<TRootValue, TObj> = {
    [key in keyof TObj]: AccumulateResult<TRootValue, TObj[key]>;
};
export declare class Aggregator<T> {
    private parent?;
    private currentPipeline?;
    private constructor();
    static start<T>(): Aggregator<DeepRequired<T>>;
    $addFields<TProject>(fields: ProjectObject<T, TProject>): Aggregator<T & ProjectObjectResult<T, TProject>>;
    $bucket(): Aggregator<T>;
    $bucketAuto(): Aggregator<T>;
    $collStats(): Aggregator<T>;
    $count<TKey extends string>(key: TKey): Aggregator<{
        [cKey in TKey]: number;
    }>;
    $currentOp(): Aggregator<T>;
    $facet(): Aggregator<T>;
    $geoNear(): Aggregator<T>;
    $graphLookup<TOther, TAs extends string, TDepthField extends string = never>(props: {
        as: TAs;
        collectionName: string;
        connectFromField: DeepKeys<T>;
        connectToField: DeepKeys<TOther>;
        depthField?: TDepthField;
        maxDepth?: number;
        startWith: ExpressionStringReferenceKey<T>;
    }): Aggregator<T & {
        [key in TAs]: (TOther & {
            [oKey in TDepthField]: number;
        })[];
    }>;
    $group<TId, TAccumulator extends {}>(props: {
        _id: InterpretProjectExpression<T, TId>;
    }, body?: AccumulateObject<T, TAccumulator>): Aggregator<{
        _id: ProjectResult<T, TId>;
    } & AccumulateObjectResult<T, TAccumulator>>;
    $indexStats(): Aggregator<T>;
    $limit(limit: number): Aggregator<T>;
    $listLocalSessions(): Aggregator<T>;
    $listSessions(): Aggregator<T>;
    $lookup<TLookupTable, TAs extends string>(props: {
        from: string;
        localField: DeepKeys<T>;
        foreignField: DeepKeys<TLookupTable>;
        as: TAs;
    }): Aggregator<T & {
        [key in TAs]: TLookupTable[];
    }>;
    $match(query: FilterQuery<T>): Aggregator<T>;
    $merge(): Aggregator<T>;
    $out(): Aggregator<T>;
    $planCacheStats(): Aggregator<T>;
    $project<TProject>(query: ProjectObject<T, TProject>): Aggregator<ProjectObjectResult<T, TProject>>;
    $redact(): Aggregator<T>;
    $replaceRoot(): Aggregator<T>;
    $replaceWith(): Aggregator<T>;
    $sample(): Aggregator<T>;
    $set(): Aggregator<T>;
    $skip(skip: number): Aggregator<T>;
    $sort(sorts: {
        [key in DeepKeys<T>]?: 1 | -1;
    }): Aggregator<T>;
    $sortByCount(): Aggregator<T>;
    $unset(): Aggregator<T>;
    $unwind<TKey extends OnlyArrayFields<T>>(key: TKey): Aggregator<ReplaceKey<T, TKey, UnArray<T[TKey]>>>;
    $unwind<TKey extends keyof T, TKey2 extends OnlyArrayFields<T[TKey]>>(key: TKey, key2: TKey2): Aggregator<ReplaceKey<T, TKey, ReplaceKey<T[TKey], TKey2, UnArray<T[TKey][TKey2]>>>>;
    $unwind<TKey extends keyof T, TKey2 extends keyof T[TKey], TKey3 extends OnlyArrayFields<T[TKey][TKey2]>>(key: TKey, key2: TKey2, key3: TKey3): Aggregator<ReplaceKey<T, TKey, ReplaceKey<T[TKey], TKey2, ReplaceKey<T[TKey][TKey2], TKey3, UnArray<T[TKey][TKey2][TKey3]>>>>>;
    query(): {}[];
    result<TDoc extends {
        _id: ObjectId;
    }>(collection: Collection<TDoc>): Promise<T[]>;
}
export {};
