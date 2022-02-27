import { Handler } from "aws-lambda";
import { getEnv } from "./get-env";
import fetch from "node-fetch";

export const handler: Handler = async (event) => {
  const { code } = JSON.parse(event.body);

  const clientId = getEnv("MONZO_CLIENT_ID");
  const clientSecret = getEnv("MONZO_CLIENT_SECRET");
  const redirectUri = getEnv("MONZO_REDIRECT_URI");

  const form = new FormData();
  form.append("grant_type", "authorization_code");
  form.append("client_id", clientId);
  form.append("client_secret", clientSecret);
  form.append("redirect_uri", redirectUri);
  form.append("code", code);

  const tokenResponse = await fetch("https://api.monzo.com/oauth2/token", {
    method: "POST",
    body: form,
  });

  return {
    statusCode: 200,
    body: await tokenResponse.text(),
  };
};
