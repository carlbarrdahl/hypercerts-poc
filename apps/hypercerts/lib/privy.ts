import ky from "ky";
import { PrivyClient } from "@privy-io/server-auth";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const appSecret = process.env.PRIVY_APP_SECRET!;
export const privy = new PrivyClient(appId, appSecret);

const credentials = Buffer.from(`${appId}:${appSecret}`).toString("base64");

const headers = {
  Authorization: `Basic ${credentials}`,
  "privy-app-id": appId,
  "Content-Type": "application/json",
};

const privyRestAPI = ky.create({
  prefixUrl: "https://api.privy.io/v1",
  headers,
});

export const extended = {
  keyQuorum: async (keyIds: string[]) => {
    const response = await privyRestAPI.post("key-quorum", {
      json: {
        display_name: "Prod key quorum",
        public_keys: [
          "-----BEGIN PUBLIC KEY-----\n ... your public key ...\n-----END PUBLIC KEY-----",
        ],
        authorization_threshold: 1,
      },
    });
    return response.json();
  },
};
