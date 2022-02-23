import { DatePicker } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { NewDate } from "./date";


interface AddDateDialogProps {
  id: string;
  name: string;
  onClose: () => void;
  onSubmit: (newDate: NewDate) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  gap: 5,
  p: 4,
};

export const AddDateDialog: FC<AddDateDialogProps> = (props) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [weekly, setWeekly] = useState(false)

  return (
    <Modal open onClose={props.onClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Enter date of payment
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
            value={date}
            onChange={(newValue) => {
              setDate(newValue ?? "");
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>

        <Button
          variant="contained"
          onClick={() => {
            props.onSubmit({
              id: props.id,
              date,
              amount,
              name,
            });
          }}
        >
          Add
        </Button>
      </Box>
    </Modal>
  );
};
