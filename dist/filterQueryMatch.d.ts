import { Binary, BSONType, DeepKeys, DeepKeysValue } from 'mongodb';
export declare type FilterQueryMatch<T, TMatchValues> = {
    [key in DeepKeys<T>]?: MongoAltQuery<DeepKeysValue<T, key>> | QuerySelector<DeepKeysValue<T, key>, TMatchValues> | TMatchValues;
} & RootQuerySelector<T, TMatchValues>;
declare type RegExpForString<T> = T extends string ? RegExp | T : T;
export declare type MongoAltQuery<T> = T extends ReadonlyArray<infer U> ? T | RegExpForString<U> : RegExpForString<T>;
/** https://docs.mongodb.com/manual/reference/operator/query/#query-selectors */
export declare type QuerySelector<T, TMatchValues> = {
    $eq?: T | TMatchValues;
    $gt?: T | TMatchValues;
    $gte?: T | TMatchValues;
    $in?: T[] | TMatchValues | TMatchValues[];
    $lt?: T | TMatchValues;
    $lte?: T | TMatchValues;
    $ne?: T | TMatchValues;
    $nin?: T[] | TMatchValues | TMatchValues[];
    $not?: (T extends string ? QuerySelector<T, TMatchValues> | RegExp : QuerySelector<T, TMatchValues>) | TMatchValues;
    /**
     * When `true`, `$exists` matches the documents that contain the field
     * including documents where the field value is null.
     */
    $exists?: boolean | TMatchValues;
    $type?: BSONType | BSONTypeAlias | TMatchValues;
    $expr?: any | TMatchValues;
    $jsonSchema?: any | TMatchValues;
    $mod?: (T extends number ? [number, number] : never) | TMatchValues;
    $regex?: (T extends string ? RegExp | string : never) | TMatchValues;
    $options?: (T extends string ? string : never) | TMatchValues;
    $geoIntersects?: {
        $geometry: object;
    } | TMatchValues;
    $geoWithin?: object | TMatchValues;
    $near?: object | TMatchValues;
    $nearSphere?: object | TMatchValues;
    $maxDistance?: number | TMatchValues;
    $all?: (T extends ReadonlyArray<infer U> ? FilterQueryMatch<U, TMatchValues>[] : never) | TMatchValues;
    $elemMatch?: (T extends ReadonlyArray<infer U> ? FilterQueryMatch<U, TMatchValues> : never) | TMatchValues;
    $size?: (T extends ReadonlyArray<infer U> ? number : never) | TMatchValues;
    $bitsAllClear?: BitwiseQuery | TMatchValues;
    $bitsAllSet?: BitwiseQuery | TMatchValues;
    $bitsAnyClear?: BitwiseQuery | TMatchValues;
    $bitsAnySet?: BitwiseQuery | TMatchValues;
};
export declare type RootQuerySelector<T, TMatchValues> = {
    /** https://docs.mongodb.com/manual/reference/operator/query/and/#op._S_and */
    $and?: Array<FilterQueryMatch<T, TMatchValues>>;
    /** https://docs.mongodb.com/manual/reference/operator/query/nor/#op._S_nor */
    $nor?: Array<FilterQueryMatch<T, TMatchValues>>;
    /** https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or */
    $or?: Array<FilterQueryMatch<T, TMatchValues>>;
    /** https://docs.mongodb.com/manual/reference/operator/query/text */
    $text?: {
        $search: string | TMatchValues;
        $language?: string | TMatchValues;
        $caseSensitive?: boolean | TMatchValues;
        $diacraticSensitive?: boolean | TMatchValues;
    } | TMatchValues;
    /** https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where */
    $where?: string | Function | TMatchValues;
    /** https://docs.mongodb.com/manual/reference/operator/query/comment/#op._S_comment */
    $comment?: string | TMatchValues;
    $expr?: any;
};
/** https://docs.mongodb.com/manual/reference/operator/query-bitwise */
declare type BitwiseQuery = number /** <numeric bitmask> */ | Binary /** <BinData bitmask> */ | number[]; /** [ <position1>, <position2>, ... ] */
declare type BSONTypeAlias = 'number' | 'double' | 'string' | 'object' | 'array' | 'binData' | 'undefined' | 'objectId' | 'bool' | 'date' | 'null' | 'regex' | 'dbPointer' | 'javascript' | 'symbol' | 'javascriptWithScope' | 'int' | 'timestamp' | 'long' | 'decimal' | 'minKey' | 'maxKey';
export {};
