"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggregator = exports.tableName = void 0;
function tableName(tableName) {
    return tableName;
}
exports.tableName = tableName;
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
    $bucket(props) {
        this.currentPipeline = { $bucket: props };
        return new Aggregator(this);
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
                let: props.let,
                pipeline: props.pipeline
                    ? props
                        .pipeline(new Aggregator())
                        .query()
                    : undefined,
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
    $replaceRoot(params) {
        this.currentPipeline = { $replaceRoot: params };
        return new Aggregator(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBNndCQSxTQUFnQixTQUFTLENBQW9CLFNBQWlCO0lBQzVELE9BQU8sU0FBOEIsQ0FBQztBQUN4QyxDQUFDO0FBRkQsOEJBRUM7QUFJRCxNQUFhLFVBQVU7SUFHckIsWUFBNEIsTUFBWTtRQUFaLFdBQU0sR0FBTixNQUFNLENBQU07SUFBRyxDQUFDO0lBRTVDLE1BQU0sQ0FBQyxLQUFLO1FBQ1YsT0FBTyxJQUFJLFVBQVUsRUFBSyxDQUFDO0lBQzdCLENBQUM7SUFDRCxVQUFVLENBQVcsTUFBa0M7UUFDckQsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsQ0FBQztRQUM1QyxPQUFPLElBQUksVUFBVSxDQUF1QyxJQUFJLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsT0FBTyxDQUF1RSxLQUs3RTtRQUNDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDeEMsT0FBTyxJQUFJLFVBQVUsQ0FBa0UsSUFBSSxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUNELFdBQVc7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELFVBQVU7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELE1BQU0sQ0FBc0IsR0FBUztRQUNuQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxVQUFVLENBQTJCLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxVQUFVO1FBQ1IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lB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