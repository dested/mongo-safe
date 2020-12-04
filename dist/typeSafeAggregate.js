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
    $geoNear() {
        throw new Error('Not Implemented');
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
    $out() {
        throw new Error('Not Implemented');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZ29CQSxNQUFhLFVBQVU7SUFHckIsWUFBNEIsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7SUFBRyxDQUFDO0lBRXhELE1BQU0sQ0FBQyxLQUFLO1FBQ1YsT0FBTyxJQUFJLFVBQVUsRUFBbUIsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsVUFBVSxDQUFXLE1BQWtDO1FBQ3JELElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLFVBQVUsQ0FBdUMsSUFBSSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELE9BQU87UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELFdBQVc7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELFVBQVU7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELE1BQU0sQ0FBc0IsR0FBUztRQUNuQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxVQUFVLENBQTJCLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxVQUFVO1FBQ1IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNO1FBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxRQUFRO1FBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7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