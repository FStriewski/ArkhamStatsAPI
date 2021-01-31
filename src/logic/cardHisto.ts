import { FullRecord, GenericObject } from '../utils/types';

export const generateCardHisto = (records: FullRecord[]) => {
  const investigatorsUsingCard: GenericObject = {};
  const totalNumber = records.length;
  records.map((record) => {
    Object.keys(investigatorsUsingCard).includes(record.investigator_code)
      ? (investigatorsUsingCard[record.investigator_code] += 1)
      : (investigatorsUsingCard[record.investigator_code] = 1);
  });

  const investigators = Object.keys(investigatorsUsingCard);
  const usagePercentagePerInvestigator: GenericObject = {};

  investigators.map(
    (inv) =>
      (usagePercentagePerInvestigator[inv] =
        Math.floor(investigatorsUsingCard[inv] / totalNumber) * 100)
  );

  const result = {
    datapoints_absolute: investigatorsUsingCard,
    datapoints_relative: usagePercentagePerInvestigator,
    meta: {
      numDecks: totalNumber
    }
  };
  return result;
};

// const result = {
//   datapoints_absolute: timerange,
//   datapoints_relative: normalizedValues(timerange),
//   meta: {
//     investigators: [iclass],
//     numDecks: totalCount,
//     allDeckTotal: await getTotalDeckCount(),
//     factionTotal: await getTotalFactionCount()
//   }
// };
