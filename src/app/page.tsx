import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

const steps = [
  {
    title: "Install the CLI",
    body: "One command on each teammate's machine. It reads your existing local Claude Code logs — nothing new to configure.",
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
  },
  {
    title: "Budget alerts",
    body: "Set a monthly ceiling per team or per project. Get an email before you go over — not an invoice after.",
  },
  {
    title: "History that survives log rotation",
    body: "Local logs get cleaned up or a laptop gets wiped. Your usage history lives in the dashboard, not just on disk.",
  },
  {
    title: "Your code never leaves the machine",
    body: "The CLI reads only token counts, model name, project label, and timestamps from your logs. Prompt and file contents are never read or transmitted.",
  },
];

const teamCheckoutUrl = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL;

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
          <a
            href="https://github.com/THEMANJH/agentspend"
            className="hover:text-zinc-100"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pt-12 pb-20 text-center sm:pt-20">
          <p className="mx-auto mb-5 inline-block rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
            For teams shipping with Claude Code
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl">
            Know what your team actually spends on AI coding agents.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
            AgentSpend turns everyone&apos;s local Claude Code usage logs into one team dashboard —
            with budget alerts, before the bill surprises you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <WaitlistForm />
            <p className="text-xs text-zinc-500">
              Free for solo use. No credit card. We never read your code or prompts —{" "}
              <a href="#privacy" className="underline underline-offset-2 hover:text-zinc-300">
                see how
              </a>
              .
            </p>
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
                <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <h3 className="font-medium text-zinc-100">{f.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            What we actually collect
          </h2>
          <p className="mt-4 text-zinc-300">
            The AgentSpend CLI parses your local Claude Code logs and extracts only the{" "}
            <span className="mono text-accent">usage</span> metadata Anthropic already writes there:
            token counts, model name, project folder name, and a timestamp. Prompt text, file
            contents, and diffs are never read, never logged, and never sent anywhere. You can
            inspect exactly what gets uploaded —{" "}
            <a
              href="https://github.com/THEMANJH/agentspend/tree/main/uploader"
              className="underline underline-offset-2 hover:text-zinc-100"
            >
              the CLI is open source
            </a>
            .
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
                <h3 className="font-medium text-zinc-100">Solo</h3>
                <p className="mt-1 text-3xl font-semibold text-zinc-50">
                  $0<span className="text-base font-normal text-zinc-500">/mo</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  <li>1 member</li>
                  <li>7-day rolling history</li>
                  <li>Daily &amp; per-project breakdown</li>
                </ul>
                <a
                  href="#get-access"
                  className="mt-5 block rounded-lg border border-zinc-700 px-4 py-2 text-center text-sm text-zinc-300 hover:border-zinc-500"
                >
                  Join waitlist
                </a>
              </div>
              <div className="rounded-xl border border-accent/50 bg-accent/5 p-6">
                <h3 className="font-medium text-zinc-100">Team</h3>
                <p className="mt-1 text-3xl font-semibold text-zinc-50">
                  $29<span className="text-base font-normal text-zinc-500">/mo</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>Up to 10 members</li>
                  <li>Unlimited history</li>
                  <li>Budget alerts by email</li>
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
              Early access — pricing may change before general availability. Waitlist members lock
              in early-access pricing.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section id="get-access" className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold text-zinc-50">
            Get early access when it opens.
          </h2>
          <div className="mt-6 flex justify-center">
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-xs text-zinc-600">
        AgentSpend is an independent tool built for teams using Claude Code and other AI coding
        agents. Not affiliated with or endorsed by Anthropic.
      </footer>
    </div>
  );
}
