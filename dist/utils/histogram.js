"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeatHistogram = exports.generateHistogram = void 0;
const dateparser_1 = require("./dateparser");
const rangeBuilder_1 = require("./rangeBuilder");
const generateHistogram = (data) => {
    const cache = [];
    data.map(record => {
        const date = record.date;
        const item = cache.find(entry => entry.x === date);
        if (item) {
            item.y += 1;
        }
        else {
            cache.push({ x: date, y: 1 });
        }
        return;
    });
    const result = {
        datapoints: cache,
        meta: {
            investigator: data[0].investigator_code,
            total: cache.length,
        }
    };
    console.log(result);
    return result;
};
exports.generateHistogram = generateHistogram;
const generateHeatHistogram = (data) => {
    const yearRange = rangeBuilder_1.buildYearRange();
    // console.log(spanObj)
    // const fullDateSpan:HeatMapObject = generateDateSpan();
    data.map(record => {
        const entry = dateparser_1.postgresToYMD(record.date);
        if (entry === '2019-01-04') {
            console.log('ding!');
        }
        const year = record.date.slice(0, 4);
        // console.log(spanObj[year][entry])
        yearRange[year][entry] += 1;
    });
    const r = data[200];
    const re = dateparser_1.postgresToYMD(r.date);
    const ry = r.date.slice(0, 4);
    const ro = yearRange[2019][re];
    const ro2 = yearRange[2018][re];
    console.log(re);
    console.log(ro2);
    const result = {
        datapoints: yearRange,
        meta: {
            investigator: data[0].investigator_code,
            total: data.length,
        }
    };
    return result;
};
exports.generateHeatHistogram = generateHeatHistogram;
//# sourceMappingURL=histogram.js.map