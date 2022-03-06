import { Event } from "@mui/icons-material";
import moment from "moment";
import * as uuid from "uuid";
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { getDates } from "../lib/recurrance";
import { RegularPayment } from "../providers/payments-provider";
import { Pot } from "../types/pot";

interface AddPaymentDialogProps {
  current?: RegularPayment;
  onDelete?: (id: string) => void;
  onClose: () => void;
  pots: Pot[];
  onSubmit: (newDate: RegularPayment) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  boxShadow: 24,
};

export const AddPaymentDialog: FC<AddPaymentDialogProps> = ({
  current,
  onClose,
  onSubmit,
  onDelete,
  pots
}) => {
  const [name, setName] = useState(current?.name);
  const [amount, setAmount] = useState(current?.amount);
  const [when, setWhen] = useState(current?.when);
  const [pot, setPot] = useState<Pot | undefined>(current?.pot)

  const nextYear = new Date();

  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const instances = getDates(when ?? "", nextYear, 10);

  return (
    <Modal open onClose={onClose}>
      <Card sx={style}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 5, p: 5 }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {current ? "Edit" : "New"} Payment
          </Typography>

          <FormControl>
            <InputLabel htmlFor="payment-name">Name</InputLabel>
            <Input
              id="payment-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <Input
              id="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="pot">Pot</InputLabel>
            <Select
              labelId="pot"
              id="pots"
              value={pot?.id}
              label="Age"
              onChange={(event) => setPot(pots.find(pot => pot.id === event.target.value))}
            >
            {pots.map(pot => <MenuItem value={pot.id}>{pot.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="recur">When</InputLabel>
            <Input
              id="when"
              value={when}
              onChange={(event) => setWhen(event.target.value)}
            />
          </FormControl>
          <List disablePadding>
            {instances.map((instance) => (
              <ListItem disableGutters>
                <ListItemIcon
                  sx={{
                    minWidth: 30,
                  }}
                >
                  <Event />
                </ListItemIcon>
                {moment(instance).format("dddd MMM Do")}
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions
          sx={{
            marginBottom: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ButtonGroup variant="contained">
            <Button
              onClick={() => {
                onSubmit({
                  id: current?.id ?? uuid.v4(),
                  fromMain: false,
                  pot: pot,
                  amount: amount ?? "",
                  name: name ?? "",
                  when: when ?? "",
                });
              }}
            >
              Save
            </Button>

            {current && (
              <Button
                variant="outlined"
                onClick={() => onDelete?.(current?.id)}
              >
                Delete
              </Button>
            )}

            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>
    </Modal>
  );
};
