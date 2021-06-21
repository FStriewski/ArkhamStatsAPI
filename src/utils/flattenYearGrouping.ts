import { Histogram, SingleDatePoint } from './types';

export const flattenYearGrouping = (input: Histogram) => {
  const dissolvedAbs: SingleDatePoint[][] = [];
  const dissolvedRel: SingleDatePoint[][] = [];

  // Get the years:
  const years: string[] = Object.keys(input.datapoints_absolute).sort();

  // Store datapoints of year in the results array:
  years.forEach((year: string) => {
    dissolvedAbs.push(input.datapoints_absolute[year]);
    dissolvedRel.push(input.datapoints_relative[year]);
  });

  // Overwrite & flat to a array of SingleDatePoints:
  input.datapoints_absolute = { 1: dissolvedAbs.flat() };
  input.datapoints_relative = { 1: dissolvedRel.flat() };

  return input;
};
