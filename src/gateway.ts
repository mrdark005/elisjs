import WebSocket, { Data } from "ws";

import { Client } from "./structures/Client";
import { prepareGuild, Guild } from "./structures/Guild";
import { prepareClientUser } from "./structures/ClientUser";
import { prepareUser, User } from "./structures/User";

import { gatewayURL } from "./constants";

let zlib: any;
let inflator: any;
let interval: any;
let waitingGuilds: string[] = [];

try {
  zlib = require("zlib-sync");
  inflator = new zlib.Inflate({
    chunkSize: 131072
  });
} catch {}

export interface GatewayData {
  op: number;
  d: any;
  s?: number;
  t?: string;
}

export const sendData = ((client: Client, data: GatewayData): void => {
  client.ws?.send(JSON.stringify(data));
});

const processData = (async (client: Client, data: Data): Promise<void> => {
  let parsed: GatewayData;

  if (client.options.compress) {
    if (data instanceof ArrayBuffer) {
      data = Buffer.from(data);
    } else if (Array.isArray(data)) {
      data = Buffer.concat(data);
    }

    if ((data as Buffer).length >= 4 && ((data as Buffer).readUInt32BE((data as Buffer).length - 4) == 0xFFFF)) {
      inflator.push(data, zlib.Z_SYNC_FLUSH);
    }

    data = Buffer.from(inflator.result);
    parsed = JSON.parse(data.toString());
  } else {
    parsed = JSON.parse(data as string);
  }

  client.lastSequence = parsed.s || null;

  if (parsed.op == 10) {
    sendData(client, {
      op: 2,
      d: {
        token: client.token,
        properties: {
          "$os": process.platform,
          "$browser": "elisjs",
          "$device": "elisjs"
        },
        compress: client.options.compress,
        large_threshold: client.options.ws?.largeThreshold,
        presence: {
          status: client.user?.presence.getStatus(),
          activities: [],
          since: Date.now(),
          afk: false
        },
        intents: client.intents
      }
    });

    initHeartbeat(client, parsed.d);
  } else if (parsed.op == 9) {
    if (parsed.d) {
      client.ws?.close();
      clearInterval(interval);
      connect(client);

      sendData(client, {
        op: 6,
        d: {
          token: client.token,
          session_id: client.sessionID,
          seq: client.lastSequence
        }
      });
    } else {
      throw new Error("The session is invalid for now, cannot resume.");
    }
  } else if (parsed.op == 0) {
    if (client.events.raw) {
      await client.events.raw(parsed);
    }

    if (parsed.t == "READY") {
      client.id = parsed.d.user.id as string;
      client.sessionID = parsed.d.session_id;
      waitingGuilds = parsed.d.guilds.map((guild: Guild) => guild.id);
      client.users.set(client.id, prepareClientUser(client, parsed.d.user));

      if (client.events.preReady) {
        await client.events.preReady();
      }
    } else if (parsed.t == "GUILD_CREATE") {
      const guild = prepareGuild(client, parsed.d);

      if (waitingGuilds.length == 0 && client.events.guildCreate) {
        await client.events.guildCreate(guild);
      } else if (waitingGuilds.includes(parsed.d.id)) {
        waitingGuilds = waitingGuilds.filter((guildID) => guildID != guild.id);

        if (waitingGuilds.length == 0 && client.events.ready) {
          await client.events.ready();
        }
      }

      client.guilds.set(guild.id, guild);
    } else if (parsed.t == "GUILD_DELETE") {
      const guild = client.guilds.get(parsed.d.id) as Guild;

      if (parsed.d.unavailable) {
        guild.unavailable = true;
        client.guilds.set(parsed.d.id, guild);

        if (client.events.guildUnavailable) {
          await client.events.guildUnavailable(guild);
        }
      } else if (!parsed.d.unavailable) {
        if (client.events.guildDelete) {
          await client.events.guildDelete(guild);
        }

        client.guilds.delete(guild.id);
      }
    } else if (parsed.t == "GUILD_UPDATE") {
      const oldGuild = client.guilds.get(parsed.d.id) as Guild;
      const newGuild = prepareGuild(client, parsed.d);

      client.guilds.set(newGuild.id, newGuild);

      if (client.events.guildUpdate) {
        await client.events.guildUpdate(oldGuild, newGuild);
      }
    } else if (parsed.t == "USER_UPDATE") {
      const oldUser = client.users.get(parsed.d.id) as User;
      const newUser = prepareUser(parsed.d);

      client.users.set(newUser.id, newUser);

      if (client.events.userUpdate) {
        await client.events.userUpdate(oldUser, newUser);
      }
    }
  }
});

const initHeartbeat = ((client: Client, payload: Record<string, any>): void => {
  interval = setInterval(() => {
    sendData(client, {
      op: 1,
      d: client.lastSequence
    });
  }, payload.heartbeat_interval as number);
});

export const connect = ((client: Client): void => {
  if (client.options.compress && !zlib) throw new Error("Please install \"zlib-sync\" package.");

  client.ws = new WebSocket(`${gatewayURL}&encoding=json${client.options.compress ? "&compress=zlib-stream" : ""}`);

  client.ws.on("message", async (data) => {
    await processData(client, data);
  });

  client.ws.on("error", console.log);
  client.ws.on("close", (code, error) => {
    if (code == 4014) {
      throw new Error("Disallowed intents, please check these.");
    } else {
      console.log(code, error);
    }
  });
});
