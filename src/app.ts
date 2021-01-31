import { PrismaClient } from '@prisma/client';
import express from 'express';
import * as bodyParser from 'body-parser';
import { GenericObject, Data, InvCount } from './utils/types';
import { factionMembers } from './utils/constants';
import {
  getSingleInvDist,
  getMultipleInvDist,
  getSingleInvSum,
  getMultipleInvSum
} from './routes/investigators';
import {
  getSingleClassDist,
  getMultipleClassDist,
  getSingleClassSum
} from './routes/classes';
import { getCardDist } from './routes/cards';

export const prisma = new PrismaClient();
export const app = express();
app.use(bodyParser.json());

export const dateIssue = (result: Data[]) =>
  result.map((tick: Data) => ({ ...tick, date: new Date(tick.date) }));

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

/**
 *  ----- CLASSES
 */
app.get(`/class/dist/:iclass`, async (req, res) => {
  const { iclass } = req.params;
  const hist = await getSingleClassDist(iclass);
  return res.json(hist);
});
app.get(`/class/sum/:iclass`, async (req, res) => {
  const { iclass } = req.params;
  const hist = await getSingleClassSum(iclass);
  return res.json(hist);
});
app.get(`/class/dist`, async (req, res) => {
  const { i0, i1, i2 } = req.query;
  const hist = await getMultipleClassDist({ i0, i1, i2 });
  return res.json(hist);
});

/**
 *  ----- Investigators
 */
app.get(`/investigator/dist/:icode`, async (req, res) => {
  const { icode } = req.params;
  const hist = await getSingleInvDist(icode);
  return res.json(hist);
});
app.get(`/investigator/sum/:icode`, async (req, res) => {
  const { icode } = req.params;
  const hist = await getSingleInvSum(icode);
  return res.json(hist);
});
app.get(`/investigators/dist`, async (req, res) => {
  const { i0, i1, i2 } = req.query;
  const hist = await getMultipleInvDist({ i0, i1, i2 });
  return res.json(hist);
});
app.get(`/investigators/sum`, async (req, res) => {
  const { i0, i1, i2 } = req.query;
  const hist = await getMultipleInvSum({ i0, i1, i2 });
  return res.json(hist);
});

/**
 *  ----- Cards
 */

app.get(`/cards/dist/`, async (req, res) => {
  const { i0, i1, i2 } = req.query;
  const result = await getCardDist({ i0, i1, i2 });
  return res.json(result);
});

export default app;
