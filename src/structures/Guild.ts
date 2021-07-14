import { Client } from "./Client";

import getTimestamp from "../utils/getTimestamp";

export interface Guild {
  id: string;
  client: Client;
  unavailable: boolean;
  name: string;
  createdAt: number;
  icon: string | null;
  splash: string | null;
  ownerID: string;
}

export const prepareGuild = ((client: Client, payload: Record<string, any>) => {
  const props: Guild = ({
    id: payload.id,
    client,
    unavailable: payload.unavailable || false,
    name: payload.name,
    createdAt: getTimestamp(payload.id),
    icon: payload.icon || null,
    splash: payload.splash || null,
    ownerID: payload.owner_id
  });

  return props;
});
