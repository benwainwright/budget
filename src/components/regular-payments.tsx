import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useContext, useState } from "react";
import { usePots } from "../hooks/use-pots";
import {
  RegularPayment,
  PaymentsContext,
} from "../providers/payments-provider";
import { AddPaymentDialog } from "./add-payment-dialog";

export const Payments: FC = () => {
  const { payments, setPayments } = useContext(PaymentsContext);
  const { data } = usePots();
  const [showAddPayments, setShowAddPayments] = useState(false);
  const [editingPayment, setEditingPayment] = useState<
    RegularPayment | undefined
  >();

  const pots = data?.pots
  return (
    <>
      {showAddPayments && pots && (
        <AddPaymentDialog
          onDelete={(id) =>
            setPayments(payments.filter((payment) => payment.id !== id))
          }
          pots={pots}
          onClose={() => {
            setShowAddPayments(false);
            setEditingPayment(undefined);
          }}
          onSubmit={(payment) => {
            const oldPayment = payments.findIndex(
              (oldPayment) => payment.id === oldPayment.id
            );
            const newPayments =
              oldPayment === -1 ? [...payments, payment] : [...payments];

            if (oldPayment !== -1) {
              newPayments[oldPayment] = payment;
            }

            setPayments(newPayments);
            setEditingPayment(undefined);
            setShowAddPayments(false);
          }}
          current={editingPayment}
        />
      )}
      <Typography variant="h1" component="h2">
        Regular Payments
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <TableContainer component={Paper} sx={{ marginTop: 5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Amount</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">When</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography>No payments</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow
                    onClick={() => {
                      setEditingPayment(payment);
                      setShowAddPayments(true);
                    }}
                  >
                    <TableCell>{payment.name}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.when}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <Button onClick={() => setShowAddPayments(true)}>
                Create Payment
              </Button>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
