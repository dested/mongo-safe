import { DeepKeys, DeepKeysResult, NumericTypes, Collection, ObjectID, ObjectId, DeepKeyArray, AggregationCursor } from 'mongodb';
import { FilterQueryMatch } from './filterQueryMatch';
declare type RawTypes = number | boolean | string | Date | ObjectID | NumericTypes;
declare type NonObjectValues = number | boolean | string | Date | ObjectID | NumericTypes;
declare type NumberTypeOrNever<TValue> = TValue extends NumericTypes ? ([TValue] extends [number] ? number : TValue) : never;
declare type DeepExcludeNever<T> = T extends NonObjectValues ? T : T extends Array<infer TArr> ? Array<DeepExcludeNever<T[number]>> : {
    [key in keyof T as T[key] extends never ? never : key]: DeepExcludeNever<T[key]>;
};
export declare type ExcludeNever<T> = {
    [key in keyof T as T[key] extends never ? never : key]: T[key];
};
export declare type UnArray<T> = T extends Array<infer U> ? U : T;
export declare type DeepUnArray<T> = T extends Array<infer U> ? DeepUnArray<U> : T;
declare type ReplaceKey<T, TKey, TValue> = {
    [key in keyof T]: key extends TKey ? TValue : T[key];
};
declare type DeepReplaceKey<T, TKeys extends Array<any>, TValue> = TKeys extends [infer TCurrentKey, ...infer TRestKeys] ? TRestKeys extends [] ? ReplaceKey<T, TKeys[0], TValue> : {
    [key in keyof T]: key extends TCurrentKey ? DeepReplaceKey<T[key], TRestKeys, TValue> : T[key];
} : never;
export declare type DeReferenceExpression<TRootValue, TRef> = TRef extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TRef extends {} ? {
    [key in keyof TRef]: DeReferenceExpression<TRootValue, TRef[key]>;
} : TRef;
declare type NotImplementedYet = never;
declare type NotImplementedProjectedYet = never;
declare type AllOperators = '$dateToString' | '$cond' | '$eq' | '$map' | '$sum' | '$abs' | '$acos' | '$acosh' | '$add' | '$addToSet' | '$allElementsTrue' | '$and' | '$anyElementTrue' | '$arrayElemAt' | '$arrayToObject' | '$asin' | '$asinh' | '$atan' | '$atan2' | '$atanh' | '$avg' | '$ceil' | '$cmp' | '$concat' | '$concatArrays' | '$convert' | '$cos' | '$dateFromParts' | '$dateToParts' | '$dateFromString' | '$dayOfMonth' | '$dayOfWeek' | '$dayOfYear' | '$degreesToRadians' | '$divide' | '$exp' | '$filter' | '$first' | '$floor' | '$gt' | '$gte' | '$hour' | '$ifNull' | '$in' | '$indexOfArray' | '$indexOfBytes' | '$indexOfCP' | '$isArray' | '$isoDayOfWeek' | '$isoWeek' | '$isoWeekYear' | '$last' | '$let' | '$literal' | '$ln' | '$log' | '$log10' | '$lt' | '$lte' | '$ltrim' | '$max' | '$mergeObjects' | '$meta' | '$min' | '$millisecond' | '$minute' | '$mod' | '$month' | '$multiply' | '$ne' | '$not' | '$objectToArray' | '$or' | '$pow' | '$push' | '$radiansToDegrees' | '$range' | '$reduce' | '$regexFind' | '$regexFindAll' | '$regexMatch' | '$reverseArray' | '$round' | '$rtrim' | '$second' | '$setDifference' | '$setEquals' | '$setIntersection' | '$setIsSubset' | '$setUnion' | '$size' | '$sin' | '$slice' | '$split' | '$sqrt' | '$stdDevPop' | '$stdDevSamp' | '$strcasecmp' | '$strLenBytes' | '$strLenCP' | '$substr' | '$substrBytes' | '$substrCP' | '$subtract' | '$switch' | '$tan' | '$toBool' | '$toDate' | '$toDecimal' | '$toDouble' | '$toInt' | '$toLong' | '$toObjectId' | '$toString' | '$toLower' | '$toUpper' | '$trim' | '$trunc' | '$type' | '$week' | '$year' | '$zip';
declare type InterpretProjectOperator<TRootValue, TValue> = {
    $abs: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$abs'>>;
} | {
    $acos: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$acos'>>;
} | {
    $acosh: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$acosh'>>;
} | {
    $add: LookupKey<TValue, '$add'> extends Array<InterpretProjectExpression<TRootValue, infer TAdds>> ? InterpretProjectExpression<TRootValue, TAdds>[] : never;
} | {
    $addToSet: LookupKey<TValue, '$addToSet'> extends InterpretProjectExpression<TRootValue, infer TAddToSet> ? InterpretProjectExpression<TRootValue, TAddToSet> : never;
} | {
    $allElementsTrue: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$allElementsTrue'>>[];
} | {
    $and: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$and'>>[];
} | {
    $anyElementTrue: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$anyElementTrue'>>[];
} | {
    $arrayElemAt: LookupKey<TValue, '$arrayElemAt'> extends [
        InterpretProjectExpression<TRootValue, infer TArray>,
        InterpretProjectExpression<TRootValue, infer TIndex>
    ] ? [InterpretProjectExpression<TRootValue, TArray>, InterpretProjectExpression<TRootValue, TIndex>] : never;
} | {
    $arrayToObject: NotImplementedProjectedYet;
} | {
    $asin: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$asin'>>;
} | {
    $asinh: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$asinh'>>;
} | {
    $atan: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$atan'>>;
} | {
    $atan2: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$atan2'>>[];
} | {
    $atanh: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$atanh'>>;
} | {
    $avg: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$avg'>>[] | InterpretProjectExpression<TRootValue, LookupKey<TValue, '$avg'>>;
} | {
    $binarySize: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$binarySize'>>;
} | {
    $bsonSize: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$bsonSize'>>;
} | {
    $ceil: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$ceil'>>;
} | {
    $cmp: LookupKey<TValue, '$cmp'> extends InterpretProjectExpression<TRootValue, infer TCmp>[] ? InterpretProjectExpression<TRootValue, TCmp>[] : never;
} | {
    $concat: LookupKey<TValue, '$concat'> extends InterpretProjectExpression<TRootValue, infer TConcat>[] ? InterpretProjectExpression<TRootValue, TConcat>[] : never;
} | {
    $concatArrays: LookupKey<TValue, '$concatArrays'> extends InterpretProjectExpression<TRootValue, infer TConcatArrays>[] ? InterpretProjectExpression<TRootValue, TConcatArrays>[] : never;
} | {
    $cond: [
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 0>>,
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 1>>,
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 2>>
    ] | {
        else: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
        if: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'if'>>;
        then: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>>;
    };
} | {
    $convert: NotImplementedProjectedYet;
} | {
    $cos: NotImplementedProjectedYet;
} | {
    $dateFromParts: NotImplementedProjectedYet;
} | {
    $dateFromString: NotImplementedProjectedYet;
} | {
    $dateToParts: NotImplementedProjectedYet;
} | {
    $dateToString: {
        date: InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$dateToString'>, 'date'>>;
        format?: string;
    };
} | {
    $dayOfMonth: NotImplementedProjectedYet;
} | {
    $dayOfWeek: NotImplementedProjectedYet;
} | {
    $dayOfYear: NotImplementedProjectedYet;
} | {
    $degreesToRadians: NotImplementedProjectedYet;
} | {
    $divide: LookupKey<TValue, '$divide'> extends Array<InterpretProjectExpression<TRootValue, infer TDivide>> ? InterpretProjectExpression<TRootValue, TDivide>[] : never;
} | {
    $eq: LookupKey<TValue, '$eq'> extends [
        InterpretProjectExpression<TRootValue, infer TLeft>,
        InterpretProjectExpression<TRootValue, infer TRight>
    ] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
} | {
    $exp: NotImplementedProjectedYet;
} | {
    $filter: NotImplementedProjectedYet;
} | {
    $first: LookupKey<TValue, '$first'> extends InterpretProjectExpression<TRootValue, infer TFirst> ? InterpretProjectExpression<TRootValue, TFirst> : never;
} | {
    $floor: NotImplementedProjectedYet;
} | {
    $gt: LookupKey<TValue, '$gt'> extends [
        InterpretProjectExpression<TRootValue, infer TLeft>,
        InterpretProjectExpression<TRootValue, infer TRight>
    ] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
} | {
    $gte: LookupKey<TValue, '$gte'> extends [
        InterpretProjectExpression<TRootValue, infer TLeft>,
        InterpretProjectExpression<TRootValue, infer TRight>
    ] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
} | {
    $hour: NotImplementedProjectedYet;
} | {
    $ifNull: LookupKey<TValue, '$ifNull'> extends InterpretProjectExpression<TRootValue, infer TIfNull>[] ? InterpretProjectExpression<TRootValue, TIfNull>[] : never;
} | {
    $in: LookupKey<TValue, '$in'> extends InterpretProjectExpression<TRootValue, infer TIn> ? InterpretProjectExpression<TRootValue, TIn> : never;
} | {
    $indexOfArray: NotImplementedProjectedYet;
} | {
    $indexOfBytes: NotImplementedProjectedYet;
} | {
    $indexOfCP: NotImplementedProjectedYet;
} | {
    $isArray: NotImplementedProjectedYet;
} | {
    $isoDayOfWeek: NotImplementedProjectedYet;
} | {
    $isoWeek: NotImplementedProjectedYet;
} | {
    $isoWeekYear: NotImplementedProjectedYet;
} | {
    $last: NotImplementedProjectedYet;
} | {
    $let: NotImplementedProjectedYet;
} | {
    $literal: NotImplementedProjectedYet;
} | {
    $ln: NotImplementedProjectedYet;
} | {
    $log: NotImplementedProjectedYet;
} | {
    $log10: NotImplementedProjectedYet;
} | {
    $lt: LookupKey<TValue, '$lt'> extends [
        InterpretProjectExpression<TRootValue, infer TLeft>,
        InterpretProjectExpression<TRootValue, infer TRight>
    ] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
} | {
    $lte: LookupKey<TValue, '$lte'> extends [
        InterpretProjectExpression<TRootValue, infer TLeft>,
        InterpretProjectExpression<TRootValue, infer TRight>
    ] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
} | {
    $ltrim: NotImplementedProjectedYet;
} | {
    $map: LookupKey<TValue, '$map'> extends {
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
} | {
    $max: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$max'>>;
} | {
    $mergeObjects: NotImplementedProjectedYet;
} | {
    $meta: NotImplementedProjectedYet;
} | {
    $millisecond: NotImplementedProjectedYet;
} | {
    $min: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$min'>>;
} | {
    $minute: NotImplementedProjectedYet;
} | {
    $mod: NotImplementedProjectedYet;
} | {
    $month: NotImplementedProjectedYet;
} | {
    $multiply: LookupKey<TValue, '$multiply'> extends Array<InterpretProjectExpression<TRootValue, infer TMultiply>> ? InterpretProjectExpression<TRootValue, TMultiply>[] : never;
} | {
    $ne: NotImplementedProjectedYet;
} | {
    $not: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$not'>>;
} | {
    $objectToArray: NotImplementedProjectedYet;
} | {
    $or: NotImplementedProjectedYet;
} | {
    $pow: NotImplementedProjectedYet;
} | {
    $push: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$push'>>;
} | {
    $radiansToDegrees: NotImplementedProjectedYet;
} | {
    $range: NotImplementedProjectedYet;
} | {
    $reduce: NotImplementedProjectedYet;
} | {
    $regexFind: NotImplementedProjectedYet;
} | {
    $regexFindAll: NotImplementedProjectedYet;
} | {
    $regexMatch: NotImplementedProjectedYet;
} | {
    $reverseArray: NotImplementedProjectedYet;
} | {
    $round: NotImplementedProjectedYet;
} | {
    $rtrim: NotImplementedProjectedYet;
} | {
    $second: NotImplementedProjectedYet;
} | {
    $setDifference: NotImplementedProjectedYet;
} | {
    $setEquals: NotImplementedProjectedYet;
} | {
    $setIntersection: InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$setIntersection'>, number>>[];
} | {
    $setIsSubset: NotImplementedProjectedYet;
} | {
    $setUnion: NotImplementedProjectedYet;
} | {
    $sin: NotImplementedProjectedYet;
} | {
    $size: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$size'>>;
} | {
    $slice: NotImplementedProjectedYet;
} | {
    $split: NotImplementedProjectedYet;
} | {
    $sqrt: NotImplementedProjectedYet;
} | {
    $stdDevPop: NotImplementedProjectedYet;
} | {
    $stdDevSamp: NotImplementedProjectedYet;
} | {
    $strcasecmp: NotImplementedProjectedYet;
} | {
    $strLenBytes: NotImplementedProjectedYet;
} | {
    $strLenCP: NotImplementedProjectedYet;
} | {
    $substr: NotImplementedProjectedYet;
} | {
    $substrBytes: NotImplementedProjectedYet;
} | {
    $substrCP: NotImplementedProjectedYet;
} | {
    $subtract: LookupKey<TValue, '$subtract'> extends Array<InterpretProjectExpression<TRootValue, infer TSubtract>> ? InterpretProjectExpression<TRootValue, TSubtract>[] : never;
} | {
    $sum: InterpretProjectExpression<TRootValue, LookupKey<TValue, '$sum'>>;
} | {
    $switch: LookupKey<TValue, '$switch'> extends {
        branches: {
            case: InterpretProjectExpression<TRootValue, infer TBranchCase>;
            then: InterpretProjectExpression<TRootValue, infer TBranchThen>;
        }[];
        default?: InterpretProjectExpression<TRootValue, infer TDefault>;
    } ? {
        branches: {
            case: InterpretProjectExpression<TRootValue, TBranchCase>;
            then: InterpretProjectExpression<TRootValue, TBranchThen>;
        }[];
        default: InterpretProjectExpression<TRootValue, TDefault>;
    } : never;
} | {
    $tan: NotImplementedProjectedYet;
} | {
    $toBool: NotImplementedProjectedYet;
} | {
    $toDate: NotImplementedProjectedYet;
} | {
    $toDecimal: NotImplementedProjectedYet;
} | {
    $toDouble: NotImplementedProjectedYet;
} | {
    $toInt: NotImplementedProjectedYet;
} | {
    $toLong: NotImplementedProjectedYet;
} | {
    $toLower: NotImplementedProjectedYet;
} | {
    $toObjectId: NotImplementedProjectedYet;
} | {
    $toString: NotImplementedProjectedYet;
} | {
    $toUpper: NotImplementedProjectedYet;
} | {
    $trim: NotImplementedProjectedYet;
} | {
    $trunc: [InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 0>>] | [
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 0>>,
        InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 1>>
    ] | InterpretProjectExpression<TRootValue, LookupKey<TValue, '$trunc'>>;
} | {
    $type: NotImplementedProjectedYet;
} | {
    $week: NotImplementedProjectedYet;
} | {
    $year: NotImplementedProjectedYet;
} | {
    $zip: NotImplementedProjectedYet;
};
declare type InterpretAccumulateOperator<TRootValue, TValue> = {
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
export declare type ExpressionStringReferenceKey<T> = `$${DeepKeys<T> | '$CURRENT'}`;
export declare type InterpretProjectExpression<TRootValue, TValue> = TValue extends `$${string}` ? ExpressionStringReferenceKey<TRootValue> : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? InterpretProjectOperator<TRootValue, TValue> : TValue extends Array<infer TValueArr> ? Array<InterpretProjectExpression<TRootValue, TValueArr>> : TValue extends {} ? ProjectObject<TRootValue, TValue> : never;
declare type ProjectObject<TRootValue, TProject> = {
    [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};
declare type AllAccumulateOperators = '$addToSet' | '$avg' | '$first' | '$last' | '$max' | '$mergeObjects' | '$min' | '$push' | '$stdDevPop' | '$stdDevSamp' | '$sum';
declare type CheckProjectDeepKey<TKey extends string, TValue> = TValue extends 1 | true ? ([TKey] extends [never] ? 0 : 1) : 0;
declare type CheckProjectDeepKeyRemoveUnderscoreID<TKey extends string, TValue> = TValue extends 0 | false ? [TKey] extends ['_id'] ? 1 : 0 : 0;
declare type ProjectResult<TRootValue, TValue> = TValue extends `$$CURRENT` ? TRootValue : TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? ProjectResultOperators<TRootValue, TValue>[keyof TValue] : TValue extends Array<infer TValueArray> ? Array<ProjectResultObject<TRootValue, TValueArray>> : TValue extends {} ? ProjectResultObject<TRootValue, TValue> : never;
declare type ProjectResultRoot<TRootValue, TValue, TKey extends string = never> = TValue extends `$$CURRENT` ? TRootValue : TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : CheckProjectDeepKey<TKey, TValue> extends 1 ? DeepKeysResult<TRootValue, TKey> : CheckProjectDeepKeyRemoveUnderscoreID<TKey, TValue> extends 1 ? never : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? ProjectResultOperators<TRootValue, TValue>[keyof TValue] : TValue extends Array<infer TValueArray> ? Array<ProjectResultRootObject<TRootValue, TValueArray, TKey>> : TValue extends {} ? ProjectResultRootObject<TRootValue, TValue, TKey> : never;
declare type ProjectResultOperators<TRootValue, TValue> = {
    $abs: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$abs'>>>;
    $acos: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$acos'>>>;
    $acosh: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$acosh'>>>;
    $add: NumberTypeOrNever<ProjectResult<TRootValue, UnArray<LookupKey<TValue, '$add'>>>>;
    $addToSet: ProjectResult<TRootValue, LookupKey<TValue, '$addToSet'>>[];
    $allElementsTrue: boolean;
    $and: boolean;
    $anyElementTrue: boolean;
    $arrayElemAt: UnArray<ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$arrayElemAt'>, 0>>>;
    $arrayToObject: NotImplementedYet;
    $asin: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$asin'>>>;
    $asinh: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$asinh'>>>;
    $atan: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$atan'>>>;
    $atan2: NumberTypeOrNever<ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$atan2'>, 0>>>;
    $atanh: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$atanh'>>>;
    $avg: number;
    $binarySize: number;
    $bsonSize: number;
    $ceil: NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$ceil'>>>;
    $cmp: NumberTypeOrNever<ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$cmp'>, 0>>>;
    $concat: string;
    $concatArrays: DeepUnArray<ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$concatArrays'>, 0>>>[];
    $cond: LookupKey<TValue, '$cond'> extends Array<any> ? ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 1>> | ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$cond'>, 2>> : ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>> | ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
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
    $map: LookupKey<LookupKey<TValue, '$map'>, 'as'> extends string ? ProjectResult<TRootValue & {
        [key in `$${LookupKey<LookupKey<TValue, '$map'>, 'as'>}`]: ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$map'>, 'input'>>;
    }, LookupKey<LookupKey<TValue, '$map'>, 'in'>>[] : never;
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
    $switch: InterpretProjectExpression<TRootValue, LookupKey<LookupArray<LookupKey<LookupKey<TValue, '$switch'>, 'branches'>, number>, 'then'>> | InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$switch'>, 'default'>>;
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
    $trunc: LookupKey<TValue, '$trunc'> extends Array<any> ? NumberTypeOrNever<ProjectResult<TRootValue, LookupArray<LookupKey<TValue, '$trunc'>, 0>>> : NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, '$trunc'>>>;
    $type: NotImplementedYet;
    $week: NotImplementedYet;
    $year: NotImplementedYet;
    $zip: NotImplementedYet;
};
declare type AccumulateResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TValue extends RawTypes ? TValue : keyof TValue extends AllAccumulateOperators ? {
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
}[keyof TValue] : never;
declare type GetProjectDeepKey<TDeepProjectKey extends string, key> = TDeepProjectKey extends never ? never : TDeepProjectKey extends '' ? key : key extends string ? `${TDeepProjectKey}.${key}` : '';
export declare type ProjectResultObject<TRootValue, TObj> = TObj extends infer T ? {
    [key in keyof T]: ProjectResult<TRootValue, T[key]>;
} : never;
export declare type ProjectResultRootObject<TRootValue, TObj, TDeepProjectKey extends string = never> = TObj extends infer T ? {
    [key in keyof T]: ProjectResultRoot<TRootValue, T[key], GetProjectDeepKey<TDeepProjectKey, key>>;
} : never;
export declare type LookupKey<T, TKey extends string> = TKey extends keyof T ? T[TKey] : never;
export declare type LookupArray<T, TIndex extends number> = T extends Array<any> ? T[TIndex] : never;
declare type InterpretAccumulateExpression<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? ExpressionStringReferenceKey<TRootValue> : TValue extends RawTypes ? TValue : keyof TValue extends AllAccumulateOperators ? InterpretAccumulateOperator<TRootValue, TValue> : never;
declare type AccumulateRootObject<TRootValue, TAccumulateObject> = {
    [key in keyof TAccumulateObject]: key extends '_id' ? InterpretProjectExpression<TRootValue, TAccumulateObject[key]> : InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
declare type BucketRootObject<TRootValue, TAccumulateObject> = {
    [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
declare type AccumulateRootResultObject<TRootValue, TObj> = TObj extends infer T ? {
    [key in keyof T]: key extends '_id' ? ProjectResult<TRootValue, T[key]> : AccumulateResult<TRootValue, T[key]>;
} : never;
declare type BucketRootResultObject<TRootValue, TObj, TId> = TObj extends infer T ? {
    [key in keyof T]: AccumulateResult<TRootValue, T[key]>;
} & {
    _id: TId;
} : never;
declare type AutoBucketRootResultObject<TRootValue, TObj> = [TObj] extends [never] ? {
    _id: {
        min: number;
        max: number;
    };
    count: number;
} : TObj extends infer T ? {
    [key in keyof T]: AccumulateResult<TRootValue, T[key]>;
} & {
    _id: {
        min: number;
        max: number;
    };
} : never;
export declare type GraphDeep<TOther, TAs extends string, TDepthField extends string> = {
    [key in TAs]: (TOther & {
        [oKey in TDepthField]: number;
    })[];
};
declare type Simplify<T> = T extends object | any[] ? {
    [K in keyof T]: T[K];
} : T;
declare type TableName<TTable> = string & {
    __table: TTable;
};
export declare function tableName<TTable extends {}>(tableName: string): TableName<TTable>;
export declare function isPossiblyTableName(tableName: any): tableName is TableName<any>;
declare type Double$Keys<T> = {
    [key in keyof T as `$${key extends string ? key : never}`]: T[key];
};
export declare class Aggregator<T> {
    private parent?;
    private currentPipeline?;
    private constructor();
    static start<T>(): Aggregator<T>;
    $addFields<TProject>(fields: ProjectObject<T, TProject>): Aggregator<T & ProjectResultObject<T, TProject>>;
    $bucket<TGroupBy, TBoundaries, TAccumulator, TDefault extends string = never>(props: {
        groupBy: InterpretProjectExpression<T, TGroupBy>;
        boundaries: InterpretProjectExpression<T, TBoundaries>[];
        default?: TDefault;
        output: BucketRootObject<T, TAccumulator>;
    }): Aggregator<BucketRootResultObject<T, TAccumulator, TBoundaries | TDefault>>;
    $bucketAuto<TGroupBy, TAccumulator = never>(props: {
        groupBy: InterpretProjectExpression<T, TGroupBy>;
        buckets: number;
        output?: BucketRootObject<T, TAccumulator>;
        granularity?: 'R5' | 'R10' | 'R20' | 'R40' | 'R80' | '1-2-5' | 'E6' | 'E12' | 'E24' | 'E48' | 'E96' | 'E192' | 'POWERSOF2';
    }): Aggregator<AutoBucketRootResultObject<T, TAccumulator>>;
    $count<TKey extends string>(key: TKey): Aggregator<{
        [cKey in TKey]: number;
    }>;
    $facet<TItem>(props: {
        [key in keyof TItem]: (agg: Aggregator<T>) => Aggregator<TItem[key]>;
    }): Aggregator<{
        [key in keyof TItem]: TItem[key][];
    }>;
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
    }): Aggregator<T & {
        [key in TDistanceField]: number;
    }>;
    $graphLookup<TOther, TAs extends string, TDepthField extends string = never>(props: {
        as: TAs;
        from: TableName<TOther>;
        connectFromField: DeepKeys<T>;
        connectToField: DeepKeys<TOther>;
        depthField?: TDepthField;
        maxDepth?: number;
        startWith: ExpressionStringReferenceKey<T>;
    }): Aggregator<T & GraphDeep<TOther, TAs, TDepthField>>;
    $group<TAccumulator>(props: AccumulateRootObject<T, TAccumulator>): Aggregator<AccumulateRootResultObject<T, TAccumulator>>;
    $limit(limit: number): Aggregator<T>;
    $lookup<TLookupTable, TAs extends string, TLet extends {} = never, TPipeline extends {} = never>(props: {
        from: TableName<TLookupTable>;
        localField: DeepKeys<T>;
        foreignField: DeepKeys<TLookupTable>;
        as: TAs;
        let?: ProjectObject<TLookupTable, TLet>;
        pipeline?: (agg: Aggregator<ProjectResult<TLookupTable, TLet> extends infer R ? Double$Keys<R> : never>) => Aggregator<TPipeline>;
    }): Aggregator<T & ([TPipeline] extends [never] ? [TLet] extends [never] ? {
        [key in TAs]: TLookupTable[];
    } : {
        [key in TAs]: ProjectResult<TLookupTable, TLet>[];
    } : {
        [key in TAs]: TPipeline[];
    })>;
    $match(query: FilterQueryMatch<T, `$${DeepKeys<T>}`>): Aggregator<T>;
    $merge(): Aggregator<T>;
    $out(tableName: string): Aggregator<void>;
    $project<TProject>(query: ProjectObject<T, TProject>): Aggregator<DeepExcludeNever<ProjectResultRootObject<T, TProject, ''>>>;
    $redact(): Aggregator<T>;
    $replaceRoot<TNewRootValue, TNewRoot extends {
        newRoot: TNewRootValue;
    }>(params: {
        newRoot: InterpretProjectExpression<T, TNewRootValue>;
    }): Aggregator<ProjectResult<T, TNewRootValue>>;
    $replaceWith<TNewRootValue, TNewRoot extends {
        newRoot: TNewRootValue;
    }>(params: {
        newRoot: InterpretProjectExpression<T, TNewRootValue>;
    }): Aggregator<ProjectResult<T, TNewRootValue>>;
    $sample(props: {
        size: number;
    }): Aggregator<T>;
    $sampleRate(props: number): Aggregator<T>;
    $set<TProject>(fields: ProjectObject<T, TProject>): Aggregator<T & ProjectResultObject<T, TProject>>;
    $skip(skip: number): Aggregator<T>;
    $sort(sorts: {
        [key in DeepKeys<T>]?: 1 | -1;
    }): Aggregator<T>;
    $sortByCount<TExpression>(expression: InterpretProjectExpression<T, TExpression>): Aggregator<{
        _id: ProjectResult<T, TExpression>;
        count: number;
    }>;
    $unionWith<TOtherTable, TPipeline = never>(props: TableName<TOtherTable> | {
        coll: TableName<TOtherTable>;
        pipeline: (agg: Aggregator<TOtherTable>) => Aggregator<TPipeline>;
    }): Aggregator<T | ([TPipeline] extends [never] ? TOtherTable : TPipeline)>;
    $unset<TDeepKey extends DeepKeys<T>>(key: TDeepKey): Aggregator<ExcludeNever<T & {
        [k in typeof key]: never;
    }>>;
    $unwind<TKey extends DeepKeys<T>, TArrayIndexField extends string = never>(key: `$${TKey}` | {
        path: `$${TKey}`;
        preserveNullAndEmptyArrays?: boolean;
        includeArrayIndex?: TArrayIndexField;
    }): Aggregator<DeepReplaceKey<T & {
        [key in TArrayIndexField]: number;
    }, DeepKeyArray<TKey>, UnArray<DeepKeysResult<T, TKey>>>>;
    query(): {}[];
    result<TDoc extends {
        _id: ObjectId;
    }>(collection: Collection<TDoc>): Promise<Simplify<T>[]>;
    resultCursor<TDoc extends {
        _id: ObjectId;
    }>(collection: Collection<TDoc>): Promise<AggregationCursor<T>>;
}
export {};
