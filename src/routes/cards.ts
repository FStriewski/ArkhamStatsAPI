import { generateCardHisto } from '../logic/cardHisto';
import { prisma } from '../app';
import { GenericObject } from '../utils/types';

export const getSingleCardDist = async (
  card: string
): Promise<GenericObject> => {
  return await prisma
    .$queryRaw(
      `select * from decks where ${card} = ANY(slots) ORDER BY investigator_name;`
    )
    .then((queryResult) => {
      const hist = generateCardHisto(queryResult);
      return hist;
    });
};
