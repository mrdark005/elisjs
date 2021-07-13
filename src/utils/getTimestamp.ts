import { DISCORD_EPOCH } from "../constants";

const getTimestamp = ((id: string) => {
  return Math.floor(Number(id) / 4194304) + DISCORD_EPOCH;
});

export default getTimestamp;
