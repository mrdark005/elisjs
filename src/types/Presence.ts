export type Status = "online" | "dnd" | "idle" | "invisible" | "offline";


export interface Activity {
  name: string;
  type: number;
  url?: string;
  createdAt: string;
  timestamps?: {
    start?: number;
    end?: number;
  },
  details?: string;
  state?: string;
}

export interface Presence {
  getStatus(): Status;
  getActivities(): Activity[];
}
