import {ObjectID} from 'mongodb';

export interface DBCar {
  _id: ObjectID;
  color: 'black' | 'red';
  tailPipe: {
    length: number;
    count: number;
  };
  doors: Door[];
  carburetor: Carburetor;
}

export interface Carburetor {
  bolts: Bolt[];
  base: CarburetorBase;
}

export interface CarburetorBase {
  bolts: Bolt[];
}

export interface Door {
  side: 'left' | 'right';
  childLocks: boolean;
  bolts: Bolt[];
}
export interface Bolt {
  type: 'phillips' | 'flat';
}
