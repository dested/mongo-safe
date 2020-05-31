import {ObjectID} from 'mongodb';

export interface DBTire {
  _id: ObjectID;
  carId: ObjectID;
  size: number;
}
