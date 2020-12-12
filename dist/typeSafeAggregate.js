"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggregator = void 0;
class Aggregator {
    constructor(parent) {
        this.parent = parent;
    }
    static start() {
        return new Aggregator();
    }
    $addFields(fields) {
        this.currentPipeline = { $addFields: fields };
        return new Aggregator(this);
    }
    $bucket() {
        throw new Error('Not Implemented');
    }
    $bucketAuto() {
        throw new Error('Not Implemented');
    }
    $collStats() {
        throw new Error('Not Implemented');
    }
    $count(key) {
        this.currentPipeline = { $count: key };
        return new Aggregator(this);
    }
    $currentOp() {
        throw new Error('Not Implemented');
    }
    $facet(props) {
        this.currentPipeline = { $facet: {} };
        for (const safeKey of safeKeys(props)) {
            this.currentPipeline.$facet[safeKey] = props[safeKey](new Aggregator()).query();
        }
        return new Aggregator(this);
    }
    $geoNear(props) {
        this.currentPipeline = { $geoNear: props };
        return new Aggregator(this);
    }
    $graphLookup(props) {
        this.currentPipeline = { $graphLookup: props };
        return new Aggregator(this);
    }
    $group(props) {
        this.currentPipeline = { $group: props };
        return new Aggregator(this);
    }
    $indexStats() {
        throw new Error('Not Implemented');
    }
    $limit(limit) {
        this.currentPipeline = { $limit: limit };
        return new Aggregator(this);
    }
    $listLocalSessions() {
        throw new Error('Not Implemented');
    }
    $listSessions() {
        throw new Error('Not Implemented');
    }
    $lookup(props) {
        this.currentPipeline = {
            $lookup: {
                from: props.from,
                localField: props.localField,
                foreignField: props.foreignField,
                as: props.as,
            },
        };
        return new Aggregator(this);
    }
    $match(query) {
        this.currentPipeline = { $match: query };
        return new Aggregator(this);
    }
    $merge() {
        throw new Error('Not Implemented');
    }
    $out(tableName) {
        this.currentPipeline = { $out: tableName };
        return new Aggregator(this);
    }
    $planCacheStats() {
        throw new Error('Not Implemented');
    }
    $project(query) {
        this.currentPipeline = { $project: query };
        return new Aggregator(this);
    }
    $redact() {
        throw new Error('Not Implemented');
    }
    $replaceRoot() {
        throw new Error('Not Implemented');
    }
    $replaceWith() {
        throw new Error('Not Implemented');
    }
    $sample(props) {
        this.currentPipeline = { $sample: props };
        return new Aggregator(this);
    }
    $set() {
        throw new Error('Not Implemented');
    }
    $skip(skip) {
        this.currentPipeline = { $skip: skip };
        return new Aggregator(this);
    }
    $sort(sorts) {
        this.currentPipeline = { $sort: sorts };
        return new Aggregator(this);
    }
    $sortByCount() {
        throw new Error('Not Implemented');
    }
    $unset(key) {
        this.currentPipeline = { $unset: key };
        return new Aggregator(this);
    }
    $unwind(key) {
        this.currentPipeline = { $unwind: key };
        return new Aggregator(this);
    }
    query() {
        const pipelines = [];
        if (this.currentPipeline) {
            pipelines.push(this.currentPipeline);
        }
        let parent = this.parent;
        while (parent) {
            pipelines.push(parent.currentPipeline);
            parent = parent.parent;
        }
        return pipelines.reverse();
    }
    async result(collection) {
        const query = this.query();
        // console.log(JSON.stringify(q, null, 2));
        return collection.aggregate(query).toArray();
    }
    async resultCursor(collection) {
        const query = this.query();
        // console.log(JSON.stringify(q, null, 2));
        return collection.aggregate(query);
    }
}
exports.Aggregator = Aggregator;
function safeKeys(model) {
    return Object.keys(model);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBa3dCQSxNQUFhLFVBQVU7SUFHckIsWUFBNEIsTUFBWTtRQUFaLFdBQU0sR0FBTixNQUFNLENBQU07SUFBRyxDQUFDO0lBRTVDLE1BQU0sQ0FBQyxLQUFLO1FBQ1YsT0FBTyxJQUFJLFVBQVUsRUFBSyxDQUFDO0lBQzdCLENBQUM7SUFDRCxVQUFVLENBQVcsTUFBa0M7UUFDckQsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsQ0FBQztRQUM1QyxPQUFPLElBQUksVUFBVSxDQUF1QyxJQUFJLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsV0FBVztRQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsVUFBVTtRQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsTUFBTSxDQUFzQixHQUFTO1FBQ25DLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUM7UUFDckMsT0FBTyxJQUFJLFVBQVUsQ0FBMkIsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELE1BQU0sQ0FDSixLQUE2RTtRQUU3RSxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBRXBDLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lB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