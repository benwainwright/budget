import useSWR from "swr";
import { useToken } from "./use-token";

const fetcher = async (path: string, token: string) => {
  const finalPath = `https://api.monzo.com/${path}`;
  return fetch(finalPath, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => r.json());
};

export const useMonzo = <T>(path: string | (() => string | undefined)) => {
  const token = useToken();

  const key =
    typeof path === "function"
      ? () => token && path() && [path(), token]
      : token && [path, token];

  return useSWR<T>(key, fetcher);
};
