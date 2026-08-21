import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

const steps = [
  {
    title: "Install the CLI",
    body: "One command on each teammate's machine, once. It reads your existing local Claude Code logs and then keeps syncing every 30 minutes on its own — nothing new to configure, nothing to remember.",
  },
  {
    title: "Connect your team",
    body: "Everyone points at the same team key. Usage starts flowing into one shared dashboard within minutes.",
  },
  {
    title: "See spend, set budgets",
    body: "Daily trends, per-member and per-project breakdowns, and email alerts before you blow through budget.",
  },
];

const features = [
  {
    title: "One dashboard for the whole team",
    body: "Stop asking teammates to paste their local usage numbers into a spreadsheet. See everyone's spend in one place, updated automatically.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    ),
  },
  {
    title: "Budget alerts",
    body: "Set a monthly ceiling for the team. Get an email when you cross your threshold — before the invoice, not after.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    ),
  },
  {
    title: "History that survives log rotation",
    body: "Local logs get cleaned up or a laptop gets wiped. Your usage history lives in the dashboard, not just on disk.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  {
    title: "Your code never leaves the machine",
    body: "The CLI reads only token counts, model name, project label, and timestamps from your logs. Prompt and file contents are never read or transmitted.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    ),
  },
];

const comparison = [
  {
    label: "How it collects",
    free: "Reads local logs",
    others: "Sits in the request path to route or compress traffic",
    us: "Reads local logs — nothing sits between you and the API",
  },
  {
    label: "Collector source",
    free: "Open source",
    others: "Closed source",
    us: "Open source — run --dry-run to see the exact payload",
  },
  {
    label: "Team dashboard",
    free: "—",
    others: "✓",
    us: "✓",
  },
  {
    label: "Staying up to date",
    free: "You run it when you want a number",
    others: "Automatic — traffic flows through them",
    us: "Automatic — background job on each machine, and the dashboard names anyone who stops syncing",
  },
  {
    label: "Budget alerts",
    free: "—",
    others: "Often an upgrade — one charges $49.99/mo for them",
    us: "✓ by email, included at the base price",
  },
  {
    label: "History survives log cleanup",
    free: "—",
    others: "✓ — one caps history at 45 days on its entry plan",
    us: "✓",
  },
  {
    label: "Cost as your team's spend grows",
    free: "Free",
    others: "One meters you: $500/mo tracked, then $7.50 per extra $250",
    us: "Flat — you are never charged more for tracking more",
  },
  {
    label: "Price",
    free: "Free",
    others: "$14.99–$59/mo across entry and mid tiers",
    us: "$19/mo, up to 10 people",
  },
];

const teamProductId = process.env.NEXT_PUBLIC_POLAR_TEAM_PRODUCT_ID;
const teamCheckoutUrl = teamProductId ? `/api/checkout?products=${teamProductId}` : undefined;

export default function Home() {
  return (
    <div className="flex-1">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-semibold tracking-tight text-zinc-100">
          Agent<span className="text-accent">Spend</span>
        </span>
        <nav className="flex items-center gap-5 text-sm text-zinc-400">
          <Link href="/dashboard" className="hover:text-zinc-100">
            See a live dashboard
          </Link>
          <a href="https://github.com/THEMANJH/agentspend" className="hover:text-zinc-100">
            GitHub
          </a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-12rem] h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
          />
          <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-20 text-center sm:pt-24">
            <p className="mx-auto mb-5 inline-block rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              For teams shipping with Claude Code
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl">
              Know what your team actually spends on Claude Code.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
              AgentSpend turns everyone&apos;s local Claude Code usage logs into one team dashboard —
              with budget alerts, before the bill surprises you. Flat $19/mo for up to 10 people:
              a cost tracker shouldn&apos;t charge you more as your costs go up.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="mono w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-left text-sm text-zinc-300">
                <span className="select-none text-zinc-600">$ </span>
                npx github:THEMANJH/agentspend-upload --dry-run
              </div>
              <p className="text-xs text-zinc-500">
                See your own Claude Code spend right now — free, no signup, nothing uploaded.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                {teamCheckoutUrl && (
                  <a
                    href={teamCheckoutUrl}
                    className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
                  >
                    Get the team dashboard — $19/mo
                  </a>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:border-zinc-500"
                >
                  See a live dashboard
                </Link>
              </div>
              <p className="text-xs text-zinc-500">
                We never read your code or prompts —{" "}
                <a href="#privacy" className="underline underline-offset-2 hover:text-zinc-300">
                  see how
                </a>
                .
              </p>
            </div>
            <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> No proxy in your request path
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Flat $19 — never metered on your spend
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Open-source collector
              </span>
            </div>
          </div>
        </section>

        {/* Problem framing */}
        <section className="border-y border-zinc-800 bg-zinc-950/60 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
              The problem
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-300">
                &ldquo;I have no idea which of my engineers are heavy Claude Code users until the
                bill lands at the end of the month.&rdquo;
              </p>
              <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-300">
                &ldquo;Everyone runs their own local CLI usage tool, but nobody on the team can see
                the combined picture.&rdquo;
              </p>
              <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-300">
                &ldquo;I want a heads-up before we go over budget, not a console bill I find out
                about after.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
            How it works
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title}>
                <div className="mono mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 text-sm text-accent">
                  {i + 1}
                </div>
                <h3 className="font-medium text-zinc-100">{step.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-zinc-800 bg-zinc-950/60 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700"
                >
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      className="h-5 w-5"
                    >
                      {f.icon}
                    </svg>
                  </div>
                  <h3 className="font-medium text-zinc-100">{f.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
            How it compares
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
            Free local tools like ccusage are great for one person. Other team dashboards exist
            too — here&apos;s where AgentSpend lands.
          </p>
          <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">&nbsp;</th>
                  <th className="px-4 py-3 font-medium">Free CLI (ccusage)</th>
                  <th className="px-4 py-3 font-medium">Other paid dashboards</th>
                  <th className="px-4 py-3 font-medium text-accent">AgentSpend</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-zinc-950/40" : "bg-transparent"}
                  >
                    <td className="px-4 py-3 font-medium text-zinc-200">{row.label}</td>
                    <td className="px-4 py-3 text-zinc-500">{row.free}</td>
                    <td className="px-4 py-3 text-zinc-500">{row.others}</td>
                    <td className="px-4 py-3 font-medium text-zinc-100">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-zinc-600">
            &ldquo;Other paid dashboards&rdquo; reflects the published pricing pages of the two
            comparable Claude Code spend dashboards we could find, checked 22 Aug 2026. Their
            plans change — please verify before you decide.
          </p>
        </section>

        {/* Privacy */}
        <section id="privacy" className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
            What we actually collect
          </h2>
          <p className="mt-4 text-center text-zinc-300">
            Some team dashboards work by putting themselves between you and the model — you run
            their command instead of <span className="mono text-accent">claude</span>, and your
            file reads and build output pass through their servers. AgentSpend never does that. It
            reads the log files Claude Code already wrote to your disk, after the fact.
          </p>

          <p className="mt-8 text-center text-sm text-zinc-400">
            This is the entire extraction step — every field that ever leaves your machine:
          </p>
          <pre className="mono mt-3 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-xs leading-relaxed text-zinc-300">
            <code>{`events.push({
  occurred_at:           entry.timestamp,
  project_label:         path.basename(entry.cwd),   // folder name only
  model:                 entry.message.model,
  input_tokens:          usage.input_tokens,
  output_tokens:         usage.output_tokens,
  cache_read_tokens:     usage.cache_read_input_tokens,
  cache_creation_tokens: usage.cache_creation_input_tokens,
});`}</code>
          </pre>
          <p className="mt-4 text-center text-sm text-zinc-400">
            No prompt text, no file contents, no diffs — there is no line in the collector that
            reads them. Run{" "}
            <span className="mono text-zinc-300">npx github:THEMANJH/agentspend-upload --dry-run</span>{" "}
            to print the exact payload before sending anything, or read{" "}
            <a
              href="https://github.com/THEMANJH/agentspend-upload/blob/main/bin/agentspend-upload.js"
              className="underline underline-offset-2 hover:text-zinc-100"
            >
              all ~200 lines of it
            </a>
            . Zero dependencies, MIT licensed.
          </p>
        </section>

        {/* Pricing */}
        <section className="border-t border-zinc-800 bg-zinc-950/60 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
              Pricing
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="font-medium text-zinc-100">Solo — the CLI alone</h3>
                <p className="mt-1 text-3xl font-semibold text-zinc-50">
                  $0<span className="text-base font-normal text-zinc-500">/mo</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  <li>Open-source collector, run it on your own machine</li>
                  <li>
                    <code className="mono text-xs text-zinc-300">--dry-run</code> prints your own
                    usage locally
                  </li>
                  <li>No account, no signup, nothing uploaded</li>
                  <li className="text-zinc-500">
                    The hosted dashboard and alerts are Team-only today.
                  </li>
                </ul>
                <a
                  href="https://github.com/THEMANJH/agentspend-upload"
                  className="mt-5 block rounded-lg border border-zinc-700 px-4 py-2 text-center text-sm text-zinc-300 hover:border-zinc-500"
                >
                  Get the CLI on GitHub
                </a>
              </div>
              <div className="relative rounded-xl border border-accent/50 bg-accent/5 p-6">
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
                  No proxy, no API keys
                </span>
                <h3 className="font-medium text-zinc-100">Team</h3>
                <p className="mt-1 text-3xl font-semibold text-zinc-50">
                  $19<span className="text-base font-normal text-zinc-500">/mo</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>Up to 10 members</li>
                  <li>Full history — 14/30/90-day and all-time views</li>
                  <li>Team budget alerts by email</li>
                  <li>Per-member &amp; per-project breakdown</li>
                </ul>
                <a
                  href={teamCheckoutUrl || "#get-access"}
                  className="mt-5 block rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent/90"
                >
                  {teamCheckoutUrl ? "Upgrade to Team" : "Join waitlist"}
                </a>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-zinc-500">
              No setup fees, cancel anytime. Team unlocks the moment payment goes through.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section id="get-access" className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold text-zinc-50">
            Find out what your team is actually spending.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
            Start with the free CLI on your own machine. When you want the same picture for the
            whole team, the dashboard is one command and $19/mo away.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {teamCheckoutUrl && (
              <a
                href={teamCheckoutUrl}
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90"
              >
                Get the team dashboard — $19/mo
              </a>
            )}
            <a
              href="https://github.com/THEMANJH/agentspend-upload"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:border-zinc-500"
            >
              Get the free CLI
            </a>
          </div>
          <p className="mt-8 text-xs text-zinc-500">
            Not ready? Leave your email and we&apos;ll tell you when something changes.
          </p>
          <div className="mt-3 flex justify-center">
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-xs text-zinc-600">
        AgentSpend is an independent tool built for teams using Claude Code. Not affiliated with
        or endorsed by Anthropic.
      </footer>
    </div>
  );
}
