"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresToYMD = exports.dateToYMD = exports.dateparser = void 0;
const dateparser = (date) => {
    const year = +date.slice(0, 4);
    const month = +date.slice(4, 6);
    const day = +date.slice(6, 8);
    const newdate = (new Date(year, month, day)).toString();
    return Date.parse(newdate).toString().slice(0, 10);
};
exports.dateparser = dateparser;
const dateToYMD = (date) => date.toISOString().slice(0, 10);
exports.dateToYMD = dateToYMD;
const postgresToYMD = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${year}-${month}-${day}`;
};
exports.postgresToYMD = postgresToYMD;
//# sourceMappingURL=dateparser.js.map