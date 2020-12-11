import {postgresToYMD, dateToYMD, postgresToDatestring} from './dateparser';
import {buildTimeRange} from './rangeBuilder';
import { SingleDatePoint } from './types';

export type Data = {
    date: Date,
    investigator_code: string;
}

type Scale = SCALE.MONTH | SCALE.DAY

export enum SCALE {
    DAY = "DAY",
    MONTH = "MONTH",
}

export const generateHistogram = (data : Data[], ids: string[], scale:Scale) => {

    const compositObj: {[key: string]: any}  = {}
    ids.forEach(id => compositObj[id] = buildTimeRange(scale));

    data.map( record => {
        const year = dateToYMD(record.date).slice(0,4)

        const entry = scale === SCALE.DAY
        ? dateToYMD(record.date)
        : dateToYMD(record.date).slice(0,7);
        
        const target = scale === SCALE.DAY 
            ? compositObj[record.investigator_code][year].filter((datapoint:SingleDatePoint) => datapoint.date === entry)
            : compositObj[record.investigator_code][year].filter((datapoint:SingleDatePoint) => datapoint.date.slice(0,7) === entry)
        target[0].value += 1
    } )

    const result = {
        datapoints: compositObj,
        meta: {
            investigator: data[0].investigator_code,
            total: data.length,
        }
    }

    return result
}
