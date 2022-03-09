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
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Adjustment } from "../types/budget";
import { DatePicker } from "@mui/lab";

interface AddAdjustmentDialogProps {
  id: string;
  current?: Adjustment;
  onDelete?: (id: string) => void;
  onClose: () => void;
  onSubmit: (newDate: Adjustment) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  boxShadow: 24,
};

export const AddAdjustmentDialog: FC<AddAdjustmentDialogProps> = ({
  current,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [name, setName] = useState(current?.name);
  const [amount, setAmount] = useState(current?.amount);
  const [when, setWhen] = useState(current?.date);

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
            <DatePicker
              label="when"
              value={when}
              onChange={(newValue) => {
                setWhen(newValue ?? undefined);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
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
                  amount: amount ?? "",
                  name: name ?? "",
                  paymentId: "",
                  date: when,
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
