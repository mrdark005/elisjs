import { Client } from "./Client";
import { Emoji } from "./Emoji";

import getTimestamp from "../utils/getTimestamp";
import Collection from "../utils/Collection";

export interface Guild {
  id: string;
  client: Client;
  unavailable: boolean;
  name: string;
  createdAt: number;
  emojis: Collection<string, Emoji>;
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
    emojis: new Collection(),
    icon: payload.icon || null,
    splash: payload.splash || null,
    ownerID: payload.owner_id
  });

  return props;
});
