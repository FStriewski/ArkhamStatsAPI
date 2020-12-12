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

    const timerange = buildTimeRange(scale, ids);

    data.map( record => {
        const year = dateToYMD(record.date).slice(0,4)

        const entry = scale === SCALE.DAY
        ? dateToYMD(record.date)
        : dateToYMD(record.date).slice(0,7);
        
        const target = scale === SCALE.DAY 
            ? timerange[year].filter((datapoint:SingleDatePoint) => datapoint.date === entry)
            : timerange[year].filter((datapoint:SingleDatePoint) => datapoint.date.slice(0,7) === entry)
        target[0][record.investigator_code] += 1
    } )

    const result = {
        datapoints: timerange, 
        meta: {
            investigator: ids,
            total: data.length,
        }
    }

    return result
}
