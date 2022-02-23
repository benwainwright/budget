import {
  Box,
  FormControl,
  Input,
  InputLabel,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { usePots } from "./use-pots";
import { DatePicker } from "@mui/lab";
import { AddDateDialog } from "./add-date-dialog";
import { NewDate } from "./date";
import moment from "moment"

interface Pot {
  id: string
  balance: string
  name: string
  weekly: boolean
}

const makePlan = (toBudget: number, pots: Pot[], dates: NewDate[]) => {
    const changedPots = pots.map(pot => {

      const potDates = dates.filter((date) => date.id === pot.id)
      const totalToBudget = potDates.reduce((accum, item) => accum + item.amount ? Number(item.amount) : 0, 0)
      const balance = Number(pot.balance) / 100
      const adjustment = totalToBudget - balance

      return {
        ...pot,
        dates: potDates,
        balance,
        totalToBudget,
        adjustment
      }

    })

    const surplus = toBudget + changedPots.reduce((accum, item) => (accum + (item.adjustment < 0 ? item.adjustment : 0)), 0)

    return { 
      changedPots,
      surplus
    }
}


export const Pots: FC = () => {
  const [endDate, setEndDate] = useState<string>("");
  const { data } = usePots();
  const [dates, setDates] = useState<NewDate[]>([]);
  const [toBudget, setToBudget] = useState<number>(0)

  const plan = makePlan(toBudget, data?.pots ?? [], dates)

  const [addDialogPot, setAddDialogPot] = useState<string | undefined>();
  const [addDialogPotName, setAddDialogPotName] = useState<
    string | undefined
  >();

  var formatter = new Intl.NumberFormat("en-GB", {
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
      {addDialogPot && addDialogPotName && (
        <AddDateDialog
          onSubmit={(newDate) => {
            setAddDialogPot(undefined);
            setAddDialogPotName(undefined);
            setDates([...dates, newDate])
          }}
          name={addDialogPotName}
          id={addDialogPot}
          onClose={() => {
            setAddDialogPot(undefined);
            setAddDialogPotName(undefined);
          }}
        />
      )}

      <Box style={{ display: 'flex', flexDirection: 'column', paddingTop: 20, paddingBottom: 20, gap: 5 }}>
        <DatePicker
          label="Next Payday"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue ?? "");
          }}
          renderInput={(params) => <TextField {...params} />}
        />

        <FormControl>
        <InputLabel htmlFor="budget">To Budget</InputLabel>
        <Input
          id="budget"
          value={toBudget}
          onChange={(event) => setToBudget(Number(event.target.value))}
        />
        </FormControl>

        <FormControl>
        <InputLabel>Surplus</InputLabel>
        <Input
          id="surplus"
          disabled
          value={plan.surplus}
        />
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Payments</TableCell>
              <TableCell>Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plan.changedPots.map((pot) => {
              return <TableRow
                onClick={(event) => {
                  setAddDialogPot(pot.id);
                  setAddDialogPotName(pot.name);
                }}
                key={pot.name}
              >
                <TableCell>{pot.name}</TableCell>
                <TableCell>{formatter.format(pot.balance)}</TableCell>
                <TableCell>
                  <List>
                  {pot.dates.map((date: any) => {
                    const dateString = date.date ? `${moment(date.date).format('MMM Do')} -` : ''
                    return <ListItem disablePadding>{`${dateString}${formatter.format(date.amount)} (${date.name})`}</ListItem> 

                  })}
                  </List>
                </TableCell>
                <TableCell style={{color: pot.adjustment > 0 ? 'red' : pot.adjustment < 0 ? 'blue' : 'green'}}>
                {formatter.format(pot.adjustment)}
                </TableCell>
            </TableRow>
            }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
