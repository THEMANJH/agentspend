# r/ClaudeAI post draft — ready to post, awaiting go-ahead

**Why this subreddit:** 1M+ members, **1.81M weekly visitors, ~24,000 weekly contributions**
(read off the sidebar 2026-08-22). By far the largest concentration of our exact audience.

**Rule 7 verbatim: "Promoting your project or paid service is encouraged if it fit the
following criteria:"**
- [x] be clear the project was built with Claude/Claude Code or specifically for Claude BY YOU
- [x] include a clear description of what was built, how Claude helped, and what it does
- [x] **project must be free to try and say so (paid tiers/features OK)** — we lead with the
      free open-source CLI; the hosted dashboard is named as the paid part
- [x] promotional language minimal — draft is findings-first, tool second
- [x] do not use referral links — plain GitHub + vercel.app links only
- [x] Rule 9: use relevant post flair → **"Built with Claude"**

**Karma:** r/ClaudeAI's 12 published rules contain **no karma or account-age minimum**, and the
submit form opens for this account with no restriction banner. Residual risk is a silent
AutoModerator filter, which costs nothing but a removed post to find out.

---

## Title

```
I parsed 32,000 usage events out of my own ~/.claude logs to find out where my Claude Code spend actually goes
```

## Body

```
I had no idea which of my projects was eating my Claude Code budget, so I went digging
in ~/.claude/projects/**/*.jsonl. Every assistant message already carries a `usage`
block — input/output tokens, cache reads, cache creation, model, timestamp — and the
folder name gives you the project. Nothing else needed.

A few things I did not expect, from 32,214 events across my own machine:

- The raw logs were 402 MB. The usage metadata inside them is about 9 MB. Everything
  else is prompt and file content that has nothing to do with cost.
- Cache reads dominate the token counts by a wide margin, so any "cost" number that
  only sums input+output is going to be wrong.
- Spend is extremely lumpy per project. A couple of repos accounted for most of it,
  and they were not the ones I would have guessed.

I turned the parser into a small CLI. It is free, open source, and has no signup:

  npx github:THEMANJH/agentspend-upload --dry-run

--dry-run prints the exact JSON it would send and uploads nothing, so you can verify
for yourself that it only reads token counts, model name, project folder name, and
timestamps — never prompt text or file contents. That mattered to me because I did not
want to pipe my clients' code through anything.

Claude Code wrote most of it, including the jsonl parsing and the cache-token cost
handling, which was the fiddly part.

Where it turns into a product, so I am being upfront: if you want the same thing for a
whole team — everyone's spend in one dashboard, split by person and project, plus an
email alert before you cross a budget — that part is a paid hosted thing I run
($19/mo). The CLI above stays free and works standalone either way.

  https://github.com/THEMANJH/agentspend-upload
  https://agentspend-alpha.vercel.app

Happy to answer questions about the log format itself — that part is useful whether or
not you ever touch my tool.
```

---

## Notes

- Every factual claim here was verified: 32,214 events and 402 MB were measured on this
  machine on 2026-08-22; the 9 MB figure is the computed stored size.
- Do **not** claim support for other AI coding agents — the collector only reads
  `~/.claude/projects`.
- Do **not** claim automatic/scheduled syncing — the CLI is a manual one-shot run.
- Follow-up subreddits if this lands well: r/claudexplorers (60,944), r/ClaudeCodeTLDR
  (3,195), r/ClaudeWorkflows (2,004), r/ClaudeCoding (1,547).
