import {ObjectID} from 'mongodb';

export interface DBCar {
  _id: ObjectID;
  color: 'black' | 'red';
  tailPipe: {
    length: number;
    count: number;
  };
  doors: {side: 'left' | 'right'; childLocks: boolean; bolts: Bolt[]}[];
  carburetor: {bolts: Bolt[]};
}
export interface Bolt {
  type: 'phillips' | 'flat';
}
