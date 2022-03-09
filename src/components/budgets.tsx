import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { FC, useContext, useState } from "react";
import { usePots } from "../hooks/use-pots";
import { useRetailAccountBalance } from "../hooks/use-retail-account";
import { distributePayments } from "../lib/distribute-payments";
import { BudgetsContext } from "../providers/budgets-provider";
import { PaymentsContext } from "../providers/payments-provider";
import { BudgetPlan } from "./budget-plan";
import { NewBudgetDialog } from "./new-budget-dialog";

export const Budgets: FC = () => {
  const { budgets, setBudgets } = useContext(BudgetsContext);
  const { data: balanceData } = useRetailAccountBalance();
  const [tab, setTab] = useState(0);
  const [showNewBudget, setShowNewBudget] = useState(false);
  const { payments } = useContext(PaymentsContext);
  const { data: pots } = usePots();

  return (
    <>
      <Typography variant="h1" component="h2">
        Budgets
      </Typography>
      {showNewBudget && pots && (
        <NewBudgetDialog
          onSubmit={(newBudget) => {
            const finalBudget = distributePayments(newBudget, payments);
            setBudgets([...budgets, finalBudget]);
            setShowNewBudget(false);
          }}
          onClose={() => setShowNewBudget(false)}
          pots={pots.pots}
        />
      )}

      <Button onClick={() => setShowNewBudget(true)}>Create Budget</Button>

      {balanceData && (
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          aria-label="basic tabs example"
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {budgets.map(() => (
              <Tab label="Budget" />
            ))}
          </Box>

          {budgets.length > 0 && (
            <Box sx={{ p: 3 }}>
              <BudgetPlan
                budget={budgets[tab]}
                balance={balanceData.balance}
                onUpdate={(budget) => {
                  const finalBudgets = [...budgets];
                  finalBudgets[tab] = budget;
                  setBudgets(finalBudgets);
                }}
              />
            </Box>
          )}
        </Tabs>
      )}
    </>
  );
};
