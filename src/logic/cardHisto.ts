import { GenericObject, CardSet } from '../utils/types';

export const generateCardHisto = (cardSets: CardSet) => {
  const sets = Object.keys(cardSets);

  const datapoints_absolute: GenericObject = {};
  const datapoints_relative: GenericObject = {};
  const numDecks: GenericObject = {};

  sets.forEach((set: string) => {
    const data = cardSets[set];
    const totalNumber = data.length;
    numDecks[set] = totalNumber;

    const investigatorsUsingCard: GenericObject = {};
    data.map((record) => {
      Object.keys(investigatorsUsingCard).includes(record.investigator_code)
        ? (investigatorsUsingCard[record.investigator_code] += 1)
        : (investigatorsUsingCard[record.investigator_code] = 1);
    });

    datapoints_absolute[set] = investigatorsUsingCard;

    const investigators = Object.keys(investigatorsUsingCard);
    const usagePercentagePerInvestigator: GenericObject = {};

    investigators.map(
      (inv) =>
        (usagePercentagePerInvestigator[inv] =
          Math.floor(investigatorsUsingCard[inv] / totalNumber) * 100)
    );
    datapoints_relative[set] = usagePercentagePerInvestigator;
  });

  const result = {
    datapoints_absolute,
    datapoints_relative,
    meta: {
      numDecks
    }
  };
  return result;
};
