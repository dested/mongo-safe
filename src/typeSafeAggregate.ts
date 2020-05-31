import {SafeFilterQuery, MongoAltQuery, QuerySelector} from './typeSafeFilter';
import {ObjectID} from 'mongodb';

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

type Arrayish<T> = {[key: number]: T};

export type FlattenArray<T> = {
  [key in keyof T]: T[key] extends Array<infer J>
    ? Arrayish<FlattenArray<J>> & FlattenArray<J>
    : T[key] extends ObjectID
    ? T[key]
    : T[key] extends {}
    ? FlattenArray<T[key]>
    : T[key];
};

export type ProjectExpression<T, TValue> = TValue extends AggregatorSum<T>
  ? AggregatorSumResult<T>
  : TValue extends AggregatorMap<T, infer TAsKey, infer TAsValue, infer TArrayInput>
  ? AggregatorMapResult<TAsValue>
  : TValue extends ExpressionStringReferenceKey<T, infer TKeyResult>
  ? TKeyResult
  : TValue extends RawTypes
  ? TValue
  : never;

export class ExpressionStringKey<T, TKey> {
  reference: false = false;
  constructor(public value: TKey) {}
}
export class ExpressionStringReferenceKey<T, TKey> {
  reference: true = true;
  constructor(public value: TKey) {}
}

export class AggregatorLookup<T> {
  protected constructor(protected variableLookupLevel: number) {}

  key<TKey>(query: (t: FlattenArray<T>) => TKey): ExpressionStringKey<T, TKey> {
    const keyList: PropertyKey[] = [];
    const handler: any = {
      get(target: any, key: PropertyKey, receiver: any): any {
        keyList.push(key);
        return new Proxy({[key]: {}}, handler);
      },
    };
    const proxy = new Proxy({} as FlattenArray<T>, handler);
    query(proxy);
    return keyList.join('.') as any;
  }

  referenceKey<TKey>(query: (t: FlattenArray<T>) => TKey): ExpressionStringReferenceKey<T, TKey> {
    const keyList: PropertyKey[] = [];
    const handler: any = {
      get(target: any, key: PropertyKey, receiver: any): any {
        keyList.push(key);
        return new Proxy({[key]: {}}, handler);
      },
    };
    const proxy = new Proxy({} as FlattenArray<T>, handler);
    query(proxy);

    return (this.lookupLevel() + keyList.join('.')) as any;
  }

  private lookupLevel() {
    let lookup = '';
    for (let i = 0; i < this.variableLookupLevel; i++) {
      lookup += '$';
    }
    return lookup;
  }

  keyFilter<T2>(
    query: (t: FlattenArray<T>) => T2,
    value: MongoAltQuery<T2> | QuerySelector<MongoAltQuery<T2>>
  ): SafeFilterQuery<T> {
    const key = (this.key(query) as unknown) as string;
    return {[key]: value} as any;
  }

  keyLookup<TKey>(query: (t: FlattenArray<T>) => TKey): keyof T {
    return (this.key(query) as unknown) as keyof T;
  }
}

export class Aggregator<T> extends AggregatorLookup<T> {
  currentPipeline?: {};

  private constructor(private parent?: Aggregator<any>) {
    super(parent?.variableLookupLevel ?? 1);
    this.variableLookupLevel = parent?.variableLookupLevel ?? 1;
  }

  $addFields<T2>(
    fields: {[field in keyof T2]: ProjectExpression<T, T2[field]> extends never ? never : T2[field]}
  ): Aggregator<T & {[field in keyof T2]: ProjectExpression<T, T2[field]>}> {
    return null!;
  }
  $addFieldsCallback<T2>(
    callback: (
      aggregator: this
    ) => {[field in keyof T2]: ProjectExpression<T, T2[field]> extends never ? never : T2[field]}
  ): Aggregator<T & {[field in keyof T2]: ProjectExpression<T, T2[field]>}> {
    return null!;
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
    return null!;
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
  $limit(limit: number): Aggregator<T> {
    this.currentPipeline = {$limit: limit};
    return new Aggregator<T>(this);
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
      aggregatorLookup: AggregatorLookup<TLookupTable>
    ) => {
      from: string;
      localField: ExpressionStringKey<T, TLocalType>;
      foreignField: ExpressionStringKey<TLookupTable, TForeignType>;
      as: TAs;
    }
  ): Aggregator<T & {[key in TAs]: TLookupTable[]}> {
    const result = callback(this, new AggregatorLookup<TLookupTable>(this.variableLookupLevel));
    this.currentPipeline = {
      $lookup: {
        from: result.from,
        localField: result.localField,
        foreignField: result.foreignField,
        as: result.as,
      },
    };
    return new Aggregator<T & {[key in TAs]: TLookupTable[]}>(this);
  }

  $match(query: SafeFilterQuery<T>): Aggregator<T> {
    this.currentPipeline = {$match: query};
    return new Aggregator<T>(this);
  }

  $matchCallback(callback: (aggregator: this) => SafeFilterQuery<T>): Aggregator<T> {
    this.currentPipeline = {$match: callback(this)};
    return new Aggregator<T>(this);
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
    this.currentPipeline = {$project: query};
    return new Aggregator<{[field in keyof TProject]: ProjectExpression<TProject, TProject[field]>}>(this);
  }
  $projectCallback<TProject>(
    callback: (
      aggregator: this
    ) => {
      [field in keyof TProject]: ProjectExpression<TProject, TProject[field]> extends never ? never : TProject[field];
    }
  ): Aggregator<{[field in keyof TProject]: ProjectExpression<TProject, TProject[field]>}> {
    this.currentPipeline = {$project: callback(this)};
    return new Aggregator<{[field in keyof TProject]: ProjectExpression<TProject, TProject[field]>}>(this);
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
  $skip(skip: number): Aggregator<T> {
    this.currentPipeline = {$skip: skip};
    return new Aggregator<T>(this);
  }
  $sort(sorts: Distribute<T, keyof T, 1 | -1>): Aggregator<T> {
    this.currentPipeline = {$sort: sorts};
    return new Aggregator<T>(this);
  }
  $sortCallback(callback: (aggregator: this) => Distribute<T, keyof T, 1 | -1>): Aggregator<T> {
    this.currentPipeline = {$sort: callback(this)};
    return new Aggregator<T>(this);
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

  $unwind<TKey extends OnlyArrayFields<T>, TKey2 extends OnlyArrayFields<T> | undefined = undefined>(
    key: TKey,
    key2?: OnlyArrayFields<TKey>
  ): any {
    return null!;
  }

  result(): Promise<T> {
    return null!;
  }

  static start<T>(): Aggregator<T> {
    return new Aggregator<T>();
  }

  operators = {
    $map: <TAsKey extends string, TAsValue, TArrayInput>(
      input: ExpressionStringKey<T, TArrayInput>,
      as: TAsKey,
      inArg: (
        agg: AggregatorLookup<{[key in TAsKey]: TArrayInput}>
      ) => {
        [field in keyof TAsValue]: ProjectExpression<TAsValue, TAsValue[field]> extends never ? never : TAsValue[field];
      }
    ): {
      $map: {
        input: typeof input;
        as: typeof as;
        in: ReturnType<typeof inArg>;
      };
    } => {
      return {
        $map: {
          input,
          as,
          in: inArg(new AggregatorLookup<{[key in TAsKey]: TArrayInput}>(this.variableLookupLevel + 1)),
        },
      };
    },
  };

  query() {
    const pipelines = [];
    if (this.currentPipeline) {
      pipelines.push(this.currentPipeline);
    }
    let parent = this.parent;
    while (parent) {
      pipelines.push(parent.currentPipeline);
      parent = parent.parent;
    }
    return pipelines.reverse();
  }
}

type Distribute<T, TKey extends keyof T = keyof T, TOverwrite = T[TKey]> = T extends unknown
  ? {[key in TKey]?: TOverwrite}
  : never;
