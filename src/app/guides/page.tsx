import Link from "next/link";

export const metadata = {
  title: "Field guides — AgentSpend",
  description:
    "Measured write-ups on Claude Code usage and cost: what the local session logs contain, and what actually drives the bill.",
};

const guides = [
  {
    href: "/guides/claude-code-usage-logs",
    title: "What's actually in your Claude Code usage logs",
    blurb:
      "Where the logs live, which fields carry cost, and why summing input+output tokens undercounted real usage by 633x.",
  },
  {
    href: "/guides/what-drives-claude-code-cost",
    title: "What actually drives your Claude Code bill",
    blurb:
      "Opus turns cost 4.5x more than Sonnet turns while using fewer tokens. 8% of turns produced 28% of cost. 3 of 32 projects produced 77%.",
  },
];

export default function GuidesIndex() {
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

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Field guides</h1>
        <p className="mt-3 text-zinc-400">
          Write-ups based on measurements from real Claude Code session logs, not estimates. Every
          number in them can be reproduced on your own machine with one command.
        </p>

        <div className="mt-10 space-y-4">
          {guides.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-600"
            >
              <h2 className="text-lg font-medium text-zinc-100">{g.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{g.blurb}</p>
            </Link>
          ))}
        </div>

        <div className="mono mt-10 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300">
          <span className="select-none text-zinc-600">$ </span>
          npx github:THEMANJH/agentspend-upload --report
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Free, no signup, nothing uploaded — reproduces these breakdowns against your own logs.
        </p>
      </main>
    </div>
  );
}
