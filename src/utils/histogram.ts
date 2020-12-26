import {postgresToYMD, dateToYMD, postgresToDatestring} from './dateparser';
import {buildTimeRange} from './rangeBuilder';
import { SingleDatePoint, KEYLISTCLASS, KEYLISTINVESTIGATOR } from './types';
import {generateTotalCount} from '../app';

export type Data = {
    date: Date,
    investigator_code: string;
}
export type Count = {
    date: Date,
    count: number;
}

type Timerange = {[index: string]:SingleDatePoint[]}

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
        ? timerange[year].find((sdp:SingleDatePoint) => sdp.date === entry)
        : timerange[year].find((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)
        
        target[iclass as KEYLISTCLASS] += record.count
    })

    const normalizedValues = (input: Timerange) => {
        const years = Object.keys(input)
        const relativeData: Timerange = {}
        years.forEach( year => {
            const normalizedYear =  input[year].map(month => {
                const normalizer = total[year].find(totalmonth => totalmonth.date === month.date)
                return {...month, [iclass]: Math.floor(month[iclass as KEYLISTCLASS]/normalizer['all'] *100) | 0}
            })
            relativeData[year] = normalizedYear
        })
        return relativeData;
    }

    const result = {
        datapoints_absolute: timerange, 
        datapoints_relative: normalizedValues(timerange), 
        meta: {
            investigator: [iclass],
            total: data.length,
        }
    }
    return result
}

export const generateInvestigatorHistogram = async (data : Data[], ids: string[], scale:Scale) => {
    const timerange = buildTimeRange(scale, ids);
    const total = await generateTotalCount(scale);

    data.map( record => {
        const {year, entry} = retrieveYearEntity(record, scale);
        const target = scale === SCALE.DAY 
            ? timerange[year].find((sdp:SingleDatePoint) => sdp.date === entry)
            : timerange[year].find((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)
        target[record.investigator_code as KEYLISTINVESTIGATOR] += 1
    })

    const normalizedValues = (input: Timerange) => {
        const years = Object.keys(input) 
        const relativeData: Timerange = {}
        years.forEach( year => {
            const normalizedYear =  input[year].map(month => {
                const normalizer = total[year].find(totalmonth => totalmonth.date === month.date)
                const invs = Object.keys(month).filter(prop => prop !== 'date') // Date is treated separately
                const normalizedMonth: any = {}
                normalizedMonth.date = month.date
                invs.forEach(investigator => normalizedMonth[investigator] =  Math.floor(month[investigator as KEYLISTINVESTIGATOR]/normalizer['all'] *100) | 0)
                return normalizedMonth
            })
            return relativeData[year] = normalizedYear
        })
        return relativeData;
    }
    
    const result = {
        datapoints_absolute: timerange, 
        datapoints_relative: normalizedValues(timerange), 
        meta: {
            investigator: ids,
            total: data.length,
        }
    }
    
    return result
}
