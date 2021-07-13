import { sendData } from "../gateway";

import { Client } from "./Client";

import getTimestamp from "../utils/getTimestamp";

import { Status, Presence, Activity } from "../types/Presence";

export interface SendableActivity {
  name: string;
  type: number;
  url?: string;
}

export interface ClientUser {
  id: string;
  username: string;
  discriminator: string;
  createdAt: number;
  avatar: string | null;
  bot: boolean;
  presence: Presence & {
    setStatus(data: Status): void;
    setActivities(activities: SendableActivity[]): void;
    addActivity(activity: SendableActivity): void;
    removeActivity(index: number): void;
  };
}

export const prepareClientUser = ((client: Client, payload: Record<string, any>): ClientUser => {
  let _status: Status = "online";
  let _activities: SendableActivity[] = [];

  const props: ClientUser = ({
    id: payload.id,
    username: payload.username,
    discriminator: payload.disciminator,
    createdAt: getTimestamp(payload.id),
    avatar: payload.avatar,
    bot: payload.bot || false,
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
