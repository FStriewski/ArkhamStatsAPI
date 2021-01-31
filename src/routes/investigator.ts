import { generateInvestigatorHistogram } from '../histogram/histogram';
import { GenericObject, Histogram } from '../utils/types';
import { SCALE, MODE } from '../utils/constants';
import { prisma, dateIssue } from '../app';

export const getSingleInvDist = async (icode: string): Promise<Histogram> => {
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
      return hist;
    });
  // .catch((e) => console.log(e));
};

export const getMultipleInvDist = async ({
  i0,
  i1,
  i2
}: GenericObject): Promise<Histogram> => {
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
      return hist;
    });
};

export const getSingleInvSum = async (icode: string): Promise<Histogram> => {
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
      return hist;
    });
};

export const getMultipleInvSum = async ({
  i0,
  i1,
  i2
}: GenericObject): Promise<Histogram> => {
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
      return hist;
    });
};
