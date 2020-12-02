import * as stream from 'stream';

const a = {a: 1, b: '2', c: true, d: {e: 1}, j: {b: {d: {c: 'asdf'}}}};

filter<typeof a>({a: 7, 'd.e': true});
filter<typeof a>({a: 1, 'd.e': true});
filter<typeof a>({a: 1, 'd.e': true, 'a.e': true, 'a.f': true});

type DeepKeys<T> = T extends {}
  ? {
      [key in keyof T]: key extends string
        ? T[key] extends number | string | boolean
          ? `${key}`
          : T[key] extends {}
          ? `${key}` | `${key}.${DeepKeys<T[key]>}`
          : never
        : never;
    }[keyof T]
  : never;

type j = DeepKeys<typeof a>;
const m: j = 'd' as const;

type DeepKeysType<T, TKey extends string> = TKey extends keyof T
  ? T[TKey]
  : keyof T extends string
  ? TKey extends `${infer key}.${infer rest}`
    ? key extends keyof T
      ? DeepKeysType<T[key], rest>
      : never
    : never
  : never;

filter<typeof a>({a: 7, 'd.e': 23});
filter<typeof a>({a: 7, 'd.e': true});
filter<typeof a>({a: 7, 'j.b.d': {c: 'asdfd'}});
filter<typeof a>({a: 7, 'j.b.d.c': 'asdfff'});
filter<typeof a>({a: 1});

type Query<T> = {[key in DeepKeys<T>]?: DeepKeysType<T, key>};

function filter<T>(query: Query<T>): void {}
