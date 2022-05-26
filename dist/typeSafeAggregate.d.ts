import { DeepKeys, DeepKeysResult, NumericTypes, Collection, ObjectId, DeepKeyArray, AggregationCursor } from 'mongodb';
import { Filter } from './filterQueryMatch';
import { Decimal128 } from 'bson';
declare type KEY = string | number | Symbol;
declare type RawTypes = number | boolean | string | Date | ObjectId | NumericTypes;
declare type NonObjectValues = number | boolean | string | Date | ObjectId | NumericTypes;
declare type Impossible = never;
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
} : Impossible;
export declare type DeReferenceExpression<TRootValue, TRef> = TRef extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TRef extends {} ? {
    [key in keyof TRef]: DeReferenceExpression<TRootValue, TRef[key]>;
} : TRef;
declare type AllOperators = '$dateToString' | '$cond' | '$eq' | '$map' | '$sum' | '$abs' | '$acos' | '$acosh' | '$add' | '$addToSet' | '$allElementsTrue' | '$and' | '$anyElementTrue' | '$arrayElemAt' | '$arrayToObject' | '$asin' | '$asinh' | '$atan' | '$atan2' | '$atanh' | '$avg' | '$ceil' | '$cmp' | '$concat' | '$concatArrays' | '$convert' | '$cos' | '$dateFromParts' | '$dateToParts' | '$dateFromString' | '$dayOfMonth' | '$dayOfWeek' | '$dayOfYear' | '$degreesToRadians' | '$divide' | '$exp' | '$filter' | '$first' | '$floor' | '$gt' | '$gte' | '$hour' | '$ifNull' | '$in' | '$indexOfArray' | '$indexOfBytes' | '$indexOfCP' | '$isArray' | '$isoDayOfWeek' | '$isoWeek' | '$isoWeekYear' | '$last' | '$let' | '$literal' | '$ln' | '$log' | '$log10' | '$lt' | '$lte' | '$ltrim' | '$max' | '$mergeObjects' | '$meta' | '$min' | '$millisecond' | '$minute' | '$mod' | '$month' | '$multiply' | '$ne' | '$not' | '$objectToArray' | '$or' | '$pow' | '$push' | '$radiansToDegrees' | '$range' | '$reduce' | '$regexFind' | '$regexFindAll' | '$regexMatch' | '$reverseArray' | '$round' | '$rtrim' | '$second' | '$setDifference' | '$setEquals' | '$setIntersection' | '$setIsSubset' | '$setUnion' | '$size' | '$sin' | '$slice' | '$split' | '$sqrt' | '$stdDevPop' | '$stdDevSamp' | '$strcasecmp' | '$strLenBytes' | '$strLenCP' | '$substr' | '$substrBytes' | '$substrCP' | '$subtract' | '$switch' | '$tan' | '$toBool' | '$toDate' | '$toDecimal' | '$toDouble' | '$toInt' | '$toLong' | '$toObjectId' | '$toString' | '$toLower' | '$toUpper' | '$trim' | '$trunc' | '$type' | '$week' | '$year' | '$zip';
declare type ProjectOperatorHelperCondition<TRootValue, TExpression, TKey extends KEY> = LookupKey<TExpression, TKey> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
declare type ProjectOperatorHelperArray<TRootValue, TExpression, TKey extends KEY> = LookupKey<TExpression, TKey> extends Array<InterpretProjectExpression<TRootValue, infer TArr>> ? InterpretProjectExpression<TRootValue, TArr>[] : never;
declare type ProjectOperatorHelperDate<TRootValue, TExpression, TKey extends KEY> = {
    date: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, TKey, 'date'>;
    timezone?: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, TKey, 'timezone'>;
} | ProjectOperatorHelperExpression<TRootValue, TExpression, TKey>;
declare type ProjectOperatorHelperArrayOrExpression<TRootValue, TExpression, TKey extends KEY> = ProjectOperatorHelperArray<TRootValue, TExpression, TKey> | ProjectOperatorHelperExpression<TRootValue, TExpression, TKey>;
declare type ProjectOperatorHelperExpression<TRootValue, TExpression, TKey extends KEY> = InterpretProjectExpression<TRootValue, LookupKey<TExpression, TKey>>;
declare type ProjectOperatorHelperExpressionInner<TRootValue, TExpression, TKey1 extends KEY, TKey2 extends KEY> = InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TExpression, TKey1>, TKey2>>;
declare type ProjectOperatorHelperExpressionObject<TRootValue, TExpression, TKey extends KEY, TObj extends Record<string, 1 | 0>> = {
    [key in keyof TObj as TObj[key] extends 1 ? key : never]: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, TKey, key>;
} & {
    [key in keyof TObj as TObj[key] extends 0 ? key : never]?: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, TKey, key>;
};
declare type ProjectOperatorHelperOneTuple<TRootValue, TExpression, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>
];
declare type ProjectOperatorHelperTwoTuple<TRootValue, TExpression, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 1>>
];
declare type ProjectOperatorHelperThreeTuple<TRootValue, TExpression, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 1>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 2>>
];
declare type ProjectOperatorHelperFourTuple<TRootValue, TExpression, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 1>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 2>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 3>>
];
export declare type InterpretProjectOperator<TRootValue, TExpression> = {
    $abs: ProjectOperatorHelperExpression<TRootValue, TExpression, '$abs'>;
} | {
    $acos: ProjectOperatorHelperExpression<TRootValue, TExpression, '$acos'>;
} | {
    $acosh: ProjectOperatorHelperExpression<TRootValue, TExpression, '$acosh'>;
} | {
    $add: ProjectOperatorHelperArray<TRootValue, TExpression, '$add'>;
} | {
    $addToSet: ProjectOperatorHelperExpression<TRootValue, TExpression, '$addToSet'>;
} | {
    $allElementsTrue: ProjectOperatorHelperArray<TRootValue, TExpression, '$allElementsTrue'>;
} | {
    $and: ProjectOperatorHelperArray<TRootValue, TExpression, '$and'>;
} | {
    $anyElementTrue: ProjectOperatorHelperArray<TRootValue, TExpression, '$anyElementTrue'>;
} | {
    $arrayElemAt: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$arrayElemAt'>;
} | {
    $arrayToObject: ProjectOperatorHelperArray<TRootValue, TExpression, '$arrayToObject'> | ProjectOperatorHelperExpression<TRootValue, TExpression, '$arrayToObject'>;
} | {
    $asin: ProjectOperatorHelperExpression<TRootValue, TExpression, '$asin'>;
} | {
    $asinh: ProjectOperatorHelperExpression<TRootValue, TExpression, '$asinh'>;
} | {
    $atan: ProjectOperatorHelperExpression<TRootValue, TExpression, '$atan'>;
} | {
    $atan2: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$atan2'>;
} | {
    $atanh: ProjectOperatorHelperExpression<TRootValue, TExpression, '$atanh'>;
} | {
    $avg: ProjectOperatorHelperArrayOrExpression<TRootValue, TExpression, '$avg'>;
} | {
    $binarySize: ProjectOperatorHelperExpression<TRootValue, TExpression, '$binarySize'>;
} | {
    $bsonSize: ProjectOperatorHelperExpression<TRootValue, TExpression, '$bsonSize'>;
} | {
    $ceil: ProjectOperatorHelperExpression<TRootValue, TExpression, '$ceil'>;
} | {
    $cmp: ProjectOperatorHelperArray<TRootValue, TExpression, '$cmp'>;
} | {
    $concat: ProjectOperatorHelperArray<TRootValue, TExpression, '$concat'>;
} | {
    $concatArrays: ProjectOperatorHelperArray<TRootValue, TExpression, '$concatArrays'>;
} | {
    $cond: ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$cond'> | ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$cond', {
        if: 1;
        then: 1;
        else: 0;
    }>;
} | {
    $convert: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$convert', {
        input: 1;
        to: 0;
        onError: 0;
        onNull: 0;
    }>;
} | {
    $cos: ProjectOperatorHelperExpression<TRootValue, TExpression, '$cos'>;
} | {
    $dateFromParts: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateFromParts', {
        year: 1;
        month: 0;
        day: 0;
        hour: 0;
        minute: 0;
        second: 0;
        millisecond: 0;
        timezone: 0;
    }> | ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateFromParts', {
        isoWeekYear: 1;
        isoWeek: 0;
        isoDayOfWeek: 0;
        hour: 0;
        minute: 0;
        second: 0;
        millisecond: 0;
        timezone: 0;
    }>;
} | {
    $dateFromString: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateFromString', {
        dateString: 1;
        format: 0;
        timezone: 0;
        onError: 0;
    }>;
} | {
    $dateToParts: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateToParts', {
        date: 1;
        timezone: 0;
    }> | (ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateToParts', {
        date: 1;
        timezone: 0;
    }> & {
        iso8601?: boolean;
    });
} | {
    $dateToString: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateToString', {
        date: 1;
        format: 0;
        timezone: 0;
    }>;
} | {
    $dayOfMonth: ProjectOperatorHelperDate<TRootValue, TExpression, '$dayOfMonth'>;
} | {
    $dayOfWeek: ProjectOperatorHelperDate<TRootValue, TExpression, '$dayOfWeek'>;
} | {
    $dayOfYear: ProjectOperatorHelperDate<TRootValue, TExpression, '$dayOfYear'>;
} | {
    $degreesToRadians: ProjectOperatorHelperExpression<TRootValue, TExpression, '$degreesToRadians'>;
} | {
    $divide: ProjectOperatorHelperArray<TRootValue, TExpression, '$divide'>;
} | {
    $eq: ProjectOperatorHelperCondition<TRootValue, TExpression, '$eq'>;
} | {
    $exp: ProjectOperatorHelperExpression<TRootValue, TExpression, '$exp'>;
} | {
    $filter: ProjectOperatorHelperExpression<TRootValue, TExpression, '$filter'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        as: infer TAs;
        cond: any;
    } ? Simplify<TRootValue & (TAs extends string ? Double$Keys<{
        [key in TAs]: UnArray<ProjectResult<TRootValue, TInput>>;
    }> : never)> extends infer TNewValue ? {
        input: InterpretProjectExpression<TRootValue, TInput>;
        as: TAs;
        cond: ProjectOperatorHelperExpressionInner<TNewValue, TExpression, '$filter', 'cond'>;
    } : Impossible : Impossible;
} | {
    $first: ProjectOperatorHelperExpression<TRootValue, TExpression, '$first'>;
} | {
    $floor: ProjectOperatorHelperExpression<TRootValue, TExpression, '$floor'>;
} | {
    $gt: ProjectOperatorHelperCondition<TRootValue, TExpression, '$gt'>;
} | {
    $gte: ProjectOperatorHelperCondition<TRootValue, TExpression, '$gte'>;
} | {
    $hour: ProjectOperatorHelperDate<TRootValue, TExpression, '$hour'>;
} | {
    $ifNull: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$ifNull'>;
} | {
    $in: ProjectOperatorHelperArray<TRootValue, TExpression, '$in'>;
} | {
    $indexOfArray: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$indexOfArray'> | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$indexOfArray'> | ProjectOperatorHelperFourTuple<TRootValue, TExpression, '$indexOfArray'>;
} | {
    $indexOfBytes: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$indexOfBytes'> | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$indexOfBytes'> | ProjectOperatorHelperFourTuple<TRootValue, TExpression, '$indexOfBytes'>;
} | {
    $indexOfCP: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$indexOfCP'> | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$indexOfCP'> | ProjectOperatorHelperFourTuple<TRootValue, TExpression, '$indexOfCP'>;
} | {
    $isArray: ProjectOperatorHelperExpression<TRootValue, TExpression, '$isArray'>;
} | {
    $isoDayOfWeek: ProjectOperatorHelperDate<TRootValue, TExpression, '$isoDayOfWeek'>;
} | {
    $isoWeek: ProjectOperatorHelperDate<TRootValue, TExpression, '$isoWeek'>;
} | {
    $isoWeekYear: ProjectOperatorHelperDate<TRootValue, TExpression, '$isoWeekYear'>;
} | {
    $last: ProjectOperatorHelperExpression<TRootValue, TExpression, '$last'>;
} | {
    $let: {
        vars: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, '$let', 'vars'>;
        in: ProjectResultObject<TRootValue, ProjectOperatorHelperExpressionInner<TRootValue, TExpression, '$let', 'vars'>> extends infer R ? ProjectOperatorHelperExpressionInner<TRootValue & Double$Keys<{
            [key in keyof R]: 1;
        }>, TExpression, '$let', 'in'> : Impossible;
    };
} | {
    $literal: LookupKey<TExpression, '$literal'>;
} | {
    $ln: ProjectOperatorHelperExpression<TRootValue, TExpression, '$ln'>;
} | {
    $log: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$log'>;
} | {
    $log10: ProjectOperatorHelperExpression<TRootValue, TExpression, '$log10'>;
} | {
    $lt: ProjectOperatorHelperCondition<TRootValue, TExpression, '$lt'>;
} | {
    $lte: ProjectOperatorHelperCondition<TRootValue, TExpression, '$lte'>;
} | {
    $ltrim: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$ltrim', {
        input: 1;
        chars: 0;
    }>;
} | {
    $map: LookupKey<TExpression, '$map'> extends {
        as: string;
        in: infer TIn;
        input: ExpressionStringReferenceKey<TRootValue>;
    } ? {
        as: LookupKey<LookupKey<TExpression, '$map'>, 'as'>;
        in: ProjectObject<TRootValue & {
            [key in `$${LookupKey<LookupKey<TExpression, '$map'>, 'as'>}`]: DeReferenceExpression<TRootValue, LookupKey<LookupKey<TExpression, '$map'>, 'input'>>;
        }, TIn>;
        input: ExpressionStringReferenceKey<TRootValue>;
    } : never;
} | {
    $max: ProjectOperatorHelperExpression<TRootValue, TExpression, '$max'>;
} | {
    $mergeObjects: ProjectOperatorHelperArray<TRootValue, TExpression, '$mergeObjects'>;
} | {
    $meta: 'textScore' | 'indexKey';
} | {
    $millisecond: ProjectOperatorHelperDate<TRootValue, TExpression, '$millisecond'>;
} | {
    $min: ProjectOperatorHelperExpression<TRootValue, TExpression, '$min'>;
} | {
    $minute: ProjectOperatorHelperDate<TRootValue, TExpression, '$minute'>;
} | {
    $mod: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$mod'>;
} | {
    $month: ProjectOperatorHelperDate<TRootValue, TExpression, '$month'>;
} | {
    $multiply: ProjectOperatorHelperArray<TRootValue, TExpression, '$multiply'>;
} | {
    $ne: ProjectOperatorHelperCondition<TRootValue, TExpression, '$ne'>;
} | {
    $not: ProjectOperatorHelperExpression<TRootValue, TExpression, '$not'>;
} | {
    $objectToArray: ProjectOperatorHelperExpression<TRootValue, TExpression, '$objectToArray'>;
} | {
    $or: ProjectOperatorHelperArray<TRootValue, TExpression, '$or'>;
} | {
    $pow: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$pow:'>;
} | {
    $push: ProjectOperatorHelperExpression<TRootValue, TExpression, '$push'>;
} | {
    $radiansToDegrees: ProjectOperatorHelperExpression<TRootValue, TExpression, '$radiansToDegrees'>;
} | {
    $range: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$range'> | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$range'>;
} | {
    $reduce: ProjectOperatorHelperExpression<TRootValue, TExpression, '$reduce'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        initialValue: InterpretProjectExpression<TRootValue, infer TInitialValue>;
        in: any;
    } ? {
        input: InterpretProjectExpression<TRootValue, TInput>;
        initialValue: InterpretProjectExpression<TRootValue, TInitialValue>;
        in: ProjectResultObject<TRootValue, TInput> extends infer R ? ProjectOperatorHelperExpressionInner<TRootValue & {
            $value: UnArray<ProjectResultObject<TRootValue, TInitialValue>>;
            $this: ProjectResultObject<TRootValue, TInput>;
        }, TExpression, '$reduce', 'in'> : Impossible;
    } : never;
} | {
    $regexFind: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$regexFind', {
        input: 1;
        regex: 1;
        options: 0;
    }>;
} | {
    $regexFindAll: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$regexFindAll', {
        input: 1;
        regex: 1;
        options: 0;
    }>;
} | {
    $regexMatch: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$regexMatch', {
        input: 1;
        regex: 1;
        options: 0;
    }>;
} | {
    $reverseArray: ProjectOperatorHelperExpression<TRootValue, TExpression, '$reverseArray'>;
} | {
    $round: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$round'>;
} | {
    $rtrim: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$rtrim', {
        input: 1;
        chars: 0;
    }>;
} | {
    $second: ProjectOperatorHelperDate<TRootValue, TExpression, '$second'>;
} | {
    $setDifference: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$setDifference'>;
} | {
    $setEquals: ProjectOperatorHelperArray<TRootValue, TExpression, '$setEquals'>;
} | {
    $setIntersection: ProjectOperatorHelperArray<TRootValue, TExpression, '$setIntersection'>;
} | {
    $setIsSubset: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$setIsSubset'>;
} | {
    $setUnion: ProjectOperatorHelperArray<TRootValue, TExpression, '$setUnion'>;
} | {
    $sin: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sin'>;
} | {
    $size: ProjectOperatorHelperExpression<TRootValue, TExpression, '$size'>;
} | {
    $slice: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$slice'> | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$slice'>;
} | {
    $split: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$split'>;
} | {
    $sqrt: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sqrt'>;
} | {
    $stdDevPop: ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevPop'> | ProjectOperatorHelperArray<TRootValue, TExpression, '$stdDevPop'>;
} | {
    $stdDevSamp: ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevSamp'> | ProjectOperatorHelperArray<TRootValue, TExpression, '$stdDevSamp'>;
} | {
    $strcasecmp: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$strcasecmp'>;
} | {
    $strLenBytes: ProjectOperatorHelperExpression<TRootValue, TExpression, '$strLenBytes'>;
} | {
    $strLenCP: ProjectOperatorHelperExpression<TRootValue, TExpression, '$strLenCP'>;
} | {
    $substr: ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$substr'>;
} | {
    $substrBytes: ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$substrBytes'>;
} | {
    $substrCP: ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$substrCP'>;
} | {
    $subtract: ProjectOperatorHelperArray<TRootValue, TExpression, '$subtract'>;
} | {
    $sum: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sum'>;
} | {
    $switch: LookupKey<TExpression, '$switch'> extends {
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
    $tan: ProjectOperatorHelperExpression<TRootValue, TExpression, '$tan'>;
} | {
    $toBool: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toBool'>;
} | {
    $toDate: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toDate'>;
} | {
    $toDecimal: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toDecimal'>;
} | {
    $toDouble: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toDouble'>;
} | {
    $toInt: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toInt'>;
} | {
    $toLong: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toLong'>;
} | {
    $toLower: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toLower'>;
} | {
    $toObjectId: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toObjectId'>;
} | {
    $toString: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toString'>;
} | {
    $toUpper: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toUpper'>;
} | {
    $trim: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$trim', {
        input: 1;
        chars: 0;
    }>;
} | {
    $trunc: ProjectOperatorHelperOneTuple<TRootValue, TExpression, '$trunc'> | ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$trunc'> | ProjectOperatorHelperExpression<TRootValue, TExpression, '$trunc'>;
} | {
    $type: ProjectOperatorHelperExpression<TRootValue, TExpression, '$type'>;
} | {
    $week: ProjectOperatorHelperDate<TRootValue, TExpression, '$week'>;
} | {
    $year: ProjectOperatorHelperDate<TRootValue, TExpression, '$year'>;
} | {
    $zip: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$zip', {
        inputs: 1;
        useLongestLength: 0;
    }> | ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$zip', {
        inputs: 1;
        useLongestLength: 1;
        defaults: 1;
    }>;
};
declare type InterpretAccumulateOperator<TRootValue, TExpression> = {
    $avg?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$avg'>;
    $last?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$last'>;
    $mergeObjects?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$mergeObjects'>;
    $stdDevPop?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevPop'>;
    $stdDevSamp?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevSamp'>;
    $addToSet?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$addToSet'>;
    $first?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$first'>;
    $max?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$max'>;
    $min?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$min'>;
    $push?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$push'>;
    $sum?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sum'>;
};
export declare type ExpressionStringReferenceKey<T> = `$${DeepKeys<T> | '$CURRENT'}`;
export declare type InterpretProjectExpression<TRootValue, TExpression> = TExpression extends `$${string}` ? ExpressionStringReferenceKey<TRootValue> : TExpression extends RawTypes ? TExpression : keyof TExpression extends AllOperators ? InterpretProjectOperator<TRootValue, TExpression> : TExpression extends Array<infer TValueArr> ? Array<InterpretProjectExpression<TRootValue, TValueArr>> : TExpression extends {} ? ProjectObject<TRootValue, TExpression> : Impossible;
export declare type InterpretProjectRootExpression<TRootValue, TKey extends KEY, TExpression> = TExpression extends `$${string}` ? ExpressionStringReferenceKey<TRootValue> : TExpression extends 1 ? TKey extends DeepKeys<TRootValue> ? TExpression : never : TExpression extends RawTypes ? TExpression : keyof TExpression extends AllOperators ? InterpretProjectOperator<TRootValue, TExpression> : TExpression extends Array<infer TValueArr> ? Array<InterpretProjectExpression<TRootValue, TValueArr>> : TExpression extends {} ? ProjectObject<TRootValue, TExpression> : Impossible;
declare type ProjectObject<TRootValue, TProject> = {
    [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};
declare type ProjectRootObject<TRootValue, TProject> = {
    [key in keyof TProject]: InterpretProjectRootExpression<TRootValue, key, TProject[key]>;
};
declare type AllAccumulateOperators = '$addToSet' | '$avg' | '$first' | '$last' | '$max' | '$mergeObjects' | '$min' | '$push' | '$stdDevPop' | '$stdDevSamp' | '$sum';
declare type CheckProjectDeepKey<TKey extends string, TValue> = TValue extends 1 | true ? ([TKey] extends [never] ? 0 : 1) : 0;
declare type CheckProjectDeepKeyRemoveUnderscoreID<TKey extends string, TValue> = TValue extends 0 | false ? [TKey] extends ['_id'] ? 1 : 0 : 0;
declare type ProjectResult<TRootValue, TExpression> = TExpression extends `$$CURRENT` ? TRootValue : TExpression extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TExpression extends RawTypes ? TExpression : keyof TExpression extends AllOperators ? ProjectResultOperators<TRootValue, TExpression>[keyof TExpression] : TExpression extends Array<infer TExpressionArray> ? Array<ProjectResultObject<TRootValue, TExpressionArray>> : TExpression extends {} ? ProjectResultObject<TRootValue, TExpression> : Impossible;
declare type ProjectResultRoot<TRootValue, TExpression, TKey extends string = never> = TExpression extends `$$CURRENT` ? TRootValue : TExpression extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : CheckProjectDeepKey<TKey, TExpression> extends 1 ? DeepKeysResult<TRootValue, TKey> : CheckProjectDeepKeyRemoveUnderscoreID<TKey, TExpression> extends 1 ? never : TExpression extends RawTypes ? TExpression : keyof TExpression extends AllOperators ? ProjectResultOperators<TRootValue, TExpression>[keyof TExpression] : TExpression extends Array<infer TValueArray> ? Array<ProjectResultRootObject<TRootValue, TValueArray, TKey>> : TExpression extends {} ? ProjectResultRootObject<TRootValue, TExpression, TKey> : Impossible;
declare type ProjectResultExpression<TRootValue, TExpression, TKey extends KEY> = ProjectResult<TRootValue, LookupKey<TExpression, TKey>>;
declare type ProjectResultExpressionInner<TRootValue, TExpression, TKey extends KEY, TKey2 extends KEY> = ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, TKey>, TKey2>>;
declare type ProjectResultArrayIndex<TRootValue, TExpression, TKey extends KEY, TIndex extends number> = ProjectResult<TRootValue, LookupArray<LookupKey<TExpression, TKey>, TIndex>>;
declare type NumberProjectResultExpression<TRootValue, TExpression, TKey extends KEY> = NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TExpression, TKey>>>;
declare type NumberProjectResultExpressionUnArray<TRootValue, TExpression, TKey extends KEY> = NumberTypeOrNever<ProjectResult<TRootValue, UnArray<LookupKey<TExpression, TKey>>>>;
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : Impossible) extends (k: infer I) => void ? I : Impossible;
declare type FlattenUnion<T> = {
    [K in keyof UnionToIntersection<T>]: K extends keyof T ? T[K] extends any[] ? T[K] : T[K] extends object ? FlattenUnion<T[K]> : T[K] : UnionToIntersection<T>[K] | undefined;
};
declare type ArrayToObjectTupleBuilder<T> = T extends [infer TFirst, ...infer TRest] ? LookupKey<TFirst, 'k'> extends string ? {
    [key in LookupKey<TFirst, 'k'>]: LookupKey<TFirst, 'v'>;
} & ArrayToObjectTupleBuilder<TRest> : never : {};
export declare type UnionToTuple<Union> = UnionToIntersection<Union extends unknown ? (distributed: Union) => void : never> extends (merged: infer Intersection) => void ? [
    ...UnionToTuple<Exclude<Union, Intersection>>,
    Intersection
] : [];
declare type ObjectToArrayHelper<T> = UnionToTuple<{
    [key in keyof T]: {
        k: key;
        v: T[key];
    };
}[keyof T]>;
declare type ProjectResultOperators<TRootValue, TExpression> = {
    $abs: NumberProjectResultExpression<TRootValue, TExpression, '$abs'>;
    $acos: NumberProjectResultExpression<TRootValue, TExpression, '$acos'>;
    $acosh: NumberProjectResultExpression<TRootValue, TExpression, '$acosh'>;
    $add: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$add'>;
    $addToSet: ProjectResultExpression<TRootValue, TExpression, '$addToSet'>[];
    $allElementsTrue: boolean;
    $and: boolean;
    $anyElementTrue: boolean;
    $arrayElemAt: UnArray<ProjectResultArrayIndex<TRootValue, TExpression, '$arrayElemAt', 0>>;
    $arrayToObject: ProjectResultExpression<TRootValue, TExpression, '$arrayToObject'> extends infer TInner ? UnArray<TInner> extends any[] ? unknown : ArrayToObjectTupleBuilder<UnionToTuple<UnArray<TInner>>> : never;
    $asin: NumberProjectResultExpression<TRootValue, TExpression, '$asin'>;
    $asinh: NumberProjectResultExpression<TRootValue, TExpression, '$asinh'>;
    $atan: NumberProjectResultExpression<TRootValue, TExpression, '$atan'>;
    $atan2: NumberTypeOrNever<UnArray<ProjectResultArrayIndex<TRootValue, TExpression, '$atan2', 0>>>;
    $atanh: NumberProjectResultExpression<TRootValue, TExpression, '$atanh'>;
    $avg: number;
    $binarySize: number;
    $bsonSize: number;
    $ceil: NumberProjectResultExpression<TRootValue, TExpression, '$ceil'>;
    $cmp: NumberTypeOrNever<ProjectResultArrayIndex<TRootValue, TExpression, '$cmp', 0>>;
    $concat: string;
    $concatArrays: DeepUnArray<ProjectResultArrayIndex<TRootValue, TExpression, '$concatArrays', 0>>[];
    $cond: LookupKey<TExpression, '$cond'> extends Array<any> ? ProjectResultArrayIndex<TRootValue, TExpression, '$cond', 1> | ProjectResultArrayIndex<TRootValue, TExpression, '$cond', 2> : ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$cond'>, 'then'>> | ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$cond'>, 'else'>>;
    $convert: unknown;
    $cos: NumberProjectResultExpression<TRootValue, TExpression, '$cos'>;
    $dateFromParts: Date;
    $dateFromString: Date;
    $dateToParts: true extends LookupKey<LookupKey<TExpression, '$dateToParts'>, 'iso8601'> ? {
        isoWeekYear: number;
        isoWeek: number;
        isoDayOfWeek: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
    } : {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
    };
    $dateToString: string;
    $dayOfMonth: number;
    $dayOfWeek: number;
    $dayOfYear: number;
    $degreesToRadians: number;
    $divide: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$divide'>;
    $eq: boolean;
    $exp: number;
    $filter: ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$filter'>, 'input'>>;
    $first: UnArray<ProjectResultExpression<TRootValue, TExpression, '$first'>>;
    $floor: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$floor'>;
    $gt: boolean;
    $gte: boolean;
    $hour: number;
    $ifNull: ProjectResultExpression<TRootValue, TExpression, '$ifNull'>;
    $in: ProjectResultExpression<TRootValue, TExpression, '$in'>;
    $indexOfArray: number;
    $indexOfBytes: number;
    $indexOfCP: number;
    $isArray: boolean;
    $isoDayOfWeek: number;
    $isoWeek: number;
    $isoWeekYear: number;
    $last: UnArray<ProjectResultExpression<TRootValue, TExpression, '$last'>>;
    $let: ProjectResult<TRootValue & Double$Keys<{
        [key in keyof ProjectResultObject<TRootValue, ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$let'>, 'vars'>>>]: 1;
    }>, LookupKey<LookupKey<TExpression, '$let'>, 'in'>>;
    $literal: LookupKey<TExpression, '$literal'>;
    $ln: number;
    $log: number;
    $log10: number;
    $lt: boolean;
    $lte: boolean;
    $ltrim: string;
    $map: LookupKey<LookupKey<TExpression, '$map'>, 'as'> extends string ? ProjectResult<TRootValue & {
        [key in `$${LookupKey<LookupKey<TExpression, '$map'>, 'as'>}`]: ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$map'>, 'input'>>;
    }, LookupKey<LookupKey<TExpression, '$map'>, 'in'>>[] : never;
    $max: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TExpression, '$max'>>>;
    $mergeObjects: FlattenUnion<ProjectResultArrayIndex<TRootValue, TExpression, '$mergeObjects', number>>;
    $meta: number;
    $millisecond: number;
    $min: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TExpression, '$min'>>>;
    $minute: number;
    $mod: number;
    $month: number;
    $multiply: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$multiply'>;
    $ne: boolean;
    $not: boolean;
    $objectToArray: ObjectToArrayHelper<ProjectResultExpression<TRootValue, TExpression, '$objectToArray'>>;
    $or: boolean;
    $pow: number;
    $push: ProjectResultExpression<TRootValue, TExpression, '$push'>[];
    $radiansToDegrees: number;
    $range: number[];
    $reduce: ProjectOperatorHelperExpression<TRootValue, TExpression, '$reduce'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        initialValue: InterpretProjectExpression<TRootValue, infer TInitialValue>;
        in: any;
    } ? ProjectResultObject<TRootValue, TInput> extends infer R ? ProjectResultExpressionInner<TRootValue & {
        $value: UnArray<ProjectResultObject<TRootValue, TInitialValue>>;
        $this: ProjectResultObject<TRootValue, TInput>;
    }, TExpression, '$reduce', 'in'> : never : never;
    $regexFind: {
        match: string;
        idx: number;
        captures: string[];
    };
    $regexFindAll: {
        match: string;
        idx: number;
        captures: string[];
    }[];
    $regexMatch: boolean;
    $reverseArray: ProjectResultExpression<TRootValue, TExpression, '$reverseArray'>;
    $round: number;
    $rtrim: string;
    $second: number;
    $setDifference: ProjectResultArrayIndex<TRootValue, TExpression, '$setDifference', 0>;
    $setEquals: boolean;
    $setIntersection: UnArray<ProjectResultExpression<TRootValue, TExpression, '$setIntersection'>>;
    $setIsSubset: boolean;
    $setUnion: ProjectResultArrayIndex<TRootValue, TExpression, '$setUnion', number>;
    $sin: number;
    $size: number;
    $slice: ProjectResultArrayIndex<TRootValue, TExpression, '$slice', 0>;
    $split: string;
    $sqrt: number;
    $stdDevPop: number;
    $stdDevSamp: number;
    $strcasecmp: 0 | 1 | -1;
    $strLenBytes: number;
    $strLenCP: number;
    $substr: string;
    $substrBytes: string;
    $substrCP: string;
    $subtract: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$subtract'>;
    $sum: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TExpression, '$sum'>>>;
    $switch: InterpretProjectExpression<TRootValue, LookupKey<LookupArray<LookupKey<LookupKey<TExpression, '$switch'>, 'branches'>, number>, 'then'>> | InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TExpression, '$switch'>, 'default'>>;
    $tan: number;
    $toBool: boolean;
    $toDate: Date;
    $toDecimal: Decimal128;
    $toDouble: number;
    $toInt: number;
    $toLong: number;
    $toLower: string;
    $toObjectId: ObjectId;
    $toString: string;
    $toUpper: string;
    $trim: string;
    $trunc: LookupKey<TExpression, '$trunc'> extends Array<any> ? NumberTypeOrNever<ProjectResultArrayIndex<TRootValue, TExpression, '$trunc', 0>> : NumberProjectResultExpression<TRootValue, TExpression, '$trunc'>;
    $type: 'double' | 'string' | 'object' | 'array' | 'binData' | 'objectId' | 'bool' | 'date' | 'null' | 'regex' | 'javascript' | 'int' | 'timestamp' | 'long' | 'decimal' | 'minKey' | 'maxKey';
    $week: number;
    $year: number;
    $zip: UnArray<UnArray<ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$zip'>, 'inputs'>>>> extends infer TInput ? [LookupKey<LookupKey<TExpression, '$zip'>, 'defaults'>] extends [never] ? Array<Array<TInput>> : Array<Array<TInput | UnArray<ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$zip'>, 'defaults'>>>>> : never;
};
declare type AccumulateResult<TRootValue, TExpression> = TExpression extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TExpression extends RawTypes ? TExpression : keyof TExpression extends AllAccumulateOperators ? {
    $avg: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$avg'>>>>;
    $last: ProjectResult<TRootValue, LookupKey<TExpression, '$last'>>;
    $mergeObjects: FlattenUnion<UnArray<ProjectResultExpression<TRootValue, TExpression, '$mergeObjects'>>>;
    $stdDevPop: number;
    $stdDevSamp: number;
    $sum: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$sum'>>>>;
    $addToSet: ProjectResult<TRootValue, LookupKey<TExpression, '$addToSet'>>[];
    $first: ProjectResult<TRootValue, LookupKey<TExpression, '$first'>>;
    $min: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$min'>>>>;
    $max: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$max'>>>>;
    $push: ProjectResult<TRootValue, LookupKey<TExpression, '$push'>>[];
}[keyof TExpression] : Impossible;
declare type GetProjectDeepKey<TDeepProjectKey extends string, key> = TDeepProjectKey extends never ? never : TDeepProjectKey extends '' ? key : key extends string ? `${TDeepProjectKey}.${key}` : '';
export declare type ProjectResultObject<TRootValue, TExpression> = TExpression extends infer T ? {
    [key in keyof T]: ProjectResult<TRootValue, T[key]>;
} : Impossible;
export declare type ProjectResultRootObject<TRootValue, TObj, TDeepProjectKey extends string = never> = TObj extends infer T ? {
    [key in keyof T]: ProjectResultRoot<TRootValue, T[key], GetProjectDeepKey<TDeepProjectKey, key>>;
} : Impossible;
export declare type LookupKey<T, TKey extends string | number | Symbol> = TKey extends keyof T ? T[TKey] : never;
export declare type LookupArray<T, TIndex extends number> = T extends Array<any> ? T[TIndex] : never;
declare type InterpretAccumulateExpression<TRootValue, TExpression> = TExpression extends `$${infer TRawKey}` ? ExpressionStringReferenceKey<TRootValue> : TExpression extends RawTypes ? TExpression : keyof TExpression extends AllAccumulateOperators ? InterpretAccumulateOperator<TRootValue, TExpression> : Impossible;
declare type AccumulateRootObject<TRootValue, TAccumulateObject> = {
    [key in keyof TAccumulateObject]: key extends '_id' ? InterpretProjectExpression<TRootValue, TAccumulateObject[key]> : InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
declare type BucketRootObject<TRootValue, TAccumulateObject> = {
    [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};
declare type AccumulateRootResultObject<TRootValue, TObj> = TObj extends infer T ? {
    [key in keyof T]: key extends '_id' ? ProjectResult<TRootValue, T[key]> : AccumulateResult<TRootValue, T[key]>;
} : Impossible;
declare type BucketRootResultObject<TRootValue, TObj, TId> = TObj extends infer T ? {
    [key in keyof T]: AccumulateResult<TRootValue, T[key]>;
} & {
    _id: TId;
} : Impossible;
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
} : Impossible;
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
declare type MongoRedactTypes = {
    $DESCEND: '$DESCEND';
    $PRUNE: '$PRUNE';
    $KEEP: '$KEEP';
};
export declare class Aggregator<T> {
    private parent?;
    private currentPipeline?;
    private constructor();
    static start<T>(): Aggregator<T>;
    $addFields<TProject>(fields: ProjectRootObject<T, TProject>): Aggregator<T & ProjectResultRootObject<T, TProject>>;
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
        query?: Filter<T, `$${DeepKeys<T>}`>;
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
        connectFromField: DeepKeys<TOther>;
        connectToField: DeepKeys<TOther>;
        depthField?: TDepthField;
        maxDepth?: number;
        startWith: ExpressionStringReferenceKey<T>;
    }): Aggregator<T & GraphDeep<TOther, TAs, TDepthField>>;
    $group<TAccumulator>(props: AccumulateRootObject<T, TAccumulator>): Aggregator<AccumulateRootResultObject<T, TAccumulator>>;
    $limit(limit: number): Aggregator<T>;
    $lookup<TLookupTable, TAs extends string, TLet extends {} = never, TPipeline extends {} = never>(props: {
        from: TableName<TLookupTable>;
        as: TAs;
        localField: DeepKeys<T>;
        foreignField: DeepKeys<TLookupTable>;
    } | {
        from: TableName<TLookupTable>;
        as: TAs;
        let?: ProjectObject<T, TLet>;
        pipeline: (agg: Aggregator<Simplify<TLookupTable & (ProjectResult<TLookupTable, TLet> extends infer R ? Double$Keys<R> : never)>>) => Aggregator<TPipeline>;
    }): Aggregator<T & ([TPipeline] extends [never] ? [TLet] extends [never] ? {
        [key in TAs]: TLookupTable[];
    } : {
        [key in TAs]: ProjectResult<TLookupTable, TLet>[];
    } : {
        [key in TAs]: TPipeline[];
    })>;
    $match(query: Filter<T, `$${DeepKeys<T>}`>): Aggregator<T>;
    $merge<TOtherCollection, TOn, TLet extends {} = never, TPipeline extends {} = never>(props: {
        into: TableName<TOtherCollection> | {
            db: string;
            coll: TableName<TOtherCollection>;
        };
        on?: (DeepKeys<T> & DeepKeys<TOtherCollection>) | (DeepKeys<T> & DeepKeys<TOtherCollection>)[];
        let?: ProjectObject<T, TLet>;
        whenMatched?: 'replace' | 'keepExisting' | 'merge' | 'fail' | ((agg: Aggregator<T & ([TLet] extends [never] ? Double$Keys<{
            new: T;
        }> : ProjectResult<T, TLet> extends infer R ? Double$Keys<R> : never)>) => Aggregator<TPipeline>);
        whenNotMatched?: 'insert' | 'discard' | 'fail';
    }): Aggregator<never>;
    $out<TOutTable>(tableName: TableName<TOutTable>): Aggregator<never>;
    $project<TProject>(query: ProjectRootObject<T, TProject>): Aggregator<DeepExcludeNever<ProjectResultRootObject<T, TProject, ''>>>;
    $redact<TExpression>(expression: ProjectResult<T & MongoRedactTypes, TExpression> extends '$DESCEND' | '$PRUNE' | '$KEEP' ? InterpretProjectExpression<T & MongoRedactTypes, TExpression> : never): Aggregator<T>;
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
    $set<TProject>(fields: ProjectRootObject<T, TProject>): Aggregator<T & ProjectResultRootObject<T, TProject>>;
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
