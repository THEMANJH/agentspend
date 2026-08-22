-- AgentSpend schema
-- Metadata-only: usage_events never stores prompt/file content, only
-- token counts, model, project label, member label, and timestamps.

create extension if not exists "pgcrypto";

create table if not exists waitlist_emails (
  email text primary key,
  role text,
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ingest_key text not null unique default encode(gen_random_bytes(24), 'hex'),
  plan text not null default 'solo' check (plan in ('solo', 'team')),
  monthly_budget_usd numeric(10, 2),
  polar_subscription_id text,
  -- Set by the Polar order.paid webhook. /welcome polls team-lookup by this
  -- value to hand the buyer their ingest key, so a database built without
  -- this column makes every purchase fail silently.
  checkout_id text,
  created_at timestamptz not null default now()
);
alter table teams add column if not exists checkout_id text;
create index if not exists teams_checkout_id_idx on teams (checkout_id);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  label text not null, -- local machine username, not a real identity
  email text,
  created_at timestamptz not null default now(),
  unique (team_id, label)
);

create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  occurred_at timestamptz not null,
  project_label text not null,
  model text not null,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  cache_read_tokens bigint not null default 0,
  cache_creation_tokens bigint not null default 0,
  cost_usd numeric(10, 4) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_team_time_idx
  on usage_events (team_id, occurred_at desc);

create table if not exists budget_alerts (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  threshold_pct integer not null check (threshold_pct between 1 and 100),
  notify_email text not null,
  last_fired_at timestamptz,
  created_at timestamptz not null default now()
);

-- Row Level Security: all writes go through the service role from the
-- API/ingest route. No anon/client-side access is granted.
alter table waitlist_emails enable row level security;
alter table teams enable row level security;
alter table members enable row level security;
alter table usage_events enable row level security;
alter table budget_alerts enable row level security;
