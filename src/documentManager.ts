import {
  AggregationCursor,
  FindCursor,
  Db,
  DeepKeys,
  Filter,
  CreateIndexesOptions,
  ObjectId,
  UpdateFilter,
  WithId,
  OptionalId,
  SortDirection,
  OptionalUnlessRequiredId,
} from 'mongodb';
import {tableName} from './typeSafeAggregate';

export class DocumentManager<T extends {_id: ObjectId}> {
  constructor(private collectionName: string, private getConnection: () => Promise<Db>) {}
  public tableName = tableName<T>(this.collectionName);
  async insertDocument(document: OptionalId<T>): Promise<WithId<T>> {
    // console.log('inserting');
    const result = await (await this.getCollection()).insertOne(document as OptionalUnlessRequiredId<T>);
    // console.log('inserted');
    document._id = result.insertedId;
    // console.log('inserted got id  ');
    return document as WithId<T>;
  }

  async getCollection<TOverride = T>() {
    return (await this.getConnection()).collection<TOverride>(this.collectionName);
  }

  async insertDocuments(documents: OptionalId<T>[]): Promise<WithId<T>[]> {
    if (documents.length === 0) {
      return [] as WithId<T>[];
    }
    const result = await (await this.getCollection()).insertMany(documents as OptionalUnlessRequiredId<T>[]);
    for (let i = 0; i < documents.length; i++) {
      documents[i]._id = result.insertedIds[i];
    }
    return documents as WithId<T>[];
  }

  async updateOne(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<void> {
    await (await this.getCollection()).updateOne(filter, update);
  }

  async updateOneGet(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<WithId<T> | undefined> {
    const result = await (await this.getCollection()).updateOne(filter, update as any);
    if (result.upsertedCount === 1 || result.modifiedCount === 1) {
      return this.getOne(filter);
    }
    return undefined;
  }

  async updateMany(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<void> {
    await (await this.getCollection()).updateMany(filter, update);
  }

  async updateDocument(document: T): Promise<T> {
    // console.log('getting update collection ', this.collectionName);
    const collection = await this.getCollection();

    // console.log('updating', this.collectionName);
    await collection.findOneAndReplace({_id: document._id} as any, document);
    // console.log('update', this.collectionName);
    return document;
  }

  async getOneProject<
    TOverride extends {[key in keyof T]: T[key]} = {[key in keyof T]: T[key]},
    TProjection extends {[key in keyof TOverride]?: 1 | -1} = {[key in keyof TOverride]?: 1 | -1},
    TKeys extends keyof TProjection & keyof TOverride = keyof T
  >(query: Filter<T>, projection: TProjection): Promise<{[key in TKeys]: TOverride[key]}> {
    const item = await (await this.getCollection<any>()).findOne(query as any, {projection});
    return item;
  }

  async getOne(query: Filter<T>, projection?: any): Promise<WithId<T> | undefined> {
    if (projection) {
      console.log('get one project');
      const result = await (await this.getCollection()).findOne(query, {projection});
      console.log('got one project');
      return result ?? undefined;
    } else {
      // console.log('get one');
      const result = await (await this.getCollection()).findOne(query);
      // console.log('got one');
      return result ?? undefined;
    }
  }

  async getAllProject<
    TOverride extends {[key in keyof T]: T[key]} = {[key in keyof T]: T[key]},
    TProjection extends {[key in keyof TOverride]?: 1 | -1} = {[key in keyof TOverride]?: 1 | -1},
    TKeys extends keyof TProjection & keyof TOverride = keyof T
  >(query: Filter<T>, projection: TProjection): Promise<{[key in TKeys]: TOverride[key]}[]> {
    // console.time(`getting all`);
    const items = (await this.getCollection<any>())
      .find(query as any)
      .project(projection)
      .toArray();
    // console.timeEnd(`getting all`);
    return items as any as {[key in TKeys]: TOverride[key]}[];
  }

  async aggregate<TAgg>(query: any): Promise<TAgg[]> {
    return (await this.getCollection<any>()).aggregate(query).toArray() as any as TAgg[];
  }

  async aggregateCursor<TAgg>(query: any): Promise<AggregationCursor<TAgg>> {
    return (await this.getCollection<any>()).aggregate(query);
  }

  async getById(id: string | ObjectId, projection?: any): Promise<WithId<T> | undefined> {
    const objectId: ObjectId = typeof id === 'string' ? ObjectId.createFromHexString(id) : id;
    let result: WithId<T> | null;
    if (projection) {
      result = await (await this.getCollection<any>()).findOne({_id: objectId}, {projection});
    } else {
      result = await (await this.getCollection<any>()).findOne({_id: objectId});
    }
    if (!result) return undefined;
    return result;
  }
  async deleteMany(query: Filter<T>): Promise<void> {
    await (await this.getCollection()).deleteMany(query);
  }
  async deleteOne(query: Filter<T>): Promise<void> {
    await (await this.getCollection()).deleteOne(query);
  }

  async getAll(query: Filter<T>): Promise<WithId<T>[]> {
    return (await (await this.getCollection()).find(query)).toArray();
  }

  async exists(query: Filter<T>): Promise<boolean> {
    return (await (await this.getCollection()).count(query, {})) > 0;
  }

  async getAllPaged(
    query: Filter<T>,
    sortKey: DeepKeys<T>,
    sortDirection: SortDirection,
    page: number,
    take: number
  ): Promise<WithId<T>[]> {
    let cursor = (await this.getCollection()).find(query as any);
    if (sortKey as any) {
      cursor = cursor.sort(sortKey as any, sortDirection);
    }
    return (await cursor.skip(page * take).limit(take)).toArray();
  }

  async getAllCursor(
    query: Filter<T>,
    sortKey: DeepKeys<T>,
    sortDirection: SortDirection,
    page: number,
    take: number
  ): Promise<FindCursor<WithId<T>>> {
    let cursor = (await this.getCollection()).find(query);
    if (sortKey as any) {
      cursor = cursor.sort(sortKey as any, sortDirection);
    }
    return cursor.skip(page * take).limit(take);
  }

  async count(query: Filter<T>): Promise<number> {
    return await (await this.getCollection()).count(query, {});
  }

  async ensureIndex(spec: any, options: CreateIndexesOptions): Promise<string> {
    console.log('ensure index');
    const s = await (await this.getCollection()).createIndex(spec, options);
    console.log('ensured index');
    return s;
  }
}
