import {postgresToYMD, dateToYMD, postgresToDatestring} from './dateparser';
import {buildYearRange} from './rangeBuilder';

export type Data = {
    date: Date,
    investigator_code: string;
}

export type DataPoint = {
    x: string;
    y: number;
}

export type Histogram = {
    meta: {
        investigator: string;
    }
    datapoints: DataPoint[];
}
export type HeatMapObject = { [key: string]: number };


export const generateHistogram = (data: Data[]):Histogram => {

    const cache: DataPoint[] = []

    data.map(record => {
        const date = dateToYMD(record.date); // RM time from date
        const item = cache.find(entry => entry.x === date)
        if (item){
            item.y += 1
        }
        else{
            cache.push({x: date, y: 1})
        }
        return
    })

    const result = {
        datapoints: cache,
        meta: {
            investigator: data[0].investigator_code,
            total: cache.length,
        }
    }

    return result
}

// Full year with all days
export const generateHeatDayHistogram = (data : Data[]) => {

    const yearRange = buildYearRange();
    let count = 0

    data.map( record => {
        count += 1;
        const entry = dateToYMD(record.date);
        const year = dateToYMD(record.date).slice(0,4)
        yearRange[year][entry] += 1
    } )

    const result = {
        datapoints: yearRange,
        meta: {
            investigator: data[0].investigator_code,
            total: data.length,
        }
    }

    return result
}

export const generateMonthHeatHistogram = (data : Data[]) => {

    const yearRange = buildYearRange();
    let count = 0

    data.map( record => {
        count += 1;
        const entry = dateToYMD(record.date).slice(0,7);
        const year = dateToYMD(record.date).slice(0,4)
        yearRange[year][entry] += 1
    } )

    const result = {
        datapoints: yearRange,
        meta: {
            investigator: data[0].investigator_code,
            total: data.length,
        }
    }

    return result
}

