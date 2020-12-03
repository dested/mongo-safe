"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentManager = void 0;
const mongodb_1 = require("mongodb");
class DocumentManager {
    constructor(collectionName) {
        this.collectionName = collectionName;
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
        return (await DataManager.dbConnection()).collection(this.collectionName);
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
        const items = (await (await DataManager.dbConnection()).collection(this.collectionName).find(query).project(projection)).toArray();
        // console.timeEnd(`getting all`);
        return items;
    }
    async aggregate(query) {
        return (await DataManager.dbConnection()).collection(this.collectionName).aggregate(query).toArray();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGF0YU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQStHO0FBRS9HLE1BQWEsZUFBZTtJQUMxQixZQUFvQixjQUFzQjtRQUF0QixtQkFBYyxHQUFkLGNBQWMsQ0FBUTtJQUFHLENBQUM7SUFFOUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUF1QjtRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDakMsT0FBTyxRQUFxQixDQUFDO0lBQy9CLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYTtRQUNqQixPQUFPLENBQUMsTUFBTSxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQTBCO1FBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFX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