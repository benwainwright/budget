import { useMonzo } from "./use-monzo";

export const usePots = () => {
  const { data } = useMonzo("accounts");

  const main = data?.accounts?.find(
    (account: any) => account.type === "uk_retail"
  );

  const result = useMonzo(
    () => main.id && `pots?current_account_id=${main.id}`
  );

  return result;
};
