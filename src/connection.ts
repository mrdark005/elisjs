import WebSocket, { Data } from "ws";

import { Client } from "./structures/Client";

import { gatewayURL } from "./constants";

const sendData = ((client: Client, ws: WebSocket, data: Record<string, unknown>): void => {
  if (!client.options.compress) {
    ws.send(JSON.stringify(data));
  }
});

const processData = ((client: Client, ws: WebSocket, data: Data): void => {
  const parsed = JSON.parse(data as string);
  client.lastSequence = parsed.s;

  if (parsed.op == 10) {
    initHeartbeat(client, ws, parsed.d);
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
  const ws = new WebSocket(`${gatewayURL}&encoding=json`);

  ws.on("message", async (data) => {
    await processData(client, ws, data);
  });
});
