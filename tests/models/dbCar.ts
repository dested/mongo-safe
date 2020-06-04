import {ObjectID} from 'mongodb';

export interface DBCar {
  _id: ObjectID;
  color: Color;
  tailPipe: {
    length: number;
    count: number;
  };
  doors: Door[];
  carburetor: Carburetor;
}
export type Color = 'black' | 'red';

export interface Carburetor {
  bolts: Bolt[];
  base: CarburetorBase;
}

export interface CarburetorBase {
  bolts: Bolt[];
}

export interface Door {
  someNumber: number;
  someDate: Date;
  someString: string;
  side: 'left' | 'right';
  childLocks: boolean;
  bolts: Bolt[];
}
export interface Bolt {
  type: 'phillips' | 'flat';
}
