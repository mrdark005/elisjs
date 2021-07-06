import WebSocket from "ws";

import { connect } from "../connection";

import { User } from "./User";
import { ClientUser } from "./ClientUser";
import { Guild } from "./Guild";

import Collection from "../utils/Collection";

export interface ClientOptions {
  compress?: boolean;
  ws?: {
    largeThreshold: number;
  }
}

export interface Client {
  id?: string;
  options: ClientOptions;
  token: string;
  user: ClientUser | null;
  guilds: Collection<string, Guild>;
  users: Collection<string, User>;

  ws?: WebSocket;
  lastSequence: number | null;

  login: (() => void);
}

export const create = ((token: string, options: ClientOptions): Client => {
  const props: Client = ({
    id: undefined,
    options: Object.assign({
      compress: false,
      ws: {
        largeThreshold: 50
      }
    }, options),
    token,
    get user() {
      if (this.id && this.users.has(this.id as string)) {
        return this.users.get(this.id as string) as ClientUser;
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
