import {SafeFilterQuery, MongoAltQuery, QuerySelector} from './typeSafeFilter';
import {ObjectID} from 'mongodb';

type RawTypes = number | boolean | string | ObjectID;
type OnlyArrayFieldsKeys<T> = {[key in keyof T]: T[key] extends Array<any> ? key : never}[keyof T];

type OnlyArrayFields<T> = {[key in keyof T]: T[key] extends Array<infer J> ? key : never}[keyof T];

export type UnArray<T> = T extends Array<infer U> ? U : T;
export type ReplaceKey<T, TKey, TValue> = {[key in keyof T]: key extends TKey ? TValue : T[key]};
type DeReferenceExpression<TRef> = TRef extends ExpressionStringReferenceKey<infer TValue>
  ? TValue
  : TRef extends {}
  ? {[key in keyof TRef]: DeReferenceExpression<TRef[key]>}
  : TRef;

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

export type UnwarpArrayish<T> = T extends Arrayish<infer J> ? J[] : T;

export type UnwarpArrayishObject<T> = {
  [key in keyof T]: T[key] extends Arrayish<infer J>
    ? UnwarpArrayishObject<J>[]
    : T[key] extends {}
    ? UnwarpArrayishObject<T[key]>
    : T[key];
};

type AllOperators =
  | '$dateToString'
  | '$cond'
  | '$eq'
  | '$map'
  | '$sum'
  | '$abs'
  | '$acos'
  | '$acosh'
  | '$add'
  | '$addToSet'
  | '$allElementsTrue'
  | '$and'
  | '$anyElementTrue'
  | '$arrayElemAt'
  | '$arrayToObject'
  | '$asin'
  | '$asinh'
  | '$atan'
  | '$atan2'
  | '$atanh'
  | '$avg'
  | '$ceil'
  | '$cmp'
  | '$concat'
  | '$concatArrays'
  | '$convert'
  | '$cos'
  | '$dateFromParts'
  | '$dateToParts'
  | '$dateFromString'
  | '$dayOfMonth'
  | '$dayOfWeek'
  | '$dayOfYear'
  | '$degreesToRadians'
  | '$divide'
  | '$exp'
  | '$filter'
  | '$first'
  | '$floor'
  | '$gt'
  | '$gte'
  | '$hour'
  | '$ifNull'
  | '$in'
  | '$indexOfArray'
  | '$indexOfBytes'
  | '$indexOfCP'
  | '$isArray'
  | '$isoDayOfWeek'
  | '$isoWeek'
  | '$isoWeekYear'
  | '$last'
  | '$let'
  | '$literal'
  | '$ln'
  | '$log'
  | '$log10'
  | '$lt'
  | '$lte'
  | '$ltrim'
  | '$max'
  | '$mergeObjects'
  | '$meta'
  | '$min'
  | '$millisecond'
  | '$minute'
  | '$mod'
  | '$month'
  | '$multiply'
  | '$ne'
  | '$not'
  | '$objectToArray'
  | '$or'
  | '$pow'
  | '$push'
  | '$radiansToDegrees'
  | '$range'
  | '$reduce'
  | '$regexFind'
  | '$regexFindAll'
  | '$regexMatch'
  | '$reverseArray'
  | '$round'
  | '$rtrim'
  | '$second'
  | '$setDifference'
  | '$setEquals'
  | '$setIntersection'
  | '$setIsSubset'
  | '$setUnion'
  | '$size'
  | '$sin'
  | '$slice'
  | '$split'
  | '$sqrt'
  | '$stdDevPop'
  | '$stdDevSamp'
  | '$strcasecmp'
  | '$strLenBytes'
  | '$strLenCP'
  | '$substr'
  | '$substrBytes'
  | '$substrCP'
  | '$subtract'
  | '$switch'
  | '$tan'
  | '$toBool'
  | '$toDate'
  | '$toDecimal'
  | '$toDouble'
  | '$toInt'
  | '$toLong'
  | '$toObjectId'
  | '$toString'
  | '$toLower'
  | '$toUpper'
  | '$trim'
  | '$trunc'
  | '$type'
  | '$week'
  | '$year'
  | '$zip';

type VariableOfType<T> = ExpressionStringReferenceKey<T> | ExpressionStringReferenceKey<FlattenArray<T>> | T;

export type InterpretProjectExpression<TValue, TProjectObject> = /*
 */ TValue extends ExpressionStringReferenceKey<infer J>
  ? ExpressionStringReferenceKey<J>
  : TValue extends RawTypes
  ? TValue
  : keyof TValue extends AllOperators
  ? {
      $dateToString?: {
        date: VariableOfType<Date>;
        format?: string;
      };
      $sum?: VariableOfType<number>;
      $cond?: LookupKey<TValue, '$cond'> extends {
        if: InterpretProjectExpression<infer TIf, TProjectObject>;
        then: InterpretProjectExpression<infer TThen, TProjectObject>;
        else: InterpretProjectExpression<infer TElse, TProjectObject>;
      }
        ? {
            if: InterpretProjectExpression<TIf, TProjectObject>;
            then: InterpretProjectExpression<TThen, TProjectObject>;
            else: InterpretProjectExpression<TElse, TProjectObject>;
          }
        : never;

      $eq?: LookupKey<TValue, '$eq'> extends [
        InterpretProjectExpression<infer TLeft, TProjectObject>,
        InterpretProjectExpression<infer TRight, TProjectObject>
      ]
        ? [InterpretProjectExpression<TLeft, TProjectObject>, InterpretProjectExpression<TRight, TProjectObject>]
        : never;
      $map?: LookupKey<TValue, '$map'> extends {
        input: ExpressionStringKey<infer Tinput>;
        as: infer Tas;
        in: ProjectObject<infer Tin>;
      }
        ? {input: ExpressionStringKey<Tinput>; as: Tas; in: ProjectObject<Tin>}
        : never;

      $abs?: VariableOfType<number>;
      $acos?: number;
      $acosh?: number;
      $add?: number;
      $addToSet?: number;
      $allElementsTrue?: number;
      $and?: number;
      $anyElementTrue?: number;
      $arrayElemAt?: number;
      $arrayToObject?: number;
      $asin?: number;
      $asinh?: number;
      $atan?: number;
      $atan2?: number;
      $atanh?: number;
      $avg?: number;
      $ceil?: number;
      $cmp?: number;
      $concat?: number;
      $concatArrays?: number;
      $convert?: number;
      $cos?: number;
      $dateFromParts?: number;
      $dateToParts?: number;
      $dateFromString?: number;
      $dayOfMonth?: number;
      $dayOfWeek?: number;
      $dayOfYear?: number;
      $degreesToRadians?: number;
      $divide?: number;
      $exp?: number;
      $filter?: number;
      $first?: number;
      $floor?: number;
      $gt?: number;
      $gte?: number;
      $hour?: number;
      $ifNull?: number;
      $in?: number;
      $indexOfArray?: number;
      $indexOfBytes?: number;
      $indexOfCP?: number;
      $isArray?: number;
      $isoDayOfWeek?: number;
      $isoWeek?: number;
      $isoWeekYear?: number;
      $last?: number;
      $let?: number;
      $literal?: number;
      $ln?: number;
      $log?: number;
      $log10?: number;
      $lt?: number;
      $lte?: number;
      $ltrim?: number;
      $max?: number;
      $mergeObjects?: number;
      $meta?: number;
      $min?: number;
      $millisecond?: number;
      $minute?: number;
      $mod?: number;
      $month?: number;
      $multiply?: number;
      $ne?: number;
      $not?: number;
      $objectToArray?: number;
      $or?: number;
      $pow?: number;
      $push?: number;
      $radiansToDegrees?: number;
      $range?: number;
      $reduce?: number;
      $regexFind?: number;
      $regexFindAll?: number;
      $regexMatch?: number;
      $reverseArray?: number;
      $round?: number;
      $rtrim?: number;
      $second?: number;
      $setDifference?: number;
      $setEquals?: number;
      $setIntersection?: number;
      $setIsSubset?: number;
      $setUnion?: number;
      $size?: number;
      $sin?: number;
      $slice?: number;
      $split?: number;
      $sqrt?: number;
      $stdDevPop?: number;
      $stdDevSamp?: number;
      $strcasecmp?: number;
      $strLenBytes?: number;
      $strLenCP?: number;
      $substr?: number;
      $substrBytes?: number;
      $substrCP?: number;
      $subtract?: number;
      $switch?: number;
      $tan?: number;
      $toBool?: number;
      $toDate?: number;
      $toDecimal?: number;
      $toDouble?: number;
      $toInt?: number;
      $toLong?: number;
      $toObjectId?: number;
      $toString?: number;
      $toLower?: number;
      $toUpper?: number;
      $trim?: number;
      $trunc?: number;
      $type?: number;
      $week?: number;
      $year?: number;
      $zip?: number;
    }
  : TValue extends {}
  ? TProjectObject
  : never;

export type ProjectObject<TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<TProject[key], ProjectObject<TProject[key]>>;
};

type AllAccumulateOperators = '$sum';

export type ProjectObjectResult<TProject> = {
  [key in keyof TProject]: TProject[key] extends ExpressionStringReferenceKey<infer J>
    ? J
    : TProject[key] extends RawTypes
    ? TProject[key]
    : keyof TProject[key] extends AllOperators
    ? {
        $dateToString: string;
        $cond:
          | UnwarpArrayish<DeReferenceExpression<LookupKey<LookupKey<TProject[key], '$cond'>, 'then'>>>
          | UnwarpArrayish<DeReferenceExpression<LookupKey<LookupKey<TProject[key], '$cond'>, 'else'>>>;
        $eq: boolean;
        $map: UnwarpArrayish<DeReferenceExpression<LookupKey<LookupKey<TProject[key], '$map'>, 'in'>>>[];
        $sum: number;

        $abs: number;
        $acos: number;
        $acosh: number;
        $add: number;
        $addToSet: number;
        $allElementsTrue: number;
        $and: number;
        $anyElementTrue: number;
        $arrayElemAt: number;
        $arrayToObject: number;
        $asin: number;
        $asinh: number;
        $atan: number;
        $atan2: number;
        $atanh: number;
        $avg: number;
        $ceil: number;
        $cmp: number;
        $concat: number;
        $concatArrays: number;
        $convert: number;
        $cos: number;
        $dateFromParts: number;
        $dateToParts: number;
        $dateFromString: number;
        $dayOfMonth: number;
        $dayOfWeek: number;
        $dayOfYear: number;
        $degreesToRadians: number;
        $divide: number;
        $exp: number;
        $filter: number;
        $first: number;
        $floor: number;
        $gt: number;
        $gte: number;
        $hour: number;
        $ifNull: number;
        $in: number;
        $indexOfArray: number;
        $indexOfBytes: number;
        $indexOfCP: number;
        $isArray: number;
        $isoDayOfWeek: number;
        $isoWeek: number;
        $isoWeekYear: number;
        $last: number;
        $let: number;
        $literal: number;
        $ln: number;
        $log: number;
        $log10: number;
        $lt: number;
        $lte: number;
        $ltrim: number;
        $max: number;
        $mergeObjects: number;
        $meta: number;
        $min: number;
        $millisecond: number;
        $minute: number;
        $mod: number;
        $month: number;
        $multiply: number;
        $ne: number;
        $not: number;
        $objectToArray: number;
        $or: number;
        $pow: number;
        $push: number;
        $radiansToDegrees: number;
        $range: number;
        $reduce: number;
        $regexFind: number;
        $regexFindAll: number;
        $regexMatch: number;
        $reverseArray: number;
        $round: number;
        $rtrim: number;
        $second: number;
        $setDifference: number;
        $setEquals: number;
        $setIntersection: number;
        $setIsSubset: number;
        $setUnion: number;
        $size: number;
        $sin: number;
        $slice: number;
        $split: number;
        $sqrt: number;
        $stdDevPop: number;
        $stdDevSamp: number;
        $strcasecmp: number;
        $strLenBytes: number;
        $strLenCP: number;
        $substr: number;
        $substrBytes: number;
        $substrCP: number;
        $subtract: number;
        $switch: number;
        $tan: number;
        $toBool: number;
        $toDate: number;
        $toDecimal: number;
        $toDouble: number;
        $toInt: number;
        $toLong: number;
        $toObjectId: number;
        $toString: number;
        $toLower: number;
        $toUpper: number;
        $trim: number;
        $trunc: number;
        $type: number;
        $week: number;
        $year: number;
        $zip: number;
      }[keyof TProject[key]]
    : TProject[key] extends {}
    ? ProjectObjectResult<TProject[key]>
    : never;
};

export type LookupKey<T, TKey> = {[key in keyof T]: key extends TKey ? T[key] : never}[keyof T];

export type InterpretAccumulateObjectExpression<TValue, TProjectObject> = keyof TValue extends AllAccumulateOperators
  ? {
      $sum: number;
    }[keyof TValue]
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
  operators = {
    $map: <TAsKey extends string, TAsValue, TArrayInput>(
      input: ExpressionStringKey<TArrayInput>,
      as: TAsKey,
      inArg: (agg: AggregatorLookup<{[key in TAsKey]: TArrayInput} & T>) => ProjectObject<TAsValue>
    ): {
      $map: {
        input: typeof input;
        as: typeof as;
        in: ProjectObject<TAsValue>;
      };
    } => {
      return {
        $map: {
          input,
          as,
          in: (inArg(
            new AggregatorLookup<{[key in TAsKey]: TArrayInput} & T>(this.variableLookupLevel + 1)
          ) as unknown) as ProjectObject<TAsValue>,
        },
      };
    },
  };
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

  $addFieldsCallback<T2>(
    callback: (aggregator: AggregatorLookup<T>) => ProjectObject<T2>
  ): Aggregator<T & ProjectObjectResult<T2>> {
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
  $count<TKey extends string>(key: TKey): Aggregator<{[key in TKey]: number}> {
    this.currentPipeline = {$count: key};
    return new Aggregator<{[key in TKey]: number}>(this);
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
      aggregator: AggregatorLookup<T>,
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
  ): Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}> {
    this.currentPipeline = {$graphLookup: callback(this, new AggregatorLookup<TOther>(this.variableLookupLevel))};
    return new Aggregator<T & {[key in TAs]: (TOther & {[oKey in TDepthField]: number})[]}>(this);
  }

  $group<TGroupId extends InterpretProjectExpression<any, ProjectObject<any>>, TAccumulator extends {}>(
    callback: (aggregator: AggregatorLookup<T>) => [TGroupId] | [TGroupId, AccumulateObject<TAccumulator>]
  ): Aggregator<ProjectObjectResult<{_id: TGroupId}> & AccumulateObjectResult<TAccumulator>> {
    const result = callback(this);
    this.currentPipeline = {$group: {_id: result[0], ...result[1]}};
    return new Aggregator<any /* todo ProjectObjectResult<{_id: TGroupId}> & AccumulateObjectResult<TAccumulator>*/>(
      this
    );
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
      aggregator: AggregatorLookup<T>,
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

  $matchCallback(callback: (aggregator: AggregatorLookup<T>) => SafeFilterQuery<T>): Aggregator<T> {
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
    callback: (aggregator: AggregatorLookup<T>) => ProjectObject<TProject>
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
  $sortCallback(callback: (aggregator: AggregatorLookup<T>) => Distribute<T, keyof T, 1 | -1>): Aggregator<T> {
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

  async result(/*db: DocumentManager<any>*/): Promise<UnwarpArrayishObject<T>[]> {
    // return db.aggregate<UnwarpArrayish<T>>(this.query());
    return [];
  }

  static start<T>(): Aggregator<T> {
    return new Aggregator<T>();
  }

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
