import {postgresToYMD, dateToYMD, postgresToDatestring} from './dateparser';
import {buildTimeRange} from './rangeBuilder';
import { SingleDatePoint } from './types';

export type Data = {
    date: Date,
    investigator_code: string;
}
export type Count = {
    date: Date,
    count: number;
}

type Scale = SCALE.MONTH | SCALE.DAY

export enum SCALE {
    DAY = "DAY",
    MONTH = "MONTH",
}

// Process cound data
export const generateCountTimeline = (data : Count[], iclass: string, scale:Scale) => {
    const timerange = buildTimeRange(scale, [iclass]);
        
    data.map( record => {
        const year = dateToYMD(record.date).slice(0,4)
        
        const entry = scale === SCALE.DAY
        ? dateToYMD(record.date)
        : dateToYMD(record.date).slice(0,7);
        
        const target = scale === SCALE.DAY 
        ? timerange[year].filter((sdp:SingleDatePoint) => sdp.date === entry)
        : timerange[year].filter((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)

        target[0][iclass] += record.count
    })
    const result = {
        datapoints_absolute: timerange, 
        meta: {
            investigator: [iclass],
            total: data.length,
        }
    }
    return result
}

export const generateHistogram = (data : Data[], ids: string[], scale:Scale) => {

    const timerange = buildTimeRange(scale, ids);

    data.map( record => {
        const year = dateToYMD(record.date).slice(0,4)

        const entry = scale === SCALE.DAY
        ? dateToYMD(record.date)
        : dateToYMD(record.date).slice(0,7);
        
        const target = scale === SCALE.DAY 
            ? timerange[year].filter((sdp:SingleDatePoint) => sdp.date === entry)
            : timerange[year].filter((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)
        target[0][record.investigator_code] += 1
    } )

    const result = {
        datapoints_absolute: timerange, 
        datapoints_relative: timerange, 
        meta: {
            investigator: ids,
            total: data.length,
        }
    }

    return result
}
