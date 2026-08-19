export type UsageEvent = {
  date: string; // YYYY-MM-DD
  member: string;
  project: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
  costUsd: number;
};

export type MemberTotal = {
  member: string;
  costUsd: number;
  sessions: number;
};

export type DailyTotal = {
  date: string;
  costUsd: number;
};

export type ProjectTotal = {
  project: string;
  costUsd: number;
};
