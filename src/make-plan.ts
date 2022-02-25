import moment from "moment";
import { NewDate } from "./date";
import { getDates } from "./recurrance";
import { Pot } from "./use-pots";

export const makePlan = (
  toBudget: number,
  pots: Pot[],
  dates: NewDate[],
  surplusPot: string,
  endDate: Date
) => {
  const changedPots = pots.map((pot) => {
    const rawDates = dates.filter((date) => date.potId === pot.id);

    const potDates = rawDates
      .flatMap((date) =>
        date.when
          ? getDates(date.when, endDate).map((recurrance) => ({
              ...date,
              date: recurrance.toString(),
            }))
          : [date]
      )
      .slice()
      .sort((a: any, b: any) => moment(a).diff(moment(b)));

    const totalToBudget = potDates.reduce(
      (accum, item) => accum + (item.amount ? Number(item.amount) : 0),
      0
    );
    const balance = Number(pot.balance) / 100;
    const adjustment = totalToBudget - balance;

    return {
      ...pot,
      dates: potDates,
      rawDates,
      balance,
      totalToBudget,
      adjustment,
    };
  });

  const surplus =
    toBudget + changedPots.reduce((accum, item) => accum - item.adjustment, 0);

  const foundSurplus = changedPots.find((pot) => pot.id === surplusPot);

  if (foundSurplus) {
    foundSurplus.adjustment = surplus;
  }

  return {
    changedPots,
    surplus: surplus > 0 ? surplus : 0,
  };
};
