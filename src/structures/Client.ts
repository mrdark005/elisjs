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
  guildUpdate?(oldGuild: Guild, newGuild: Guild): Promise<void> | void;
  guildUnavailable?(guild: Guild): Promise<void> | void;

  userUpdate?(oldUser: User, newUser: User): Promise<void> | void;
}

export interface ClientOptions {
  compress?: boolean;
  ws?: {
    largeThreshold: number;
    intents: number | Intents[] | (keyof typeof Intents)[]
  }
}

export interface Client {
  id?: string;
  options: ClientOptions;
  token: string;
  guilds: Collection<string, Guild>;
  users: Collection<string, User>;

  getUser: (() => ClientUser | undefined);

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
    getUser: (() => {
      return props.users.get(props.id as string) as (ClientUser | undefined);
    }),
    guilds: new Collection(),
    users: new Collection(),

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
    const wsOptions = props.options.ws as NonNullable<ClientOptions["ws"]>;
    let intents = wsOptions.intents as any[];

    if (intents.length > 0 && typeof intents[0] == "string") {
      const intentsLength = intents.length;

      for (let i = 0; i < intentsLength; i++) {
        const intentKey = intents[i] as keyof typeof Intents;
        props.intents |= Intents[intentKey];
      }
    } else if (intents.length > 0 && typeof intents[0] == "number") {
      const intentsLength = intents.length;

      for (let i = 0; i < intentsLength; i++) {
        props.intents |= intents[i] as number;
      }
    }
  }

  return props;
});
