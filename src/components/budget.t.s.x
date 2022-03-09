import {
  IconButton,
  List,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AddBox, Delete } from "@mui/icons-material";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { FC, useContext, useEffect, useState } from "react";

import { usePots } from "../hooks/use-pots";
import { AddDateDialog } from "./add-date-dialog";
import { BudgetEntry } from "../types/budget-entry";
import { calculateBudget } from "../lib/make-plan";
import { BudgetEntryItem } from "./budget-entry-items";
import { useRetailAccountBalance } from "../hooks/use-retail-account";
import { SettingsContext } from "../providers/settings-provider";

const DATES_KEY = "budget-dates";
const SURPLUS_POT_KEY = "budget-surplus-pot";
const HIDDEN_POTS = "budget-hidden-pots";

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "none",
});

export const Budget: FC = () => {
  const { settings } = useContext(SettingsContext);
  const { data: balanceData } = useRetailAccountBalance();
  console.log("render");
  const { data } = usePots();
  const [hidden, setHidden] = useState<string[]>(
    JSON.parse(localStorage.getItem(HIDDEN_POTS) ?? "[]") ?? []
  );
  const [dates, setDates] = useState<BudgetEntry[]>(
    JSON.parse(localStorage.getItem(DATES_KEY) ?? "[]") ?? []
  );

  const [surplusPot, setSurplusPot] = useState<string>(
    localStorage.getItem(SURPLUS_POT_KEY) ?? ""
  );

  const balance = (balanceData?.balance ?? 0) / 100;

  const [addDialogPot, setAddDialogPot] = useState<string | undefined>();
  const [addDialogPotName, setAddDialogPotName] = useState<
    string | undefined
  >();

  useEffect(() => {
    hidden.length > 0 &&
      localStorage.setItem(HIDDEN_POTS, JSON.stringify(hidden));
    dates.length > 0 && localStorage.setItem(DATES_KEY, JSON.stringify(dates));
    surplusPot && localStorage.setItem(SURPLUS_POT_KEY, surplusPot);
  }, [dates, surplusPot, hidden]);

  const payday = settings.nextPayday;

  if (!payday) {
    return (
      <>
        <Typography variant="h1" component="h2">
          Budget
        </Typography>

        <Typography>
          Please configure data of next payday on the settings page
        </Typography>
      </>
    );
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const draggedDate = result.draggableId;
    const newPot = result.destination.droppableId;

    const newDates = dates.map((date) =>
      date.id === draggedDate ? { ...date, potId: newPot } : date
    );
    setDates(newDates);
  };

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  if (!plan) {
    return <>Loading</>;
  }
  return (
    <>
      <Typography variant="h1" component="h2">
        Budget
      </Typography>

      <Typography variant="h4" component="h3">
        {formatter.format(plan.surplus)} remaining
      </Typography>

      {addDialogPot && addDialogPotName && (
        <AddDateDialog
          payday={payday}
          onSubmit={(newDate) => {
            setAddDialogPot(undefined);
            setAddDialogPotName(undefined);
            setDates([...dates, newDate]);
          }}
          id={addDialogPot}
          onClose={() => {
            setAddDialogPot(undefined);
            setAddDialogPotName(undefined);
          }}
        />
      )}

      <RadioGroup name="radio-buttons-group">
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
            <DragDropContext onDragEnd={onDragEnd}>
              <TableBody>
                {plan.changedPots.map((pot, potIndex) => {
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
                                {pot.rawDates.map((date, index) => {
                                  return (
                                    <BudgetEntryItem
                                      onDelete={() => {
                                        const newDates = dates.filter(
                                          (item) => item.id !== date.id
                                        );
                                        setDates(newDates);
                                      }}
                                      onEdit={(date) => {
                                        const newDates = dates.map(
                                          (editingDate) =>
                                            editingDate.id === date.id
                                              ? date
                                              : editingDate
                                        );
                                        setDates(newDates);
                                      }}
                                      key={`${date.id}-budget-entry`}
                                      payday={payday}
                                      date={date}
                                      dates={pot.dates.filter(
                                        (generatedDate) =>
                                          generatedDate.id === date.id
                                      )}
                                      index={potIndex + index}
                                      isFinal={
                                        index === pot.rawDates.length - 1
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
                            <TableCell padding="none" align="center">
                              <Radio
                                checked={surplusPot === pot.id}
                                onChange={(event) => {
                                  setSurplusPot(event.target.value);
                                  event.stopPropagation();
                                  event.preventDefault();
                                }}
                                value={pot.id}
                                name="radio-buttons"
                              />
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
      </RadioGroup>
    </>
  );
};
