export type WeddingTask = {
  id: string;
  category: string;
  title: string;
  detail: string;
  due: string;
  done: boolean;
};

export type WeddingScheduleItem = {
  time: string;
  title: string;
  description: string;
};

export type Wedding = {
  slug: string;
  partnerOne: string;
  partnerTwo: string;
  headline: string;
  date: string;
  venue: string;
  location: string;
  ceremonyTime: string;
  receptionTime: string;
  story: string;
  heroImage: string;
  schedule: WeddingScheduleItem[];
  tasks: WeddingTask[];
  published: boolean;
  ownerUid: string;
  plannerUid?: string;
  guestCount: number;
  invitedCount: number;
  respondedCount: number;
  attendingCount: number;
};

export function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function readWeddingSchedule(value: unknown): WeddingScheduleItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item)).map((item) => ({
    time: readString(item.time),
    title: readString(item.title),
    description: readString(item.description),
  })).filter((item) => item.title.length > 0);
}

export function readWeddingTasks(value: unknown): WeddingTask[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item)).map((item, index) => ({
    id: typeof item.id === "string" && item.id ? item.id : `task-${index + 1}`,
    category: readString(item.category),
    title: readString(item.title),
    detail: readString(item.detail),
    due: readString(item.due),
    done: item.done === true,
  })).filter((item) => item.title.length > 0);
}
