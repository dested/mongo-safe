/// <reference path="../mongodb.d.ts"/>
import {assert} from 'conditional-type-checks';
import {DeepKeys, DeepKeysValue, DeepQuery, FilterQuery, UpdateQuery} from 'mongodb';

const a = {
  a: 1,
  b: '2',
  c: true,
  d: {e: 1},
  j: {b: {d: {c: 'asdf'}}},
  m: [{ae: 1}, {ae: 2}],
  n: [1],
};

// m = 'm.1.ae' as const; //bad
// m = 'm.10.ae' as const; //bad
// m = 'm.a' as const; //bad
// m = 'm.aea' as const; //bad

// filter<typeof a>({a: 7, 'd.e': true}); // bad
// filter<typeof a>({a: 1, 'd.e': true}); // bad
// filter<typeof a>({a: 1, 'd.e': true, 'a.e': true, 'a.f': true}); // bad
// filter<typeof a>({a: 7, 'd.e': true}); //bad
// filter<typeof a>({a: 1, 'm.aae': 1}); //bad
// filter<typeof a>({n: 'a'}); //bad
test('simple', () => {
  type j = DeepKeys<typeof a>;
  let m: j;
  m = 'n' as const;
  m = 'n.0' as const;
  m = 'm.0' as const;
  m = 'a' as const;
  m = 'd.e' as const;
  m = 'j.b.d.c' as const;

  filter<typeof a>({a: 7});
  filter<typeof a>({a: 7, 'd.e': 23});
  filter<typeof a>({a: 7, 'j.b.d': {c: 'asdfd'}});
  filter<typeof a>({a: 7, 'j.b.d.c': 'asdfff'});
  filter<typeof a>({a: 1, m: []});
  filter<typeof a>({a: 1, 'm.ae': 1});
  filter<typeof a>({a: 1, 'm.0.ae': 1});
  const testQuery = {aa: 1, n: 1};
  filter<typeof a>(testQuery);
  filter<typeof a>({a: 1, n: 7});
  filter<typeof a>({a: 1, 'n.0': 7});
  const d: DeepKeysValue<typeof a, 'n.0'> = 7;
  const de: DeepKeysValue<typeof a, 'a'> = 7;
  assert(true);
});

test('optionalField', () => {
  type Thing = {a: 1; b: 2};
  type j = DeepKeys<Thing>;

  filter<typeof a>({a: 7});
  filter<typeof a>({a: 7, 'd.e': 23});
  filter<typeof a>({a: 7, 'j.b.d': {c: 'asdfd'}});
  filter<typeof a>({a: 7, 'j.b.d.c': 'asdfff'});
  filter<typeof a>({a: 1, m: []});
  filter<typeof a>({a: 1, 'm.ae': 1});
  filter<typeof a>({a: 1, 'm.0.ae': 1});
  const testQuery = {aa: 1, n: 1};
  filter<typeof a>(testQuery);
  filter<typeof a>({a: 1, n: 7});
  filter<typeof a>({a: 1, 'n.0': 7});
  const d: DeepKeysValue<typeof a, 'n.0'> = 7;
  const de: DeepKeysValue<typeof a, 'a'> = 7;
  assert(true);
});

function filter<T>(query: DeepQuery<T>): T {
  return undefined!;
}

test('simple', () => {
  type Thing = {a: number; b: number};

  query<Thing>({a: 2});
  assert(true);
});
test('optionalField', () => {
  type Thing = {a?: number; b: number};

  query<Thing>({a: 2});
  assert(true);
});

test('deepField', () => {
  type Thing = {a?: number; b: {c: string}};

  query<Thing>({'b.c': 'a'});
  assert(true);
});

test('any', () => {
  type Thing = {a: any; b: number; c: number};

  query<Thing>({b: 12});
  assert(true);
});

test('optional any', () => {
  type Thing = {a?: any; b: number; c: number};

  query<Thing>({b: 45});
  assert(true);
});

test('deepOptionalField', () => {
  type Thing = {a?: number; b: {c?: string}};

  query<Thing>({'b.c': 'a'});
  assert(true);
});

test('updateField', () => {
  type Thing = {a?: number; b: {c?: string}};

  update<Thing>({'b.c': 'a'}, {$set: {'b.c': 'avxc'}});
  assert(true);
});

function query<T>(query: FilterQuery<T>): void {}
function update<T>(query: FilterQuery<T>, update: UpdateQuery<T> | T): void {}
