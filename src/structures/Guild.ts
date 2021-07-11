import { Client } from "./Client";
import { User } from "./User";

export interface Guild {
  id: string;
  unavailable: boolean;
  name: string;
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
    icon: payload.icon || null,
    splash: payload.splash || null,
    ownerID: payload.owner_id,
    get owner(): User {
      return client.users.get(this.ownerID) as User;
    }
  });

  return props;
});
