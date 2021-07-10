import { sendData } from "../gateway";

import { Client } from "./Client";

import { Status, Presence, SendableActivity, Activity } from "../types/Presence";

export interface ClientUser {
  id: string;
  presence: Presence;
}

export const prepareClientUser = ((client: Client, payload: Record<string, any>): ClientUser => {
  let _status: Status = "online";
  let _activities: SendableActivity[] = [];

  const props: ClientUser = ({
    id: payload.id,
    presence: {
      getStatus: ((): Status => {
        return _status;
      }),
      setStatus: ((status: Status): void => {
        _status = status;

        sendData(client, {
          op: 3,
          d: {
            since: Date.now(),
            activities: _activities,
            status: _status,
            afk: false
          }
        });
      }),
      getActivities: (() => {
        return _activities as Activity[];
      }),
      setActivities: ((activities: SendableActivity[]) => {
        _activities = activities;

        sendData(client, {
          op: 3,
          d: {
            since: Date.now(),
            activities: _activities,
            status: _status,
            afk: false
          }
        });
      }),
      addActivity: ((activity: SendableActivity) => {
        _activities.push(activity);

        sendData(client, {
          op: 3,
          d: {
            since: Date.now(),
            activities: _activities,
            status: _status,
            afk: false
          }
        });
      }),
      removeActivity: ((index: number) => {
        _activities = _activities.filter((_, _index) => _index != index);

        sendData(client, {
          op: 3,
          d: {
            since: Date.now(),
            activities: _activities,
            status: _status,
            afk: false
          }
        });
      })
    }
  });

  return props;
});
