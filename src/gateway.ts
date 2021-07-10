import WebSocket, { Data } from "ws";

import { Client } from "./structures/Client";
import { prepareClientUser } from "./structures/ClientUser";

import { gatewayURL } from "./constants";

let zlib: any;
let inflator: any;

try {
  zlib = require("zlib-sync");
  inflator = new zlib.Inflate({
    chunkSize: 131072
  });
} catch {}

export const sendData = ((client: Client, data: Record<string, any>): void => {
  client.ws?.send(JSON.stringify(data));
});

const processData = (async (client: Client, data: Data): Promise<void> => {
  let parsed: Record<string, any>;

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

  client.lastSequence = parsed.s;

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
  } else if (parsed.op == 0) {
    if (client.events.raw) {
      await client.events.raw(parsed);
    }

    if (parsed.t == "READY") {
      client.id = parsed.d.user.id as string;
      client.sessionID = parsed.d.session_id;
      client.users.set(client.id, prepareClientUser(client, parsed.d.user));

      if (client.events.preReady) {
        await client.events.preReady();
      }
    }
  }
});

const initHeartbeat = ((client: Client, payload: Record<string, any>): void => {
  setInterval(() => {
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
  client.ws.on("close", console.log);
});
