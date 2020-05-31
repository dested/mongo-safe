import {ObjectID} from 'mongodb';

export class DBWindow {
  _id: ObjectID;
  carId: ObjectID;
  tint: 'dark' | 'light';
}
