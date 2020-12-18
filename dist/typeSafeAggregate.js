"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggregator = exports.isPossiblyTableName = exports.tableName = void 0;
let m = {
    item: 'foo',
    qty: 25,
    size: { len: 25, w: 10, uom: 'cm' },
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBaXJCQSxJQUFJLENBQUMsR0FBRztJQUNOLElBQUksRUFBRSxLQUFLO0lBQ1gsR0FBRyxFQUFFLEVBQUU7SUFDUCxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztDQUNsQyxDQUFDO0FBeVRGLFNBQWdCLFNBQVMsQ0FBb0IsU0FBaUI7SUFDNUQsT0FBTyxTQUE4QixDQUFDO0FBQ3hDLENBQUM7QUFGRCw4QkFFQztBQUNELFNBQWdCLG1CQUFtQixDQUFDLFNBQWM7SUFDaEQsT0FBTyxPQUFPLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFDdkMsQ0FBQztBQUZELGtEQUVDO0FBSUQsTUFBYSxVQUFVO0lBR3JCLFlBQTRCLE1BQVk7UUFBWixXQUFNLEdBQU4sTUFBTSxDQUFNO0lBQUcsQ0FBQztJQUU1QyxNQUFNLENBQUMsS0FBSztRQUNWLE9BQU8sSUFBSSxVQUFVLEVBQUssQ0FBQztJQUM3QixDQUFDO0lBQ0QsVUFBVSxDQUFXLE1BQWtDO1FBQ3JELElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLFVBQVUsQ0FBdUMsSUFBSSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELE9BQU8sQ0FBdUUsS0FLN0U7UUFDQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxVQUFVLENBQWtFLElBQUksQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFFRCxXQUFXLENBQWlDLEtBa0IzQztRQUNDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFD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