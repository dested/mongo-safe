/// <reference path="../mongodb.d.ts" />
import { AggregationCursor, FindCursor, Db, DeepKeys, Filter, CreateIndexesOptions, ObjectId, UpdateFilter, WithId, OptionalId, SortDirection } from 'mongodb';
export declare class DocumentManager<T extends {
    _id: ObjectId;
}> {
    private collectionName;
    private getConnection;
    constructor(collectionName: string, getConnection: () => Promise<Db>);
    tableName: string & {
        __table: T;
    };
    insertDocument(document: OptionalId<T>): Promise<WithId<T>>;
    getCollection<TOverride = T>(): Promise<import("mongodb").Collection<TOverride>>;
    insertDocuments(documents: OptionalId<T>[]): Promise<WithId<T>[]>;
    updateOne(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<void>;
    updateOneGet(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<WithId<T> | undefined>;
    updateMany(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<void>;
    updateDocument(document: T): Promise<T>;
    getOneProject<TOverride extends {
        [key in keyof T]: T[key];
    } = {
        [key in keyof T]: T[key];
    }, TProjection extends {
        [key in keyof TOverride]?: 1 | -1;
    } = {
        [key in keyof TOverride]?: 1 | -1;
    }, TKeys extends keyof TProjection & keyof TOverride = keyof T>(query: Filter<T>, projection: TProjection): Promise<{
        [key in TKeys]: TOverride[key];
    }>;
    getOne(query: Filter<T>, projection?: any): Promise<WithId<T> | undefined>;
    getAllProject<TOverride extends {
        [key in keyof T]: T[key];
    } = {
        [key in keyof T]: T[key];
    }, TProjection extends {
        [key in keyof TOverride]?: 1 | -1;
    } = {
        [key in keyof TOverride]?: 1 | -1;
    }, TKeys extends keyof TProjection & keyof TOverride = keyof T>(query: Filter<T>, projection: TProjection): Promise<{
        [key in TKeys]: TOverride[key];
    }[]>;
    aggregate<TAgg>(query: any): Promise<TAgg[]>;
    aggregateCursor<TAgg>(query: any): Promise<AggregationCursor<TAgg>>;
    getById(id: string | ObjectId, projection?: any): Promise<WithId<T> | undefined>;
    deleteMany(query: Filter<T>): Promise<void>;
    deleteOne(query: Filter<T>): Promise<void>;
    getAll(query: Filter<T>): Promise<WithId<T>[]>;
    exists(query: Filter<T>): Promise<boolean>;
    getAllPaged(query: Filter<T>, sortKey: DeepKeys<T>, sortDirection: SortDirection, page: number, take: number): Promise<WithId<T>[]>;
    getAllCursor(query: Filter<T>, sortKey: DeepKeys<T>, sortDirection: SortDirection, page: number, take: number): Promise<FindCursor<WithId<T>>>;
    count(query: Filter<T>): Promise<number>;
    ensureIndex(spec: any, options: CreateIndexesOptions): Promise<string>;
}
