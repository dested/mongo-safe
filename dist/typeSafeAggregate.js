"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggregator = void 0;
class Aggregator {
    constructor(parent) {
        this.parent = parent;
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
    $addFields(fields) {
        this.currentPipeline = { $addFields: fields };
        return new Aggregator(this);
    }
    $count(key) {
        this.currentPipeline = { $count: key };
        return new Aggregator(this);
    }
    $limit(limit) {
        this.currentPipeline = { $limit: limit };
        return new Aggregator(this);
    }
    /*
  
    $addFieldsCallback<T2>(
      callback: (aggregator: AggregatorLookup<T>) => ProjectObject<T2>
    ): Aggregator<T & ProjectObjectResult<T2>> {
      this.currentPipeline = {$addFields: callback(this)};
      return new Aggregator<T & ProjectObjectResult<T2>>(this);
    }
  
    $bucket(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
    $bucketAuto(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
    $collStats(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
  
    $currentOp(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
    $facet(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
    $geoNear(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
  
  
    $indexStats(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
  
    $listLocalSessions(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
    $listSessions(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
  
  
  
    $merge(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
    $out(): Aggregator<T> {
      throw new Error('Not Implemented');
    }
    $planCacheStats(): Aggregator<T> {
      throw new Error('Not Implemented');
    }*/
    $group(props, body) {
        this.currentPipeline = { $group: Object.assign(Object.assign({}, props), body) };
        return new Aggregator(this);
    }
    $graphLookup(props) {
        this.currentPipeline = { $graphLookup: props };
        return new Aggregator(this);
    }
    $match(query) {
        this.currentPipeline = { $match: query };
        return new Aggregator(this);
    }
    $project(query) {
        this.currentPipeline = { $project: query };
        return new Aggregator(this);
    }
    /*
    $projectCallback<TProject>(
      callback: (aggregator: AggregatorLookup<T>) => ProjectObject<TProject>
    ): Aggregator<ProjectObjectResult<TProject>> {
      this.currentPipeline = {$project: callback(this)};
      return new Aggregator<ProjectObjectResult<TProject>>(this);
    }
  */
    $redact() {
        throw new Error('Not Implemented');
    }
    $replaceRoot() {
        throw new Error('Not Implemented');
    }
    $replaceWith() {
        throw new Error('Not Implemented');
    }
    $sample() {
        throw new Error('Not Implemented');
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
    /*
     */
    $sortByCount() {
        throw new Error('Not Implemented');
    }
    $unset() {
        throw new Error('Not Implemented');
    }
    $unwind(key, key2, key3) {
        let result = '$';
        result += key;
        if (key2) {
            result += `.${key2}`;
        }
        if (key3) {
            result += `.${key3}`;
        }
        this.currentPipeline = { $unwind: result };
        return new Aggregator(this);
    }
    async result(collection) {
        return collection.aggregate(this.query()).toArray();
    }
    static start() {
        return new Aggregator();
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
}
exports.Aggregator = Aggregator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVNhZmVBZ2dyZWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZVNhZmVBZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBeWlCQSxNQUFhLFVBQVU7SUFHckIsWUFBNEIsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7SUFBRyxDQUFDO0lBRXhELE9BQU8sQ0FDTCxLQUF3QztRQUV4QyxJQUFJLENBQUMsZUFBZSxHQUFHO1lBQ3JCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtnQkFDNUIsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO2dCQUNoQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7YUFDYjtTQUNGLENBQUM7UUFDRixPQUFPLElBQUksVUFBVSxDQUFxQyxJQUFJLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBQ0QsVUFBVSxDQUFXLE1BQWtDO1FBQ3JELElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDNUMsT0FBTyxJQUFJLFVBQVUsQ0FBdUMsSUFBSSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNELE1BQU0sQ0FBc0IsR0FBUztRQUNuQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxVQUFVLENBQTJCLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRCxNQUFNLENBQUMsS0FBYTtRQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxVQUFVLENBQUksSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtREc7SUFFSCxNQUFNLENBQ0osS0FFQyxFQUNELElBQXdDO1FBRXhDLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxNQUFNLGtDQUFNLEtBQUssR0FBSyxJQUFJLENBQUMsRUFBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxVQUFVLENBQXlFLElBQUksQ0FBQyxDQUFDO0lBQ3RHLENBQUM7SUFFRCxZQUFZLENBQWlFLEtBUTVFO1FBQ0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUM3QyxPQUFPLElBQUksVUFBVSxDQUFtRSxJQUFJLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQXFCO1FBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDdkMsT0FBTyxJQUFJLFVBQVUsQ0FBSSxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsUUFBUSxDQUFXLEtBQWlDO1FBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLFVBQVUsQ0FBbUMsSUFBSSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNEOzs7Ozs7O0lBT0E7SUFDQSxPQUFPO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxZQUFZO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxZQUFZO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxPQUFPO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxJQUFJO1FBQ0YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxLQUFLLENBQUMsSUFBWTtRQUNoQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxVQUFVLENBQUksSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELEtBQUssQ0FBQyxLQUFzQztRQUMxQyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxVQUFVLENBQUksSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEO09BQ0c7SUFDSCxZQUFZO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNO1FBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFpQkQsT0FBTyxDQUE2QyxHQUFTLEVBQUUsSUFBWSxFQUFFLElBQVk7UUFDdkYsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLE1BQU0sSUFBSSxHQUFHLENBQUM7UUFDZCxJQUFJLElBQUksRUFBRTtZQUNSLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztTQUN0QjtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLFVBQVUsQ0FBSSxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBK0IsVUFBNEI7UUFDckUsT0FBTyxVQUFVLENBQUMsU0FBUyxDQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSztRQUNWLE9BQU8sSUFBSSxVQUFVLEVBQUssQ0FBQztJQUM3QixDQUFDO0lBRUQsS0FBSztRQUNILE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixPQUFPLE1BQU0sRUFBRTtZQUNiLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWdCLENBQUMsQ0FBQztZQUN4QyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUN4QjtRQUNELE9BQU8sU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQTVNRCxnQ0E0TUMifQ==