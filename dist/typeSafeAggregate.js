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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBd3pCQSxTQUFnQixTQUFTLENBQW9CLFNBQWlCO0lBQzVELE9BQU8sU0FBOEIsQ0FBQztBQUN4QyxDQUFDO0FBRkQsOEJBRUM7QUFDRCxTQUFnQixtQkFBbUIsQ0FBQyxTQUFjO0lBQ2hELE9BQU8sT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxrREFFQztBQUlELE1BQWEsVUFBVTtJQUdyQixZQUE0QixNQUFZO1FBQVosV0FBTSxHQUFOLE1BQU0sQ0FBTTtJQUFHLENBQUM7SUFFNUMsTUFBTSxDQUFDLEtBQUs7UUFDVixPQUFPLElBQUksVUFBVSxFQUFLLENBQUM7SUFDN0IsQ0FBQztJQUNELFVBQVUsQ0FBVyxNQUFrQztRQUNyRCxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxDQUFDO1FBQzVDLE9BQU8sSUFBSSxVQUFVLENBQXVDLElBQUksQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxPQUFPLENBQXVFLEtBSzdFO1FBQ0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUN4QyxPQUFPLElBQUksVUFBVSxDQUFrRSxJQUFJLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsV0FBVyxDQUFpQyxLQWtCM0M7UUFDQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQzVDLE9BQU8sSUFBSSxVQUFVLENBQThDLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxNQUFNLENBQXNCLEdBQVM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQztRQUNyQyxPQUFPLElBQUks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