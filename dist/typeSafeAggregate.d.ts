import { DeepKeys, DeepKeysResult, NumericTypes, Collection, ObjectID, ObjectId, DeepKeyArray, AggregationCursor } from 'mongodb';
import { FilterQueryMatch } from './filterQueryMatch';
import { Decimal128 } from 'bson';
declare type KEY = string | number | Symbol;
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
declare type NotImplementedProjectedYet = never;
declare type AllOperators = '$dateToString' | '$cond' | '$eq' | '$map' | '$sum' | '$abs' | '$acos' | '$acosh' | '$add' | '$addToSet' | '$allElementsTrue' | '$and' | '$anyElementTrue' | '$arrayElemAt' | '$arrayToObject' | '$asin' | '$asinh' | '$atan' | '$atan2' | '$atanh' | '$avg' | '$ceil' | '$cmp' | '$concat' | '$concatArrays' | '$convert' | '$cos' | '$dateFromParts' | '$dateToParts' | '$dateFromString' | '$dayOfMonth' | '$dayOfWeek' | '$dayOfYear' | '$degreesToRadians' | '$divide' | '$exp' | '$filter' | '$first' | '$floor' | '$gt' | '$gte' | '$hour' | '$ifNull' | '$in' | '$indexOfArray' | '$indexOfBytes' | '$indexOfCP' | '$isArray' | '$isoDayOfWeek' | '$isoWeek' | '$isoWeekYear' | '$last' | '$let' | '$literal' | '$ln' | '$log' | '$log10' | '$lt' | '$lte' | '$ltrim' | '$max' | '$mergeObjects' | '$meta' | '$min' | '$millisecond' | '$minute' | '$mod' | '$month' | '$multiply' | '$ne' | '$not' | '$objectToArray' | '$or' | '$pow' | '$push' | '$radiansToDegrees' | '$range' | '$reduce' | '$regexFind' | '$regexFindAll' | '$regexMatch' | '$reverseArray' | '$round' | '$rtrim' | '$second' | '$setDifference' | '$setEquals' | '$setIntersection' | '$setIsSubset' | '$setUnion' | '$size' | '$sin' | '$slice' | '$split' | '$sqrt' | '$stdDevPop' | '$stdDevSamp' | '$strcasecmp' | '$strLenBytes' | '$strLenCP' | '$substr' | '$substrBytes' | '$substrCP' | '$subtract' | '$switch' | '$tan' | '$toBool' | '$toDate' | '$toDecimal' | '$toDouble' | '$toInt' | '$toLong' | '$toObjectId' | '$toString' | '$toLower' | '$toUpper' | '$trim' | '$trunc' | '$type' | '$week' | '$year' | '$zip';
declare type ProjectOperatorHelperCondition<TRootValue, TValue, TKey extends KEY> = LookupKey<TValue, TKey> extends [
    InterpretProjectExpression<TRootValue, infer TLeft>,
    InterpretProjectExpression<TRootValue, infer TRight>
] ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>] : never;
declare type ProjectOperatorHelperArray<TRootValue, TValue, TKey extends KEY> = LookupKey<TValue, TKey> extends Array<InterpretProjectExpression<TRootValue, infer TArr>> ? InterpretProjectExpression<TRootValue, TArr>[] : never;
declare type ProjectOperatorHelperDate<TRootValue, TValue, TKey extends KEY> = {
    date: ProjectOperatorHelperExpressionInner<TRootValue, TValue, TKey, 'date'>;
    timezone?: ProjectOperatorHelperExpressionInner<TRootValue, TValue, TKey, 'timezone'>;
} | ProjectOperatorHelperExpression<TRootValue, TValue, TKey>;
declare type ProjectOperatorHelperArrayOrExpression<TRootValue, TValue, TKey extends KEY> = ProjectOperatorHelperArray<TRootValue, TValue, TKey> | ProjectOperatorHelperExpression<TRootValue, TValue, TKey>;
declare type ProjectOperatorHelperExpression<TRootValue, TValue, TKey extends KEY> = InterpretProjectExpression<TRootValue, LookupKey<TValue, TKey>>;
declare type ProjectOperatorHelperExpressionInner<TRootValue, TValue, TKey1 extends KEY, TKey2 extends KEY> = InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, TKey1>, TKey2>>;
declare type ProjectOperatorHelperExpressionObject<TRootValue, TValue, TKey extends KEY, TObj extends Record<string, 1 | 0>> = {
    [key in keyof TObj as key extends 1 ? key : never]: ProjectOperatorHelperExpressionInner<TRootValue, TValue, TKey, key>;
} & {
    [key in keyof TObj as key extends 0 ? key : never]?: ProjectOperatorHelperExpressionInner<TRootValue, TValue, TKey, key>;
};
declare type ProjectOperatorHelperOneTuple<TRootValue, TValue, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 0>>
];
declare type ProjectOperatorHelperTwoTuple<TRootValue, TValue, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 0>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 1>>
];
declare type ProjectOperatorHelperThreeTuple<TRootValue, TValue, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 0>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 1>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 2>>
];
declare type ProjectOperatorHelperFourTuple<TRootValue, TValue, TKey extends KEY> = [
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 0>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 1>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 2>>,
    InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TValue, TKey>, 3>>
];
declare type InterpretProjectOperator<TRootValue, TValue> = {
    $abs: ProjectOperatorHelperExpression<TRootValue, TValue, '$abs'>;
} | {
    $acos: ProjectOperatorHelperExpression<TRootValue, TValue, '$acos'>;
} | {
    $acosh: ProjectOperatorHelperExpression<TRootValue, TValue, '$acosh'>;
} | {
    $add: ProjectOperatorHelperArray<TRootValue, TValue, '$add'>;
} | {
    $addToSet: ProjectOperatorHelperExpression<TRootValue, TValue, '$addToSet'>;
} | {
    $allElementsTrue: ProjectOperatorHelperArray<TRootValue, TValue, '$allElementsTrue'>;
} | {
    $and: ProjectOperatorHelperArray<TRootValue, TValue, '$and'>;
} | {
    $anyElementTrue: ProjectOperatorHelperArray<TRootValue, TValue, '$anyElementTrue'>;
} | {
    $arrayElemAt: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$arrayElemAt'>;
} | {
    $arrayToObject: ProjectOperatorHelperArray<TRootValue, TValue, '$arrayToObject'> | ProjectOperatorHelperExpression<TRootValue, TValue, '$arrayToObject'>;
} | {
    $asin: ProjectOperatorHelperExpression<TRootValue, TValue, '$asin'>;
} | {
    $asinh: ProjectOperatorHelperExpression<TRootValue, TValue, '$asinh'>;
} | {
    $atan: ProjectOperatorHelperExpression<TRootValue, TValue, '$atan'>;
} | {
    $atan2: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$atan2'>;
} | {
    $atanh: ProjectOperatorHelperExpression<TRootValue, TValue, '$atanh'>;
} | {
    $avg: ProjectOperatorHelperArrayOrExpression<TRootValue, TValue, '$avg'>;
} | {
    $binarySize: ProjectOperatorHelperExpression<TRootValue, TValue, '$binarySize'>;
} | {
    $bsonSize: ProjectOperatorHelperExpression<TRootValue, TValue, '$bsonSize'>;
} | {
    $ceil: ProjectOperatorHelperExpression<TRootValue, TValue, '$ceil'>;
} | {
    $cmp: ProjectOperatorHelperArray<TRootValue, TValue, '$cmp'>;
} | {
    $concat: ProjectOperatorHelperArray<TRootValue, TValue, '$concat'>;
} | {
    $concatArrays: ProjectOperatorHelperArray<TRootValue, TValue, '$concatArrays'>;
} | {
    $cond: ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$cond'> | ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$cond', {
        else: 0;
        if: 1;
        then: 1;
    }>;
} | {
    $convert: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$convert', {
        input: 1;
        to: 0;
        onError: 0;
        onNull: 0;
    }>;
} | {
    $cos: ProjectOperatorHelperExpression<TRootValue, TValue, '$cos'>;
} | {
    $dateFromParts: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$dateFromParts', {
        year: 1;
        month: 0;
        day: 0;
        hour: 0;
        minute: 0;
        second: 0;
        millisecond: 0;
        timezone: 0;
    }> | ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$dateFromParts', {
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
    $dateFromString: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$dateFromString', {
        dateString: 1;
        format: 0;
        timezone: 0;
        onError: 0;
    }>;
} | {
    $dateToParts: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$dateToParts', {
        date: 1;
        timezone: 0;
    }> | (ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$dateToParts', {
        date: 1;
        timezone: 0;
    }> & {
        iso8601?: boolean;
    });
} | {
    $dateToString: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$dateToString', {
        date: 1;
        format: 0;
    }>;
} | {
    $dayOfMonth: ProjectOperatorHelperDate<TRootValue, TValue, '$dayOfMonth'>;
} | {
    $dayOfWeek: ProjectOperatorHelperDate<TRootValue, TValue, '$dayOfWeek'>;
} | {
    $dayOfYear: ProjectOperatorHelperDate<TRootValue, TValue, '$dayOfYear'>;
} | {
    $degreesToRadians: ProjectOperatorHelperExpression<TRootValue, TValue, '$degreesToRadians'>;
} | {
    $divide: ProjectOperatorHelperArray<TRootValue, TValue, '$divide'>;
} | {
    $eq: ProjectOperatorHelperCondition<TRootValue, TValue, '$eq'>;
} | {
    $exp: ProjectOperatorHelperExpression<TRootValue, TValue, '$exp'>;
} | {
    $filter: ProjectOperatorHelperExpression<TRootValue, TValue, '$filter'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        as: infer TAs;
        cond: any;
    } ? {
        input: InterpretProjectExpression<TRootValue, TInput>;
        as: TAs;
        cond: ProjectOperatorHelperExpressionInner<TRootValue & (TAs extends string ? Double$Keys<{
            [key in TAs]: UnArray<ProjectResult<TRootValue, TInput>>;
        }> : never), TValue, '$filter', 'cond'>;
    } : never;
} | {
    $first: ProjectOperatorHelperExpression<TRootValue, TValue, '$first'>;
} | {
    $floor: ProjectOperatorHelperExpression<TRootValue, TValue, '$floor'>;
} | {
    $gt: ProjectOperatorHelperCondition<TRootValue, TValue, '$gt'>;
} | {
    $gte: ProjectOperatorHelperCondition<TRootValue, TValue, '$gte'>;
} | {
    $hour: ProjectOperatorHelperDate<TRootValue, TValue, '$hour'>;
} | {
    $ifNull: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$ifNull'>;
} | {
    $in: ProjectOperatorHelperArray<TRootValue, TValue, '$in'>;
} | {
    $indexOfArray: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$indexOfArray'> | ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$indexOfArray'> | ProjectOperatorHelperFourTuple<TRootValue, TValue, '$indexOfArray'>;
} | {
    $indexOfBytes: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$indexOfBytes'> | ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$indexOfBytes'> | ProjectOperatorHelperFourTuple<TRootValue, TValue, '$indexOfBytes'>;
} | {
    $indexOfCP: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$indexOfCP'> | ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$indexOfCP'> | ProjectOperatorHelperFourTuple<TRootValue, TValue, '$indexOfCP'>;
} | {
    $isArray: ProjectOperatorHelperExpression<TRootValue, TValue, '$isArray'>;
} | {
    $isoDayOfWeek: ProjectOperatorHelperDate<TRootValue, TValue, '$isoDayOfWeek'>;
} | {
    $isoWeek: ProjectOperatorHelperDate<TRootValue, TValue, '$isoWeek'>;
} | {
    $isoWeekYear: ProjectOperatorHelperDate<TRootValue, TValue, '$isoWeekYear'>;
} | {
    $last: ProjectOperatorHelperExpression<TRootValue, TValue, '$last'>;
} | {
    $let: ProjectOperatorHelperExpression<TRootValue, TValue, '$let'> extends {
        vars: InterpretProjectExpression<TRootValue, infer TVars>;
    } ? {
        vars: ProjectOperatorHelperExpressionInner<TRootValue, TValue, '$let', 'vars'>;
        in: ProjectResultObject<TRootValue, TVars> extends infer R ? ProjectOperatorHelperExpressionInner<TRootValue & Double$Keys<{
            [key in keyof R]: 1;
        }>, TValue, '$let', 'in'> : never;
    } : never;
} | {
    $literal: LookupKey<TValue, '$literal'>;
} | {
    $ln: ProjectOperatorHelperExpression<TRootValue, TValue, '$ln'>;
} | {
    $log: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$log'>;
} | {
    $log10: ProjectOperatorHelperExpression<TRootValue, TValue, '$log10'>;
} | {
    $lt: ProjectOperatorHelperCondition<TRootValue, TValue, '$lt'>;
} | {
    $lte: ProjectOperatorHelperCondition<TRootValue, TValue, '$lte'>;
} | {
    $ltrim: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$ltrim', {
        input: 1;
        chars: 0;
    }>;
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
    $max: ProjectOperatorHelperExpression<TRootValue, TValue, '$max'>;
} | {
    $mergeObjects: ProjectOperatorHelperArray<TRootValue, TValue, '$mergeObjects'>;
} | {
    $meta: 'textScore' | 'indexKey';
} | {
    $millisecond: ProjectOperatorHelperDate<TRootValue, TValue, '$millisecond'>;
} | {
    $min: ProjectOperatorHelperExpression<TRootValue, TValue, '$min'>;
} | {
    $minute: ProjectOperatorHelperDate<TRootValue, TValue, '$minute'>;
} | {
    $mod: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$mod'>;
} | {
    $month: ProjectOperatorHelperDate<TRootValue, TValue, '$month'>;
} | {
    $multiply: ProjectOperatorHelperArray<TRootValue, TValue, '$multiply'>;
} | {
    $ne: ProjectOperatorHelperCondition<TRootValue, TValue, '$ne'>;
} | {
    $not: ProjectOperatorHelperExpression<TRootValue, TValue, '$not'>;
} | {
    $objectToArray: ProjectOperatorHelperExpression<TRootValue, TValue, '$objectToArray'>;
} | {
    $or: ProjectOperatorHelperArray<TRootValue, TValue, '$or'>;
} | {
    $pow: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$pow:'>;
} | {
    $push: ProjectOperatorHelperExpression<TRootValue, TValue, '$push'>;
} | {
    $radiansToDegrees: ProjectOperatorHelperExpression<TRootValue, TValue, '$radiansToDegrees'>;
} | {
    $range: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$range'> | ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$range'>;
} | {
    $reduce: ProjectOperatorHelperExpression<TRootValue, TValue, '$reduce'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        initialValue: InterpretProjectExpression<TRootValue, infer TInitialValue>;
        in: any;
    } ? {
        input: InterpretProjectExpression<TRootValue, TInput>;
        initialValue: InterpretProjectExpression<TRootValue, TInitialValue>;
        in: ProjectResultObject<TRootValue, TInput> extends infer R ? ProjectOperatorHelperExpressionInner<TRootValue & {
            $value: UnArray<ProjectResultObject<TRootValue, TInitialValue>>;
            $this: ProjectResultObject<TRootValue, TInput>;
        }, TValue, '$reduce', 'in'> : never;
    } : never;
} | {
    $regexFind: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$regexFind', {
        input: 1;
        regex: 1;
        options: 0;
    }>;
} | {
    $regexFindAll: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$regexFindAll', {
        input: 1;
        regex: 1;
        options: 0;
    }>;
} | {
    $regexMatch: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$regexMatch', {
        input: 1;
        regex: 1;
        options: 0;
    }>;
} | {
    $reverseArray: ProjectOperatorHelperExpression<TRootValue, TValue, '$reverseArray'>;
} | {
    $round: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$round'>;
} | {
    $rtrim: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$rtrim', {
        input: 1;
        chars: 0;
    }>;
} | {
    $second: ProjectOperatorHelperDate<TRootValue, TValue, '$second'>;
} | {
    $setDifference: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$setDifference'>;
} | {
    $setEquals: ProjectOperatorHelperArray<TRootValue, TValue, '$setEquals'>;
} | {
    $setIntersection: ProjectOperatorHelperArray<TRootValue, TValue, '$setIntersection'>;
} | {
    $setIsSubset: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$setIsSubset'>;
} | {
    $setUnion: ProjectOperatorHelperArray<TRootValue, TValue, '$setUnion'>;
} | {
    $sin: ProjectOperatorHelperExpression<TRootValue, TValue, '$sin'>;
} | {
    $size: ProjectOperatorHelperExpression<TRootValue, TValue, '$size'>;
} | {
    $slice: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$slice'> | ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$slice'>;
} | {
    $split: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$split'>;
} | {
    $sqrt: ProjectOperatorHelperExpression<TRootValue, TValue, '$sqrt'>;
} | {
    $stdDevPop: ProjectOperatorHelperExpression<TRootValue, TValue, '$stdDevPop'> | ProjectOperatorHelperArray<TRootValue, TValue, '$stdDevPop'>;
} | {
    $stdDevSamp: ProjectOperatorHelperExpression<TRootValue, TValue, '$stdDevSamp'> | ProjectOperatorHelperArray<TRootValue, TValue, '$stdDevSamp'>;
} | {
    $strcasecmp: ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$strcasecmp'>;
} | {
    $strLenBytes: ProjectOperatorHelperExpression<TRootValue, TValue, '$strLenBytes'>;
} | {
    $strLenCP: ProjectOperatorHelperExpression<TRootValue, TValue, '$strLenCP'>;
} | {
    $substr: ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$substr'>;
} | {
    $substrBytes: ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$substrBytes'>;
} | {
    $substrCP: ProjectOperatorHelperThreeTuple<TRootValue, TValue, '$substrCP'>;
} | {
    $subtract: ProjectOperatorHelperArray<TRootValue, TValue, '$subtract'>;
} | {
    $sum: ProjectOperatorHelperExpression<TRootValue, TValue, '$sum'>;
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
    $tan: ProjectOperatorHelperExpression<TRootValue, TValue, '$tan'>;
} | {
    $toBool: ProjectOperatorHelperExpression<TRootValue, TValue, '$toBool'>;
} | {
    $toDate: ProjectOperatorHelperExpression<TRootValue, TValue, '$toDate'>;
} | {
    $toDecimal: ProjectOperatorHelperExpression<TRootValue, TValue, '$toDecimal'>;
} | {
    $toDouble: ProjectOperatorHelperExpression<TRootValue, TValue, '$toDouble'>;
} | {
    $toInt: ProjectOperatorHelperExpression<TRootValue, TValue, '$toInt'>;
} | {
    $toLong: ProjectOperatorHelperExpression<TRootValue, TValue, '$toLong'>;
} | {
    $toLower: ProjectOperatorHelperExpression<TRootValue, TValue, '$toLower'>;
} | {
    $toObjectId: ProjectOperatorHelperExpression<TRootValue, TValue, '$toObjectId'>;
} | {
    $toString: ProjectOperatorHelperExpression<TRootValue, TValue, '$toString'>;
} | {
    $toUpper: ProjectOperatorHelperExpression<TRootValue, TValue, '$toUpper'>;
} | {
    $trim: ProjectOperatorHelperExpressionObject<TRootValue, TValue, '$trim', {
        input: 1;
        chars: 0;
    }>;
} | {
    $trunc: ProjectOperatorHelperOneTuple<TRootValue, TValue, '$trunc'> | ProjectOperatorHelperTwoTuple<TRootValue, TValue, '$trunc'> | ProjectOperatorHelperExpression<TRootValue, TValue, '$trunc'>;
} | {
    $type: ProjectOperatorHelperExpression<TRootValue, TValue, '$type'>;
} | {
    $week: ProjectOperatorHelperDate<TRootValue, TValue, '$week'>;
} | {
    $year: ProjectOperatorHelperDate<TRootValue, TValue, '$year'>;
} | {
    $zip: NotImplementedProjectedYet;
};
declare type InterpretAccumulateOperator<TRootValue, TValue> = {
    $avg?: ProjectOperatorHelperExpression<TRootValue, TValue, '$avg'>;
    $last?: ProjectOperatorHelperExpression<TRootValue, TValue, '$last'>;
    $mergeObjects?: ProjectOperatorHelperExpression<TRootValue, TValue, '$mergeObjects'>;
    $stdDevPop?: ProjectOperatorHelperExpression<TRootValue, TValue, '$stdDevPop'>;
    $stdDevSamp?: ProjectOperatorHelperExpression<TRootValue, TValue, '$stdDevSamp'>;
    $addToSet?: ProjectOperatorHelperExpression<TRootValue, TValue, '$addToSet'>;
    $first?: ProjectOperatorHelperExpression<TRootValue, TValue, '$first'>;
    $max?: ProjectOperatorHelperExpression<TRootValue, TValue, '$max'>;
    $min?: ProjectOperatorHelperExpression<TRootValue, TValue, '$min'>;
    $push?: ProjectOperatorHelperExpression<TRootValue, TValue, '$push'>;
    $sum?: ProjectOperatorHelperExpression<TRootValue, TValue, '$sum'>;
};
export declare type ExpressionStringReferenceKey<T> = `$${DeepKeys<T>}`;
export declare type InterpretProjectExpression<TRootValue, TValue> = TValue extends `$${string}` ? ExpressionStringReferenceKey<TRootValue> : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? InterpretProjectOperator<TRootValue, TValue> : TValue extends Array<infer TValueArr> ? Array<InterpretProjectExpression<TRootValue, TValueArr>> : TValue extends {} ? ProjectObject<TRootValue, TValue> : never;
declare type ProjectObject<TRootValue, TProject> = {
    [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};
declare type ProjectRootObject<TRootValue, TProject> = {
    [key in keyof TProject]: InterpretProjectExpression<TRootValue & CurrentAggregate<TRootValue>, TProject[key]>;
};
declare type AllAccumulateOperators = '$addToSet' | '$avg' | '$first' | '$last' | '$max' | '$mergeObjects' | '$min' | '$push' | '$stdDevPop' | '$stdDevSamp' | '$sum';
declare type CheckProjectDeepKey<TKey extends string, TValue> = TValue extends 1 | true ? ([TKey] extends [never] ? 0 : 1) : 0;
declare type CheckProjectDeepKeyRemoveUnderscoreID<TKey extends string, TValue> = TValue extends 0 | false ? [TKey] extends ['_id'] ? 1 : 0 : 0;
declare type ProjectResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? ProjectResultOperators<TRootValue, TValue>[keyof TValue] : TValue extends Array<infer TValueArray> ? Array<ProjectResultObject<TRootValue, TValueArray>> : TValue extends {} ? ProjectResultObject<TRootValue, TValue> : never;
declare type ProjectResultRoot<TRootValue, TValue, TKey extends string = never> = TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : CheckProjectDeepKey<TKey, TValue> extends 1 ? DeepKeysResult<TRootValue, TKey> : CheckProjectDeepKeyRemoveUnderscoreID<TKey, TValue> extends 1 ? never : TValue extends RawTypes ? TValue : keyof TValue extends AllOperators ? ProjectResultOperators<TRootValue, TValue>[keyof TValue] : TValue extends Array<infer TValueArray> ? Array<ProjectResultRootObject<TRootValue, TValueArray, TKey>> : TValue extends {} ? ProjectResultRootObject<TRootValue, TValue, TKey> : never;
declare type ProjectResultExpression<TRootValue, TValue, TKey extends KEY> = ProjectResult<TRootValue, LookupKey<TValue, TKey>>;
declare type ProjectResultExpressionInner<TRootValue, TValue, TKey extends KEY, TKey2 extends KEY> = ProjectResult<TRootValue, LookupKey<LookupKey<TValue, TKey>, TKey2>>;
declare type ProjectResultArrayIndex<TRootValue, TValue, TKey extends KEY, TIndex extends number> = ProjectResult<TRootValue, LookupArray<LookupKey<TValue, TKey>, TIndex>>;
declare type NumberProjectResultExpression<TRootValue, TValue, TKey extends KEY> = NumberTypeOrNever<ProjectResult<TRootValue, LookupKey<TValue, TKey>>>;
declare type NumberProjectResultExpressionUnArray<TRootValue, TValue, TKey extends KEY> = NumberTypeOrNever<ProjectResult<TRootValue, UnArray<LookupKey<TValue, TKey>>>>;
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
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
declare type ProjectResultOperators<TRootValue, TValue> = {
    $abs: NumberProjectResultExpression<TRootValue, TValue, '$abs'>;
    $acos: NumberProjectResultExpression<TRootValue, TValue, '$acos'>;
    $acosh: NumberProjectResultExpression<TRootValue, TValue, '$acosh'>;
    $add: NumberProjectResultExpressionUnArray<TRootValue, TValue, '$add'>;
    $addToSet: ProjectResultExpression<TRootValue, TValue, '$addToSet'>[];
    $allElementsTrue: boolean;
    $and: boolean;
    $anyElementTrue: boolean;
    $arrayElemAt: UnArray<ProjectResultArrayIndex<TRootValue, TValue, '$arrayElemAt', 0>>;
    $arrayToObject: ProjectResultExpression<TRootValue, TValue, '$arrayToObject'> extends infer TInner ? UnArray<TInner> extends any[] ? unknown : ArrayToObjectTupleBuilder<UnionToTuple<UnArray<TInner>>> : never;
    $asin: NumberProjectResultExpression<TRootValue, TValue, '$asin'>;
    $asinh: NumberProjectResultExpression<TRootValue, TValue, '$asinh'>;
    $atan: NumberProjectResultExpression<TRootValue, TValue, '$atan'>;
    $atan2: NumberTypeOrNever<UnArray<ProjectResultArrayIndex<TRootValue, TValue, '$atan2', 0>>>;
    $atanh: NumberProjectResultExpression<TRootValue, TValue, '$atanh'>;
    $avg: number;
    $binarySize: number;
    $bsonSize: number;
    $ceil: NumberProjectResultExpression<TRootValue, TValue, '$ceil'>;
    $cmp: NumberTypeOrNever<ProjectResultArrayIndex<TRootValue, TValue, '$cmp', 0>>;
    $concat: string;
    $concatArrays: DeepUnArray<ProjectResultArrayIndex<TRootValue, TValue, '$concatArrays', 0>>[];
    $cond: LookupKey<TValue, '$cond'> extends Array<any> ? ProjectResultArrayIndex<TRootValue, TValue, '$cond', 1> | ProjectResultArrayIndex<TRootValue, TValue, '$cond', 2> : ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'then'>> | ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$cond'>, 'else'>>;
    $convert: unknown;
    $cos: NumberProjectResultExpression<TRootValue, TValue, '$cos'>;
    $dateFromParts: Date;
    $dateFromString: Date;
    $dateToParts: true extends LookupKey<LookupKey<TValue, '$dateToParts'>, 'iso8601'> ? {
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
    $divide: NumberProjectResultExpressionUnArray<TRootValue, TValue, '$divide'>;
    $eq: boolean;
    $exp: number;
    $filter: ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$filter'>, 'input'>>;
    $first: UnArray<ProjectResultExpression<TRootValue, TValue, '$first'>>;
    $floor: NumberProjectResultExpressionUnArray<TRootValue, TValue, '$floor'>;
    $gt: boolean;
    $gte: boolean;
    $hour: number;
    $ifNull: ProjectResultExpression<TRootValue, TValue, '$ifNull'>;
    $in: ProjectResultExpression<TRootValue, TValue, '$in'>;
    $indexOfArray: number;
    $indexOfBytes: number;
    $indexOfCP: number;
    $isArray: boolean;
    $isoDayOfWeek: number;
    $isoWeek: number;
    $isoWeekYear: number;
    $last: UnArray<ProjectResultExpression<TRootValue, TValue, '$last'>>;
    $let: ProjectResult<TRootValue & Double$Keys<{
        [key in keyof ProjectResultObject<TRootValue, ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$let'>, 'vars'>>>]: 1;
    }>, LookupKey<LookupKey<TValue, '$let'>, 'in'>>;
    $literal: LookupKey<TValue, '$literal'>;
    $ln: number;
    $log: number;
    $log10: number;
    $lt: boolean;
    $lte: boolean;
    $ltrim: string;
    $map: LookupKey<LookupKey<TValue, '$map'>, 'as'> extends string ? ProjectResult<TRootValue & {
        [key in `$${LookupKey<LookupKey<TValue, '$map'>, 'as'>}`]: ProjectResult<TRootValue, LookupKey<LookupKey<TValue, '$map'>, 'input'>>;
    }, LookupKey<LookupKey<TValue, '$map'>, 'in'>>[] : never;
    $max: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TValue, '$max'>>>;
    $mergeObjects: FlattenUnion<ProjectResultArrayIndex<TRootValue, TValue, '$mergeObjects', number>>;
    $meta: number;
    $millisecond: number;
    $min: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TValue, '$min'>>>;
    $minute: number;
    $mod: number;
    $month: number;
    $multiply: NumberProjectResultExpressionUnArray<TRootValue, TValue, '$multiply'>;
    $ne: boolean;
    $not: boolean;
    $objectToArray: ObjectToArrayHelper<ProjectResultExpression<TRootValue, TValue, '$objectToArray'>>;
    $or: boolean;
    $pow: number;
    $push: ProjectResultExpression<TRootValue, TValue, '$push'>[];
    $radiansToDegrees: number;
    $range: number[];
    $reduce: ProjectOperatorHelperExpression<TRootValue, TValue, '$reduce'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        initialValue: InterpretProjectExpression<TRootValue, infer TInitialValue>;
        in: any;
    } ? ProjectResultObject<TRootValue, TInput> extends infer R ? ProjectResultExpressionInner<TRootValue & {
        $value: UnArray<ProjectResultObject<TRootValue, TInitialValue>>;
        $this: ProjectResultObject<TRootValue, TInput>;
    }, TValue, '$reduce', 'in'> : never : never;
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
    $reverseArray: ProjectResultExpression<TRootValue, TValue, '$reverseArray'>;
    $round: number;
    $rtrim: string;
    $second: number;
    $setDifference: ProjectResultArrayIndex<TRootValue, TValue, '$setDifference', 0>;
    $setEquals: boolean;
    $setIntersection: UnArray<ProjectResultExpression<TRootValue, TValue, '$setIntersection'>>;
    $setIsSubset: boolean;
    $setUnion: ProjectResultArrayIndex<TRootValue, TValue, '$setUnion', number>;
    $sin: number;
    $size: number;
    $slice: ProjectResultArrayIndex<TRootValue, TValue, '$slice', 0>;
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
    $subtract: NumberProjectResultExpressionUnArray<TRootValue, TValue, '$subtract'>;
    $sum: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TValue, '$sum'>>>;
    $switch: InterpretProjectExpression<TRootValue, LookupKey<LookupArray<LookupKey<LookupKey<TValue, '$switch'>, 'branches'>, number>, 'then'>> | InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TValue, '$switch'>, 'default'>>;
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
    $trunc: LookupKey<TValue, '$trunc'> extends Array<any> ? NumberTypeOrNever<ProjectResultArrayIndex<TRootValue, TValue, '$trunc', 0>> : NumberProjectResultExpression<TRootValue, TValue, '$trunc'>;
    $type: 'double' | 'string' | 'object' | 'array' | 'binData' | 'objectId' | 'bool' | 'date' | 'null' | 'regex' | 'javascript' | 'int' | 'timestamp' | 'long' | 'decimal' | 'minKey' | 'maxKey';
    $week: number;
    $year: number;
    $zip: ProjectResult<TRootValue, LookupArray<LookupKey<LookupKey<TValue, '$zip'>, 'input'>, number>>;
};
declare type AccumulateResult<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? DeepKeysResult<TRootValue, TRawKey> : TValue extends RawTypes ? TValue : keyof TValue extends AllAccumulateOperators ? {
    $avg: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TValue, '$avg'>>>>;
    $last: ProjectResult<TRootValue, LookupKey<TValue, '$last'>>;
    $mergeObjects: FlattenUnion<UnArray<ProjectResultExpression<TRootValue, TValue, '$mergeObjects'>>>;
    $stdDevPop: number;
    $stdDevSamp: number;
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
    [key in keyof T]: ProjectResultRoot<TRootValue & CurrentAggregate<TRootValue>, T[key], GetProjectDeepKey<TDeepProjectKey, key>>;
} : never;
export declare type LookupKey<T, TKey extends string | number | Symbol> = TKey extends keyof T ? T[TKey] : never;
export declare type LookupArray<T, TIndex extends number> = T extends Array<any> ? T[TIndex] : never;
export declare type CurrentAggregate<TRootValue> = {
    $CURRENT: TRootValue;
};
declare type InterpretAccumulateExpression<TRootValue, TValue> = TValue extends `$${infer TRawKey}` ? ExpressionStringReferenceKey<TRootValue> : TValue extends RawTypes ? TValue : keyof TValue extends AllAccumulateOperators ? InterpretAccumulateOperator<TRootValue, TValue> : never;
declare type AccumulateRootObject<TRootValue, TAccumulateObject> = {
    [key in keyof TAccumulateObject]: key extends '_id' ? InterpretProjectExpression<TRootValue & CurrentAggregate<TRootValue>, TAccumulateObject[key]> : InterpretAccumulateExpression<TRootValue & CurrentAggregate<TRootValue>, TAccumulateObject[key]>;
};
declare type BucketRootObject<TRootValue, TAccumulateObject> = {
    [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue & CurrentAggregate<TRootValue>, TAccumulateObject[key]>;
};
declare type AccumulateRootResultObject<TRootValue, TObj> = TObj extends infer T ? {
    [key in keyof T]: key extends '_id' ? ProjectResult<TRootValue & CurrentAggregate<TRootValue>, T[key]> : AccumulateResult<TRootValue & CurrentAggregate<TRootValue>, T[key]>;
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
declare type MongoRedactTypes = {
    $$DESCEND: '$$DESCEND';
    $$PRUNE: '$$PRUNE';
    $$KEEP: '$$KEEP';
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
    $redact<TExpression>(expression: ProjectResult<T & CurrentAggregate<T> & MongoRedactTypes, TExpression> extends '$$DESCEND' | '$$PRUNE' | '$$KEEP' ? InterpretProjectExpression<T & MongoRedactTypes, TExpression> : never): Aggregator<T>;
    $replaceRoot<TNewRootValue, TNewRoot extends {
        newRoot: TNewRootValue;
    }>(params: {
        newRoot: InterpretProjectExpression<T & CurrentAggregate<T>, TNewRootValue>;
    }): Aggregator<ProjectResult<T & CurrentAggregate<T>, TNewRootValue>>;
    $replaceWith<TNewRootValue, TNewRoot extends {
        newRoot: TNewRootValue;
    }>(params: {
        newRoot: InterpretProjectExpression<T & CurrentAggregate<T>, TNewRootValue>;
    }): Aggregator<ProjectResult<T & CurrentAggregate<T>, TNewRootValue>>;
    $sample(props: {
        size: number;
    }): Aggregator<T>;
    $sampleRate(props: number): Aggregator<T>;
    $set<TProject>(fields: ProjectRootObject<T, TProject>): Aggregator<T & ProjectResultRootObject<T, TProject>>;
    $skip(skip: number): Aggregator<T>;
    $sort(sorts: {
        [key in DeepKeys<T>]?: 1 | -1;
    }): Aggregator<T>;
    $sortByCount<TExpression>(expression: InterpretProjectExpression<T & CurrentAggregate<T>, TExpression>): Aggregator<{
        _id: ProjectResult<T & CurrentAggregate<T>, TExpression>;
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
