import Link from "next/link";

export const metadata = {
  title: "What actually drives your Claude Code bill — AgentSpend",
  description:
    "Measured across 17,424 real usage events: Opus costs 4.5x more per turn than Sonnet while using fewer tokens, 8% of turns drive 28% of cost, and 3 of 32 projects account for 77% of spend.",
};

const models = [
  { name: "claude-sonnet-5", events: "16,015", cost: "$2,593.14", per: "$0.162", tokens: "399,308" },
  { name: "claude-opus-5", events: "1,383", cost: "$1,013.16", per: "$0.733", tokens: "349,294" },
];

export default function CostDriversGuide() {
  return (
    <div className="flex-1 bg-[#08090a]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-semibold tracking-tight text-zinc-100">
          Agent<span className="text-accent">Spend</span>
        </Link>
        <a
          href="https://github.com/THEMANJH/agentspend-upload"
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          The CLI
        </a>
      </header>

      <article className="mx-auto max-w-3xl px-6 pb-24">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Field guide</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl">
          What actually drives your Claude Code bill
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Three things I expected to matter turned out not to, and three I did not expect turned
          out to dominate. All of it measured from 17,424 real usage events on one working
          machine.
        </p>

        <div className="mt-12 space-y-5 text-zinc-300">
          <h2 className="text-xl font-semibold text-zinc-100">
            1. Model choice costs 4.5x per turn — and not because of length
          </h2>
          <p>
            The obvious guess is that Opus costs more because it writes more. That is not what the
            data shows. Opus turns used <em>fewer</em> tokens on average than Sonnet turns, and
            still cost 4.5 times as much each:
          </p>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 text-right font-medium">Turns</th>
                  <th className="px-4 py-3 text-right font-medium">Cost</th>
                  <th className="px-4 py-3 text-right font-medium">Per turn</th>
                  <th className="px-4 py-3 text-right font-medium">Tokens / turn</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? "bg-zinc-950/40" : ""}>
                    <td className="mono px-4 py-3 text-zinc-200">{m.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-300">{m.events}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-300">{m.cost}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-100">{m.per}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-400">{m.tokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            The gap is pure rate, not verbosity. Which means the lever is{" "}
            <strong className="text-zinc-100">which model handles which turn</strong>, and nothing
            about how you write prompts will move it.
          </p>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">
            2. 8% of turns produced 28% of the cost
          </h2>
          <p>
            Those 1,383 Opus turns were <strong className="text-zinc-100">7.9%</strong> of all
            turns and <strong className="text-zinc-100">28.1%</strong> of all cost. If you are
            trying to bring spend down, that ratio is the whole game: a small number of
            model-selection decisions carries almost a third of the bill, and the other 92% of
            your activity is comparatively cheap noise.
          </p>
          <p>
            This is also why &ldquo;use Claude Code less&rdquo; is bad advice. Using it less
            uniformly cuts mostly cheap turns. Moving a category of work from Opus to Sonnet cuts
            the expensive ones.
          </p>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">
            3. Spend is Pareto across projects, and not where you would guess
          </h2>
          <p>
            Across 32 projects, the single largest accounted for{" "}
            <strong className="text-zinc-100">35.7%</strong> of all spend, and the top three
            together for <strong className="text-zinc-100">77.1%</strong>. The remaining 29
            projects shared under a quarter.
          </p>
          <p>
            The useful part is that the top three were not the three I would have named before
            measuring. Perceived effort and actual token weight are only loosely related — a
            repo where you did a lot of thinking but little agent iteration is cheap; a repo
            where the agent ground through a large codebase repeatedly is expensive, even if it
            felt like a quiet week.
          </p>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">
            What does not drive the bill
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-zinc-100">Prompt length.</strong> Across the same dataset,
              raw <code className="mono">input_tokens</code> were 0.00% of all tokens. What you
              type is a rounding error.
            </li>
            <li>
              <strong className="text-zinc-100">Output length.</strong> 0.15%. Also a rounding
              error.
            </li>
            <li>
              <strong className="text-zinc-100">Number of sessions.</strong> Cost tracks context
              size multiplied by turn count, not how many times you opened a terminal.
            </li>
          </ul>
          <p>
            Cache reads were 97.47% of all tokens — the same context being re-read on nearly
            every turn. That mechanism is covered in more detail in{" "}
            <Link
              href="/guides/claude-code-usage-logs"
              className="underline underline-offset-2 hover:text-zinc-100"
            >
              the usage-log field guide
            </Link>
            .
          </p>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">Checking your own numbers</h2>
          <p>
            Every figure above came out of local session logs, and you can produce the same
            breakdown for yourself in one command — no key, no account, nothing uploaded:
          </p>
          <pre className="mono overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
            npx github:THEMANJH/agentspend-upload --report
          </pre>
          <p>
            It prints cost by project, by model and by day, and flags the cache ratio when it
            spots it.
          </p>

          <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold text-zinc-100">Doing this for a team</h2>
            <p className="mt-2 text-sm text-zinc-400">
              The command above covers one machine. AgentSpend is the hosted version: everyone&apos;s
              spend in one dashboard split by person and project, with an email alert before you
              cross a budget. Flat $19/mo for up to 10 people, never metered on the spend you
              track.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
              >
                How it works
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
              >
                See a live dashboard
              </Link>
            </div>
          </div>

          <p className="pt-8 text-xs text-zinc-600">
            Measured 23 August 2026 across 17,424 usage-bearing events from one heavily-used
            machine. Costs are estimated at API list price; on a Max subscription the real bill is
            flat, so these numbers show relative weight rather than an invoice. One machine is one
            data point — the method transfers, the exact ratios will not.
          </p>
        </div>
      </article>
    </div>
  );
}
