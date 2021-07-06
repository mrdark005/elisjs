import { User } from "./User";
import { Guild } from "./Guild";

import Collection from "../utils/Collection";

export interface Client {
  id?: string;
  token: string;
  user: User | null;
  guilds: Collection<string, Guild>;
  users: Collection<string, User>;
}

export const create = ((token: string): Client => {
  const props: Client = ({
    id: undefined,
    token,
    get user() {
      if (this.id && this.users.has(this.id as string)) {
        return this.users.get(this.id as string) as User;
      } else {
        return null;
      }
    },
    guilds: new Collection<string, Guild>(),
    users: new Collection<string, User>()
  });

  return props;
});
