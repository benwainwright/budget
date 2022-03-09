import { RegularPayment } from "../providers/payments-provider";
import { Budget } from "../types/budget";
import { getDates } from "./recurrance";

export const distributePayments = (
  budget: Budget,
  payments: RegularPayment[]
): Budget => {
  console.log(budget);
  console.log(payments);
  return {
    ...budget,
    potPlans: budget.potPlans.map((potPlan) => ({
      ...potPlan,
      adjustments: [
        ...potPlan.adjustments.filter(
          (adjustment) =>
            !payments
              .map((payment) => payment.id)
              .includes(adjustment.paymentId)
        ),
        ...payments
          .filter((payment) => payment.pot?.id === potPlan.id)
          .flatMap((payment) =>
            getDates(payment.when, budget.toDate, budget.fromDate).map(
              (date) => ({ ...payment, date })
            )
          )
          .map((payment, index) => ({
            name: payment.name,
            paymentId: payment.id,
            id: `${payment.id}-${index}`,
            amount: payment.amount,
            date: payment.date,
          })),
      ],
    })),
  };
};
