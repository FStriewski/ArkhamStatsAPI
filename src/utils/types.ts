import {SCALE, KEYLISTCLASS, KEYLISTINVESTIGATOR} from './constants';

export type SingleDatePoint = {
    [ key in  KEYLISTCLASS | KEYLISTINVESTIGATOR] : number} & {
    date: string;
    }

export type Data = {
    date: Date,
    investigator_code: string;
}
export type Count = {
    date: Date,
    count: number;
}
export type Scale = SCALE.MONTH | SCALE.DAY

export type GenericObject = {
    [key: string]: any
}
