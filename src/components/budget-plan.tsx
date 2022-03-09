import {
  Button,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useContext } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { calculateBudgetOutcome } from "../lib/calculate-budget-outcome";
import { distributePayments } from "../lib/distribute-payments";
import { PaymentsContext } from "../providers/payments-provider";
import { SettingsContext } from "../providers/settings-provider";
import { Budget } from "../types/budget";
import { AdjustmentItem } from "./adjustment-item";

interface BudgetPlanProps {
  budget: Budget;
  balance: number;
  onUpdate: (budget: Budget) => void;
}

const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "none",
});

export const BudgetPlan: FC<BudgetPlanProps> = ({
  balance,
  budget,
  onUpdate,
}) => {
  const { settings } = useContext(SettingsContext);
  const { payments } = useContext(PaymentsContext);
  const outcome = calculateBudgetOutcome(
    settings.overdraft,
    balance,
    budget,
    settings.surplusPot
  );

  return (
    <>
      <Typography variant="h4" component="h3">
        {formatter.format(outcome.surplus)} remaining
      </Typography>

      <Button
        onClick={() => {
          const finalBudget = distributePayments(budget, payments);
          onUpdate(finalBudget);
        }}
      >
        Update Payments
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h5">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5">Balance</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5">Entries</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5">Change</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5">Surplus</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={() => {}}>
            <TableBody>
              {outcome.pots.map((pot, potIndex) => {
                return (
                  <Droppable droppableId={pot.id} key={`${pot.id}-droppable`}>
                    {(provided, snapshot) => {
                      return (
                        <TableRow
                          key={pot.id}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          <TableCell>
                            <Typography variant="h5">{pot.name}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            {formatter.format(pot.balance)}
                          </TableCell>
                          <TableCell padding="none">
                            <List disablePadding>
                              {pot.adjustments.map((adjustment, index) => {
                                return (
                                  <AdjustmentItem
                                    onDelete={() => {
                                      const newBudget = {
                                        ...budget,
                                        potPlans: budget.potPlans.map(
                                          (needle) =>
                                            pot.id === needle.id
                                              ? {
                                                  ...pot,
                                                  balance: String(pot.balance),
                                                  adjustments:
                                                    pot.adjustments.filter(
                                                      (needle) =>
                                                        needle.id !==
                                                        adjustment.id
                                                    ),
                                                }
                                              : needle
                                        ),
                                      };
                                      onUpdate(newBudget);
                                    }}
                                    onEdit={(newAdjustment) => {
                                      const newBudget = {
                                        ...budget,
                                        potPlans: budget.potPlans.map(
                                          (needle) =>
                                            pot.id === needle.id
                                              ? {
                                                  ...pot,
                                                  balance: String(pot.balance),
                                                  adjustments:
                                                    pot.adjustments.map(
                                                      (needle) =>
                                                        needle.id ===
                                                        adjustment.id
                                                          ? newAdjustment
                                                          : needle
                                                    ),
                                                }
                                              : needle
                                        ),
                                      };
                                      onUpdate(newBudget);
                                    }}
                                    key={`${adjustment.id}-budget-entry`}
                                    payday={budget.toDate}
                                    adjustment={adjustment}
                                    index={potIndex + index}
                                    isFinal={
                                      index === pot.adjustments.length - 1
                                    }
                                  />
                                );
                              })}
                              {provided.placeholder}
                            </List>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              color:
                                pot.adjustment > 0
                                  ? "red"
                                  : pot.adjustment < 0
                                  ? "blue"
                                  : "green",
                            }}
                          >
                            {formatter.format(pot.adjustment)}
                          </TableCell>
                        </TableRow>
                      );
                    }}
                  </Droppable>
                );
              })}
            </TableBody>
          </DragDropContext>
        </Table>
      </TableContainer>
    </>
  );
};
