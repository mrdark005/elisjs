import getTimestamp from "../utils/getTimestamp";

import { Status, Activity, Presence } from "../types/Presence";

export interface User {
  id: string;
  username: string;
  discriminator: string;
  createdAt: number;
  avatar: string | null;
  bot: boolean;
  presence: Presence;
}

export const prepareUser = ((payload: Record<string, any>) => {
  let _status: Status = "online";
  let _activities: Activity[] = [];

  const props: User = ({
    id: payload.id,
    username: payload.username,
    discriminator: payload.disciminator,
    createdAt: getTimestamp(payload.id),
    avatar: payload.avatar,
    bot: payload.bot || false,
    presence: {
      getStatus: (() => {
        return _status;
      }),
      getActivities: (() => {
        return _activities;
      })
    }
  });

  return props;
});
