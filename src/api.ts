const MONZO_ID = "oauth2client_00009pjIPXhWYkc6rvfa1C";
const MONZO_SECRET = encodeURIComponent(
  "mnzconf.CV//V1y61tVkUCH6/qlkq58scua2LFCnAMuUKAwO1imYVJzfERJjNaF/q3TLtVVxvKktrjXnKBU9V53kvD3h"
);
const MONZO_REDIRECT_URI = encodeURIComponent("http://localhost:3000");
const BUDGET_REDIRECT_STATE_KEY = "budget_redirect_state";
const BUDGET_TOKEN_KEY = "budget-token";

export const getToken = () => {
  const state = encodeURIComponent(String(Math.random()));

  localStorage.setItem(BUDGET_REDIRECT_STATE_KEY, state);

  const token = localStorage.getItem(BUDGET_TOKEN_KEY);

  if (!token) {
    console.log(token);
    const redirectTo = `https://auth.monzo.com/?client_id=${MONZO_ID}&redirect_uri=${MONZO_REDIRECT_URI}&response_type=code&state=${state}`;
    console.log(redirectTo);
    window.location.href = redirectTo;
  }
};
