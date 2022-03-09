import { createContext, FC } from "react";
import { usePersistedState } from "../hooks/use-persisted-state";
import { Budget } from "../types/budget";

interface BudgetsContext {
  budgets: Budget[];
  setBudgets: (payments: Budget[]) => void;
}

const defaultBudgets: Budget[] = [];

export const BudgetsContext = createContext<BudgetsContext>({
  budgets: defaultBudgets,
  setBudgets: () => {},
});

const BUDGETS_KEY = "budget-budgets";

const deserialiseDate = (date: string) => new Date(Date.parse(date));

export const BudgetsProvider: FC = ({ children }) => {
  const [budgets, setBudgets] = usePersistedState(BUDGETS_KEY, defaultBudgets);
  const deserialisedBudgets = budgets.map((budget) => ({
    ...budget,
    fromDate: deserialiseDate(budget.fromDate as unknown as string),
    toDate: deserialiseDate(budget.toDate as unknown as string),
    adjustments: budget.potPlans.map((potPlan) => ({
      ...potPlan,
      adjustments: potPlan.adjustments.map((adjustment) => ({
        ...adjustment,
        date: deserialiseDate(adjustment.date as unknown as string),
      })),
    })),
  }));
  return (
    <BudgetsContext.Provider
      value={{ budgets: deserialisedBudgets, setBudgets }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
