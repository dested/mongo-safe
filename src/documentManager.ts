import {
  AggregationCursor,
  Cursor,
  Db,
  DeepKeys,
  FilterQuery,
  IndexOptions,
  ObjectID,
  ObjectId,
  OptionalId,
  UpdateQuery,
  WithId,
} from 'mongodb';

export class DocumentManager<T extends {_id: ObjectId}> {
  constructor(private collectionName: string, private getConnection: () => Promise<Db>) {}

  async insertDocument(document: OptionalId<T>): Promise<WithId<T>> {
    console.log('inserting');
    const result = await (await this.getCollection()).insertOne(document);
    console.log('inserted');
    document._id = result.insertedId;
    console.log('inserted got id  ');
    return document as WithId<T>;
  }

  async getCollection<TOverride = T>() {
    return (await this.getConnection()).collection<TOverride>(this.collectionName);
  }

  async insertDocuments(documents: OptionalId<T>[]): Promise<WithId<T>[]> {
    const result = await (await this.getCollection()).insertMany(documents);
    for (let i = 0; i < documents.length; i++) {
      documents[i]._id = result.insertedIds[i];
    }
    return documents as WithId<T>[];
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T> | T): Promise<void> {
    await (await this.getCollection()).updateOne(filter, update);
  }

  async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T> | T): Promise<void> {
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
  >(query: FilterQuery<T>, projection: TProjection): Promise<{[key in TKeys]: TOverride[key]}> {
    const item = await (await this.getCollection<any>()).findOne(query as any, {projection});
    return item;
  }

  async getOne(query: FilterQuery<T>, projection?: any): Promise<T | null> {
    if (projection) {
      console.log('get one project');
      const result = await (await this.getCollection()).findOne(query, {projection});
      console.log('got one project');
      return result;
    } else {
      // console.log('get one');
      const result = await (await this.getCollection()).findOne(query);
      // console.log('got one');
      return result;
    }
  }

  async getAllProject<
    TOverride extends {[key in keyof T]: T[key]} = {[key in keyof T]: T[key]},
    TProjection extends {[key in keyof TOverride]?: 1 | -1} = {[key in keyof TOverride]?: 1 | -1},
    TKeys extends keyof TProjection & keyof TOverride = keyof T
  >(query: FilterQuery<T>, projection: TProjection): Promise<{[key in TKeys]: TOverride[key]}[]> {
    // console.time(`getting all`);
    const items = (await this.getCollection<any>())
      .find(query as any)
      .project(projection)
      .toArray();
    // console.timeEnd(`getting all`);
    return items;
  }

  async aggregate<TAgg>(query: any): Promise<TAgg[]> {
    return (await this.getCollection<any>()).aggregate(query).toArray();
  }

  async aggregateCursor<TAgg>(query: any): Promise<AggregationCursor<TAgg>> {
    return (await this.getCollection<any>()).aggregate(query);
  }

  async getById(id: string | ObjectID, projection?: any): Promise<T | null> {
    const objectId: ObjectID = typeof id === 'string' ? ObjectID.createFromHexString(id) : id;
    if (projection) {
      return (await this.getCollection()).findOne({_id: objectId} as any, {projection});
    } else {
      return (await this.getCollection()).findOne({_id: objectId} as any);
    }
  }

  async deleteMany(query: FilterQuery<T>): Promise<void> {
    await (await this.getCollection()).deleteMany(query);
  }
  async deleteOne(query: FilterQuery<T>): Promise<void> {
    await (await this.getCollection()).deleteOne(query);
  }

  async getAll(query: FilterQuery<T>): Promise<T[]> {
    return (await (await this.getCollection()).find(query)).toArray();
  }

  async exists(query: FilterQuery<T>): Promise<boolean> {
    return (await (await this.getCollection()).count(query, {})) > 0;
  }

  async getAllPaged(
    query: FilterQuery<T>,
    sortKey: DeepKeys<T>,
    sortDirection: number,
    page: number,
    take: number
  ): Promise<T[]> {
    let cursor = (await this.getCollection()).find(query as any);
    if (sortKey as any) {
      cursor = cursor.sort(sortKey as any, sortDirection);
    }
    return (await cursor.skip(page * take).limit(take)).toArray();
  }

  async getAllCursor(
    query: FilterQuery<T>,
    sortKey: DeepKeys<T>,
    sortDirection: number,
    page: number,
    take: number
  ): Promise<Cursor<T>> {
    let cursor = (await this.getCollection()).find(query);
    if (sortKey as any) {
      cursor = cursor.sort(sortKey as any, sortDirection);
    }
    return cursor.skip(page * take).limit(take);
  }

  async count(query: FilterQuery<T>): Promise<number> {
    return await (await this.getCollection()).count(query, {});
  }

  async ensureIndex(spec: any, options: IndexOptions): Promise<string> {
    console.log('ensure index');
    const s = await (await this.getCollection()).createIndex(spec, options);
    console.log('ensured index');
    return s;
  }
}
