import {Decimal128} from 'bson';
import {ObjectId} from 'mongodb';

export type SafeTypes = number | string | boolean | ObjectId | Date | Decimal128;
export type AllowedArrayIndexes = '0'; //| '1' | '2'; // | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type DeepKeys<T extends {}> = {
  [key in keyof T]: key extends string
    ? T[key] extends SafeTypes
      ? `${key}`
      : T[key] extends Array<infer D>
      ? D extends SafeTypes
        ? `${key}` | `${key}.${AllowedArrayIndexes}`
        :
            | `${key}`
            | `${key}.${DeepKeys<D>}`
            | `${key}.${AllowedArrayIndexes}.${DeepKeys<D>}`
            | `${key}.${AllowedArrayIndexes}`
      : T[key] extends infer D
      ? D extends {}
        ? `${key}` | `${key}.${DeepKeys<D>}`
        : never
      : never
    : never;
}[keyof T];

export type DeepKeysValue<T, TKey extends string> = TKey extends keyof T
  ? T[TKey] extends Array<infer Value>
    ? T[TKey] | Value
    : T[TKey]
  : T extends Array<infer Value>
  ? Value extends SafeTypes
    ? Value
    : TKey extends `${infer key}.${infer rest}` // go deeper into array
    ? key extends AllowedArrayIndexes // 0.rest
      ? DeepKeysValue<Value, rest> // 0.rest
      : DeepKeysValue<Value, TKey> // .rest
    : DeepKeysValue<Value, TKey> // its just Value
  : keyof T extends string
  ? TKey extends `${infer key}.${infer rest}`
    ? key extends keyof T
      ? DeepKeysValue<T[key], rest>
      : never
    : never
  : never;

export type DeepKeysResult<T, TKey extends string> = TKey extends keyof T
  ? T[TKey] extends Array<infer Value>
    ? T[TKey] // | Value ** this is the only difference
    : T[TKey]
  : T extends Array<infer Value>
  ? Value extends SafeTypes
    ? Value
    : TKey extends `${infer key}.${infer rest}` // go deeper into array
    ? key extends AllowedArrayIndexes // 0.rest
      ? DeepKeysResult<Value, rest> // 0.rest
      : DeepKeysResult<Value, TKey> // .rest
    : DeepKeysResult<Value, TKey> // its just Value
  : keyof T extends string
  ? TKey extends `${infer key}.${infer rest}`
    ? key extends keyof T
      ? DeepKeysResult<T[key], rest>
      : never
    : never
  : never;

export type DeepQuery<T> = {[key in DeepKeys<T>]?: DeepKeysValue<T, key>};
