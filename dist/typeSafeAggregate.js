"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggregator = exports.isPossiblyTableName = exports.tableName = void 0;
function tableName(tableName) {
    return tableName;
}
exports.tableName = tableName;
function isPossiblyTableName(tableName) {
    return typeof tableName === 'string';
}
exports.isPossiblyTableName = isPossiblyTableName;
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
    $bucketAuto(props) {
        this.currentPipeline = { $bucketAuto: props };
        return new Aggregator(this);
    }
    $count(key) {
        this.currentPipeline = { $count: key };
        return new Aggregator(this);
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
    $limit(limit) {
        this.currentPipeline = { $limit: limit };
        return new Aggregator(this);
    }
    $lookup(props) {
        this.currentPipeline = {
            $lookup: Object.assign(Object.assign({ from: props.from, localField: props.localField, foreignField: props.foreignField, as: props.as }, (props.let ? { let: props.let } : {})), (props.pipeline
                ? {
                    pipeline: props
                        .pipeline(new Aggregator())
                        .query(),
                }
                : {})),
        };
        return new Aggregator(this);
    }
    $match(query) {
        this.currentPipeline = { $match: query };
        return new Aggregator(this);
    }
    $merge(props) {
        if (props.whenMatched && typeof props.whenMatched === 'function') {
            this.currentPipeline = { $merge: Object.assign(Object.assign({}, props), { whenMatched: props.whenMatched(new Aggregator()).query() }) };
        }
        else {
            this.currentPipeline = { $merge: props };
        }
        return new Aggregator(this);
    }
    $out(tableName) {
        this.currentPipeline = { $out: tableName };
        return new Aggregator(this);
    }
    $project(query) {
        this.currentPipeline = { $project: query };
        return new Aggregator(this);
    }
    $redact(expression) {
        this.currentPipeline = { $redact: expression };
        return new Aggregator(this);
    }
    $replaceRoot(params) {
        this.currentPipeline = { $replaceRoot: params };
        return new Aggregator(this);
    }
    $replaceWith(params) {
        this.currentPipeline = { $replaceWith: params };
        return new Aggregator(this);
    }
    $sample(props) {
        this.currentPipeline = { $sample: props };
        return new Aggregator(this);
    }
    $sampleRate(props) {
        this.currentPipeline = { $sampleRate: props };
        return new Aggregator(this);
    }
    $set(fields) {
        this.currentPipeline = { $set: fields };
        return new Aggregator(this);
    }
    $skip(skip) {
        this.currentPipeline = { $skip: skip };
        return new Aggregator(this);
    }
    $sort(sorts) {
        this.currentPipeline = { $sort: sorts };
        return new Aggregator(this);
    }
    $sortByCount(expression) {
        this.currentPipeline = { $sortByCount: expression };
        return new Aggregator(this);
    }
    $unionWith(props) {
        if (isPossiblyTableName(props)) {
            this.currentPipeline = { $unionWith: props };
        }
        else {
            this.currentPipeline = {
                $unionWith: {
                    coll: props.coll,
                    pipeline: props.pipeline(new Aggregator()).query(),
                },
            };
        }
        return new Aggregator(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBK2dDQSxTQUFnQixTQUFTLENBQW9CLFNBQWlCO0lBQzVELE9BQU8sU0FBOEIsQ0FBQztBQUN4QyxDQUFDO0FBRkQsOEJBRUM7QUFDRCxTQUFnQixtQkFBbUIsQ0FBQyxTQUFjO0lBQ2hELE9BQU8sT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxrREFFQztBQUtELE1BQWEsVUFBVTtJQUdyQixZQUE0QixNQUFZO1FBQVosV0FBTSxHQUFOLE1BQU0sQ0FBTTtJQUFHLENBQUM7SUFFNUMsTUFBTSxDQUFDLEtBQUs7UUFDVixPQUFPLElBQUksVUFBVSxFQUFLLENBQUM7SUFDN0IsQ0FBQztJQUNELFVBQVUsQ0FBVyxNQUFzQztRQUN6RCxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxDQUFDO1FBQzVDLE9BQU8sSUFBSSxVQUFVLENBQTJDLElBQUksQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxPQUFPLENBQXVFLEtBSzdFO1FBQ0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUN4QyxPQUFPLElBQUksVUFBVSxDQUFrRSxJQUFJLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsV0FBVyxDQUFpQyxLQWtCM0M7UUFDQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQzVDLE9BQU8sSUFBSSxVQUFVLENBQThDLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxNQUFNLENBQXNCLEdBQVM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQztRQUNyQyxPQUFPLElBQUks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