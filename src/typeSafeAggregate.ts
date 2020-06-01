import {SafeFilterQuery, MongoAltQuery, QuerySelector} from './typeSafeFilter';
import {ObjectID} from 'mongodb';

type RawTypes = number | boolean | string;
type OnlyArrayFieldsKeys<T> = {[key in keyof T]: T[key] extends Array<any> ? key : never}[keyof T];
type OnlyArrayFieldItems<T> = {[key in OnlyArrayFieldsKeys<T>]: T[key]};

type OnlyArrayFields<T> = {[key in keyof T]: T[key] extends Array<infer J> ? key : never}[keyof T];

export type UnArray<T> = T extends Array<infer U> ? U : T;
export type ReplaceKey<T, TKey, TValue> = {[key in keyof T]: key extends TKey ? TValue : T[key]};

type AggregatorSum = {
  $sum: ExpressionStringKey<number> | number;
};
type AggregatorSumResult = number;

type AggregatorMap<TAsKey extends string, TAsValue, TArrayInput> = {
  $map: {
    input: ExpressionStringKey<TArrayInput>;
    as: TAsKey;
    in: ProjectObject<TAsValue>;
  };
};

type AggregatorMapResult<TAsValue> = ProjectObject<TAsValue>[];

type Arrayish<T> = {[key: number]: T} & {arrayish: true};

export type FlattenArray<T> = {
  [key in keyof T]: T[key] extends Array<infer J>
    ? Arrayish<FlattenArray<J>> & FlattenArray<J>
    : T[key] extends ObjectID
    ? T[key]
    : T[key] extends {}
    ? FlattenArray<T[key]>
    : T[key];
};

export type UnwarpArrayish<T> = {
  [key in keyof T]: T[key] extends Arrayish<infer J> ? J[] : T[key];
};

export type InterpretProjectExpression<TValue, TProjectObject> = TValue extends AggregatorSum
  ? AggregatorSumResult
  : TValue extends AggregatorMap<infer TAsKey, infer TAsValue, infer TArrayInput>
  ? AggregatorMapResult<TAsValue>
  : TValue extends ExpressionStringReferenceKey<infer TKeyResult>
  ? TKeyResult
  : TValue extends RawTypes
  ? TValue
  : TValue extends {}
  ? TProjectObject
  : never;

export type ProjectObject<TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<TProject[key], ProjectObject<TProject>> extends never
    ? never
    : TProject[key];
};
export type ProjectObjectJustId<TProject extends {_id: any}> = {
  [key in '_id']: InterpretProjectExpression<TProject[key], ProjectObject<TProject>> extends never
    ? never
    : TProject[key];
};
export type ProjectObjectResult<TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<TProject[key], ProjectObjectResult<TProject[key]>>;
};

export type InterpretAccumulateObjectExpression<TValue, TProjectObject> = TValue extends AggregatorSum
  ? AggregatorSumResult
  : never;

export type AccumulateObject<TAccumulateObject> = {
  [key in keyof TAccumulateObject]: InterpretAccumulateObjectExpression<
    TAccumulateObject[key],
    AccumulateObject<TAccumulateObject>
  > extends never
    ? never
    : TAccumulateObject[key];
};
export type AccumulateObjectResult<TAccumulateObject> = {
  [key in keyof TAccumulateObject]: InterpretAccumulateObjectExpression<
    TAccumulateObject[key],
    AccumulateObjectResult<TAccumulateObject[key]>
  >;
};

export class ExpressionStringKey<TKey> {
  reference: false = false;
  constructor(public value: TKey) {}
}
export class ExpressionStringReferenceKey<TKey> {
  reference: true = true;
  constructor(public value: TKey) {}
}

export class AggregatorLookup<T> {
  protected constructor(protected variableLookupLevel: number) {}

  key<TKey>(query: (t: FlattenArray<T>) => TKey): ExpressionStringKey<TKey> {
    const keyList: PropertyKey[] = [];
    const handler: any = {
      get(target: any, key: PropertyKey): any {
        keyList.push(key);
        return new Proxy({[key]: {}}, handler);
      },
    };
    const proxy = new Proxy({} as FlattenArray<T>, handler);
    query(proxy);
    return keyList.join('.') as any;
  }

  referenceKey<TKey>(query: (t: FlattenArray<T>) => TKey): ExpressionStringReferenceKey<TKey> {
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

  $addFields<T2>(fields: ProjectObject<T2>): Aggregator<T & ProjectObjectResult<T2>> {
    this.currentPipeline = {$addFields: fields};
    return new Aggregator<T & ProjectObjectResult<T2>>(this);
  }

  $addFieldsCallback<T2>(callback: (aggregator: this) => ProjectObject<T2>): Aggregator<T & ProjectObjectResult<T2>> {
    this.currentPipeline = {$addFields: callback(this)};
    return new Aggregator<T & ProjectObjectResult<T2>>(this);
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
  $graphLookup<
    TOther,
    TAs extends string,
    TStartsWith,
    TConnectFromField,
    TConnectToField,
    TDepthField extends string = never
  >(
    callback: (
      aggregator: this,
      aggregatorLookup: AggregatorLookup<TOther>
    ) => {
      collectionName: string;
      startWith: ExpressionStringReferenceKey<TStartsWith>;
      connectFromField: ExpressionStringKey<TConnectFromField>;
      connectToField: ExpressionStringKey<TConnectToField>;
      as: TAs;
      maxDepth?: number;
      depthField?: TDepthField;
    }
  ): Aggregator<T & {[key in TAs]: (TOther & {[key in TDepthField]: number})[]}> {
    this.currentPipeline = {$graphLookup: callback(this, new AggregatorLookup<TOther>(this.variableLookupLevel))};
    return new Aggregator<T & {[key in TAs]: (TOther & {[key in TDepthField]: number})[]}>(this);
  }

  $group<TGroup extends {_id: InterpretProjectExpression<any, ProjectObject<any>>}, TAccumulator>(
    callback: (aggregator: this) => ProjectObject/*JustId*/<TGroup>/* & AccumulateObject<TAccumulator>*/
  ): Aggregator<ProjectObjectResult<TGroup>/* & AccumulateObjectResult<TAccumulator>*/> {
    this.currentPipeline = {$group: callback(this)};
    return new Aggregator<ProjectObjectResult<TGroup>/* & AccumulateObjectResult<TAccumulator>*/>(this);
  }
  /*;
  $group<TIdObject extends ExpressionStringReferenceKey<T, keyof T>>(
    callback: (aggregator: this) => {_id: TIdObject}
  ): Aggregator<{_id: TIdObject}>;
  $group<TIdObject>(callback: (aggregator: this) => any): Aggregator<TIdObject>*/

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
      localField: ExpressionStringKey<TLocalType>;
      foreignField: ExpressionStringKey<TForeignType>;
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
  $project<TProject>(query: ProjectObject<TProject>): Aggregator<ProjectObjectResult<TProject>> {
    this.currentPipeline = {$project: query};
    return new Aggregator<ProjectObjectResult<TProject>>(this);
  }
  $projectCallback<TProject>(
    callback: (aggregator: this) => ProjectObject<TProject>
  ): Aggregator<ProjectObjectResult<TProject>> {
    this.currentPipeline = {$project: callback(this)};
    return new Aggregator<ProjectObjectResult<TProject>>(this);
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

  $unwind<TKey extends keyof T, TKey2 extends keyof T[TKey], TKey3 extends OnlyArrayFields<T[TKey][TKey2]>>(
    key: TKey,
    key2: TKey2,
    key3: TKey3
  ): Aggregator<
    ReplaceKey<T, TKey, ReplaceKey<T[TKey], TKey2, ReplaceKey<T[TKey][TKey2], TKey3, UnArray<T[TKey][TKey2][TKey3]>>>>
  >;

  $unwind<TKey, TKey2 = undefined, TKey3 = undefined>(key: TKey, key2?: TKey2, key3?: TKey3): any {
    let result = '$';
    result += key;
    if (key2) {
      result += `.${key2}`;
    }
    if (key3) {
      result += `.${key3}`;
    }
    this.currentPipeline = {$unwind: result};
    return new Aggregator<T>(this);
  }

  result(): Promise<UnwarpArrayish<T>> {
    return null!;
  }

  static start<T>(): Aggregator<T> {
    return new Aggregator<T>();
  }

  operators = {
    $map: <TAsKey extends string, TAsValue, TArrayInput>(
      input: ExpressionStringKey<TArrayInput>,
      as: TAsKey,
      inArg: (agg: AggregatorLookup<{[key in TAsKey]: TArrayInput}>) => ProjectObject<TAsValue>
    ): {
      $map: {
        input: typeof input;
        as: typeof as;
        in: ProjectObjectResult<TAsValue>;
      };
    } => {
      return {
        $map: {
          input,
          as,
          in: inArg(
            new AggregatorLookup<{[key in TAsKey]: TArrayInput}>(this.variableLookupLevel + 1)
          ) as ProjectObjectResult<TAsValue>,
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
