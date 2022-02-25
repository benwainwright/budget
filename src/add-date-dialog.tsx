import { Event } from "@mui/icons-material";
import moment from "moment";
import * as uuid from "uuid";
import {
  Box,
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
  Modal,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { NewDate } from "./date";
import { getDates } from "./recurrance";

interface AddDateDialogProps {
  id: string;
  current?: NewDate;
  onDelete?: (id: string) => void;
  onClose: () => void;
  payday: Date;
  onSubmit: (newDate: NewDate) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  boxShadow: 24,
};

export const AddDateDialog: FC<AddDateDialogProps> = ({
  current,
  onClose,
  payday,
  onSubmit,
  id,
  onDelete,
}) => {
  const [name, setName] = useState(current?.name);
  const [amount, setAmount] = useState(current?.amount);
  const [when, setWhen] = useState(current?.when);

  const instances = getDates(when ?? "", payday);

  return (
    <Modal open onClose={onClose}>
      <Card sx={style}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 5, p: 5 }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {current ? "Edit" : "New"} Budget Entry
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
                  potId: id,
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
