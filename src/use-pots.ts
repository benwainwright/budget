import { useMonzo } from "./use-monzo";

export interface Pot {
  id: string;
  balance: string;
  name: string;
  weekly: boolean;
}

interface Account {
  type: "uk_retail";
  id: string;
}

interface AccountsResponse {
  accounts: Account[];
}

interface PotsResponse {
  pots: Pot[];
}

export const usePots = () => {
  const { data } = useMonzo<AccountsResponse>("accounts");

  const main = data?.accounts?.find(
    (account: any) => account.type === "uk_retail"
  );

  const result = useMonzo<PotsResponse>(
    () => main?.id && `pots?current_account_id=${main?.id}`
  );

  return result;
};
