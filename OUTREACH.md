# Cold email outreach — drafts (review before sending)

Not sent yet. Waiting on user approval for both the copy and the recipient list.

## Targeting logic

Companies pulled from https://4dayweek.io/claude-code-jobs — a job board listing
employers with open roles that explicitly mention Claude Code. That's a real signal
their engineering team actually uses it (unlike a generic startup list), so the
pitch can reference it directly instead of a blind guess.

## Email draft

**Subject line options (pick one, or A/B test):**
1. `Quick question about {{company}}'s Claude Code spend`
2. `Who on your team is racking up the biggest Claude Code bill?`
3. `{{company}} + Claude Code — one question`

**Body:**

```
Hi {{first_name}},

Saw {{company}} is hiring for roles that use Claude Code — figured you might
already have more than one person on the team running it daily.

Quick question: can you currently see combined Claude Code spend across your
whole team in one place, or does everyone just know their own number?

Most teams we've talked to can't — there's no built-in way to see it, and the
usual fix (ccusage) only shows one person's machine at a time.

I built AgentSpend to fix that: one dashboard for the whole team's spend, split
by person and by project, plus an email alert before you go over budget. Takes
about 5 minutes to wire up — a small CLI reads local usage logs (token counts
only, never your code or prompts) and syncs them in.

Free to try solo, $29/mo for a team of up to 10: https://agentspend-alpha.vercel.app

No pressure either way — just curious whether this is actually a problem for
{{company}} or if you've already got it handled somehow. Happy to hear either
answer.

{{sender_name}}
```

**Notes on the copy:**
- Deliberately short (~120 words) and asks a genuine question rather than
  hard-selling — cold B2B email performs better as a conversation opener than
  a pitch.
- `{{first_name}}` needs a real named contact, not "Hi there" — sending to a
  generic contact@/hello@ inbox with "Hi {{first_name}}" left unfilled would
  look like a mail-merge mistake. For companies where I could only find a
  general inbox, the subject/body should drop the name and greet the team
  instead ("Hi {{company}} team,").
- No attachments, plain text, one link — keeps it out of spam filters and
  doesn't read as mass-blasted.

## Competitive note (found during this research, 2026-08-19)

**Tokenwise (tokenwise.fyi)** is a direct competitor — same core pitch (per-developer
Claude Code spend, multi-developer dashboard, budget alerts), same $29/mo starting
price, also supports Cursor/Windsurf. No visible customer logos, testimonials, or
usage metrics on their site — reads as early-stage/no clear traction yet, same stage
as us. Not mentioned in the outreach copy (no reason to promote them), but worth
knowing if a prospect brings it up: our angle is CLI-only local-log reading (no
proxy sitting between you and the API) and the loud privacy claim (verifiable via
`--dry-run`), theirs is a proxy-based approach with broader multi-agent support and
Slack alerts (we only have email alerts right now).

## Target list — 18+ companies researched across 3 rounds, real verified emails only

Researched from two sources: (1) https://4dayweek.io/claude-code-jobs — a job board
listing employers whose postings explicitly mention Claude Code, and (2) direct
search for startups whose own job postings / Anthropic's published case studies name
Claude Code as a daily tool. Only companies with a genuinely public, general-purpose
email (not privacy@/legal@/press@-scoped, not guessed) are listed as ready to send.

### Tier 1 — best fit (small team, strong Claude Code evidence, real general inbox)

| # | Company | Email | Evidence | Size |
|---|---|---|---|---|
| 1 | HumanLayer | contact@humanlayer.dev | Anthropic's own case study, founder quote: "We just wrote everything with Claude Code" | YC F24, ~3 founders |
| 2 | Ambral | founders@ambral.com | Same Anthropic case study, CTO named using Claude Code daily | YC S25, 4 people |
| 3 | Vulcan Technologies | sales@vulcan.ai (or support@vulcan.ai) | Same Anthropic case study: "entire prototype was made using Claude" | YC S25, 3 founders, $10.9M seed |
| 4 | Clubb | team@theclubb.co | Own job posting: "Live in tools like Cursor, Claude Code and Codex to ship" | Bootstrapped, very small, London |
| 5 | Numero | support@numero.ai | Own job posting: "Engineers use Claude Code, Cursor, and Conductor as day-to-day tools" | 11-50 people, 3 co-founders |
| 6 | Checkly | support@checklyhq.com | 4dayweek listing + site explicitly says "relatively small team" | Small, remote, ~16 countries |

### Tier 2 — good fit, slightly larger or one-notch-weaker signal

| # | Company | Email | Evidence | Size |
|---|---|---|---|---|
| 7 | Soda | info@soda.io (or support@soda.io) | Own job posting: "AI coding agents are part of the daily workflow here, not an experiment" | 11-50, distributed |
| 8 | Lithic | hello@lithic.com | 4dayweek listing | 170-200 people |
| 9 | WorkMotion | hello@workmotion.com | 4dayweek listing | 200-226 people |
| 10 | Secfix | hello@secfix.com | Job posting says "Claude" generically, not explicitly "Claude Code" — moderate confidence | 5 engineers, Munich |

### Researched but not included (no usable email, or poor size/stage fit)

Close, Pogo, Sona, OpenZeppelin, TaskRay, Redpanda, Deepgram, Cribl, SambaSafety,
Parachute Health, Sonatype, Power Digital, Fivetran, Apollo.io, ClickHouse, Booma,
Toku — either no publicly-displayed general email found (most gate contact through
forms), or the only public email was privacy/legal/press-scoped, or (Fivetran,
Cribl, Apollo.io, Sonatype) clearly enterprise-scale needing procurement rather than
self-serve $29/mo signup.

## Suggested rollout

Don't blast all 10 at once — send **Tier 1 first (6 emails)**, watch for replies/
bounces over a few days, then send Tier 2 once the copy is confirmed working. For
companies with a named founder (HumanLayer, Ambral, Vulcan, Clubb — all YC, likely
small enough that the general inbox reaches a founder directly), the email can open
with "Hi {{company}} team," since I don't have a verified named contact for any of
these, despite the template above showing `{{first_name}}`.
