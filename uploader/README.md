# agentspend-upload

Syncs Claude Code usage metadata to your [AgentSpend](https://agentspend.dev) team dashboard.

## What it does

Reads `~/.claude/projects/**/*.jsonl` — the session logs Claude Code already
writes to your machine — and extracts only the `usage` object each entry
already contains: input/output token counts, cache token counts, model
name, and a timestamp, plus the project folder's base name.

**It never reads prompt text, file contents, diffs, or tool output.** Run
with `--dry-run` at any time to see exactly what would be uploaded, sent
nowhere.

## Usage

```bash
npx agentspend-upload --key <your-team-key>
```

Get a team key from your AgentSpend dashboard after signing up. Run this
on a schedule (cron / launchd) on each teammate's machine to keep the
dashboard current — every 15–30 minutes is typical.

```bash
# Preview only, sends nothing:
npx agentspend-upload --dry-run

# Real sync:
npx agentspend-upload --key sk_live_xxxx --member yuna
```

## Options

| Flag | Description |
| --- | --- |
| `--key <key>` | Team ingest key (or set `AGENTSPEND_TEAM_KEY`) |
| `--member <label>` | Label for this machine/person (default: OS username) |
| `--endpoint <url>` | Override the ingest URL (or set `AGENTSPEND_ENDPOINT`) |
| `--dry-run` | Print what would be uploaded without sending it |

## License

MIT
