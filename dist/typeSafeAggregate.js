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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBc3pCQSxTQUFnQixTQUFTLENBQW9CLFNBQWlCO0lBQzVELE9BQU8sU0FBOEIsQ0FBQztBQUN4QyxDQUFDO0FBRkQsOEJBRUM7QUFDRCxTQUFnQixtQkFBbUIsQ0FBQyxTQUFjO0lBQ2hELE9BQU8sT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxrREFFQztBQUlELE1BQWEsVUFBVTtJQUdyQixZQUE0QixNQUFZO1FBQVosV0FBTSxHQUFOLE1BQU0sQ0FBTTtJQUFHLENBQUM7SUFFNUMsTUFBTSxDQUFDLEtBQUs7UUFDVixPQUFPLElBQUksVUFBVSxFQUFLLENBQUM7SUFDN0IsQ0FBQztJQUNELFVBQVUsQ0FBVyxNQUFrQztRQUNyRCxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxDQUFDO1FBQzVDLE9BQU8sSUFBSSxVQUFVLENBQXVDLElBQUksQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxPQUFPLENBQXVFLEtBSzdFO1FBQ0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUN4QyxPQUFPLElBQUksVUFBVSxDQUFrRSxJQUFJLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsV0FBVyxDQUFpQyxLQWtCM0M7UUFDQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQzVDLE9BQU8sSUFBSSxVQUFVLENBQThDLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxNQUFNLENBQXNCLEdBQVM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQztRQUNyQyxPQUFPLElBQUks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