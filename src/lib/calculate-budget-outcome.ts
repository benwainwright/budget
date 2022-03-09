import { Budget } from "../types/budget";

export const calculateBudgetOutcome = (
  overdraft: number,
  accountBalance: number,
  budget: Budget,
  surplusPot: string
) => {
  const hydratedPots = budget.potPlans.map((plan) => {
    const totalToBudget = plan.adjustments.reduce(
      (accum, item) => accum + (item.amount ? Number(item.amount) : 0),
      0
    );

    const balance = Number(plan.balance) / 100;
    const adjustment = totalToBudget - balance;

    return {
      ...plan,
      balance,
      totalToBudget,
      adjustment,
    };
  });

  const potTotals = hydratedPots.reduce(
    (accum, item) => accum + item.balance,
    0
  );

  const planned = hydratedPots.reduce(
    (accum, item) => accum + item.totalToBudget,
    0
  );

  const availableBalance = accountBalance / 100 + overdraft;
  const surplus = availableBalance + potTotals - planned;
  const foundSurplus = hydratedPots.find((pot) => pot.id === surplusPot);

  if (foundSurplus && surplus >= 0) {
    foundSurplus.adjustment = surplus;
  }

  return {
    pots: hydratedPots,
    surplus,
  };
};
