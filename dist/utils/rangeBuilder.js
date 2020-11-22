"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildYearRange = void 0;
const dateparser_1 = require("./dateparser");
const buildYearRange = () => {
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
    ];
    const generateDateSpan = (startDate, endDate) => {
        const dateObj = {};
        const dt = new Date(startDate);
        while (dt <= endDate) {
            const record = dateparser_1.dateToYMD(dt);
            dateObj[record] = 0;
            dt.setDate(dt.getDate() + 1);
        }
        return dateObj;
    };
    const rangeObject = {};
    years.forEach(year => rangeObject[year.label] = generateDateSpan(year.startDate, year.endDate));
    return rangeObject;
};
exports.buildYearRange = buildYearRange;
//# sourceMappingURL=rangeBuilder.js.map