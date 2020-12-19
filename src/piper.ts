import {FilterQueryMatch} from './filterQueryMatch';
import {DeepKeys, ObjectID} from 'mongodb';
import {
  DeepExcludeNever,
  KEY,
  LookupArray,
  LookupKey,
  ProjectResultRootObject,
  ProjectRootObject,
  Simplify,
} from './typeSafeAggregate';

type PipelineSteps = '$match';

type Cast<TLeft, TRight> = TLeft extends TRight ? TRight : never;
type Impossible = never;

type IsError<T> = [LookupArray<T, 0>] extends [never] ? never : LookupArray<T, 0> extends '$$$ERROR' ? T : never;

export type PipelineTest<T, TFirst, TKey extends KEY> = LookupKey<
  {
    $match: LookupKey<TFirst, '$match'> extends infer R
      ? TFirst extends {$match: FilterQueryMatch<T, `$${DeepKeys<T>}`>}
        ? T
        : {$match: FilterQueryMatch<T, `$${DeepKeys<T>}`>}
      : Impossible;
    $project: LookupKey<TFirst, '$project'> extends infer R
      ? TFirst extends {$project: ProjectRootObject<T, R>}
        ? DeepExcludeNever<ProjectResultRootObject<T, R, ''>>
        : {$project: ProjectRootObject<T, R>}
      : Impossible;
  },
  TKey
>;

type PipelineTester<T, LNLLast> = [LookupKey<LNLLast, 'Last'>] extends [never]
  ? PipelineTest<T, LookupKey<LNLLast, 'Item'>, keyof LookupKey<LNLLast, 'Item'>>
  : PipelineTester<T, LookupKey<LNLLast, 'Last'>> extends infer J
  ? PipelineTest<J, LookupKey<LNLLast, 'Item'>, keyof LookupKey<LNLLast, 'Item'>>
  : Impossible;

type m<T, TPipe extends readonly unknown[]> = LookupKey<LinkedListReverse<TPipe>, 'Last'> extends infer LNL
  ? PipelineTester<T, LNL>
  : Impossible;

type LinkedList<T, Last = never> = T extends readonly [infer Head, ...infer Tail]
  ? {Item: Head; Next: LinkedList<Tail, Head>}
  : never;

type LinkedListReverse<T extends readonly unknown[], Last = never> = T extends readonly [infer Head, ...infer Tail]
  ? LinkedListReverse<Tail, {Item: Head; Last: Last}>
  : {Last: Last; Item: never};

class PP<T> {
  pipe<TPipes extends readonly unknown[]>(pipe: m<T, TPipes>): void {
    return null!;
  }
}

const pp = new PP<DBUserRoundStatDetails>();
pp.pipe([
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
  {$project: {gameId: 'ah'}},
  {$match: {gameId: 'ah'}},
] as const);

type d = LinkedListReverse<
  [
    {$match: {gameId: 'ah1'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}},
    {$match: {gameId: 'ah3'}}
  ]
>;

type DBUserRoundStats = {
  _id: ObjectID;
  gameId: string;
  userId: string;
  userName: string;
  roundsParticipated: DBUserRoundStatDetails[];
};
type DBUserRoundStatDetails = {
  generation: number;
  votesCast: number;
  votesWon: number;
  damageDone: number;
  unitsDestroyed: number;
  unitsCreated: number;
  resourcesMined: number;
  distanceMoved: number;
};
export type Pipeline<T, TPipe> = TPipe extends readonly [infer TFirst, ...infer TRest]
  ? PipelineTest<T, TFirst, keyof TFirst> extends infer TResult
    ? TResult extends false
      ? 11111
      : Pipeline<TResult, TRest>
    : 1
  : [];

export type PipelineResult<T, TPipe> = TPipe extends readonly [infer TFirst, ...infer TRest]
  ? keyof TFirst extends PipelineSteps
    ? {
        $match: LookupKey<TFirst, '$match'> extends infer R ? PipelineResult<T, TRest> : never;
        $project: PipelineResult<
          Simplify<DeepExcludeNever<ProjectResultRootObject<T, LookupKey<TFirst, '$project'>>>>,
          TRest
        >;
      }[keyof TFirst]
    : never
  : T;
