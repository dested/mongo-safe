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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBbXNCQSxNQUFhLFVBQVU7SUFHckIsWUFBNEIsTUFBWTtRQUFaLFdBQU0sR0FBTixNQUFNLENBQU07SUFBRyxDQUFDO0lBRTVDLE1BQU0sQ0FBQyxLQUFLO1FBQ1YsT0FBTyxJQUFJLFVBQVUsRUFBbUIsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsVUFBVSxDQUFXLE1BQWtDO1FBQ3JELElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLFVBQVUsQ0FBdUMsSUFBSSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELE9BQU87UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELFdBQVc7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELFVBQVU7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELE1BQU0sQ0FBc0IsR0FBUztRQUNuQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxVQUFVLENBQTJCLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxVQUFVO1FBQ1IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNO1FBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxRQUFRLENBQWdDLEtBV3ZDO1FBQ0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksVUFBVSxDQUF3QyxJQUFJLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0QsWUFBWSxDQUFpRSxLQVE1RTtRQUNDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDN0MsT0FBTyxJQUFJLFVBQVUsQ0FBMEMsSUFBSSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELE1BQU0sQ0FDSixLQUVDLEVBQ0QsSUFBd0M7UUFFeEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE1BQU0sa0NBQU0sS0FBSyxHQUFLLElBQUksQ0FBQyxFQUFDLENBQUM7UUFDckQsT0FBTyxJQUFJLFVBQVUsQ0FBeUUsSUFBSSxDQUFDLENBQUM7SUFDdEcsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFhO1FBQ2xCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDdkMsT0FBTyxJQUFJLFVBQVUsQ0FBSSxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsYUFBYTtRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsT0FBTyxDQUFtQyxLQUt6QztRQUNDLElBQUksQ0FBQyxlQUFlLEdBQUc7WUFDckIsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDaEIsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO2dCQUM1QixZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQ2hDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTthQUNiO1NBQ0YsQ0FBQztRQUNGLE9BQU8sSUFBSSxVQUFVLENBQXFDLElBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBcUI7UUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUN2QyxPQUFPLElBQUksVUFBVSxDQUFJLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxJQUFJLENBQUMsU0FBaUI7UUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksVUFBVSxDQUFPLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxlQUFlO1FBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxRQUFRLENBQ04sS0FBaUM7UUFFakMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksVUFBVSxDQUF5RCxJQUFJLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsWUFBWTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsWUFBWTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQXFCO1FBQzNCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDeEMsT0FBTyxJQUFJLFVBQVUsQ0FBSSxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsSUFBSTtRQUNGLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQVk7UUFDaEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUNyQyxPQUFPLElBQUksVUFBVSxDQUFJLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxLQUFLLENBQUMsS0FBc0M7UUFDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUN0QyxPQUFPLElBQUksVUFBVSxDQUFJLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxZQUFZO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNO1FBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxPQUFPLENBQ0wsR0FBZ0g7UUFJaEgsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUMsQ0FBQztRQUN0QyxPQUFPLElBQUksVUFBVSxDQUVuQixJQUFJLENBQUMsQ0FBQztJQUNWLENBQUM7SUFFRCxLQUFLO1FBQ0gsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFnQixDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pCLE9BQU8sTUFBTSxFQUFFO1lBQ2IsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZ0IsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQStCLFVBQTRCO1FBQ3JFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQiwyQ0FBMkM7UUFDM0MsT0FBTyxVQUFVLENBQUMsU0FBUyxDQUFJLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUErQixVQUE0QjtRQUMzRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsMkNBQTJDO1FBQzNDLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBSSxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0Y7QUFuTUQsZ0NBbU1DIn0=