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
    async getOneProject(query, projection) {
        const item = await (await this.getCollection()).findOne(query, { projection });
        return item;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RvY3VtZW50TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FZaUI7QUFFakIsTUFBYSxlQUFlO0lBQzFCLFlBQW9CLGNBQXNCLEVBQVUsYUFBZ0M7UUFBaEUsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7SUFBRyxDQUFDO0lBRXhGLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBdUI7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixRQUFRLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sUUFBcUIsQ0FBQztJQUMvQixDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWE7UUFDakIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFZLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUEwQjtRQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsU0FB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