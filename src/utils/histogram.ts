import {postgresToYMD, dateToYMD, postgresToDatestring} from './dateparser';
import {buildTimeRange} from './rangeBuilder';
import { SingleDatePoint } from './types';
import {generateTotalCount} from '../app';

export type Data = {
    date: Date,
    investigator_code: string;
}
export type Count = {
    date: Date,
    count: number;
}

export type Scale = SCALE.MONTH | SCALE.DAY

export enum SCALE {
    DAY = "DAY",
    MONTH = "MONTH",
}

export const retrieveYearEntity = (record: Count | Data, scale: Scale) => {
    const year = dateToYMD(record.date).slice(0,4)
    const entry = scale === SCALE.DAY
    ? dateToYMD(record.date)
    : dateToYMD(record.date).slice(0,7);

    return {year, entry}
}

// Process cound data
export const generateClassCountHistogram = async (data : Count[], iclass: string, scale:Scale) => {
    const timerange = buildTimeRange(scale, [iclass]);
    const total = await generateTotalCount(scale);
    
    data.map( record => {
        const {year, entry} = retrieveYearEntity(record, scale);
        const target = scale === SCALE.DAY 
        ? timerange[year].filter((sdp:SingleDatePoint) => sdp.date === entry)
        : timerange[year].filter((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)
        
        target[0][iclass] += record.count
    })

    const normalizedValues = () => {
        for (let year in timerange){
            timerange[year].map(month => {
                const normaliser = total[year].find(totalmonth => totalmonth.date === month.date)
                return {...month, [iclass]: Math.floor(month[iclass]/normaliser['all'])}
            })
        }
    }
    console.log(JSON.stringify(normalizedValues())) // => LOGS UNDEFINED

    const result = {
        datapoints_absolute: timerange, 
        datapoints_relative: normalizedValues(), 
        meta: {
            investigator: [iclass],
            total: data.length,
        }
    }
    return result
}

export const generateInvestigatorHistogram = (data : Data[], ids: string[], scale:Scale) => {
    const timerange = buildTimeRange(scale, ids);
    // const total = generateTotalCount(scale);
    
    data.map( record => {
        const {year, entry} = retrieveYearEntity(record, scale);
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
