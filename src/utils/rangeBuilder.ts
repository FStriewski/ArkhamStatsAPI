import {postgresToYMD, dateToYMD} from './dateparser'

export const buildYearRange = () => {
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

    const generateDateSpan = (startDate: Date, endDate: Date) => {
        const dateObj: {[index: string]:any} = {}
        const dt = new Date(startDate);
        while (dt <= endDate) {
            const record = dateToYMD(dt).slice(0,7);
            dateObj[record]= 0;
        dt.setDate(dt.getDate() + 1);
        }
        return dateObj;
    }

    const rangeObject: {[index: string]:any} = {}

    years.forEach( year =>
        rangeObject[year.label] =  generateDateSpan(year.startDate, year.endDate)
    )

    return rangeObject;
}