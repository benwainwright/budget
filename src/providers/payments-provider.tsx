import { createContext, FC } from "react";
import { usePersistedState } from "../hooks/use-persisted-state";
import { Pot } from "../types/pot";

export interface RegularPayment {
  when: string;
  amount: string;
  pot?: Pot;
  fromMain: boolean;
  name: string;
  id: string;
}

interface PaymentsContext {
  payments: RegularPayment[];
  setPayments: (payments: RegularPayment[]) => void;
}

const defaultPayments: RegularPayment[] = [];

export const PaymentsContext = createContext<PaymentsContext>({
  payments: defaultPayments,
  setPayments: () => {},
});

const PAYMENTS_KEY = "budget-payments";

export const PaymentsProvider: FC = ({ children }) => {
  const [payments, setPayments] = usePersistedState(
    PAYMENTS_KEY,
    defaultPayments
  );
  return (
    <PaymentsContext.Provider value={{ payments, setPayments }}>
      {children}
    </PaymentsContext.Provider>
  );
};
