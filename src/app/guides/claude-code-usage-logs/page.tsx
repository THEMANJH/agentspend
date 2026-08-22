import Link from "next/link";

export const metadata = {
  title: "What's actually in your Claude Code usage logs — AgentSpend",
  description:
    "A field guide to ~/.claude/projects/**/*.jsonl: which fields record token usage, why cache tokens dominate the count, and why summing only input and output tokens undercounted our real usage by 633x.",
};

const rows = [
  { field: "cache_read_input_tokens", tokens: "6,545,108,694", pct: "97.46%" },
  { field: "cache_creation_input_tokens", tokens: "159,983,196", pct: "2.38%" },
  { field: "output_tokens", tokens: "10,549,546", pct: "0.16%" },
  { field: "input_tokens", tokens: "59,353", pct: "0.00%" },
];

export default function UsageLogsGuide() {
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
          What&apos;s actually in your Claude Code usage logs
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Claude Code already writes everything you need to work out what it costs you. Here is
          where it lives, what the fields mean, and the one mistake that made our own first
          estimate wrong by a factor of 633.
        </p>

        <div className="mt-12 space-y-5 text-zinc-300">
          <h2 className="text-xl font-semibold text-zinc-100">Where the logs are</h2>
          <p>
            Every session is appended to a JSON Lines file under your home directory:
          </p>
          <pre className="mono overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
            ~/.claude/projects/&lt;encoded-project-path&gt;/&lt;session-id&gt;.jsonl
          </pre>
          <p>
            One JSON object per line. The directory name is derived from the project path you
            were working in, which is what makes per-project attribution possible without any
            extra configuration on your side.
          </p>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">The fields that matter</h2>
          <p>
            Assistant messages carry a <code className="mono text-zinc-100">usage</code> object.
            The parts relevant to cost are:
          </p>
          <pre className="mono overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">{`{
  "timestamp": "2026-08-22T04:53:13.857Z",
  "cwd": "/Users/you/code/some-project",
  "message": {
    "model": "claude-sonnet-5",
    "usage": {
      "input_tokens": 2,
      "output_tokens": 878,
      "cache_read_input_tokens": 409004,
      "cache_creation_input_tokens": 1993
    }
  }
}`}</pre>
          <p>
            That is the whole surface you need: four token counts, a model name, a timestamp,
            and the working directory. Nothing about cost requires reading the prompt text or
            the file contents that make up the rest of the line.
          </p>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">
            The mistake: input + output is not your usage
          </h2>
          <p>
            The obvious way to price a session is to sum{" "}
            <code className="mono text-zinc-100">input_tokens</code> and{" "}
            <code className="mono text-zinc-100">output_tokens</code>. That is wrong, and not by
            a little. Here is the real breakdown across 17,202 usage-bearing events from 35
            session files on one working machine:
          </p>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">Field</th>
                  <th className="px-4 py-3 font-medium">Tokens</th>
                  <th className="px-4 py-3 font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.field} className={i % 2 === 0 ? "bg-zinc-950/40" : ""}>
                    <td className="mono px-4 py-3 text-zinc-200">{r.field}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                      {r.tokens}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-zinc-400">{r.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Cache reads are <strong className="text-zinc-100">97.46%</strong> of all tokens.
            Input and output together came to 10.6 million out of 6.72 billion — so pricing on
            those two fields alone undercounts by roughly{" "}
            <strong className="text-zinc-100">633&times;</strong>.
          </p>
          <p>
            This is not an anomaly, it is how an agentic coding tool works. Claude Code re-reads
            a large cached context on nearly every turn, so cached input dwarfs the handful of
            new tokens you actually type. Cached reads are billed at a lower rate than fresh
            input, which is exactly why they are worth having — but a lower rate is not a zero
            rate, and at this volume the difference decides your bill.
          </p>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">Other things worth knowing</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-zinc-100">The logs are mostly not usage data.</strong> On
              the same machine, 402 MB of raw <code className="mono">.jsonl</code> contained
              about 9 MB of usage metadata. The rest is prompt and file content.
            </li>
            <li>
              <strong className="text-zinc-100">Spend per project is lumpy.</strong> A couple of
              repositories accounted for most of the total, and they were not the ones we would
              have guessed before measuring.
            </li>
            <li>
              <strong className="text-zinc-100">Models are mixed within a session.</strong>{" "}
              Entries carry their own model name, so you cannot price a whole session at one
              rate.
            </li>
            <li>
              <strong className="text-zinc-100">Some entries are synthetic.</strong> You will see
              a <code className="mono">&lt;synthetic&gt;</code> model on a small number of lines;
              they are not billable turns.
            </li>
          </ul>

          <h2 className="pt-6 text-xl font-semibold text-zinc-100">Reading it yourself</h2>
          <p>
            You do not need us for any of this. Our collector is open source and dependency-free,
            and it will do the arithmetic above against your own logs — no key, no account,
            nothing uploaded:
          </p>
          <pre className="mono overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
            npx github:THEMANJH/agentspend-upload --report
          </pre>
          <p>
            If you would rather see the raw payload a team sync would send instead of a summary,{" "}
            <code className="mono text-zinc-100">--dry-run</code> prints exactly that and uploads
            nothing.
          </p>
          <p>
            It reads only the four token counts, the model name, the project folder name and the
            timestamp — never prompt text or file contents. You can confirm that in about two
            minutes by reading the source, which is one file.
          </p>

          <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold text-zinc-100">
              If you need this for a whole team
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              The CLI shows one machine. AgentSpend is the hosted version: everyone&apos;s spend
              in one dashboard split by person and project, with an email alert before you cross
              a budget. Flat $19/mo for up to 10 people, never metered on the spend you track.
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
            Figures measured 22 August 2026 on a single heavily-used machine: 35 session files,
            17,202 usage-bearing events, 6,715,700,789 tokens total. Your mix will differ; the
            method is what transfers.
          </p>
        </div>
      </article>
    </div>
  );
}
