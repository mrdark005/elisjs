import WebSocket, { Data } from "ws";

import { Client } from "./structures/Client";

import { gatewayURL } from "./constants";

let zlib: any;
let inflator: any;

try {
  zlib = require("zlib-sync");
  inflator = new zlib.Inflate({
    chunkSize: 131072
  });
} catch {}

const sendData = ((client: Client, ws: WebSocket, data: Record<string, unknown>): void => {
  if (!client.options.compress) {
    ws.send(JSON.stringify(data));
  }
});

const processData = ((client: Client, ws: WebSocket, data: Data): void => {
  let parsed: Record<string, unknown>;

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

  client.lastSequence = parsed.s as (number | null);

  if (parsed.op == 10) {
    initHeartbeat(client, ws, parsed.d as Record<string, unknown>);
  }
});

const initHeartbeat = ((client: Client, ws: WebSocket, payload: Record<string, unknown>): void => {
  setInterval(() => {
    sendData(client, ws, {
      op: 1,
      d: client.lastSequence
    });
  }, payload.heartbeat_interval as number);
});

export const connect = ((client: Client): void => {
  if (client.options.compress && !zlib) throw new Error("Please install \"zlib-sync\" package.");

  const ws = new WebSocket(`${gatewayURL}&encoding=json${client.options.compress ? "&compress=zlib-stream" : ""}`);

  ws.on("message", async (data) => {
    await processData(client, ws, data);
  });
});
