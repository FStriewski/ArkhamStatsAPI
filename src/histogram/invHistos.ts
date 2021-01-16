import {
  SingleDatePoint,
  Scale,
  GenericObject,
  Timerange
} from '../utils/types';
import { generateTotalCount } from '../app';
import { KEYLISTINVESTIGATOR } from '../utils/constants';

export const distHisto = async (
  ids: string[],
  scale: Scale,
  input: Timerange
): Promise<Timerange> => {
  const total = await generateTotalCount(scale);

  const years = Object.keys(input);
  const relativeData: GenericObject = {};

  years.forEach((year) => {
    const normalizedYear = input[year].map((month) => {
      const normalizer = (total[year] as SingleDatePoint[]).find(
        (totalmonth) => totalmonth.date === month.date
      );
      const normalizedMonth: GenericObject = {};
      normalizedMonth.date = month.date;
      ids.forEach(
        (investigator) =>
          (normalizedMonth[investigator] =
            Math.floor(
              (month[investigator as KEYLISTINVESTIGATOR] / normalizer.all) *
                100
            ) | 0)
      );
      return normalizedMonth;
    });
    relativeData[year] = normalizedYear;
  });
  return relativeData;
};

export const sumHisto = async (
  ids: string[],
  totalCount: GenericObject,
  input: Timerange
): Promise<{ summedData: Timerange; normalisedSummedData: Timerange }> => {
  const years = Object.keys(input);

  // Return Object with placeholder for year data
  const summedData: Timerange = {};
  years.forEach((year) => (summedData[year] = []));

  // Return Object with placeholder for year data
  const normalisedSummedData: Timerange = {};
  years.forEach((year) => (normalisedSummedData[year] = []));

  // Object that keeps track of sums per id
  const sum: GenericObject = {};
  ids.map((id) => (sum[id] = 0));

  years.forEach((year) =>
    input[year].forEach((sdp: SingleDatePoint) => {
      const date = sdp.date;
      const cache: GenericObject = {};
      ids.forEach((id) => {
        sum[id] += sdp[id as KEYLISTINVESTIGATOR];
        cache[id] = sum[id] / totalCount[id]; // Percent
      });
      summedData[year].push(Object.assign({ date, ...sum }));
      normalisedSummedData[year].push(Object.assign({ date, ...cache }));
    })
  );
  return { summedData, normalisedSummedData };
};
