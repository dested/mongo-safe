import {ObjectID} from 'mongodb';

export class DBCar {
  _id: ObjectID;
  color: 'black' | 'red';
  tailPipe: {
    length: number;
    count: number;
  };
  doors: {side: 'left' | 'right'; childLocks: boolean}[];
}
