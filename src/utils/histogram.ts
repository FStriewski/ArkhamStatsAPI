import {postgresToYMD, dateToYMD} from './dateparser';
import {buildYearRange} from './rangeBuilder';

export type Data = {
    date: string,
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
        const date = record.date;
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
    console.log(result)
    return result
}

export const generateHeatHistogram = (data : Data[]) => {

    const yearRange = buildYearRange();

    data.map( record => {
        const entry = postgresToYMD(record.date);
        const year = record.date.slice(0,4)
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

