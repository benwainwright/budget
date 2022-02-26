import { useEffect, useState } from "react";

const MONZO_ID = "oauth2client_0000AGsrmDCRRbCYvHz1Yv";
const MONZO_SECRET =
  "mnzpub.bY1+LQZy0sx6I4kY+iuIYYQjqhz50v/5da4o3n7vjYSqmyWT5INbX68Ys7HJJorAGyQghcou4luHmZk38jIR/Q==";
const MONZO_REDIRECT_URI = "budget-app://auth";
const BUDGET_REDIRECT_STATE_KEY = "budget_redirect_state";
const BUDGET_TOKEN_KEY = "budget-token";

export const useToken = () => {
  const [token, setToken] = useState<string | undefined>();
  useEffect(() => {
    (async () => {
      const localStorageToken = localStorage.getItem(BUDGET_TOKEN_KEY);

      const params = new URLSearchParams(window.location.search);

      const state = params.get("state");
      const code = params.get("code");

      if (state && code) {
        const storedState = localStorage.getItem(BUDGET_REDIRECT_STATE_KEY);
        if (storedState !== state) {
          return;
        }
        const form = new FormData();
        form.append("grant_type", "authorization_code");
        form.append("client_id", MONZO_ID);
        form.append("client_secret", MONZO_SECRET);
        form.append("redirect_uri", MONZO_REDIRECT_URI);
        form.append("code", code);

        const tokenResponse = await fetch(
          "https://api.monzo.com/oauth2/token",
          {
            method: "POST",
            body: form,
          }
        );

        const tokenData = await tokenResponse.json();
        localStorage.setItem(BUDGET_TOKEN_KEY, tokenData.access_token);
        window.location.href = `http://localhost:3000`;
        return;
      }

      if (!localStorageToken) {
        const state = String(Math.random());
        localStorage.setItem(BUDGET_REDIRECT_STATE_KEY, state);
        console.log(localStorageToken);
        const redirectTo = `https://auth.monzo.com/?client_id=${encodeURIComponent(
          MONZO_ID
        )}&redirect_uri=${encodeURIComponent(
          MONZO_REDIRECT_URI
        )}&response_type=code&state=${encodeURIComponent(state)}`;
        console.log(redirectTo);
        window.location.href = redirectTo;
        return;
      }

      setToken(localStorageToken);
    })();
  }, []);
  return token;
};
