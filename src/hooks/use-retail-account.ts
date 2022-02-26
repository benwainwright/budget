import { useAccounts } from "./use-accounts";
import { useMonzo } from "./use-monzo";

interface AccountBalance {
  balance: number;
  balance_including_flexible_savings: number;
  currency: string;
  local_currency: string;
  local_exchange_rate: 0;
  local_spend: [];
  spend_today: number;
  total_balance: number;
}

export const useRetailAccountBalance = () => {
  const { data } = useAccounts();

  const main = data?.accounts?.find((account) => account.type === "uk_retail");

  return useMonzo<AccountBalance>(
    () => main?.id && `balance?account_id=${main?.id}`
  );
};
