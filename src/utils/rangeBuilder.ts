import { dateToYMD } from './dateparser';
import { SCALE, YEARS, KEYLISTCLASS, KEYLISTINVESTIGATOR } from './constants';
import { SingleDatePoint } from './types';

export const buildTimeRange = (
  scale: SCALE,
  ids: string[]
): { [index: string]: SingleDatePoint[] } => {
  const generateDateSpan = (startDate: Date, endDate: Date, scale: SCALE) => {
    const dateArr: SingleDatePoint[] = [];
    const dt = new Date(startDate);
    while (dt <= endDate) {
      const date =
        scale === SCALE.DAY ? dateToYMD(dt) : dateToYMD(dt).slice(0, 7);

      if (!dateArr.find((entry) => entry.date === date)) {
        const obj = {} as SingleDatePoint;
        obj.date = date;
        ids.forEach(
          (id) => (obj[id as KEYLISTCLASS | KEYLISTINVESTIGATOR] = 0)
        );
        dateArr.push(obj);
      }
      dt.setDate(dt.getDate() + 1);
    }
    return dateArr;
  };

  const rangeObject: { [index: string]: SingleDatePoint[] } = {};
  YEARS.forEach(
    (year) =>
      (rangeObject[year.label] = generateDateSpan(
        year.startDate,
        year.endDate,
        scale
      ))
  );

  return rangeObject;
};
