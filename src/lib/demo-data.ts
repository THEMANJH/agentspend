import type { DailyTotal, MemberTotal, ProjectTotal, UsageEvent } from "./types";

// Deterministic demo dataset used on the /dashboard preview page so
// prospects can see the product before connecting real data.
const MEMBERS = ["yuna", "minjun", "sara", "devon"];
const PROJECTS = ["checkout-service", "mobile-app", "internal-tools", "landing-site"];
const MODELS = ["claude-sonnet-5", "claude-opus-5", "claude-haiku-4-5"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildDemoUsageEvents(days = 14): UsageEvent[] {
  const rand = seededRandom(42);
  const events: UsageEvent[] = [];
  const today = new Date("2026-08-19T00:00:00Z");

  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - d);
    const dateStr = date.toISOString().slice(0, 10);

    for (const member of MEMBERS) {
      const sessionsToday = Math.floor(rand() * 3);
      for (let i = 0; i < sessionsToday; i++) {
        const project = PROJECTS[Math.floor(rand() * PROJECTS.length)];
        const model = MODELS[Math.floor(rand() * MODELS.length)];
        const inputTokens = Math.floor(2000 + rand() * 40000);
        const outputTokens = Math.floor(500 + rand() * 8000);
        const cacheReadTokens = Math.floor(rand() * 150000);
        const cacheCreationTokens = Math.floor(rand() * 5000);

        const rate =
          model === "claude-opus-5" ? 0.000018 : model === "claude-sonnet-5" ? 0.000006 : 0.0000015;
        const costUsd =
          (inputTokens + outputTokens + cacheCreationTokens + cacheReadTokens * 0.1) * rate;

        events.push({
          date: dateStr,
          member,
          project,
          model,
          inputTokens,
          outputTokens,
          cacheReadTokens,
          cacheCreationTokens,
          costUsd: Math.round(costUsd * 100) / 100,
        });
      }
    }
  }
  return events;
}

export function totalsByMember(events: UsageEvent[]): MemberTotal[] {
  const map = new Map<string, MemberTotal>();
  for (const e of events) {
    const cur = map.get(e.member) ?? { member: e.member, costUsd: 0, sessions: 0 };
    cur.costUsd += e.costUsd;
    cur.sessions += 1;
    map.set(e.member, cur);
  }
  return Array.from(map.values())
    .map((m) => ({ ...m, costUsd: Math.round(m.costUsd * 100) / 100 }))
    .sort((a, b) => b.costUsd - a.costUsd);
}

export function totalsByDay(events: UsageEvent[]): DailyTotal[] {
  const map = new Map<string, number>();
  for (const e of events) {
    map.set(e.date, (map.get(e.date) ?? 0) + e.costUsd);
  }
  return Array.from(map.entries())
    .map(([date, costUsd]) => ({ date, costUsd: Math.round(costUsd * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function totalsByProject(events: UsageEvent[]): ProjectTotal[] {
  const map = new Map<string, number>();
  for (const e of events) {
    map.set(e.project, (map.get(e.project) ?? 0) + e.costUsd);
  }
  return Array.from(map.entries())
    .map(([project, costUsd]) => ({ project, costUsd: Math.round(costUsd * 100) / 100 }))
    .sort((a, b) => b.costUsd - a.costUsd);
}
