export type Status = "online" | "dnd" | "idle" | "invisible" | "offline";

export interface SendableActivity {
  name: string;
  type: number;
  url?: string;
}

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
  setStatus?(data: Status): void;
  getActivities(): Activity[];
  setActivities?(activities: SendableActivity[]): void;
  addActivity?(activity: SendableActivity): void;
  removeActivity?(index: number): void;
}
