/// <reference path="../mongodb.d.ts" />
import { AggregationCursor, Cursor, Db, DeepKeys, FilterQuery, IndexOptions, ObjectID, ObjectId, OptionalId, UpdateQuery, WithId } from 'mongodb';
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
    updateOne(filter: FilterQuery<T>, update: UpdateQuery<T> | T): Promise<void>;
    updateOneGet(filter: FilterQuery<T>, update: UpdateQuery<T> | T): Promise<T | undefined>;
    updateMany(filter: FilterQuery<T>, update: UpdateQuery<T> | T): Promise<void>;
    updateDocument(document: T): Promise<T>;
    getOneProject<TOverride extends {
        [key in keyof T]: T[key];
    } = {
        [key in keyof T]: T[key];
    }, TProjection extends {
        [key in keyof TOverride]?: 1 | -1;
    } = {
        [key in keyof TOverride]?: 1 | -1;
    }, TKeys extends keyof TProjection & keyof TOverride = keyof T>(query: FilterQuery<T>, projection: TProjection): Promise<{
        [key in TKeys]: TOverride[key];
    }>;
    getOne(query: FilterQuery<T>, projection?: any): Promise<T | undefined>;
    getAllProject<TOverride extends {
        [key in keyof T]: T[key];
    } = {
        [key in keyof T]: T[key];
    }, TProjection extends {
        [key in keyof TOverride]?: 1 | -1;
    } = {
        [key in keyof TOverride]?: 1 | -1;
    }, TKeys extends keyof TProjection & keyof TOverride = keyof T>(query: FilterQuery<T>, projection: TProjection): Promise<{
        [key in TKeys]: TOverride[key];
    }[]>;
    aggregate<TAgg>(query: any): Promise<TAgg[]>;
    aggregateCursor<TAgg>(query: any): Promise<AggregationCursor<TAgg>>;
    getById(id: string | ObjectID, projection?: any): Promise<T | undefined>;
    deleteMany(query: FilterQuery<T>): Promise<void>;
    deleteOne(query: FilterQuery<T>): Promise<void>;
    getAll(query: FilterQuery<T>): Promise<T[]>;
    exists(query: FilterQuery<T>): Promise<boolean>;
    getAllPaged(query: FilterQuery<T>, sortKey: DeepKeys<T>, sortDirection: number, page: number, take: number): Promise<T[]>;
    getAllCursor(query: FilterQuery<T>, sortKey: DeepKeys<T>, sortDirection: number, page: number, take: number): Promise<Cursor<T>>;
    count(query: FilterQuery<T>): Promise<number>;
    ensureIndex(spec: any, options: IndexOptions): Promise<string>;
}
