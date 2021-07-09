export type Status = "online" | "dnd" | "idle" | "invisible" | "offline";

export interface Presence {
  getStatus(): Status;
  setStatus(data: Status): void;
}
