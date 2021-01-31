import { dateToYMD } from '../utils/dateparser';
import { buildTimeRange } from '../utils/rangeBuilder';
import {
  SingleDatePoint,
  Data,
  Scale,
  Count,
  GenericObject,
  Timerange,
  Histogram
} from '../utils/types';
import {
  SCALE,
  KEYLISTCLASS,
  KEYLISTINVESTIGATOR,
  MODE,
  SPAN
} from '../utils/constants';
import {
  generateTotalCount,
  getTotalDeckCount,
  getTotalFactionCount
} from '../app';
import { distHisto, sumHisto } from './invHistos';

export const retrieveYearEntity = (record: Count | Data, scale: Scale) => {
  const year = dateToYMD(record.date).slice(0, 4);
  const entry =
    scale === SCALE.DAY
      ? dateToYMD(record.date)
      : dateToYMD(record.date).slice(0, 7);

  return { year, entry };
};

// Process cound data
export const generateClassCountHistogram = async (
  data: Count[],
  iclass: string,
  scale: Scale,
  mode: MODE
): Promise<Histogram> => {
  const iclasses = [iclass];
  const timerange = buildTimeRange(scale, [iclass], SPAN.MULTIYEAR);
  const total = await generateTotalCount(scale);

  // Deck Count per Class
  const totalCount: GenericObject = {};
  iclasses.forEach((iclass) => (totalCount[iclass] = 0));

  data.map((record) => {
    const { year, entry } = retrieveYearEntity(record, scale);
    const target =
      scale === SCALE.DAY
        ? timerange.all.find((sdp: SingleDatePoint) => sdp.date === entry)
        : timerange.all.find(
            (sdp: SingleDatePoint) => sdp.date.slice(0, 7) === entry
          );

    target[iclass as KEYLISTCLASS] += record.count;
    totalCount[iclass as KEYLISTCLASS] += record.count;
  });

  if (mode === MODE.DIST) {
    const normalizedValues = (input: Timerange) => {
      const years = Object.keys(input);
      const relativeData: Timerange = {};
      years.forEach((year) => {
        const normalizedYear = input[year].map((month) => {
          const normalizer = (total[year] as SingleDatePoint[]).find(
            (totalmonth) => totalmonth.date === month.date
          );
          return {
            ...month,
            [iclass]:
              Math.floor(
                (month[iclass as KEYLISTCLASS] / normalizer.all) * 100
              ) | 0
          };
        });
        relativeData[year] = normalizedYear;
      });
      return relativeData;
    };

    const result = {
      datapoints_absolute: timerange,
      datapoints_relative: normalizedValues(timerange),
      meta: {
        investigators: [iclass],
        numDecks: totalCount,
        allDeckTotal: await getTotalDeckCount(),
        factionTotal: await getTotalFactionCount()
      }
    };
    return result;
  }
  if ((mode = MODE.SUM)) {
    const sumValues = (input: Timerange) => {
      const years = Object.keys(input);

      // Return Object with placeholder for year data
      const summedData: Timerange = {};
      years.forEach((year) => (summedData[year] = []));

      // Return Object with placeholder for year data
      const normalisedSummedData: Timerange = {};
      years.forEach((year) => (normalisedSummedData[year] = []));

      // Object that keeps track of sums per id
      const sum: GenericObject = {};
      [iclass].map((iclass) => (sum[iclass] = 0));

      years.forEach((year) =>
        input[year].forEach((sdp: SingleDatePoint) => {
          const date = sdp.date;
          const cache: GenericObject = {};
          iclasses.forEach((iclass) => {
            sum[iclass] += sdp[iclass as KEYLISTCLASS];
            cache[iclass] = sum[iclass] / totalCount[iclass]; // Percent
          });
          summedData[year].push(Object.assign({ date, ...sum }));
          normalisedSummedData[year].push(Object.assign({ date, ...cache }));
        })
      );
      return { summedData, normalisedSummedData };
    };

    const result = {
      datapoints_absolute: sumValues(timerange).summedData,
      datapoints_relative: sumValues(timerange).normalisedSummedData,
      meta: {
        investigators: [iclass],
        numDecks: totalCount,
        allDeckTotal: await getTotalDeckCount(),
        factionTotal: await getTotalFactionCount()
      }
    };
    return result;
  }
};

export const generateInvestigatorHistogram = async (
  data: Data[],
  ids: string[],
  scale: Scale,
  mode: MODE
): Promise<Histogram> => {
  const timerange = buildTimeRange(scale, ids);

  // Deck Count per investigator
  const totalCount: GenericObject = {};
  ids.forEach((id) => (totalCount[id] = 0));

  data.map((record) => {
    const { year, entry } = retrieveYearEntity(record, scale);
    const target =
      scale === SCALE.DAY
        ? timerange[year].find((sdp: SingleDatePoint) => sdp.date === entry)
        : timerange[year].find(
            (sdp: SingleDatePoint) => sdp.date.slice(0, 7) === entry
          );
    target[record.investigator_code as KEYLISTINVESTIGATOR] += 1;
    totalCount[record.investigator_code as KEYLISTINVESTIGATOR] += 1;
  });

  if (mode === MODE.DIST) {
    const result = {
      datapoints_absolute: timerange,
      datapoints_relative: await distHisto(ids, scale, timerange),
      meta: {
        investigators: ids,
        numDecks: totalCount,
        allDeckTotal: await getTotalDeckCount(),
        factionTotal: await getTotalFactionCount()
      }
    };
    return result;
  }

  if ((mode = MODE.SUM)) {
    const sumHistogram = await sumHisto(ids, totalCount, timerange);

    const result = {
      datapoints_absolute: sumHistogram.summedData,
      datapoints_relative: sumHistogram.normalisedSummedData,
      meta: {
        investigators: ids,
        numDecks: totalCount,
        allDeckTotal: await getTotalDeckCount(),
        factionTotal: await getTotalFactionCount()
      }
    };
    return result;
  }
};

export const generateClassHistogram = async (
  data: Data[],
  ids: string[],
  scale: Scale,
  mode: MODE
): Promise<Histogram> => {
  const timerange = buildTimeRange(scale, ids);

  // Deck Count per investigator
  const totalCount: GenericObject = {};
  ids.forEach((id) => (totalCount[id] = 0));

  data.map((record) => {
    const { year, entry } = retrieveYearEntity(record, scale);
    const target =
      scale === SCALE.DAY
        ? timerange[year].find((sdp: SingleDatePoint) => sdp.date === entry)
        : timerange[year].find(
            (sdp: SingleDatePoint) => sdp.date.slice(0, 7) === entry
          );
    target[record.investigator_code as KEYLISTCLASS] += record.val;
    totalCount[record.investigator_code as KEYLISTCLASS] += record.val;
  });

  if (mode === MODE.DIST) {
    const result = {
      datapoints_absolute: timerange,
      datapoints_relative: await distHisto(ids, scale, timerange),
      meta: {
        investigators: ids,
        numDecks: totalCount,
        allDeckTotal: await getTotalDeckCount(),
        factionTotal: await getTotalFactionCount()
      }
    };
    return result;
  }

  if ((mode = MODE.SUM)) {
    const sumHistogram = await sumHisto(ids, totalCount, timerange);

    const result = {
      datapoints_absolute: sumHistogram.summedData,
      datapoints_relative: sumHistogram.normalisedSummedData,
      meta: {
        investigators: ids,
        numDecks: totalCount,
        allDeckTotal: await getTotalDeckCount(),
        factionTotal: await getTotalFactionCount()
      }
    };
    return result;
  }
};
