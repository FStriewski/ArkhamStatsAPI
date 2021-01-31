import {
  generateClassCountHistogram,
  generateClassHistogram,
  retrieveYearEntity
} from '../histogram/histogram';
import {
  Histogram,
  Scale,
  GenericObject,
  Data,
  Count,
  SingleDatePoint
} from '../utils/types';
import { SCALE, MODE, factionMembers } from '../utils/constants';
import { buildTimeRange } from '../utils/rangeBuilder';
import { prisma, dateIssue } from '../app';

const dateIssueClass = (result: Count[]) =>
  result.map((tick: Count) => ({ ...tick, date: new Date(tick.date) }));

export const generateTotalCount = async (
  scale: Scale
): Promise<GenericObject> => {
  return await prisma
    .$queryRaw('SELECT date, COUNT(id) AS count FROM decks GROUP BY date;')
    .then((queryResult) => {
      const modifRes = dateIssue(queryResult);
      const timerange = buildTimeRange(scale, ['all']);

      modifRes.map((record: any) => {
        const { year, entry } = retrieveYearEntity(record, scale);
        const target =
          scale === SCALE.DAY
            ? timerange[year].filter(
                (sdp: SingleDatePoint) => sdp.date === entry
              )
            : timerange[year].filter(
                (sdp: SingleDatePoint) => sdp.date.slice(0, 7) === entry
              );

        target[0].all += record.count;
      });
      return timerange;
    });
};

export const getSingleClassDist = async (
  iclass: string
): Promise<Histogram> => {
  if (iclass === 'all') {
    const hist = await generateTotalCount(SCALE.MONTH);

    const result = {
      datapoints_absolute: hist,
      datapoints_relative: hist,
      meta: {
        investigators: [iclass],
        numDecks: {},
        allDeckTotal: 12345,
        factionTotal: {}
      }
    };
    return result;
  } else {
    const members = factionMembers[iclass].map((mem) => `'${mem}'`).join(',');
    return await prisma
      .$queryRaw(
        // eslint-disable-next-line max-len
        `SELECT date, COUNT(1) FILTER (WHERE investigator_code IN (${members})) AS count FROM decks GROUP BY date`
      )
      .then(async (queryResult: Count[]) => {
        const modifRes: Count[] = dateIssueClass(queryResult);
        const hist = await generateClassCountHistogram(
          modifRes,
          iclass,
          SCALE.MONTH,
          MODE.DIST
        );
        return hist;
      });
  }
};

export const getMultipleClassDist = async ({
  i0,
  i1,
  i2
}: GenericObject): Promise<Histogram> => {
  const classList = [i0, i1, i2]
    .filter((icode: string) => icode !== undefined)
    .map((icode: string) => icode);
  console.log(classList);
  const classCollection: Data[] = [];

  for (const iclass of classList) {
    const members = factionMembers[iclass].map((mem) => `'${mem}'`).join(',');
    await prisma
      .$queryRaw(
        // eslint-disable-next-line max-len
        `SELECT date, COUNT(1) FILTER (WHERE investigator_code IN (${members})) AS val FROM decks GROUP BY date`
      )
      .then((queryResult: Data[]) => {
        const modifRes: Data[] = dateIssue(queryResult);
        const result = modifRes.map((obj: Data) => ({
          ...obj,
          investigator_code: iclass
        }));
        classCollection.push(...result);
      });
  }
  console.log(classCollection);
  const hist = await generateClassHistogram(
    classCollection,
    classList,
    SCALE.MONTH,
    MODE.DIST
  );
  return hist;
};
export const getSingleClassSum = async (iclass: string): Promise<Histogram> => {
  if (iclass === 'all') {
    const hist = await generateTotalCount(SCALE.MONTH);

    const result = {
      datapoints_absolute: hist,
      datapoints_relative: hist,
      meta: {
        investigators: [iclass],
        numDecks: {},
        allDeckTotal: 12345,
        factionTotal: {}
      }
    };
    return result;
  } else {
    const members = factionMembers[iclass].map((mem) => `'${mem}'`).join(',');
    return await prisma
      .$queryRaw(
        // eslint-disable-next-line max-len
        `SELECT date, COUNT(1) FILTER (WHERE investigator_code IN (${members})) AS count FROM decks GROUP BY date`
      )
      .then(async (queryResult) => {
        const modifRes = dateIssueClass(queryResult);
        const hist = await generateClassCountHistogram(
          modifRes,
          iclass,
          SCALE.MONTH,
          MODE.SUM
        );
        return hist;
      });
  }
};
