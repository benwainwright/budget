import {
  Box,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { usePots } from "./use-pots";
import { DatePicker } from "@mui/lab";
import { AddDateDialog } from "./add-date-dialog";
import { NewDate } from "./date";
import moment from "moment";
import { AddBox, Delete } from "@mui/icons-material";
import { makePlan } from "./make-plan";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { BudgetEntryItem } from "./budget-entry-items";

const DATES_KEY = "budget-dates";
const PAYDAY_KEY = "budget-payday";
const SURPLUS_POT_KEY = "budget-surplus-pot";
const TOBUDGET_KEY = "budget-tobudget";
const HIDDEN_POTS = "budget-hidden-pots";

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "none",
});

export const Pots: FC = () => {
  const { data } = usePots();
  const [endDate, setEndDate] = useState<string>(
    localStorage.getItem(PAYDAY_KEY) ?? ""
  );
  const [hidden, setHidden] = useState<string[]>(
    JSON.parse(localStorage.getItem(HIDDEN_POTS) ?? "[]") ?? []
  );
  const [dates, setDates] = useState<NewDate[]>(
    JSON.parse(localStorage.getItem(DATES_KEY) ?? "[]") ?? []
  );

  const [toBudget, setToBudget] = useState<number>(
    Number(localStorage.getItem(TOBUDGET_KEY))
  );
  const [surplusPot, setSurplusPot] = useState<string>(
    localStorage.getItem(SURPLUS_POT_KEY) ?? ""
  );

  const [addDialogPot, setAddDialogPot] = useState<string | undefined>();
  const [addDialogPotName, setAddDialogPotName] = useState<
    string | undefined
  >();

  useEffect(() => {
    endDate && localStorage.setItem(PAYDAY_KEY, endDate);
    hidden.length > 0 &&
      localStorage.setItem(HIDDEN_POTS, JSON.stringify(hidden));
    dates.length > 0 && localStorage.setItem(DATES_KEY, JSON.stringify(dates));
    surplusPot && localStorage.setItem(SURPLUS_POT_KEY, surplusPot);
    toBudget && localStorage.setItem(TOBUDGET_KEY, String(toBudget));
  }, [endDate, dates, surplusPot, toBudget, hidden]);

  const payday = new Date(endDate);
  const plan = makePlan(
    toBudget,
    data?.pots?.filter((pot) => !hidden.includes(pot.id)) ?? [],
    dates,
    surplusPot,
    payday
  );

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

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 20,
          paddingBottom: 60,
          gap: 25,
        }}
      >
        <DatePicker
          label="Next Payday"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue ?? "");
          }}
          renderInput={(params) => <TextField {...params} />}
        />

        <Box style={{ display: "flex", flexDirection: "column" }}>
          <InputLabel htmlFor="budget">Amount To Budget</InputLabel>
          <Input
            id="budget"
            value={toBudget}
            onChange={(event) => setToBudget(Number(event.target.value))}
          />
        </Box>
      </Box>

      <RadioGroup name="radio-buttons-group">
        <TableContainer component={Paper}>
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
                  <Typography variant="h5">Actions</Typography>
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
                            <TableCell padding="none" align="center">
                              <IconButton
                                onClick={() => {
                                  setAddDialogPot(pot.id);
                                  setAddDialogPotName(pot.name);
                                }}
                              >
                                <AddBox />
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  setHidden([...hidden, pot.id]);
                                }}
                              >
                                <Delete />
                              </IconButton>
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
