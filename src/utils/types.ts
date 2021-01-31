import { SCALE, KEYLISTCLASS, KEYLISTINVESTIGATOR } from './constants';

export type SingleDatePoint = {
  [key in KEYLISTCLASS | KEYLISTINVESTIGATOR]: number;
} & {
  date: string;
};

export type Data = {
  date: Date;
  investigator_code: string;
  val?: number;
};
export type FactionData = { val: number; date: Date; id?: string };
export type Count = {
  date: Date;
  count: number;
};
export type Scale = SCALE.MONTH | SCALE.DAY;

export type GenericObject = {
  [key: string]: any;
};

export type InvCount = { count: number };
export type Timerange = { [index: string]: SingleDatePoint[] };

export type Histogram = {
  datapoints_absolute: Timerange;
  datapoints_relative: Timerange;
  meta: {
    investigators: string[];
    numDecks: GenericObject;
    allDeckTotal: number;
    factionTotal: GenericObject;
  };
};

export type FullRecord = {
  id: number;
  data: Date;
  did: string;
  investigator_code: string;
  investigator_name: string;
  xp: number;
  slots: string[];
};
