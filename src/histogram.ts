import {postgresToYMD, dateToYMD, postgresToDatestring} from './utils/dateparser';
import {buildTimeRange} from './utils/rangeBuilder';
import { SingleDatePoint, Data, Scale, Count, GenericObject } from './utils/types';
import { SCALE, KEYLISTCLASS, KEYLISTINVESTIGATOR, MODE } from './utils/constants';
import {generateTotalCount} from './app';

type Timerange = {[index: string]:SingleDatePoint[]}

export const retrieveYearEntity = (record: Count | Data, scale: Scale) => {
    const year = dateToYMD(record.date).slice(0,4)
    const entry = scale === SCALE.DAY
    ? dateToYMD(record.date)
    : dateToYMD(record.date).slice(0,7);

    return {year, entry}
}

// Process cound data
export const generateClassCountHistogram = async (data : Count[], iclass: string, scale:Scale, mode: MODE) => {
    const iclasses = [iclass]
    const timerange = buildTimeRange(scale, [iclass]);
    const total = await generateTotalCount(scale);

    // Deck Count per investigator
    const totalCount: GenericObject = {}
    iclasses.forEach(iclass => totalCount[iclass as string] = 0)
    
    data.map( record => {
        const {year, entry} = retrieveYearEntity(record, scale);
        const target = scale === SCALE.DAY 
        ? timerange[year].find((sdp:SingleDatePoint) => sdp.date === entry)
        : timerange[year].find((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)
        
        target[iclass as KEYLISTCLASS] += record.count
        totalCount[iclass as KEYLISTCLASS] += record.count

    })
    
    if(mode === MODE.DIST){
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
                total: totalCount,
            }
        }
        return result
    }
    if(mode = MODE.SUM){
            const sumValues = (input: Timerange) => {
            const years = Object.keys(input)

            // Return Object with placeholder for year data
            const summedData: Timerange = {}
            years.forEach(year => summedData[year] = [])

            // Return Object with placeholder for year data
            const normalisedSummedData: Timerange = {}
            years.forEach(year => normalisedSummedData[year] = [])

            // Object that keeps track of sums per id
            const sum: GenericObject = {};
            [iclass].map(iclass => sum[iclass] = 0);

            years.forEach(
                year => input[year].forEach(
                    (sdp: SingleDatePoint) => {
                        const date = sdp.date;
                        const cache: GenericObject = {}
                        iclasses.forEach(iclass => {
                            sum[iclass] += sdp[iclass as KEYLISTCLASS]
                            cache[iclass] = sum[iclass] / totalCount[iclass] // Percent
                        })
                    summedData[year].push(Object.assign({date, ...sum}))
                    normalisedSummedData[year].push(Object.assign({date, ...cache}))
                })
            )
            return {summedData, normalisedSummedData};
        }
        

        const result = {
            datapoints_absolute: sumValues(timerange).summedData,
            datapoints_relative: sumValues(timerange).normalisedSummedData,
            meta: {
                investigator: [iclass],
                total: totalCount,
            }
        }
        return result
    }
}

export const generateInvestigatorHistogram = async (data : Data[], ids: string[], scale:Scale, mode: MODE) => {
    const timerange = buildTimeRange(scale, ids);
    const total = await generateTotalCount(scale);

    // Deck Count per investigator
    const totalCount: GenericObject = {}
    ids.forEach(id => totalCount[id as string] = 0)

    data.map( record => {
        const {year, entry} = retrieveYearEntity(record, scale);
        const target = scale === SCALE.DAY 
        ? timerange[year].find((sdp:SingleDatePoint) => sdp.date === entry)
        : timerange[year].find((sdp:SingleDatePoint) => sdp.date.slice(0,7) === entry)
        target[record.investigator_code as KEYLISTINVESTIGATOR] += 1
        totalCount[record.investigator_code as KEYLISTINVESTIGATOR] += 1
    })

    if(mode === MODE.DIST){
        const normalizedValues = (input: Timerange) => {
            const years = Object.keys(input) 
            const relativeData: Timerange = {}
            years.forEach( year => {
                const normalizedYear =  input[year].map(month => {
                    const normalizer = total[year].find(totalmonth => totalmonth.date === month.date)
                    // const invs = Object.keys(month).filter(prop => prop !== 'date') // Date is treated separately
                    const normalizedMonth: any = {}
                    normalizedMonth.date = month.date
                    ids.forEach(investigator => normalizedMonth[investigator] =  Math.floor(month[investigator as KEYLISTINVESTIGATOR]/normalizer['all'] *100) | 0)
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
                total: totalCount,
            }
        }
        return result
    }

    if(mode = MODE.SUM){
        const sumValues = (input: Timerange) => {
            const years = Object.keys(input)

            // Return Object with placeholder for year data
            const summedData: Timerange = {}
            years.forEach(year => summedData[year] = [])

            // Return Object with placeholder for year data
            const normalisedSummedData: Timerange = {}
            years.forEach(year => normalisedSummedData[year] = [])

            // Object that keeps track of sums per id
            const sum: GenericObject = {};
            ids.map(id => sum[id] = 0);

            years.forEach(
                year => input[year].forEach(
                    (sdp: SingleDatePoint) => {
                        const date = sdp.date;
                        const cache: GenericObject = {}
                        ids.forEach(id => {
                            sum[id] += sdp[id as KEYLISTINVESTIGATOR]
                            cache[id] = sum[id] / totalCount[id] // Percent
                        })
                    summedData[year].push(Object.assign({date, ...sum}))
                    normalisedSummedData[year].push(Object.assign({date, ...cache}))
                })
            )       
            return {summedData, normalisedSummedData};
        }

        const result = {
            datapoints_absolute: sumValues(timerange).summedData,
            datapoints_relative: sumValues(timerange).normalisedSummedData,
            meta: {
                investigator: ids,
                total: totalCount,
            }
        }
        return result
    }
}