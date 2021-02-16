import {
  DeepKeys,
  DeepKeysResult,
  NumericTypes,
  Collection,
  ObjectID,
  ObjectId,
  DeepKeyArray,
  AggregationCursor,
} from 'mongodb';
import {FilterQueryMatch} from './filterQueryMatch';
import {Decimal128} from 'bson';

type KEY = string | number | Symbol;
type RawTypes = number | boolean | string | Date | ObjectID | NumericTypes;
type NonObjectValues = number | boolean | string | Date | ObjectID | NumericTypes;
type Impossible = never;

type NumberTypeOrNever<TValue> = TValue extends NumericTypes ? ([TValue] extends [number] ? number : TValue) : never;
type DeepExcludeNever<T> = T extends NonObjectValues
  ? T
  : T extends Array<infer TArr>
  ? Array<DeepExcludeNever<T[number]>>
  : {
      [key in keyof T as T[key] extends never ? never : key]: DeepExcludeNever<T[key]>;
    };

export type ExcludeNever<T> = {
  [key in keyof T as T[key] extends never ? never : key]: T[key];
};

export type UnArray<T> = T extends Array<infer U> ? U : T;
export type DeepUnArray<T> = T extends Array<infer U> ? DeepUnArray<U> : T;
type ReplaceKey<T, TKey, TValue> = {[key in keyof T]: key extends TKey ? TValue : T[key]};

type DeepReplaceKey<T, TKeys extends Array<any>, TValue> = TKeys extends [infer TCurrentKey, ...infer TRestKeys]
  ? TRestKeys extends []
    ? ReplaceKey<T, TKeys[0], TValue>
    : {
        [key in keyof T]: key extends TCurrentKey ? DeepReplaceKey<T[key], TRestKeys, TValue> : T[key];
      }
  : Impossible;

export type DeReferenceExpression<TRootValue, TRef> = TRef extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TRef extends {}
  ? {[key in keyof TRef]: DeReferenceExpression<TRootValue, TRef[key]>}
  : TRef;

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

type ProjectOperatorHelperCondition<TRootValue, TExpression, TKey extends KEY> = LookupKey<TExpression, TKey> extends [
  InterpretProjectExpression<TRootValue, infer TLeft>,
  InterpretProjectExpression<TRootValue, infer TRight>
]
  ? [InterpretProjectExpression<TRootValue, TLeft>, InterpretProjectExpression<TRootValue, TRight>]
  : never;

type ProjectOperatorHelperArray<TRootValue, TExpression, TKey extends KEY> =
  //without this infer the array lookup doesnt work right
  LookupKey<TExpression, TKey> extends Array<InterpretProjectExpression<TRootValue, infer TArr>>
    ? InterpretProjectExpression<TRootValue, TArr>[]
    : never;

type ProjectOperatorHelperDate<TRootValue, TExpression, TKey extends KEY> =
  | {
      date: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, TKey, 'date'>;
      timezone?: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, TKey, 'timezone'>;
    }
  | ProjectOperatorHelperExpression<TRootValue, TExpression, TKey>;

type ProjectOperatorHelperArrayOrExpression<TRootValue, TExpression, TKey extends KEY> =
  | ProjectOperatorHelperArray<TRootValue, TExpression, TKey>
  | ProjectOperatorHelperExpression<TRootValue, TExpression, TKey>;

type ProjectOperatorHelperExpression<TRootValue, TExpression, TKey extends KEY> = InterpretProjectExpression<
  TRootValue,
  LookupKey<TExpression, TKey>
>;
type ProjectOperatorHelperExpressionInner<
  TRootValue,
  TExpression,
  TKey1 extends KEY,
  TKey2 extends KEY
> = InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TExpression, TKey1>, TKey2>>;

type ProjectOperatorHelperExpressionObject<
  TRootValue,
  TExpression,
  TKey extends KEY,
  TObj extends Record<string, 1 | 0>
> = {
  [key in keyof TObj as TObj[key] extends 1 ? key : never]: ProjectOperatorHelperExpressionInner<
    TRootValue,
    TExpression,
    TKey,
    key
  >;
} &
  {
    [key in keyof TObj as TObj[key] extends 0 ? key : never]?: ProjectOperatorHelperExpressionInner<
      TRootValue,
      TExpression,
      TKey,
      key
    >;
  };

type ProjectOperatorHelperOneTuple<TRootValue, TExpression, TKey extends KEY> = [
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>
];
type ProjectOperatorHelperTwoTuple<TRootValue, TExpression, TKey extends KEY> = [
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>,
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 1>>
];
type ProjectOperatorHelperThreeTuple<TRootValue, TExpression, TKey extends KEY> = [
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>,
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 1>>,
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 2>>
];
type ProjectOperatorHelperFourTuple<TRootValue, TExpression, TKey extends KEY> = [
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 0>>,
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 1>>,
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 2>>,
  InterpretProjectExpression<TRootValue, LookupArray<LookupKey<TExpression, TKey>, 3>>
];

export type InterpretProjectOperator<TRootValue, TExpression> =
  | {$abs: ProjectOperatorHelperExpression<TRootValue, TExpression, '$abs'>}
  | {$acos: ProjectOperatorHelperExpression<TRootValue, TExpression, '$acos'>}
  | {$acosh: ProjectOperatorHelperExpression<TRootValue, TExpression, '$acosh'>}
  | {$add: ProjectOperatorHelperArray<TRootValue, TExpression, '$add'>}
  | {$addToSet: ProjectOperatorHelperExpression<TRootValue, TExpression, '$addToSet'>}
  | {$allElementsTrue: ProjectOperatorHelperArray<TRootValue, TExpression, '$allElementsTrue'>}
  | {$and: ProjectOperatorHelperArray<TRootValue, TExpression, '$and'>}
  | {$anyElementTrue: ProjectOperatorHelperArray<TRootValue, TExpression, '$anyElementTrue'>}
  | {$arrayElemAt: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$arrayElemAt'>}
  | {
      $arrayToObject:
        | ProjectOperatorHelperArray<TRootValue, TExpression, '$arrayToObject'>
        | ProjectOperatorHelperExpression<TRootValue, TExpression, '$arrayToObject'>;
    }
  | {$asin: ProjectOperatorHelperExpression<TRootValue, TExpression, '$asin'>}
  | {$asinh: ProjectOperatorHelperExpression<TRootValue, TExpression, '$asinh'>}
  | {$atan: ProjectOperatorHelperExpression<TRootValue, TExpression, '$atan'>}
  | {$atan2: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$atan2'>}
  | {$atanh: ProjectOperatorHelperExpression<TRootValue, TExpression, '$atanh'>}
  | {$avg: ProjectOperatorHelperArrayOrExpression<TRootValue, TExpression, '$avg'>}
  | {$binarySize: ProjectOperatorHelperExpression<TRootValue, TExpression, '$binarySize'>}
  | {$bsonSize: ProjectOperatorHelperExpression<TRootValue, TExpression, '$bsonSize'>}
  | {$ceil: ProjectOperatorHelperExpression<TRootValue, TExpression, '$ceil'>}
  | {$cmp: ProjectOperatorHelperArray<TRootValue, TExpression, '$cmp'>}
  | {$concat: ProjectOperatorHelperArray<TRootValue, TExpression, '$concat'>}
  | {$concatArrays: ProjectOperatorHelperArray<TRootValue, TExpression, '$concatArrays'>}
  | {
      $cond:
        | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$cond'>
        | ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$cond', {if: 1; then: 1; else: 0}>;
    }
  | {
      $convert: ProjectOperatorHelperExpressionObject<
        TRootValue,
        TExpression,
        '$convert',
        {input: 1; to: 0; onError: 0; onNull: 0}
      >;
    }
  | {$cos: ProjectOperatorHelperExpression<TRootValue, TExpression, '$cos'>}
  | {
      $dateFromParts:
        | ProjectOperatorHelperExpressionObject<
            TRootValue,
            TExpression,
            '$dateFromParts',
            {year: 1; month: 0; day: 0; hour: 0; minute: 0; second: 0; millisecond: 0; timezone: 0}
          >
        | ProjectOperatorHelperExpressionObject<
            TRootValue,
            TExpression,
            '$dateFromParts',
            {isoWeekYear: 1; isoWeek: 0; isoDayOfWeek: 0; hour: 0; minute: 0; second: 0; millisecond: 0; timezone: 0}
          >;
    }
  | {
      $dateFromString: ProjectOperatorHelperExpressionObject<
        TRootValue,
        TExpression,
        '$dateFromString',
        {dateString: 1; format: 0; timezone: 0; onError: 0}
      >;
    }
  | {
      $dateToParts:
        | ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateToParts', {date: 1; timezone: 0}>
        | (ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$dateToParts', {date: 1; timezone: 0}> & {
            iso8601?: boolean;
          });
    }
  | {
      $dateToString: ProjectOperatorHelperExpressionObject<
        TRootValue,
        TExpression,
        '$dateToString',
        {date: 1; format: 0}
      >;
    }
  | {$dayOfMonth: ProjectOperatorHelperDate<TRootValue, TExpression, '$dayOfMonth'>}
  | {$dayOfWeek: ProjectOperatorHelperDate<TRootValue, TExpression, '$dayOfWeek'>}
  | {$dayOfYear: ProjectOperatorHelperDate<TRootValue, TExpression, '$dayOfYear'>}
  | {$degreesToRadians: ProjectOperatorHelperExpression<TRootValue, TExpression, '$degreesToRadians'>}
  | {$divide: ProjectOperatorHelperArray<TRootValue, TExpression, '$divide'>}
  | {$eq: ProjectOperatorHelperCondition<TRootValue, TExpression, '$eq'>}
  | {$exp: ProjectOperatorHelperExpression<TRootValue, TExpression, '$exp'>}
  | {
      $filter: ProjectOperatorHelperExpression<TRootValue, TExpression, '$filter'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        as: infer TAs;
        cond: any;
      }
        ? Simplify<
            TRootValue &
              (TAs extends string ? Double$Keys<{[key in TAs]: UnArray<ProjectResult<TRootValue, TInput>>}> : never)
          > extends infer TNewValue
          ? {
              input: InterpretProjectExpression<TRootValue, TInput>;
              as: TAs;

              cond: ProjectOperatorHelperExpressionInner<TNewValue, TExpression, '$filter', 'cond'>;
            }
          : Impossible
        : Impossible;
    }
  | {$first: ProjectOperatorHelperExpression<TRootValue, TExpression, '$first'>}
  | {$floor: ProjectOperatorHelperExpression<TRootValue, TExpression, '$floor'>}
  | {$gt: ProjectOperatorHelperCondition<TRootValue, TExpression, '$gt'>}
  | {$gte: ProjectOperatorHelperCondition<TRootValue, TExpression, '$gte'>}
  | {$hour: ProjectOperatorHelperDate<TRootValue, TExpression, '$hour'>}
  | {
      $ifNull: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$ifNull'>;
    }
  | {
      $in: ProjectOperatorHelperArray<TRootValue, TExpression, '$in'>;
    }
  | {
      $indexOfArray:
        | ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$indexOfArray'>
        | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$indexOfArray'>
        | ProjectOperatorHelperFourTuple<TRootValue, TExpression, '$indexOfArray'>;
    }
  | {
      $indexOfBytes:
        | ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$indexOfBytes'>
        | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$indexOfBytes'>
        | ProjectOperatorHelperFourTuple<TRootValue, TExpression, '$indexOfBytes'>;
    }
  | {
      $indexOfCP:
        | ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$indexOfCP'>
        | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$indexOfCP'>
        | ProjectOperatorHelperFourTuple<TRootValue, TExpression, '$indexOfCP'>;
    }
  | {$isArray: ProjectOperatorHelperExpression<TRootValue, TExpression, '$isArray'>}
  | {$isoDayOfWeek: ProjectOperatorHelperDate<TRootValue, TExpression, '$isoDayOfWeek'>}
  | {$isoWeek: ProjectOperatorHelperDate<TRootValue, TExpression, '$isoWeek'>}
  | {$isoWeekYear: ProjectOperatorHelperDate<TRootValue, TExpression, '$isoWeekYear'>}
  | {$last: ProjectOperatorHelperExpression<TRootValue, TExpression, '$last'>}
  | {
      $let: {
        vars: ProjectOperatorHelperExpressionInner<TRootValue, TExpression, '$let', 'vars'>;
        in: ProjectResultObject<
          TRootValue,
          ProjectOperatorHelperExpressionInner<TRootValue, TExpression, '$let', 'vars'>
        > extends infer R
          ? // todo document let is a little sketchy, the values that come from vars are not super typesafe, which doesnt matter because we dont check them yet, but maybe someday
            ProjectOperatorHelperExpressionInner<
              TRootValue & Double$Keys<{[key in keyof R]: 1}>,
              TExpression,
              '$let',
              'in'
            >
          : Impossible;
      };
    }
  | {$literal: LookupKey<TExpression, '$literal'>}
  | {$ln: ProjectOperatorHelperExpression<TRootValue, TExpression, '$ln'>}
  | {$log: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$log'>}
  | {$log10: ProjectOperatorHelperExpression<TRootValue, TExpression, '$log10'>}
  | {$lt: ProjectOperatorHelperCondition<TRootValue, TExpression, '$lt'>}
  | {$lte: ProjectOperatorHelperCondition<TRootValue, TExpression, '$lte'>}
  | {$ltrim: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$ltrim', {input: 1; chars: 0}>}
  | {
      $map: LookupKey<TExpression, '$map'> extends {
        as: string;
        in: infer TIn;
        input: ExpressionStringReferenceKey<TRootValue>;
      }
        ? {
            as: LookupKey<LookupKey<TExpression, '$map'>, 'as'>;
            in: ProjectObject<
              TRootValue &
                {
                  [key in `$${LookupKey<LookupKey<TExpression, '$map'>, 'as'>}`]: DeReferenceExpression<
                    TRootValue,
                    LookupKey<LookupKey<TExpression, '$map'>, 'input'>
                  >;
                },
              TIn
            >;
            input: ExpressionStringReferenceKey<TRootValue>;
          }
        : never;
    }
  | {$max: ProjectOperatorHelperExpression<TRootValue, TExpression, '$max'>}
  | {$mergeObjects: ProjectOperatorHelperArray<TRootValue, TExpression, '$mergeObjects'>}
  | {$meta: 'textScore' | 'indexKey'}
  | {$millisecond: ProjectOperatorHelperDate<TRootValue, TExpression, '$millisecond'>}
  | {$min: ProjectOperatorHelperExpression<TRootValue, TExpression, '$min'>}
  | {$minute: ProjectOperatorHelperDate<TRootValue, TExpression, '$minute'>}
  | {$mod: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$mod'>}
  | {$month: ProjectOperatorHelperDate<TRootValue, TExpression, '$month'>}
  | {$multiply: ProjectOperatorHelperArray<TRootValue, TExpression, '$multiply'>}
  | {$ne: ProjectOperatorHelperCondition<TRootValue, TExpression, '$ne'>}
  | {$not: ProjectOperatorHelperExpression<TRootValue, TExpression, '$not'>}
  | {$objectToArray: ProjectOperatorHelperExpression<TRootValue, TExpression, '$objectToArray'>}
  | {$or: ProjectOperatorHelperArray<TRootValue, TExpression, '$or'>}
  | {$pow: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$pow:'>}
  | {$push: ProjectOperatorHelperExpression<TRootValue, TExpression, '$push'>}
  | {$radiansToDegrees: ProjectOperatorHelperExpression<TRootValue, TExpression, '$radiansToDegrees'>}
  | {
      $range:
        | ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$range'>
        | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$range'>;
    }
  | {
      $reduce: ProjectOperatorHelperExpression<TRootValue, TExpression, '$reduce'> extends {
        input: InterpretProjectExpression<TRootValue, infer TInput>;
        initialValue: InterpretProjectExpression<TRootValue, infer TInitialValue>;
        in: any;
      }
        ? {
            input: InterpretProjectExpression<TRootValue, TInput>;
            initialValue: InterpretProjectExpression<TRootValue, TInitialValue>;
            in: ProjectResultObject<TRootValue, TInput> extends infer R
              ? ProjectOperatorHelperExpressionInner<
                  TRootValue & {
                    $value: UnArray<ProjectResultObject<TRootValue, TInitialValue>>;
                    $this: ProjectResultObject<TRootValue, TInput>;
                  },
                  TExpression,
                  '$reduce',
                  'in'
                >
              : Impossible;
          }
        : never;
    }
  | {
      $regexFind: ProjectOperatorHelperExpressionObject<
        TRootValue,
        TExpression,
        '$regexFind',
        {input: 1; regex: 1; options: 0}
      >;
    }
  | {
      $regexFindAll: ProjectOperatorHelperExpressionObject<
        TRootValue,
        TExpression,
        '$regexFindAll',
        {input: 1; regex: 1; options: 0}
      >;
    }
  | {
      $regexMatch: ProjectOperatorHelperExpressionObject<
        TRootValue,
        TExpression,
        '$regexMatch',
        {input: 1; regex: 1; options: 0}
      >;
    }
  | {$reverseArray: ProjectOperatorHelperExpression<TRootValue, TExpression, '$reverseArray'>}
  | {$round: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$round'>}
  | {$rtrim: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$rtrim', {input: 1; chars: 0}>}
  | {$second: ProjectOperatorHelperDate<TRootValue, TExpression, '$second'>}
  | {$setDifference: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$setDifference'>}
  | {$setEquals: ProjectOperatorHelperArray<TRootValue, TExpression, '$setEquals'>}
  | {$setIntersection: ProjectOperatorHelperArray<TRootValue, TExpression, '$setIntersection'>}
  | {$setIsSubset: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$setIsSubset'>}
  | {$setUnion: ProjectOperatorHelperArray<TRootValue, TExpression, '$setUnion'>}
  | {$sin: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sin'>}
  | {$size: ProjectOperatorHelperExpression<TRootValue, TExpression, '$size'>}
  | {
      $slice:
        | ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$slice'>
        | ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$slice'>;
    }
  | {$split: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$split'>}
  | {$sqrt: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sqrt'>}
  | {
      $stdDevPop:
        | ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevPop'>
        | ProjectOperatorHelperArray<TRootValue, TExpression, '$stdDevPop'>;
    }
  | {
      $stdDevSamp:
        | ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevSamp'>
        | ProjectOperatorHelperArray<TRootValue, TExpression, '$stdDevSamp'>;
    }
  | {$strcasecmp: ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$strcasecmp'>}
  | {$strLenBytes: ProjectOperatorHelperExpression<TRootValue, TExpression, '$strLenBytes'>}
  | {$strLenCP: ProjectOperatorHelperExpression<TRootValue, TExpression, '$strLenCP'>}
  | {$substr: ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$substr'>}
  | {$substrBytes: ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$substrBytes'>}
  | {$substrCP: ProjectOperatorHelperThreeTuple<TRootValue, TExpression, '$substrCP'>}
  | {$subtract: ProjectOperatorHelperArray<TRootValue, TExpression, '$subtract'>}
  | {$sum: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sum'>}
  | {
      $switch: LookupKey<TExpression, '$switch'> extends {
        branches: {
          case: InterpretProjectExpression<TRootValue, infer TBranchCase>;
          then: InterpretProjectExpression<TRootValue, infer TBranchThen>;
        }[];
        default?: InterpretProjectExpression<TRootValue, infer TDefault>;
      }
        ? {
            branches: {
              case: InterpretProjectExpression<TRootValue, TBranchCase>;
              then: InterpretProjectExpression<TRootValue, TBranchThen>;
            }[];
            default: InterpretProjectExpression<TRootValue, TDefault>;
          }
        : never;
    }
  | {$tan: ProjectOperatorHelperExpression<TRootValue, TExpression, '$tan'>}
  | {$toBool: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toBool'>}
  | {$toDate: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toDate'>}
  | {$toDecimal: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toDecimal'>}
  | {$toDouble: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toDouble'>}
  | {$toInt: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toInt'>}
  | {$toLong: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toLong'>}
  | {$toLower: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toLower'>}
  | {$toObjectId: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toObjectId'>}
  | {$toString: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toString'>}
  | {$toUpper: ProjectOperatorHelperExpression<TRootValue, TExpression, '$toUpper'>}
  | {$trim: ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$trim', {input: 1; chars: 0}>}
  | {
      $trunc:
        | ProjectOperatorHelperOneTuple<TRootValue, TExpression, '$trunc'>
        | ProjectOperatorHelperTwoTuple<TRootValue, TExpression, '$trunc'>
        | ProjectOperatorHelperExpression<TRootValue, TExpression, '$trunc'>;
    }
  | {$type: ProjectOperatorHelperExpression<TRootValue, TExpression, '$type'>}
  | {$week: ProjectOperatorHelperDate<TRootValue, TExpression, '$week'>}
  | {$year: ProjectOperatorHelperDate<TRootValue, TExpression, '$year'>}
  | {
      $zip:
        | ProjectOperatorHelperExpressionObject<TRootValue, TExpression, '$zip', {inputs: 1; useLongestLength: 0}>
        | ProjectOperatorHelperExpressionObject<
            TRootValue,
            TExpression,
            '$zip',
            {inputs: 1; useLongestLength: 1; defaults: 1}
          >;
    };

type InterpretAccumulateOperator<TRootValue, TExpression> = {
  $avg?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$avg'>;
  $last?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$last'>;
  $mergeObjects?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$mergeObjects'>;
  $stdDevPop?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevPop'>;
  $stdDevSamp?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$stdDevSamp'>;
  $addToSet?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$addToSet'>;
  $first?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$first'>;
  $max?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$max'>;
  $min?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$min'>;
  $push?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$push'>;
  $sum?: ProjectOperatorHelperExpression<TRootValue, TExpression, '$sum'>;
};

export type ExpressionStringReferenceKey<T> = `$${DeepKeys<T> | '$CURRENT'}`;

export type InterpretProjectExpression<TRootValue, TExpression> = /* // you cant add one more here without overflow lol
 */ TExpression extends `$${string}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TExpression extends RawTypes
  ? TExpression
  : keyof TExpression extends AllOperators
  ? InterpretProjectOperator<TRootValue, TExpression>
  : TExpression extends Array<infer TValueArr>
  ? Array<InterpretProjectExpression<TRootValue, TValueArr>>
  : TExpression extends {}
  ? ProjectObject<TRootValue, TExpression>
  : Impossible;

export type InterpretProjectRootExpression<
  TRootValue,
  TKey extends KEY,
  TExpression
> = /* // you cant add one more here without overflow lol
 */ TExpression extends `$${string}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TExpression extends 1
  ? TKey extends DeepKeys<TRootValue>
    ? TExpression
    : never
  : TExpression extends RawTypes
  ? TExpression
  : keyof TExpression extends AllOperators
  ? InterpretProjectOperator<TRootValue, TExpression>
  : TExpression extends Array<infer TValueArr>
  ? Array<InterpretProjectExpression<TRootValue, TValueArr>>
  : TExpression extends {}
  ? ProjectObject<TRootValue, TExpression>
  : Impossible;

type ProjectObject<TRootValue, TProject> = {
  [key in keyof TProject]: InterpretProjectExpression<TRootValue, TProject[key]>;
};
type ProjectRootObject<TRootValue, TProject> = {
  [key in keyof TProject]: InterpretProjectRootExpression<TRootValue, key, TProject[key]>;
};

type AllAccumulateOperators =
  | '$addToSet'
  | '$avg'
  | '$first'
  | '$last'
  | '$max'
  | '$mergeObjects'
  | '$min'
  | '$push'
  | '$stdDevPop'
  | '$stdDevSamp'
  | '$sum';

type CheckProjectDeepKey<TKey extends string, TValue> = TValue extends 1 | true ? ([TKey] extends [never] ? 0 : 1) : 0;

type CheckProjectDeepKeyRemoveUnderscoreID<TKey extends string, TValue> = TValue extends 0 | false
  ? [TKey] extends ['_id']
    ? 1
    : 0
  : 0;

type ProjectResult<TRootValue, TExpression> = TExpression extends `$$CURRENT`
  ? TRootValue
  : TExpression extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TExpression extends RawTypes
  ? TExpression
  : keyof TExpression extends AllOperators
  ? ProjectResultOperators<TRootValue, TExpression>[keyof TExpression]
  : TExpression extends Array<infer TExpressionArray>
  ? Array<ProjectResultObject<TRootValue, TExpressionArray>>
  : TExpression extends {}
  ? ProjectResultObject<TRootValue, TExpression>
  : Impossible;

type ProjectResultRoot<TRootValue, TExpression, TKey extends string = never> = TExpression extends `$$CURRENT`
  ? TRootValue
  : TExpression extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : CheckProjectDeepKey<TKey, TExpression> extends 1
  ? DeepKeysResult<TRootValue, TKey>
  : CheckProjectDeepKeyRemoveUnderscoreID<TKey, TExpression> extends 1
  ? never
  : TExpression extends RawTypes
  ? TExpression
  : keyof TExpression extends AllOperators
  ? ProjectResultOperators<TRootValue, TExpression>[keyof TExpression]
  : TExpression extends Array<infer TValueArray>
  ? Array<ProjectResultRootObject<TRootValue, TValueArray, TKey>>
  : TExpression extends {}
  ? ProjectResultRootObject<TRootValue, TExpression, TKey>
  : Impossible;

type ProjectResultExpression<TRootValue, TExpression, TKey extends KEY> = ProjectResult<
  TRootValue,
  LookupKey<TExpression, TKey>
>;
type ProjectResultExpressionInner<TRootValue, TExpression, TKey extends KEY, TKey2 extends KEY> = ProjectResult<
  TRootValue,
  LookupKey<LookupKey<TExpression, TKey>, TKey2>
>;
type ProjectResultArrayIndex<TRootValue, TExpression, TKey extends KEY, TIndex extends number> = ProjectResult<
  TRootValue,
  LookupArray<LookupKey<TExpression, TKey>, TIndex>
>;
type NumberProjectResultExpression<TRootValue, TExpression, TKey extends KEY> = NumberTypeOrNever<
  ProjectResult<TRootValue, LookupKey<TExpression, TKey>>
>;

type NumberProjectResultExpressionUnArray<TRootValue, TExpression, TKey extends KEY> = NumberTypeOrNever<
  ProjectResult<TRootValue, UnArray<LookupKey<TExpression, TKey>>>
>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : Impossible) extends (k: infer I) => void
  ? I
  : Impossible;
type FlattenUnion<T> = {
  [K in keyof UnionToIntersection<T>]: K extends keyof T
    ? T[K] extends any[]
      ? T[K]
      : T[K] extends object
      ? FlattenUnion<T[K]>
      : T[K]
    : UnionToIntersection<T>[K] | undefined;
};

type ArrayToObjectTupleBuilder<T> = T extends [infer TFirst, ...infer TRest]
  ? LookupKey<TFirst, 'k'> extends string
    ? {[key in LookupKey<TFirst, 'k'>]: LookupKey<TFirst, 'v'>} & ArrayToObjectTupleBuilder<TRest>
    : never
  : {};

//shamelessly stolen from https://github.com/sindresorhus/type-fest/blob/738bd1a6332c571bd203c769d7912dd618bdf1a3/source/union-to-tuple.d.ts
export type UnionToTuple<Union> = UnionToIntersection<
  // Distributive conditional trick.
  // See the source for the `UnionToIntersection` type for more details.
  Union extends unknown ? (distributed: Union) => void : never
> extends (merged: infer Intersection) => void
  ? // Transforms ('A' | 'B') into [[[], "A"], "B"], but destructures the arrays
    [...UnionToTuple<Exclude<Union, Intersection>>, Intersection]
  : [];

type ObjectToArrayHelper<T> = UnionToTuple<
  {
    [key in keyof T]: {k: key; v: T[key]};
  }[keyof T]
>;

type ProjectResultOperators<TRootValue, TExpression> = {
  // document, anything other than lookupkey would throw deep
  $abs: NumberProjectResultExpression<TRootValue, TExpression, '$abs'>;
  $acos: NumberProjectResultExpression<TRootValue, TExpression, '$acos'>;
  $acosh: NumberProjectResultExpression<TRootValue, TExpression, '$acosh'>;
  $add: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$add'>;
  $addToSet: ProjectResultExpression<TRootValue, TExpression, '$addToSet'>[];
  $allElementsTrue: boolean;
  $and: boolean;
  $anyElementTrue: boolean;
  $arrayElemAt: UnArray<ProjectResultArrayIndex<TRootValue, TExpression, '$arrayElemAt', 0>>;
  $arrayToObject: ProjectResultExpression<TRootValue, TExpression, '$arrayToObject'> extends infer TInner
    ? UnArray<TInner> extends any[]
      ? unknown
      : ArrayToObjectTupleBuilder<UnionToTuple<UnArray<TInner>>>
    : never;
  $asin: NumberProjectResultExpression<TRootValue, TExpression, '$asin'>;
  $asinh: NumberProjectResultExpression<TRootValue, TExpression, '$asinh'>;
  $atan: NumberProjectResultExpression<TRootValue, TExpression, '$atan'>;
  $atan2: NumberTypeOrNever<UnArray<ProjectResultArrayIndex<TRootValue, TExpression, '$atan2', 0>>>;
  $atanh: NumberProjectResultExpression<TRootValue, TExpression, '$atanh'>;
  $avg: number;
  $binarySize: number;
  $bsonSize: number;
  $ceil: NumberProjectResultExpression<TRootValue, TExpression, '$ceil'>;
  $cmp: NumberTypeOrNever<ProjectResultArrayIndex<TRootValue, TExpression, '$cmp', 0>>;
  $concat: string;
  $concatArrays: DeepUnArray<ProjectResultArrayIndex<TRootValue, TExpression, '$concatArrays', 0>>[];
  $cond: LookupKey<TExpression, '$cond'> extends Array<any>
    ?
        | ProjectResultArrayIndex<TRootValue, TExpression, '$cond', 1>
        | ProjectResultArrayIndex<TRootValue, TExpression, '$cond', 2>
    :
        | ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$cond'>, 'then'>>
        | ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$cond'>, 'else'>>;
  $convert: unknown;
  $cos: NumberProjectResultExpression<TRootValue, TExpression, '$cos'>;
  $dateFromParts: Date;
  $dateFromString: Date;
  $dateToParts: true extends LookupKey<LookupKey<TExpression, '$dateToParts'>, 'iso8601'>
    ? {
        isoWeekYear: number;
        isoWeek: number;
        isoDayOfWeek: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
      }
    : {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
      };
  $dateToString: string;
  $dayOfMonth: number;
  $dayOfWeek: number;
  $dayOfYear: number;
  $degreesToRadians: number;
  $divide: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$divide'>;
  $eq: boolean;
  $exp: number;
  $filter: ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$filter'>, 'input'>>;
  $first: UnArray<ProjectResultExpression<TRootValue, TExpression, '$first'>>;
  $floor: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$floor'>;
  $gt: boolean;
  $gte: boolean;
  $hour: number;
  $ifNull: ProjectResultExpression<TRootValue, TExpression, '$ifNull'>;
  $in: ProjectResultExpression<TRootValue, TExpression, '$in'>;
  $indexOfArray: number;
  $indexOfBytes: number;
  $indexOfCP: number;
  $isArray: boolean;
  $isoDayOfWeek: number;
  $isoWeek: number;
  $isoWeekYear: number;
  $last: UnArray<ProjectResultExpression<TRootValue, TExpression, '$last'>>;
  $let: ProjectResult<
    TRootValue &
      Double$Keys<
        {
          [key in keyof ProjectResultObject<
            TRootValue,
            ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$let'>, 'vars'>>
          >]: 1;
        }
      >,
    LookupKey<LookupKey<TExpression, '$let'>, 'in'>
  >;

  $literal: LookupKey<TExpression, '$literal'>;
  $ln: number;
  $log: number;
  $log10: number;
  $lt: boolean;
  $lte: boolean;
  $ltrim: string;
  $map: LookupKey<LookupKey<TExpression, '$map'>, 'as'> extends string
    ? ProjectResult<
        TRootValue &
          {
            [key in `$${LookupKey<LookupKey<TExpression, '$map'>, 'as'>}`]: ProjectResult<
              TRootValue,
              LookupKey<LookupKey<TExpression, '$map'>, 'input'>
            >;
          },
        LookupKey<LookupKey<TExpression, '$map'>, 'in'>
      >[]
    : never;
  $max: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TExpression, '$max'>>>;
  $mergeObjects: FlattenUnion<ProjectResultArrayIndex<TRootValue, TExpression, '$mergeObjects', number>>;
  $meta: number;
  $millisecond: number;
  $min: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TExpression, '$min'>>>;
  $minute: number;
  $mod: number;
  $month: number;
  $multiply: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$multiply'>;
  $ne: boolean;
  $not: boolean;
  $objectToArray: ObjectToArrayHelper<ProjectResultExpression<TRootValue, TExpression, '$objectToArray'>>;
  $or: boolean;
  $pow: number;
  $push: ProjectResultExpression<TRootValue, TExpression, '$push'>[];
  $radiansToDegrees: number;
  $range: number[];
  $reduce: ProjectOperatorHelperExpression<TRootValue, TExpression, '$reduce'> extends {
    input: InterpretProjectExpression<TRootValue, infer TInput>;
    initialValue: InterpretProjectExpression<TRootValue, infer TInitialValue>;
    in: any;
  }
    ? ProjectResultObject<TRootValue, TInput> extends infer R
      ? ProjectResultExpressionInner<
          TRootValue & {
            $value: UnArray<ProjectResultObject<TRootValue, TInitialValue>>;
            $this: ProjectResultObject<TRootValue, TInput>;
          },
          TExpression,
          '$reduce',
          'in'
        >
      : never
    : never;
  $regexFind: {match: string; idx: number; captures: string[]};
  $regexFindAll: {match: string; idx: number; captures: string[]}[];
  $regexMatch: boolean;
  $reverseArray: ProjectResultExpression<TRootValue, TExpression, '$reverseArray'>;
  $round: number;
  $rtrim: string;
  $second: number;
  $setDifference: ProjectResultArrayIndex<TRootValue, TExpression, '$setDifference', 0>;
  $setEquals: boolean;
  $setIntersection: UnArray<ProjectResultExpression<TRootValue, TExpression, '$setIntersection'>>;
  $setIsSubset: boolean;
  $setUnion: ProjectResultArrayIndex<TRootValue, TExpression, '$setUnion', number>;
  $sin: number;
  $size: number;
  $slice: ProjectResultArrayIndex<TRootValue, TExpression, '$slice', 0>;
  $split: string;
  $sqrt: number;
  $stdDevPop: number;
  $stdDevSamp: number;
  $strcasecmp: 0 | 1 | -1;
  $strLenBytes: number;
  $strLenCP: number;
  $substr: string;
  $substrBytes: string;
  $substrCP: string;
  $subtract: NumberProjectResultExpressionUnArray<TRootValue, TExpression, '$subtract'>;
  $sum: NumberTypeOrNever<UnArray<ProjectResultExpression<TRootValue, TExpression, '$sum'>>>;
  $switch:
    | InterpretProjectExpression<
        TRootValue,
        LookupKey<LookupArray<LookupKey<LookupKey<TExpression, '$switch'>, 'branches'>, number>, 'then'>
      >
    | InterpretProjectExpression<TRootValue, LookupKey<LookupKey<TExpression, '$switch'>, 'default'>>;
  $tan: number;
  $toBool: boolean;
  $toDate: Date;
  $toDecimal: Decimal128;
  $toDouble: number;
  $toInt: number;
  $toLong: number;
  $toLower: string;
  $toObjectId: ObjectId;
  $toString: string;
  $toUpper: string;
  $trim: string;
  $trunc: LookupKey<TExpression, '$trunc'> extends Array<any>
    ? NumberTypeOrNever<ProjectResultArrayIndex<TRootValue, TExpression, '$trunc', 0>>
    : NumberProjectResultExpression<TRootValue, TExpression, '$trunc'>;
  $type:
    | 'double'
    | 'string'
    | 'object'
    | 'array'
    | 'binData'
    | 'objectId'
    | 'bool'
    | 'date'
    | 'null'
    | 'regex'
    | 'javascript'
    | 'int'
    | 'timestamp'
    | 'long'
    | 'decimal'
    | 'minKey'
    | 'maxKey';
  $week: number;
  $year: number;
  $zip: UnArray<
    UnArray<ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$zip'>, 'inputs'>>>
  > extends infer TInput
    ? [LookupKey<LookupKey<TExpression, '$zip'>, 'defaults'>] extends [never]
      ? Array<Array<TInput>>
      : Array<Array<TInput | UnArray<ProjectResult<TRootValue, LookupKey<LookupKey<TExpression, '$zip'>, 'defaults'>>>>>
    : never;
};

type AccumulateResult<TRootValue, TExpression> = TExpression extends `$${infer TRawKey}`
  ? DeepKeysResult<TRootValue, TRawKey>
  : TExpression extends RawTypes
  ? TExpression
  : keyof TExpression extends AllAccumulateOperators
  ? {
      $avg: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$avg'>>>>;
      $last: ProjectResult<TRootValue, LookupKey<TExpression, '$last'>>;
      $mergeObjects: FlattenUnion<UnArray<ProjectResultExpression<TRootValue, TExpression, '$mergeObjects'>>>;
      $stdDevPop: number;
      $stdDevSamp: number;

      $sum: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$sum'>>>>;
      $addToSet: ProjectResult<TRootValue, LookupKey<TExpression, '$addToSet'>>[];
      $first: ProjectResult<TRootValue, LookupKey<TExpression, '$first'>>;
      $min: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$min'>>>>;
      $max: NumberTypeOrNever<UnArray<ProjectResult<TRootValue, LookupKey<TExpression, '$max'>>>>;
      $push: ProjectResult<TRootValue, LookupKey<TExpression, '$push'>>[];
    }[keyof TExpression]
  : Impossible;

type GetProjectDeepKey<TDeepProjectKey extends string, key> = TDeepProjectKey extends never
  ? never
  : TDeepProjectKey extends ''
  ? key
  : key extends string
  ? `${TDeepProjectKey}.${key}`
  : '';

export type ProjectResultObject<TRootValue, TExpression> = TExpression extends infer T
  ? {
      [key in keyof T]: ProjectResult<TRootValue, T[key]>;
    }
  : Impossible;

export type ProjectResultRootObject<TRootValue, TObj, TDeepProjectKey extends string = never> = TObj extends infer T
  ? {
      [key in keyof T]: ProjectResultRoot<TRootValue, T[key], GetProjectDeepKey<TDeepProjectKey, key>>;
    }
  : Impossible;

export type LookupKey<T, TKey extends string | number | Symbol> = TKey extends keyof T ? T[TKey] : never;
export type LookupArray<T, TIndex extends number> = T extends Array<any> ? T[TIndex] : never;

type InterpretAccumulateExpression<TRootValue, TExpression> = /*
 */ TExpression extends `$${infer TRawKey}`
  ? ExpressionStringReferenceKey<TRootValue>
  : TExpression extends RawTypes
  ? TExpression
  : keyof TExpression extends AllAccumulateOperators
  ? InterpretAccumulateOperator<TRootValue, TExpression>
  : Impossible;

type AccumulateRootObject<TRootValue, TAccumulateObject> = {
  [key in keyof TAccumulateObject]: key extends '_id'
    ? InterpretProjectExpression<TRootValue, TAccumulateObject[key]>
    : InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};

type BucketRootObject<TRootValue, TAccumulateObject> = {
  [key in keyof TAccumulateObject]: InterpretAccumulateExpression<TRootValue, TAccumulateObject[key]>;
};

type AccumulateRootResultObject<TRootValue, TObj> = TObj extends infer T
  ? {
      [key in keyof T]: key extends '_id' ? ProjectResult<TRootValue, T[key]> : AccumulateResult<TRootValue, T[key]>;
    }
  : Impossible;
type BucketRootResultObject<TRootValue, TObj, TId> = TObj extends infer T
  ? {
      [key in keyof T]: AccumulateResult<TRootValue, T[key]>;
    } & {_id: TId}
  : Impossible;
type AutoBucketRootResultObject<TRootValue, TObj> = [TObj] extends [never]
  ? {
      _id: {
        min: number;
        max: number;
      };
      count: number;
    }
  : TObj extends infer T
  ? {
      [key in keyof T]: AccumulateResult<TRootValue, T[key]>;
    } & {
      _id: {
        min: number;
        max: number;
      };
    }
  : Impossible;

export type GraphDeep<TOther, TAs extends string, TDepthField extends string> = {
  [key in TAs]: (TOther & {[oKey in TDepthField]: number})[];
};

type Simplify<T> = T extends object | any[] ? {[K in keyof T]: T[K]} : T;

//todo document this trick
type TableName<TTable> = string & {__table: TTable};
export function tableName<TTable extends {}>(tableName: string): TableName<TTable> {
  return tableName as TableName<TTable>;
}
export function isPossiblyTableName(tableName: any): tableName is TableName<any> {
  return typeof tableName === 'string';
}

type Double$Keys<T> = {[key in keyof T as `$${key extends string ? key : never}`]: T[key]};
type MongoRedactTypes = {$DESCEND: '$DESCEND'; $PRUNE: '$PRUNE'; $KEEP: '$KEEP'};

export class Aggregator<T> {
  private currentPipeline?: {};

  private constructor(private parent?: any) {}

  static start<T>(): Aggregator<T> {
    return new Aggregator<T>();
  }
  $addFields<TProject>(fields: ProjectRootObject<T, TProject>): Aggregator<T & ProjectResultRootObject<T, TProject>> {
    this.currentPipeline = {$addFields: fields};
    return new Aggregator<T & ProjectResultRootObject<T, TProject>>(this);
  }

  $bucket<TGroupBy, TBoundaries, TAccumulator, TDefault extends string = never>(props: {
    groupBy: InterpretProjectExpression<T, TGroupBy>;
    boundaries: InterpretProjectExpression<T, TBoundaries>[];
    default?: TDefault;
    output: BucketRootObject<T, TAccumulator>;
  }): Aggregator<BucketRootResultObject<T, TAccumulator, TBoundaries | TDefault>> {
    this.currentPipeline = {$bucket: props};
    return new Aggregator<BucketRootResultObject<T, TAccumulator, TBoundaries | TDefault>>(this);
  }

  $bucketAuto<TGroupBy, TAccumulator = never>(props: {
    groupBy: InterpretProjectExpression<T, TGroupBy>;
    buckets: number;
    output?: BucketRootObject<T, TAccumulator>;
    granularity?:
      | 'R5'
      | 'R10'
      | 'R20'
      | 'R40'
      | 'R80'
      | '1-2-5'
      | 'E6'
      | 'E12'
      | 'E24'
      | 'E48'
      | 'E96'
      | 'E192'
      | 'POWERSOF2';
  }): Aggregator<AutoBucketRootResultObject<T, TAccumulator>> {
    this.currentPipeline = {$bucketAuto: props};
    return new Aggregator<AutoBucketRootResultObject<T, TAccumulator>>(this);
  }

  $count<TKey extends string>(key: TKey): Aggregator<{[cKey in TKey]: number}> {
    this.currentPipeline = {$count: key};
    return new Aggregator<{[cKey in TKey]: number}>(this);
  }

  $facet<TItem>(
    props: {[key in keyof TItem]: (agg: Aggregator<T>) => Aggregator<TItem[key]>}
  ): Aggregator<{[key in keyof TItem]: TItem[key][]}> {
    this.currentPipeline = {$facet: {}};

    for (const safeKey of safeKeys(props)) {
      (this.currentPipeline as any).$facet[safeKey] = props[safeKey](new Aggregator<T>()).query();
    }

    return new Aggregator<{[key in keyof TItem]: TItem[key][]}>(this);
  }
  $geoNear<TDistanceField extends string>(props: {
    near: {
      type: 'Point';
      coordinates: [number, number];
    };
    query?: FilterQueryMatch<T, `$${DeepKeys<T>}`>;
    spherical?: boolean;
    maxDistance?: number;
    minDistance?: number;
    distanceMultiplier?: number;
    distanceField: TDistanceField;
  }): Aggregator<T & {[key in TDistanceField]: number}> {
    this.currentPipeline = {$geoNear: props};
    return new Aggregator<T & {[key in TDistanceField]: number}>(this);
  }
  $graphLookup<TOther, TAs extends string, TDepthField extends string = never>(props: {
    as: TAs;
    from: TableName<TOther>;
    connectFromField: DeepKeys<TOther>;
    connectToField: DeepKeys<TOther>;
    depthField?: TDepthField;
    maxDepth?: number;
    startWith: ExpressionStringReferenceKey<T>;
  }): Aggregator<T & GraphDeep<TOther, TAs, TDepthField>> {
    this.currentPipeline = {$graphLookup: props};
    return new Aggregator<T & GraphDeep<TOther, TAs, TDepthField>>(this);
  }

  $group<TAccumulator>(
    props: AccumulateRootObject<T, TAccumulator>
  ): Aggregator<AccumulateRootResultObject<T, TAccumulator>> {
    this.currentPipeline = {$group: props};
    return new Aggregator<AccumulateRootResultObject<T, TAccumulator>>(this);
  }

  $limit(limit: number): Aggregator<T> {
    this.currentPipeline = {$limit: limit};
    return new Aggregator<T>(this);
  }

  $lookup<TLookupTable, TAs extends string, TLet extends {} = never, TPipeline extends {} = never>(
    props:
      | {from: TableName<TLookupTable>; as: TAs; localField: DeepKeys<T>; foreignField: DeepKeys<TLookupTable>}
      | {
          from: TableName<TLookupTable>;
          as: TAs;
          let?: ProjectObject<T, TLet>;
          pipeline: (
            // somehow you overcame deep nested with this again. it defers testing of the types until its sure that its ary, and not just thinks it is
            // THIS DOES NOT WORK WHEN T IS NEVER
            agg: Aggregator<
              Simplify<TLookupTable & (ProjectResult<TLookupTable, TLet> extends infer R ? Double$Keys<R> : never)>
            >
          ) => Aggregator<TPipeline>;
        }
  ): Aggregator<
    T &
      //todo document this [never]
      ([TPipeline] extends [never]
        ? [TLet] extends [never]
          ? {[key in TAs]: TLookupTable[]}
          : {[key in TAs]: ProjectResult<TLookupTable, TLet>[]}
        : {[key in TAs]: TPipeline[]})
  > {
    if ('pipeline' in props) {
      this.currentPipeline = {
        $lookup: {
          from: props.from,
          as: props.as,
          ...(props.let ? {let: props.let} : {}),
          pipeline: props.pipeline(new Aggregator<any>()).query(),
        },
      };
    } else {
      this.currentPipeline = {
        $lookup: {
          from: props.from,
          localField: props.localField,
          foreignField: props.foreignField,
          as: props.as,
        },
      };
    }

    return new Aggregator<
      T &
        ([TPipeline] extends [never]
          ? [TLet] extends [never]
            ? {[key in TAs]: TLookupTable[]}
            : {[key in TAs]: ProjectResult<TLookupTable, TLet>[]}
          : {[key in TAs]: TPipeline[]})
    >(this);
  }

  $match(query: FilterQueryMatch<T, `$${DeepKeys<T>}`>): Aggregator<T> {
    this.currentPipeline = {$match: query};
    return new Aggregator<T>(this);
  }

  $merge<TOtherCollection, TOn, TLet extends {} = never, TPipeline extends {} = never>(props: {
    into: TableName<TOtherCollection> | {db: string; coll: TableName<TOtherCollection>};
    on?: (DeepKeys<T> & DeepKeys<TOtherCollection>) | (DeepKeys<T> & DeepKeys<TOtherCollection>)[];
    let?: ProjectObject<T, TLet>;
    whenMatched?:
      | 'replace'
      | 'keepExisting'
      | 'merge'
      | 'fail'
      | ((
          agg: Aggregator<
            T &
              ([TLet] extends [never]
                ? Double$Keys<{new: T}>
                : ProjectResult<T, TLet> extends infer R
                ? Double$Keys<R>
                : never)
          >
        ) => Aggregator<TPipeline>);
    whenNotMatched?: 'insert' | 'discard' | 'fail';
  }): Aggregator<never> {
    if (props.whenMatched && typeof props.whenMatched === 'function') {
      this.currentPipeline = {$merge: {...props, whenMatched: props.whenMatched(new Aggregator<any>()).query()}};
    } else {
      this.currentPipeline = {$merge: props};
    }
    return new Aggregator<never>(this);
  }

  $out<TOutTable>(tableName: TableName<TOutTable>): Aggregator<never> {
    this.currentPipeline = {$out: tableName};
    return new Aggregator<never>(this);
  }

  $project<TProject>(
    query: ProjectRootObject<T, TProject>
  ): Aggregator<DeepExcludeNever<ProjectResultRootObject<T, TProject, ''>>> {
    this.currentPipeline = {$project: query};
    return new Aggregator<DeepExcludeNever<ProjectResultRootObject<T, TProject, ''>>>(this);
  }

  $redact<TExpression>(
    expression: ProjectResult<T & MongoRedactTypes, TExpression> extends '$DESCEND' | '$PRUNE' | '$KEEP'
      ? InterpretProjectExpression<T & MongoRedactTypes, TExpression>
      : never
  ): Aggregator<T> {
    this.currentPipeline = {$redact: expression};
    return new Aggregator<T>(this);
  }

  $replaceRoot<TNewRootValue, TNewRoot extends {newRoot: TNewRootValue}>(params: {
    newRoot: InterpretProjectExpression<T, TNewRootValue>;
  }): Aggregator<ProjectResult<T, TNewRootValue>> {
    this.currentPipeline = {$replaceRoot: params};
    return new Aggregator<ProjectResult<T, TNewRootValue>>(this);
  }
  $replaceWith<TNewRootValue, TNewRoot extends {newRoot: TNewRootValue}>(params: {
    newRoot: InterpretProjectExpression<T, TNewRootValue>;
  }): Aggregator<ProjectResult<T, TNewRootValue>> {
    this.currentPipeline = {$replaceWith: params};
    return new Aggregator<ProjectResult<T, TNewRootValue>>(this);
  }

  $sample(props: {size: number}): Aggregator<T> {
    this.currentPipeline = {$sample: props};
    return new Aggregator<T>(this);
  }
  $sampleRate(props: number): Aggregator<T> {
    this.currentPipeline = {$sampleRate: props};
    return new Aggregator<T>(this);
  }

  $set<TProject>(fields: ProjectRootObject<T, TProject>): Aggregator<T & ProjectResultRootObject<T, TProject>> {
    this.currentPipeline = {$set: fields};
    return new Aggregator<T & ProjectResultRootObject<T, TProject>>(this);
  }
  $skip(skip: number): Aggregator<T> {
    this.currentPipeline = {$skip: skip};
    return new Aggregator<T>(this);
  }

  $sort(sorts: {[key in DeepKeys<T>]?: 1 | -1}): Aggregator<T> {
    this.currentPipeline = {$sort: sorts};
    return new Aggregator<T>(this);
  }

  $sortByCount<TExpression>(
    expression: InterpretProjectExpression<T, TExpression>
  ): Aggregator<{_id: ProjectResult<T, TExpression>; count: number}> {
    this.currentPipeline = {$sortByCount: expression};
    return new Aggregator<{_id: ProjectResult<T, TExpression>; count: number}>(this);
  }

  $unionWith<TOtherTable, TPipeline = never>(
    props:
      | TableName<TOtherTable>
      | {
          coll: TableName<TOtherTable>;
          pipeline: (agg: Aggregator<TOtherTable>) => Aggregator<TPipeline>;
        }
  ): Aggregator<T | ([TPipeline] extends [never] ? TOtherTable : TPipeline)> {
    if (isPossiblyTableName(props)) {
      this.currentPipeline = {$unionWith: props};
    } else {
      this.currentPipeline = {
        $unionWith: {
          coll: props.coll,
          pipeline: props.pipeline(new Aggregator<TOtherTable>()).query(),
        },
      };
    }
    return new Aggregator<T | ([TPipeline] extends [never] ? TOtherTable : TPipeline)>(this);
  }

  $unset<TDeepKey extends DeepKeys<T>>(key: TDeepKey): Aggregator<ExcludeNever<T & {[k in typeof key]: never}>> {
    this.currentPipeline = {$unset: key};
    return new Aggregator<ExcludeNever<T & {[k in typeof key]: never}>>(this);
  }

  $unwind<TKey extends DeepKeys<T>, TArrayIndexField extends string = never>(
    key: `$${TKey}` | {path: `$${TKey}`; preserveNullAndEmptyArrays?: boolean; includeArrayIndex?: TArrayIndexField}
  ): Aggregator<
    DeepReplaceKey<T & {[key in TArrayIndexField]: number}, DeepKeyArray<TKey>, UnArray<DeepKeysResult<T, TKey>>>
  > {
    this.currentPipeline = {$unwind: key};
    return new Aggregator<
      DeepReplaceKey<T & {[key in TArrayIndexField]: number}, DeepKeyArray<TKey>, UnArray<DeepKeysResult<T, TKey>>>
    >(this);
  }

  query(): {}[] {
    const pipelines = [];
    let parent = this.parent;
    while (parent) {
      pipelines.push(parent.currentPipeline!);
      parent = parent.parent;
    }
    return pipelines.reverse();
  }

  async result<TDoc extends {_id: ObjectId}>(collection: Collection<TDoc>): Promise<Simplify<T>[]> {
    const query = this.query();
    // console.log(JSON.stringify(q, null, 2));
    return collection.aggregate<Simplify<T>>(query).toArray();
  }

  async resultCursor<TDoc extends {_id: ObjectId}>(collection: Collection<TDoc>): Promise<AggregationCursor<T>> {
    const query = this.query();
    // console.log(JSON.stringify(q, null, 2));
    return collection.aggregate<T>(query);
  }
}
function safeKeys<T>(model: T): (keyof T)[] {
  return Object.keys(model) as (keyof T)[];
}
