# Launch content (drafts — review before posting)

All drafts below are honest about where the product actually is: early access /
waitlist stage, not yet a live paid product. Don't oversell — the "team lead /
finance manager can't see combined spend" pain point is real and doesn't need
exaggeration.

Live URL: https://agentspend-alpha.vercel.app
Uploader source: `agentspend/uploader/` (point people at the GitHub repo once pushed)

---

## Show HN

**Title:**
`Show HN: AgentSpend – see what your whole team spends on Claude Code`

**First comment (post immediately after submitting):**

Hi HN — I built this after noticing there's no way to see combined Claude
Code spend across a team. Anthropic has an open feature request for this
(#18550) and the community's answer so far is ccusage (great tool, 18k+
stars) — but it's local-only: each person sees their own machine, nobody
gets the team-wide picture, and there's no budget alerting.

AgentSpend is a small uploader (open source, `--dry-run` shows exactly what
it sends before it sends anything) that reads the `usage` field Claude Code
already writes to its local session logs — token counts, model, project
folder name, timestamp — and nothing else. No prompt text, no file
contents, no diffs. It posts that to a shared dashboard so a team lead can
see per-member and per-project spend trends and get an email before a
budget is blown.

Right now it's early access / waitlist while I finish the billing
integration. Feedback very welcome, especially on the privacy model — I'd
rather over-explain what's collected than have anyone surprised.

---

## Product Hunt

**Tagline (60 char max):**
`Team spend visibility for Claude Code`

**Description:**
AgentSpend gives engineering leads one dashboard for their whole team's
Claude Code usage — daily trends, per-member and per-project breakdowns,
and budget alerts by email. A small open-source CLI reads only token-count
metadata from your local logs; your code and prompts never leave your
machine.

**First comment / maker note:**
Made this because I couldn't find a way to see combined AI-coding-agent
spend across a team without everyone manually running a local CLI and
pasting numbers into a spreadsheet. Would love feedback from anyone running
Claude Code across more than one person.

---

## Reddit — r/ClaudeAI or r/ClaudeCode

**Title:**
`Built a small dashboard so I can see my whole team's Claude Code spend in one place (open source uploader, never touches your code)`

**Body:**

Our team ran into the classic problem: everyone's using Claude Code, nobody
can see combined spend until the invoice shows up. ccusage is great for an
individual, but it's local-only — no team view, no history once logs
rotate, no budget alerts.

So I built AgentSpend: a tiny open-source CLI that reads the `usage`
metadata Claude Code already logs locally (tokens, model, project name,
timestamp — never prompt/file content) and syncs it to a shared team
dashboard. `--dry-run` shows exactly what it would send before it sends
anything, so you can verify the privacy claim yourself instead of trusting
me.

It's in early access right now (waitlist on the site). Posting here mostly
for feedback — is per-project + per-member budget alerting actually useful
to how your team works, or is there a sharper angle I'm missing?

Link: https://agentspend-alpha.vercel.app

---

## X / Twitter thread

1/ Shipped a small tool after hitting the same wall a bunch of people have
hit: you can see *your own* Claude Code spend, but not your team's
combined spend, until the bill shows up.

2/ ccusage solves this for one person on one machine (and it's great —
18k+ stars). What's missing is the team view: who's using what, which
project is expensive, and a heads-up before you go over budget.

3/ AgentSpend = a small open-source CLI that reads local usage metadata
only (tokens/model/project/timestamp — never your code or prompts, verify
with --dry-run) + one shared dashboard for the team.

4/ Early access is open — waitlist at https://agentspend-alpha.vercel.app.
Would love feedback from anyone running Claude Code across more than one
person.

---

## Notes for whoever posts these

- GitHub OAuth covers sign-in for Hacker News (via email actually, HN has
  no OAuth — needs a plain account) and Product Hunt (supports GitHub
  login) — Reddit and X need their own accounts if you don't already have
  them.
- Space posts out per the research: PH Tue/Wed, HN same day, Reddit ~day 5,
  X continuously. Don't post all four in the same hour.
- Update "early access / waitlist" language once Polar billing is live.
