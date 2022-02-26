import { useMonzo } from "./use-monzo";

interface Account {
  type: "uk_retail";
  id: string;
}

interface AccountsResponse {
  accounts: Account[];
}

export const useAccounts = () => {
  return useMonzo<AccountsResponse>("accounts");
};
