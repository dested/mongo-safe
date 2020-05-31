import {Aggregator} from '../src/typeSafeAggregate';
import {DBCar} from './models/dbCar';

test('match', async () => {
  const result = new Aggregator<DBCar>().$match({color: 'black'}).query();
  expect(result).toEqual({color: 'black'});
});
