import {postgresToYMD, dateToYMD, postgresToDatestring} from './dateparser';
import {buildTimeRange} from './rangeBuilder';

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

type Scale = SCALE.MONTH | SCALE.DAY

export enum SCALE {
    DAY = "DAY",
    MONTH = "MONTH",
}


// export const generateHistogram = (data: Data[]):Histogram => {

//     const cache: DataPoint[] = []

//     data.map(record => {
//         const date = dateToYMD(record.date); // RM time from date
//         const item = cache.find(entry => entry.x === date)
//         if (item){
//             item.y += 1
//         }
//         else{
//             cache.push({x: date, y: 1})
//         }
//         return
//     })

//     const result = {
//         datapoints: cache,
//         meta: {
//             investigator: data[0].investigator_code,
//             total: cache.length,
//         }
//     }

//     return result
// }

// Full year with all days
export const generateHistogram = (data : Data[], scale:Scale) => {

    const timeRange = buildTimeRange(scale);

    data.map( record => {
        const year = dateToYMD(record.date).slice(0,4)

        const entry = scale === SCALE.DAY
        ?  dateToYMD(record.date)
        : dateToYMD(record.date).slice(0,7);
        
        const target = scale === SCALE.DAY 
            ? timeRange[year].filter(datapoint => datapoint.date === entry)
            : timeRange[year].filter(datapoint => datapoint.date.slice(0,7) === entry)
        target[0].value += 1
    } )

    const result = {
        datapoints: timeRange,
        meta: {
            investigator: data[0].investigator_code,
            total: data.length,
        }
    }

    return result
}
