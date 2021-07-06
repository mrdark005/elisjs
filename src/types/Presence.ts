export type Status = "online" | "dnd" | "idle" | "invisible" | "offline";

export interface Presence {
  _status: Status;
  status: Status;
}
