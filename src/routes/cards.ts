import { generateCardHisto } from '../logic/cardHisto';
import { prisma } from '../app';
import {
  GenericObject,
  FullRecord,
  CardHistogram,
  CardSet
} from '../utils/types';

export const getCardDist = async ({
  i0,
  i1,
  i2
}: GenericObject): Promise<CardHistogram> => {
  const cards: string[] = [i0, i1, i2].filter(
    (card: string) => card !== undefined
  ) as string[];

  const records: CardSet = {};

  for (const card of cards) {
    const queryResult: FullRecord[] = await prisma.$queryRaw(
      `select * from decks where ${card} = ANY(slots) ORDER BY investigator_name;`
    );
    records[card] = queryResult;
  }
  const hist = generateCardHisto(records);
  return hist;
};
