import {postgresToYMD, dateToYMD} from './dateparser'
import {generateHistogram, SCALE} from './histogram';


export const buildTimeRange = (scale: SCALE) => {
    const years = [
        {
            label: "2016",
            startDate: new Date("2016-01-01"),
            endDate: new Date("2016-12-31")
        },
        {
            label: "2017",
            startDate: new Date("2017-01-01"),
            endDate: new Date("2017-12-31")
        },
        {
            label: "2018",
            startDate: new Date("2018-01-01"),
            endDate: new Date("2018-12-31")
        },
        {
            label: "2019",
            startDate: new Date("2019-01-01"),
            endDate: new Date("2019-12-31")
        },
        {
            label: "2020",
            startDate: new Date("2020-01-01"),
            endDate: new Date("2020-12-31")
        },
    ]

    type SingleDatePoint = {
        date: string;
        value:number;
    }

    // Used for Frappe: {"datapoints":{"2016":{"2016-01":0,"2016-02":0,...}}} 
    const generateKeyVal = (startDate: Date, endDate: Date) => {
        const dateObj: {[index: string]:any} = {}
        const dt = new Date(startDate);
        while (dt <= endDate) {
            const record = dateToYMD(dt).slice(0,7);
            dateObj[record] = 0;
        dt.setDate(dt.getDate() + 1);
        }
        return dateObj;
    }

    // Used for all other: 
    const generateDateSpan = (startDate: Date, endDate: Date, scale: SCALE) => {
        const dateArr: SingleDatePoint[] = []
        const dt = new Date(startDate);
        while (dt <= endDate) {
            const date = scale === SCALE.DAY 
                ? dateToYMD(dt)
                :dateToYMD(dt).slice(0,7);

            if(!dateArr.find(entry => entry.date === date)){
                dateArr.push(
                    {
                    date,
                    value: 0 
                    }
            )}
        dt.setDate(dt.getDate() + 1);
        }
        return dateArr;
    }

    const rangeObject: {[index: string]:SingleDatePoint[]} = {}

    years.forEach( year =>
        rangeObject[year.label] =  generateDateSpan(year.startDate, year.endDate, scale)
    )

    return rangeObject;
}