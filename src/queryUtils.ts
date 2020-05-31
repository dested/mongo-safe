export class QueryUtils {
  static locationSearch(latitude: number, longitude: number, minDistance: number, maxDistance: number) {
    return {
      $near: {
        $geometry: {type: 'Point', coordinates: [longitude, latitude]},
        $minDistance: minDistance,
        $maxDistance: maxDistance,
      },
    } as const;
  }

  static regex(regExp: RegExp) {
    return (regExp as unknown) as string;
  }
}
