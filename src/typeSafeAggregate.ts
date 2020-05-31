import {FilterQuery2} from './typeSafeFilter';

type RawTypes = number | boolean | string;
type OnlyArrayFields<T> = {[key in keyof T]: T[key] extends Array<infer J> ? key : never}[keyof T];
type UnArray<T> = T extends Array<infer U> ? U : T;
type ReplaceKey<T, TKey, TValue> = {[key in keyof T]: key extends TKey ? TValue : T[key]};

type AggregatorSum<T> = {
  $sum: ExpressionStringKey<T, number> | number;
};
type AggregatorSumResult<T> = number;

type AggregatorMap<T, TAsKey extends string, TAsValue, TArrayInput> = {
  $map: {
    input: ExpressionStringKey<T, TArrayInput>;
    as: TAsKey;
    in: {
      [field in keyof TAsValue]: ProjectExpression<TAsValue, TAsValue[field]> extends never ? never : TAsValue[field];
    };
  };
};

type AggregatorMapResult<TAsValue> = {[key in keyof TAsValue]: ProjectExpression<TAsValue, TAsValue[key]>}[];

type FlattenArray<T> = {
  [key in keyof T]: T[key] extends Array<infer J> ? Array<FlattenArray<J>> & FlattenArray<J> : FlattenArray<T[key]>;
};

export type ProjectExpression<T, TValue> = TValue extends AggregatorSum<T>
  ? AggregatorSumResult<T>
  : TValue extends AggregatorMap<T, infer TAsKey, infer TAsValue, infer TArrayInput>
  ? AggregatorMapResult<TAsValue>
  : TValue extends ExpressionStringKey<T, infer TKeyResult>
  ? TKeyResult
  : TValue extends RawTypes
  ? TValue
  : never;

export class ExpressionStringKey<T, TKey> {
  constructor(public value: TKey) {}
}

export class Aggregator<T> {
  constructor() {}

  $addFields<T2>(
    fields: {[field in keyof T2]: ProjectExpression<T, T2[field]> extends never ? never : T2[field]}
  ): Aggregator<T & {[field in keyof T2]: ProjectExpression<T, T2[field]>}> {
    return null;
  }
  $addFieldsCallback<T2>(
    callback: (
      aggregator: this
    ) => {[field in keyof T2]: ProjectExpression<T, T2[field]> extends never ? never : T2[field]}
  ): Aggregator<T & {[field in keyof T2]: ProjectExpression<T, T2[field]>}> {
    return null;
  }

  $bucket(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $bucketAuto(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $collStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $count(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $currentOp(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $facet(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $geoNear(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $graphLookup<TOther>(
    collectionName: string,
    startWith: keyof TOther,
    connectFromField: keyof T,
    connectToField: keyof T,
    as: string
  ): Aggregator<T> {
    // todo not done
    return null;
    /*{
      from: 'partner',
        startWith: '$parentPartnerId',
      connectFromField: 'parentPartnerId',
      connectToField: '_id',
      as: 'parents',
    }*/
  }
  $group(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $indexStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $limit(skip: number): this {
    return null;
  }
  $listLocalSessions(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $listSessions(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $lookupCallback<TLookupTable, TLocalType, TForeignType extends TLocalType, TAs extends string>(
    callback: (
      aggregator: this,
      aggregatorLookup: Aggregator<TLookupTable>
    ) => {
      from: string;
      localField: ExpressionStringKey<T, TLocalType>;
      foreignField: ExpressionStringKey<TLookupTable, TForeignType>;
      as: TAs;
    }
  ): Aggregator<T & {[key in TAs]: TLookupTable[]}> {
    return null;
  }
  $match(options: FilterQuery2<T>): Aggregator<T> {
    return null;
  }

  $matchCallback(callback: (aggregator: this) => FilterQuery2<T>): Aggregator<T> {
    return null;
  }
  $merge(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $out(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $planCacheStats(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $project<TProject>(
    query: {
      [field in keyof TProject]: ProjectExpression<TProject, TProject[field]> extends never ? never : TProject[field];
    }
  ): Aggregator<{[field in keyof TProject]: ProjectExpression<TProject, TProject[field]>}> {
    return null;
  }
  $projectCallback<TProject>(
    callback: (
      aggregator: this
    ) => {
      [field in keyof TProject]: ProjectExpression<TProject, TProject[field]> extends never ? never : TProject[field];
    }
  ): Aggregator<{[field in keyof TProject]: ProjectExpression<TProject, TProject[field]>}> {
    return null;
  }
  $redact(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $replaceRoot(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $replaceWith(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $sample(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $set(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $skip(skip: number): this {
    return null;
  }
  $sort(sorts: Distribute<T, keyof T, 1 | -1>): this {
    return null;
  }
  $sortByCount(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $unset(): Aggregator<T> {
    throw new Error('Not Implemented');
  }
  $unwind<TKey extends OnlyArrayFields<T>>(key: TKey): Aggregator<ReplaceKey<T, TKey, UnArray<T[TKey]>>>;
  $unwind<TKey extends keyof T, TKey2 extends OnlyArrayFields<T[TKey]>>(
    key: TKey,
    key2: TKey2
  ): Aggregator<ReplaceKey<T, TKey, ReplaceKey<T[TKey], TKey2, UnArray<T[TKey][TKey2]>>>>;

  $unwind<TKey extends OnlyArrayFields<T>, TKey2 extends OnlyArrayFields<T> = null>(
    key: TKey,
    key2?: OnlyArrayFields<TKey>
  ): any {
    return null;
  }

  result(): Promise<T> {
    return null;
  }
  key<TKey>(query: (t: FlattenArray<T>) => TKey): ExpressionStringKey<T, TKey> {
    // proxy
    return null;
  }

  referenceKey<TKey>(query: (t: FlattenArray<T>) => TKey): ExpressionStringKey<T, TKey> {
    // proxy
    // prefix with $ * agg.deep
    // return new ExpressionStringKey<T, TKey>()
    return null;
  }

  keyLookup<TKey>(query: (t: FlattenArray<T>) => TKey): keyof T {
    return null;
  }

  static start<T>(): Aggregator<T> {
    return new Aggregator<T>();
  }

  operators = {
    $map<TAsKey extends string, TAsValue, TArrayInput>(
      input: ExpressionStringKey<T, TArrayInput>,
      as: TAsKey,
      inArg: (
        agg: Aggregator<{[key in TAsKey]: TArrayInput} & T>
      ) => {
        [field in keyof TAsValue]: ProjectExpression<TAsValue, TAsValue[field]> extends never ? never : TAsValue[field];
      }
    ): {
      $map: {
        input: typeof input;
        as: typeof as;
        in: ReturnType<typeof inArg>;
      };
    } {
      // inArg(new Aggregator<{[key in TAsKey(extends string)]: TArrayInput}&T>()) deep level = 2
      return null;
    },
  };

  query() {
    return {};
  }
}

type Distribute<T, TKey extends keyof T = keyof T, TOverwrite = T[TKey]> = T extends unknown
  ? {[key in TKey]?: TOverwrite}
  : never;
