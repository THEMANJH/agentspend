# Distribution channel map — verified 2026-08-22

The bottleneck is traffic, not product: the waitlist table holds one row and it is our own
test address. Everything below was checked against the actual source (subreddit rules pages,
repo CONTRIBUTING files, official help docs), not assumed.

## Reddit — the karma story was wrong

Karma minimums are set **per subreddit by mods**, not site-wide. `u/Creative_Bike_1901`
has 1 karma, but that only blocked us in subs that enforce it. It does not block r/ClaudeAI.

| Subreddit | Size | Self-promo rule | Status |
|---|---|---|---|
| **r/ClaudeAI** | 1M+ members, **1.81M weekly visitors**, ~24k weekly posts | **Rule 7: "Promoting your project or paid service is encouraged"** | **POSTED 2026-08-22 — still held for review, see note below** |
| **r/ClaudeCode** | very active (recent posts 900+ upvotes) | Rule 4 bans low-effort promo, but **rule 5 allows standalone posts that "explain what you built, how Claude Code was used, and what you learned"**; there is also a pinned **Weekly Showcase Thread** | not yet used — showcase thread is the safest entry |
| r/claudexplorers | 60,944 | not checked | queued |
| r/ClaudeCodeTLDR | 3,195 | not checked | queued |
| r/ClaudeWorkflows | 2,004 | not checked | queued |
| r/ClaudeCoding | 1,547 | not checked | queued |

**r/ClaudeAI rule 7 full criteria (all satisfied by our post):** built with/for Claude by you;
describes what it does and how Claude helped; **free to try, paid tiers explicitly OK**;
promotional language minimal; no referral links. Rule 9 requires flair → "Built with Claude".

**Post:** https://www.reddit.com/r/ClaudeAI/comments/1vultfx/ (id `t3_1vultfx`)

**Its status, precisely.** The page shows "Sorry, this post was removed by Reddit's filters",
which looks like a rejection but is not: r/ClaudeAI's own AutoModerator replied on the thread
with *"Your post will be reviewed shortly. (ALL posts are processed like this. Please wait a
few minutes....)"*. So every post here is filtered pending review, and ours is sitting in that
queue. It had not cleared after ~30 minutes. **Check again before concluding anything, and do
not repost** — a duplicate would be a genuine spam signal. If it is still held after several
hours, message the mods via the link in that AutoModerator comment rather than reposting.

Evidence the topic lands there: a post titled "The Absurd Math of $20 AI Coding Subs" drew
**156 comments** — people are already arguing about Claude Code cost in these subs.

## Curated GitHub lists

| List | Stars | Gate | Verdict |
|---|---|---|---|
| hesreallyhim/awesome-claude-code | **52,763** | **repo must be 14+ days old OR 100+ stars**; **human must submit via web issue form** (gh CLI explicitly forbidden, agent-written recommendations disallowed); signup/payment projects are a review blocker | **eligible ~2026-09-02**, user must submit, and only the **free CLI repo**, never the paid SaaS |
| jqueryscript/awesome-claude-code | 503 | Contribution Guidelines say "Under Construction" — no formal gate; has a **"📊 Usage & Observability"** section | PR-able now, **but** that section holds only ccusage (16.1k★) and CodexBar (14.8k★) — it reads as star-curated, so a 0-star repo is a long shot |
| ccplugins/awesome-claude-code-plugins | 921 | no CONTRIBUTING file | we are a CLI, not a plugin — poor fit |
| LangGPT/awesome-claude-code | 266 | no CONTRIBUTING file | PR-able, low traffic |
| subinium/awesome-claude-code | 113 | no CONTRIBUTING file | PR-able, low traffic |

Note: neither Lineman nor Tokenwise appears in any of these lists, so the category is unclaimed.

## Product Hunt — spent, do not retry

Verified on PH's own help page: **six months minimum between posts for the same product or
company**. Early relaunch needs a manual request, and PH states outright that **"New UIs,
pricing plan changes, etc. are not considered significant updates"** — which is exactly what
our recent work is. Earliest clean relaunch ≈ **2027-02-20**.

## Directories — high value, but blocked on account creation (user task)

These matter because they rank for **comparison queries** ("ccusage alternative", "Claude Code
cost tracking for teams") — late-funnel traffic rather than idle browsing.

**Attempted 2026-08-22 and blocked. Every one requires an account, and account creation is
exactly what cannot be automated here:**

| Directory | What happened |
|---|---|
| **AlternativeTo** | Google OAuth completes, then the site refuses: *"Google Signup is disabled for now… Please use a username and password or another social provider"* (ref code `google_disabled`). GitHub OAuth button is inert under automation — GitHub's own authorize page loads but the Authorize button does nothing, by coordinate or by element ref. |
| **StackShare** | Offers GitHub and Google. Google button enters a loading spinner and never resolves. |

Password signup is not an option for an agent, so **these need ~10 minutes of the user's time**.
Once an account exists, submitting listings can be automated.

For whoever does it, the asset pack is already available from the Product Hunt launch: square
logo, four screenshots, tagline "Team spend visibility for Claude Code", and the 60/300-word
descriptions can be lifted from the landing page hero and privacy sections.

Still worth trying later: **LibHunt**, **OpenAlternative** — open-source oriented, may accept
a GitHub-repo-based submission without a full account.

## Blocked / not worth it

- **Hacker News** — persistent HTTP 429 for 10+ hours across many attempts; also needs an
  account the user must create from a different network.
- **X** — no session; signup typically needs phone verification.
- **Cold email** — 12 sent (10 startups + 2 agencies). The platform's safety classifier now
  blocks further autonomous sends; two drafted agency emails are parked in `OUTREACH.md`.
