"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentManager = void 0;
const mongodb_1 = require("mongodb");
class DocumentManager {
    constructor(collectionName, getConnection) {
        this.collectionName = collectionName;
        this.getConnection = getConnection;
    }
    async insertDocument(document) {
        console.log('inserting');
        const result = await (await this.getCollection()).insertOne(document);
        console.log('inserted');
        document._id = result.insertedId;
        console.log('inserted got id  ');
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
    async getOne(query, projection) {
        if (projection) {
            console.log('get one project');
            const result = await (await this.getCollection()).findOne(query, { projection });
            console.log('got one project');
            return result;
        }
        else {
            // console.log('get one');
            const result = await (await this.getCollection()).findOne(query);
            // console.log('got one');
            return result;
        }
    }
    async getAllProject(query, projection) {
        // console.time(`getting all`);
        const items = (await this.getCollection()).find(query).project(projection).toArray();
        // console.timeEnd(`getting all`);
        return items;
    }
    async aggregate(query) {
        return (await this.getCollection()).aggregate(query).toArray();
    }
    async getById(id, projection) {
        const objectId = typeof id === 'string' ? mongodb_1.ObjectID.createFromHexString(id) : id;
        if (projection) {
            return (await this.getCollection()).findOne({ _id: objectId }, { projection });
        }
        else {
            return (await this.getCollection()).findOne({ _id: objectId });
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RvY3VtZW50TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBbUg7QUFFbkgsTUFBYSxlQUFlO0lBQzFCLFlBQW9CLGNBQXNCLEVBQVUsYUFBZ0M7UUFBaEUsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7SUFBRyxDQUFDO0lBRXhGLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBdUI7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixRQUFRLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sUUFBcUIsQ0FBQztJQUMvQixDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWE7UUFDakIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFZLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUEwQjtRQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsU0FB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