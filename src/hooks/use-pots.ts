import { Pot } from "../types/pot";
import { useAccounts } from "./use-accounts";
import { useMonzo } from "./use-monzo";

interface PotsResponse {
  pots: Pot[];
}

export const usePots = () => {
  const { data } = useAccounts()

  const main = data?.accounts?.find(
    (account: any) => account.type === "uk_retail"
  );

  const result = useMonzo<PotsResponse>(
    () => main?.id && `pots?current_account_id=${main?.id}`
  );

  return result;
};
