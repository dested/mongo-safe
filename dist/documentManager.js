"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentManager = void 0;
const mongodb_1 = require("mongodb");
const typeSafeAggregate_1 = require("./typeSafeAggregate");
class DocumentManager {
    constructor(collectionName, getConnection) {
        this.collectionName = collectionName;
        this.getConnection = getConnection;
        this.tableName = typeSafeAggregate_1.tableName(this.collectionName);
    }
    async insertDocument(document) {
        // console.log('inserting');
        const result = await (await this.getCollection()).insertOne(document);
        // console.log('inserted');
        document._id = result.insertedId;
        // console.log('inserted got id  ');
        return document;
    }
    async getCollection() {
        return (await this.getConnection()).collection(this.collectionName);
    }
    async insertDocuments(documents) {
        const result = await (await this.getCollection()).insertMany(documents);
        for (let i = 0; i < documents.length; i++) {
            documents[i]._id = result.insertedIds[i];
        }
        return documents;
    }
    async updateOne(filter, update) {
        await (await this.getCollection()).updateOne(filter, update);
    }
    async updateOneGet(filter, update) {
        const result = await (await this.getCollection()).updateOne(filter, update);
        if (result.upsertedCount === 1 || result.modifiedCount === 1) {
            return this.getOne(filter);
        }
        return undefined;
    }
    async updateMany(filter, update) {
        await (await this.getCollection()).updateMany(filter, update);
    }
    async updateDocument(document) {
        // console.log('getting update collection ', this.collectionName);
        const collection = await this.getCollection();
        // console.log('updating', this.collectionName);
        await collection.findOneAndReplace({ _id: document._id }, document);
        // console.log('update', this.collectionName);
        return document;
    }
    async getOneProject(query, projection) {
        const item = await (await this.getCollection()).findOne(query, { projection });
        return item;
    }
    async getOne(query, projection) {
        if (projection) {
            console.log('get one project');
            const result = await (await this.getCollection()).findOne(query, { projection });
            console.log('got one project');
            return result !== null && result !== void 0 ? result : undefined;
        }
        else {
            // console.log('get one');
            const result = await (await this.getCollection()).findOne(query);
            // console.log('got one');
            return result !== null && result !== void 0 ? result : undefined;
        }
    }
    async getAllProject(query, projection) {
        // console.time(`getting all`);
        const items = (await this.getCollection())
            .find(query)
            .project(projection)
            .toArray();
        // console.timeEnd(`getting all`);
        return items;
    }
    async aggregate(query) {
        return (await this.getCollection()).aggregate(query).toArray();
    }
    async aggregateCursor(query) {
        return (await this.getCollection()).aggregate(query);
    }
    async getById(id, projection) {
        const objectId = typeof id === 'string' ? mongodb_1.ObjectID.createFromHexString(id) : id;
        let result;
        if (projection) {
            result = await (await this.getCollection()).findOne({ _id: objectId }, { projection });
        }
        else {
            result = await (await this.getCollection()).findOne({ _id: objectId });
        }
        if (!result)
            return undefined;
        return result;
    }
    async deleteMany(query) {
        await (await this.getCollection()).deleteMany(query);
    }
    async deleteOne(query) {
        await (await this.getCollection()).deleteOne(query);
    }
    async getAll(query) {
        return (await (await this.getCollection()).find(query)).toArray();
    }
    async exists(query) {
        return (await (await this.getCollection()).count(query, {})) > 0;
    }
    async getAllPaged(query, sortKey, sortDirection, page, take) {
        let cursor = (await this.getCollection()).find(query);
        if (sortKey) {
            cursor = cursor.sort(sortKey, sortDirection);
        }
        return (await cursor.skip(page * take).limit(take)).toArray();
    }
    async getAllCursor(query, sortKey, sortDirection, page, take) {
        let cursor = (await this.getCollection()).find(query);
        if (sortKey) {
            cursor = cursor.sort(sortKey, sortDirection);
        }
        return cursor.skip(page * take).limit(take);
    }
    async count(query) {
        return await (await this.getCollection()).count(query, {});
    }
    async ensureIndex(spec, options) {
        console.log('ensure index');
        const s = await (await this.getCollection()).createIndex(spec, options);
        console.log('ensured index');
        return s;
    }
}
exports.DocumentManager = DocumentManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RvY3VtZW50TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FZaUI7QUFDakIsMkRBQThDO0FBRTlDLE1BQWEsZUFBZTtJQUMxQixZQUFvQixjQUFzQixFQUFVLGFBQWdDO1FBQWhFLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQW1CO1FBQzdFLGNBQVMsR0FBRyw2QkFBUyxDQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQURrQyxDQUFDO0lBRXhGLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBdUI7UUFDMUMsNEJBQTRCO1FBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RSwyQkFBMkI7UUFDM0IsUUFBUSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ2pDLG9DQUFvQztRQUNwQyxPQUFPLFFBQXFCLENBQUM7SUFDL0IsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhO1FBQ2pCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBWSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsU0FBMEI7UUFDOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FB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