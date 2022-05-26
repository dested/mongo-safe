import { Binary, BSONType, BSONRegExp, Join, NestedPaths, WithId, Condition, PropertyType, NonObjectIdLikeDocument } from 'mongodb';
export declare type Filter<TSchema, TMatchValues> = Partial<TSchema> | ({
    [Property in Join<NestedPaths<WithId<TSchema>>, '.'>]?: Condition<PropertyType<WithId<TSchema>, Property>>;
} & RootFilterOperators<WithId<TSchema>, TMatchValues>) | TMatchValues;
declare type RegExpForString<T> = T extends string ? RegExp | T : T;
export declare type MongoAltQuery<T> = T extends ReadonlyArray<infer U> ? T | RegExpForString<U> : RegExpForString<T>;
/** @public */
export interface FilterOperators<TValue, TMatchValues> extends NonObjectIdLikeDocument {
    $eq?: TValue | TMatchValues;
    $gt?: TValue | TMatchValues;
    $gte?: TValue | TMatchValues;
    $in?: ReadonlyArray<TValue> | TMatchValues | ReadonlyArray<TMatchValues>;
    $lt?: TValue | TMatchValues;
    $lte?: TValue | TMatchValues;
    $ne?: TValue | TMatchValues;
    $nin?: ReadonlyArray<TValue> | TMatchValues | ReadonlyArray<TMatchValues>;
    $not?: (TValue extends string ? FilterOperators<TValue, TMatchValues> | RegExp : FilterOperators<TValue, TMatchValues>) | TMatchValues;
    /**
     * When `true`, `$exists` matches the documents that contain the field,
     * including documents where the field value is null.
     */
    $exists?: boolean | TMatchValues;
    $type?: BSONType | BSONTypeAlias | TMatchValues;
    $expr?: any | TMatchValues;
    $jsonSchema?: Record<string, any> | TMatchValues;
    $mod?: (TValue extends number ? [number, number] : never) | TMatchValues;
    $regex?: (TValue extends string ? RegExp | BSONRegExp | string : never) | TMatchValues;
    $options?: (TValue extends string ? string : never) | TMatchValues;
    $geoIntersects?: {
        $geometry: Document;
    } | TMatchValues;
    $geoWithin?: Document | TMatchValues;
    $near?: Document | TMatchValues;
    $nearSphere?: Document | TMatchValues;
    $maxDistance?: number | TMatchValues;
    $all?: (TValue extends ReadonlyArray<infer U> ? Filter<U, TMatchValues>[] : never) | TMatchValues;
    $elemMatch?: (TValue extends ReadonlyArray<infer U> ? Filter<U, TMatchValues> : never) | TMatchValues;
    $size?: (TValue extends ReadonlyArray<infer U> ? number : never) | TMatchValues;
    $bitsAllClear?: BitwiseQuery | TMatchValues;
    $bitsAllSet?: BitwiseQuery | TMatchValues;
    $bitsAnyClear?: BitwiseQuery | TMatchValues;
    $bitsAnySet?: BitwiseQuery | TMatchValues;
    $rand?: Record<string, never>;
}
/** @public */
export interface RootFilterOperators<TSchema, TMatchValues> extends Document {
    $and?: Filter<TSchema, TMatchValues>[];
    $nor?: Filter<TSchema, TMatchValues>[];
    $or?: Filter<TSchema, TMatchValues>[];
    $text?: {
        $search: string;
        $language?: string;
        $caseSensitive?: boolean;
        $diacriticSensitive?: boolean;
    };
    $where?: string | ((this: TSchema) => boolean);
    $comment?: string | Document;
    $expr?: any;
}
/** https://docs.mongodb.com/manual/reference/operator/query-bitwise */
declare type BitwiseQuery = number /** <numeric bitmask> */ | Binary /** <BinData bitmask> */ | number[]; /** [ <position1>, <position2>, ... ] */
declare type BSONTypeAlias = 'number' | 'double' | 'string' | 'object' | 'array' | 'binData' | 'undefined' | 'objectId' | 'bool' | 'date' | 'null' | 'regex' | 'dbPointer' | 'javascript' | 'symbol' | 'javascriptWithScope' | 'int' | 'timestamp' | 'long' | 'decimal' | 'minKey' | 'maxKey';
export {};
