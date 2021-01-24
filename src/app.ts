import { PrismaClient } from '@prisma/client';
import express from 'express';
import * as bodyParser from 'body-parser';
import {
  generateInvestigatorHistogram,
  generateClassCountHistogram,
  generateClassHistogram,
  retrieveYearEntity
} from './histogram/histogram';
import {
  SingleDatePoint,
  Scale,
  GenericObject,
  Data,
  Count,
  InvCount
} from './utils/types';
import { SCALE, MODE, factionMembers } from './utils/constants';
import { buildTimeRange } from './utils/rangeBuilder';

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

const dateIssue = (result: Data[]) =>
  result.map((tick: Data) => ({ ...tick, date: new Date(tick.date) }));
const dateIssueClass = (result: Count[]) =>
  result.map((tick: Count) => ({ ...tick, date: new Date(tick.date) }));

export const getTotalDeckCount = async (): Promise<number> =>
  await prisma
    .$queryRaw('SELECT count(*) FROM decks;')
    .then((res: InvCount[]) => res[0].count);

export const getTotalFactionCount = async (): Promise<GenericObject> => {
  const classes = Object.keys(factionMembers);
  const facCnt_abs: GenericObject = {};
  const facCnt_rel: GenericObject = {};

  for (const iclass of classes) {
    const members = factionMembers[iclass].map((mem) => `'${mem}'`).join(',');
    const totalNumDecks = await getTotalDeckCount();
    await prisma
      .$queryRaw(
        `SELECT COUNT(1) FILTER (WHERE investigator_code IN (${members})) AS count FROM decks`
      )
      .then((res: InvCount[]) => {
        facCnt_abs[iclass] = res[0].count;
        facCnt_rel[iclass] = Math.floor((res[0].count / totalNumDecks) * 100);
      });
  }

  return { facCnt_abs, facCnt_rel };
};

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

app.get(`/class/dist/:iclass`, async (req, res) => {
  const { iclass } = req.params;
  if (iclass === 'all') {
    const hist = await generateTotalCount(SCALE.MONTH);

    const result = {
      datapoints_absolute: hist,
      datapoints_relative: hist,
      meta: {
        investigator: [iclass],
        total: 0
      }
    };
    return res.json(result);
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
        return res.json(hist);
      })
      .catch((e) => console.log(e));
  }
});

app.get(`/classes/dist`, async (req, res) => {
  const { i0, i1, i2 } = req.query;

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
  return res.json(hist);
});

app.get(`/class/sum/:iclass`, async (req, res) => {
  const { iclass } = req.params;
  if (iclass === 'all') {
    const hist = await generateTotalCount(SCALE.MONTH);

    const result = {
      datapoints_absolute: hist,
      datapoints_relative: hist,
      meta: {
        investigator: [iclass],
        total: 0
      }
    };
    return res.json(result);
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
        return res.json(hist);
      })
      .catch((e) => console.log(e));
  }
});

app.get(`/investigator/dist/:icode`, async (req, res) => {
  const { icode } = req.params;

  return await prisma.decks
    .findMany({
      where: {
        investigator_code: String(icode)
      },
      select: {
        investigator_code: true,
        date: true
      }
    })
    .then(async (queryResult) => {
      const modifRes = dateIssue(queryResult);
      const hist = await generateInvestigatorHistogram(
        modifRes,
        [icode],
        SCALE.MONTH,
        MODE.DIST
      );
      return res.json(hist);
    })
    .catch((e) => console.log(e));
});

app.get(`/investigators/dist`, async (req, res) => {
  const { i0, i1, i2 } = req.query;

  const investigatorList = [i0, i1, i2]
    .filter((icode: string) => icode !== undefined)
    .map((icode: string) => icode);

  return await prisma.decks
    .findMany({
      where: {
        investigator_code: {
          in: investigatorList
        }
      },
      select: {
        investigator_code: true,
        date: true
      }
    })
    .then(async (queryResult) => {
      const hist = await generateInvestigatorHistogram(
        queryResult,
        investigatorList,
        SCALE.MONTH,
        MODE.DIST
      );
      return res.json(hist);
    })
    .catch((e) => console.log(e));
});

app.get(`/investigator/sum/:icode`, async (req, res) => {
  const { icode } = req.params;

  return await prisma.decks
    .findMany({
      where: {
        investigator_code: String(icode)
      },
      select: {
        investigator_code: true,
        date: true
      }
    })
    .then(async (queryResult) => {
      const modifRes = dateIssue(queryResult);
      const hist = await generateInvestigatorHistogram(
        modifRes,
        [icode],
        SCALE.MONTH,
        MODE.SUM
      );
      return res.json(hist);
    })
    .catch((e) => console.log(e));
});

app.get(`/investigators/sum`, async (req, res) => {
  const { i0, i1, i2 } = req.query;

  const investigatorList = [i0, i1, i2]
    .filter((icode: string) => icode !== undefined)
    .map((icode: string) => icode);

  return await prisma.decks
    .findMany({
      where: {
        investigator_code: {
          in: investigatorList
        }
      },
      select: {
        investigator_code: true,
        date: true
      }
    })
    .then(async (queryResult) => {
      const hist = await generateInvestigatorHistogram(
        queryResult,
        investigatorList,
        SCALE.MONTH,
        MODE.SUM
      );
      return res.json(hist);
    })
    .catch((e) => console.log(e));
});

export default app;
