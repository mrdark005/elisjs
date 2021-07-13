import { Client } from "./Client";
import { User } from "./User";

import getTimestamp from "../utils/getTimestamp";

export interface Guild {
  id: string;
  unavailable: boolean;
  name: string;
  createdAt: number;
  icon: string | null;
  splash: string | null;
  ownerID: string;
  owner: User;
}

export const prepareGuild = ((client: Client, payload: Record<string, any>) => {
  const props: Guild = ({
    id: payload.id,
    unavailable: payload.unavailable || false,
    name: payload.name,
    createdAt: getTimestamp(payload.id),
    icon: payload.icon || null,
    splash: payload.splash || null,
    ownerID: payload.owner_id,
    get owner() {
      return client.users.get(this.ownerID) as User;
    }
  });

  return props;
});
