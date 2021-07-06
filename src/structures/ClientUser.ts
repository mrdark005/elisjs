import { sendData } from "../connection";

import { Client } from "./Client";

import { Status, Presence } from "../types/Presence";

export interface ClientUser {
  id: string;
  presence: Presence;
}

export const create = ((client: Client, payload: Record<string, unknown>): ClientUser => {
  const props: ClientUser = ({
    id: payload.id as string,
    presence: {
      _status: "online",
      get status(): Status {
        return this._status
      },
      set status(status: Status) {
        this._status = status;

        sendData(client, {
          op: 3,
          d: {
            since: Date.now(),
            activities: [],
            status: this.status,
            afk: false
          }
        });
      }
    }
  });

  return props;
});
