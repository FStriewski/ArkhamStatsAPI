import {postgresToYMD, dateToYMD} from './dateparser'
import { SCALE} from './histogram';
import { SingleDatePoint, KEYLISTCLASS, KEYLISTINVESTIGATOR  } from './types';
import { YEARS } from './constants';


export const buildTimeRange = (scale: SCALE, ids: string[]) => {
    const generateDateSpan = (startDate: Date, endDate: Date, scale: SCALE) => {
        const dateArr: SingleDatePoint[] = []
        const dt = new Date(startDate);
        while (dt <= endDate) {
            const date = scale === SCALE.DAY 
                ? dateToYMD(dt)
                :dateToYMD(dt).slice(0,7);

            if(!dateArr.find(entry => entry.date === date)){
                const obj: any = {}
                obj.date = date
                ids.forEach(id => obj[id as KEYLISTCLASS | KEYLISTINVESTIGATOR] = 0)
                dateArr.push(obj)}
        dt.setDate(dt.getDate() + 1);
        }
        return dateArr;
    }

    const rangeObject: {[index: string]:SingleDatePoint[]} = {}
    YEARS.forEach( year => rangeObject[year.label] =  generateDateSpan(year.startDate, year.endDate, scale))

    return rangeObject;
}