import { sendData } from "../gateway";

import { Client } from "./Client";

import { Status, Presence } from "../types/Presence";

export interface ClientUser {
  id: string;
  presence: Presence;
}

export const prepareClientUser = ((client: Client, payload: Record<string, any>): ClientUser => {
  let _status: Status = "online";

  const props: ClientUser = ({
    id: payload.id,
    presence: {
      getStatus: ((): Status => {
        return _status;
      }),
      setStatus: ((data: Status): void => {
        _status = data;

        sendData(client, {
          op: 3,
          d: {
            since: Date.now(),
            activities: [],
            status: _status,
            afk: false
          }
        });
      })
    }
  });

  return props;
});
