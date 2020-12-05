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
    $facet() {
        throw new Error('Not Implemented');
    }
    $geoNear(props) {
        this.currentPipeline = { $geoNear: props };
        return new Aggregator(this);
    }
    $graphLookup(props) {
        this.currentPipeline = { $graphLookup: props };
        return new Aggregator(this);
    }
    $group(props, body) {
        this.currentPipeline = { $group: Object.assign(Object.assign({}, props), body) };
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
    $unset() {
        throw new Error('Not Implemented');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBdXRCQSxNQUFhLFVBQVU7SUFHckIsWUFBNEIsTUFBWTtRQUFaLFdBQU0sR0FBTixNQUFNLENBQU07SUFBRyxDQUFDO0lBRTVDLE1BQU0sQ0FBQyxLQUFLO1FBQ1YsT0FBTyxJQUFJLFVBQVUsRUFBSyxDQUFDO0lBQzdCLENBQUM7SUFDRCxVQUFVLENBQVcsTUFBa0M7UUFDckQsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsQ0FBQztRQUM1QyxPQUFPLElBQUksVUFBVSxDQUF1QyxJQUFJLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsV0FBVztRQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsVUFBVTtRQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsTUFBTSxDQUFzQixHQUFTO1FBQ25DLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUM7UUFDckMsT0FBTyxJQUFJLFVBQVUsQ0FBMkIsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELE1BQU07UUFDSixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELFFBQVEsQ0FBZ0MsS0FXdkM7UUFDQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsUUFBUSxFQUFFLEtBQUss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