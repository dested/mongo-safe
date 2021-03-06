import {ObjectID} from 'mongodb';

export interface DBWindow {
  _id: ObjectID;
  carId: ObjectID;
  tint: 'dark' | 'light';
}
