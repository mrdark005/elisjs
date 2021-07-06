import { connect } from "../connection";

import { User } from "./User";
import { Guild } from "./Guild";

import Collection from "../utils/Collection";

export interface ClientOptions {
  compress: boolean;
}

export interface Client {
  id?: string;
  options: ClientOptions;
  token: string;
  user: User | null;
  guilds: Collection<string, Guild>;
  users: Collection<string, User>;

  lastSequence: number | null;

  login: (() => void);
}

export const create = ((token: string, options: ClientOptions): Client => {
  const props: Client = ({
    id: undefined,
    options: Object.assign({
      compress: false
    }, options),
    token,
    get user() {
      if (this.id && this.users.has(this.id as string)) {
        return this.users.get(this.id as string) as User;
      } else {
        return null;
      }
    },
    guilds: new Collection<string, Guild>(),
    users: new Collection<string, User>(),

    lastSequence: null,

    login() {
      return connect(this);
    }
  });

  return props;
});
