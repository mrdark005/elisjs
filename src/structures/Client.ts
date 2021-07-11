import WebSocket from "ws";

import { connect } from "../gateway";

import { User } from "./User";
import { ClientUser } from "./ClientUser";
import { Guild } from "./Guild";

import Collection from "../utils/Collection";

import { Intents, Intents_ALL } from "../constants";

export interface ClientEvents {
  preReady?(): Promise<void> | void;
  ready?(): Promise<void> | void;
  raw?(raw: Record<string, any>): Promise<void> | void;
  guildCreate?(guild: Guild): Promise<void> | void;
  guildDelete?(guild: Guild): Promise<void> | void;
  guildUnavailable?(guild: Guild): Promise<void> | void;
}

export interface ClientOptions {
  compress?: boolean;
  ws?: {
    largeThreshold: number;
    intents: number | Intents[]
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
  intents: number;
  lastSequence: number | null;
  sessionID: string | null;

  events: ClientEvents;
  login: (() => void);
}

export const create = ((token: string, options: ClientOptions) => {
  const props: Client = ({
    id: undefined,
    options: Object.assign({
      compress: false,
      ws: {
        largeThreshold: 50,
        intents: Intents_ALL
      },
    }, options),
    token,
    get user(): ClientUser | null {
      if (this.id && this.users.has(this.id as string)) {
        return this.users.get(this.id as string) as ClientUser;
      } else {
        return null;
      }
    },
    guilds: new Collection<string, Guild>(),
    users: new Collection<string, User>(),

    intents: 0,
    lastSequence: null,
    sessionID: null,

    events: {},
    login() {
      return connect(this);
    }
  });

  if (typeof props.options.ws?.intents == "number") {
    props.intents = props.options.ws?.intents;
  } else if (Array.isArray(props.options.ws?.intents)) {
    const length = props.options.ws?.intents.length as number;

    for (let i = 0; i < length; i++) {
      const intentKey = props.options.ws?.intents[i] as unknown as keyof typeof Intents;
      props.intents |= Intents[intentKey];
    }
  }

  return props;
});
