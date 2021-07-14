import { Guild } from "./Guild";

import getTimestamp from "../utils/getTimestamp";

export interface Emoji {
  id: string;
  name: string;
  createdAt: number;
  createdBy?: string;
  guildID: string;
  managed: boolean;
  animated: boolean;
  available: boolean;
}

export const prepareEmoji = ((guild: Guild, payload: Record<string, any>) => {
  const props: Emoji = ({
    id: payload.id,
    name: payload.name,
    createdAt: getTimestamp(payload.id),
    guildID: guild.id,
    managed: payload.managed || false,
    animated: payload.animated || false,
    available: payload.available || false
  });

  if (payload.user) {
    props.createdBy = payload.user.id;
  }

  return props;
});
