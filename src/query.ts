const a = {
  a: 1,
  b: '2',
  c: true,
  d: {e: 1},
  j: {b: {d: {c: 'asdf'}}},
  m: [{ae: 1}, {ae: 2}],
};

type AllowedArrayIndexes = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type DeepKeys<T extends {}> = {
  [key in keyof T]: key extends string
    ? T[key] extends number | string | boolean
      ? `${key}`
      : T[key] extends (infer D)[]
      ?
          | `${key}`
          | `${key}.${DeepKeys<D>}`
          | `${key}.${AllowedArrayIndexes}`
          | `${key}.${AllowedArrayIndexes}.${DeepKeys<D>}`
      : T[key] extends infer D
      ? D extends {}
        ? `${key}` | `${key}.${DeepKeys<D>}`
        : never
      : never
    : never;
}[keyof T];

type DeepKeysType<T, TKey extends string> = TKey extends keyof T
  ? T[TKey]
  : keyof T extends string
  ? TKey extends `${infer key}.${infer rest}`
    ? key extends keyof T
      ? DeepKeysType<T[key], rest>
      : never
    : never
  : T extends (infer Value)[]
  ? TKey extends `${infer key}.${infer rest}`
    ? key extends AllowedArrayIndexes
      ? DeepKeysType<Value, rest>
      : DeepKeysType<Value, TKey>
    : DeepKeysType<Value, TKey>
  : never;

type j = DeepKeys<typeof a>;
let m: j;
m = 'm.1' as const;
m = 'm.ae' as const;
m = 'm.1.ae' as const;
m = 'm.10.ae' as const; //bad
m = 'm.a' as const; //bad
m = 'm.aea' as const; //bad

filter<typeof a>({a: 7, 'd.e': true}); // bad
filter<typeof a>({a: 1, 'd.e': true}); // bad
filter<typeof a>({a: 1, 'd.e': true, 'a.e': true, 'a.f': true}); // bad
filter<typeof a>({a: 7, 'd.e': 23});
filter<typeof a>({a: 7, 'd.e': true}); //bad
filter<typeof a>({a: 7, 'j.b.d': {c: 'asdfd'}});
filter<typeof a>({a: 7, 'j.b.d.c': 'asdfff'});
filter<typeof a>({a: 1, m: []});
filter<typeof a>({a: 1, 'm.aae': 1}); //bad
filter<typeof a>({a: 1, 'm.ae': 1});
filter<typeof a>({a: 1, 'm.2.ae': 1});
const d: DeepKeysType<typeof a, 'm.1.ae'>;

type Query<T> = {[key in DeepKeys<T>]?: DeepKeysType<T, key>};

declare function filter<T>(query: Query<T>): T {};
