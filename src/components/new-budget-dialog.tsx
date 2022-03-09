import { Event } from "@mui/icons-material";
import moment from "moment";
import * as uuid from "uuid";
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useContext, useState } from "react";
import { Budget } from "../types/budget";
import { DatePicker } from "@mui/lab";
import { Pot } from "../types/pot";
import { distributePayments } from "../lib/distribute-payments";
import { PaymentsContext } from "../providers/payments-provider";

interface AddDateDialogProps {
  onClose: () => void;
  pots: Pot[];
  onSubmit: (newBudget: Budget) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  boxShadow: 24,
};

export const NewBudgetDialog: FC<AddDateDialogProps> = ({
  onClose,
  onSubmit,
  pots,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <Modal open onClose={onClose}>
      <Card sx={style}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 5, p: 5 }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Budget
          </Typography>

          <DatePicker
            label="Budget Start"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue ?? undefined);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Budget End"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue ?? undefined);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </CardContent>

        <CardActions
          sx={{
            marginBottom: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ButtonGroup variant="contained">
            {startDate && endDate && (
              <Button
                onClick={() => {
                  const newBudget: Budget = {
                    fromDate: startDate,
                    toDate: endDate,
                    potPlans: pots.map((pot) => ({ ...pot, adjustments: [] })),
                  };
                  onSubmit(newBudget);
                }}
              >
                Save
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
