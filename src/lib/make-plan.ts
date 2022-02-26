import moment from "moment";
import { BudgetEntry } from "../types/budget-entry";
import { Pot } from "../types/pot";
import { getDates } from "./recurrance";

export const calculateBudget = (
  overdraft: number,
  balance: number,
  pots: Pot[],
  entries: BudgetEntry[],
  surplusPot: string,
  endDate: Date
) => {
  const changedPots = pots.map((pot) => {
    const rawDates = entries.filter((date) => date.potId === pot.id);

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

  const potTotals = changedPots.reduce(
    (accum, item) => accum + item.balance,
    0
  );

  const planned = changedPots.reduce(
    (accum, item) => accum + item.totalToBudget,
    0
  );
  const availableBalance = balance + overdraft;
  const surplus = availableBalance + potTotals - planned;
  const foundSurplus = changedPots.find((pot) => pot.id === surplusPot);

  if (foundSurplus && surplus >= 0) {
    foundSurplus.adjustment = surplus;
  }

  return {
    changedPots,
    surplus,
  };
};
