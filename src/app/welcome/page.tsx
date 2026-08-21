"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type LookupResult = { ready: boolean; name?: string | null; ingestKey?: string };

function WelcomeContent() {
  const checkoutId = useSearchParams().get("checkout_id");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!checkoutId) return;
    if (result?.ready) return;
    if (attempts > 10) return;

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/team-lookup?checkout_id=${checkoutId}`);
      const data: LookupResult = await res.json();
      setResult(data);
      setAttempts((a) => a + 1);
    }, attempts === 0 ? 0 : 2000);

    return () => clearTimeout(timer);
  }, [checkoutId, attempts, result?.ready]);

  if (!checkoutId) {
    return (
      <p className="text-zinc-400">
        Missing checkout reference. If you just paid, check your Polar receipt email for
        confirmation — your team key will be available there too.
      </p>
    );
  }

  if (!result?.ready) {
    return (
      <div className="flex flex-col items-center gap-3 text-zinc-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-accent" />
        <p>Setting up your team{attempts > 5 ? " — this is taking longer than usual" : "…"}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg text-left">
      <p className="text-sm text-zinc-400">Payment confirmed. Here&apos;s your team key:</p>
      <div className="mono mt-3 break-all rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-accent">
        {result.ingestKey}
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        Save this — you&apos;ll need it to connect the uploader CLI. It won&apos;t be shown again here.
      </p>

      <div className="mt-8 space-y-4 text-sm text-zinc-300">
        <p className="font-medium text-zinc-100">Next steps</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            On each teammate&apos;s machine, run this once:
            <div className="mono mt-1 break-all rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
              npx github:THEMANJH/agentspend-upload --install --key {result.ingestKey} --member
              yourname
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              <code className="mono">--install</code> sets up a background job that syncs every
              30 minutes, so nobody has to remember to re-run anything. Add{" "}
              <code className="mono">--dry-run</code> first to see exactly what it installs, or
              drop <code className="mono">--install</code> for a one-off sync.
            </p>
          </li>
          <li>Usage starts flowing in within minutes.</li>
          <li>
            <Link href={`/team/${result.ingestKey}`} className="underline underline-offset-2">
              Open your team dashboard
            </Link>{" "}
            — bookmark this link, it&apos;s how you&apos;ll check spend going forward.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-8 font-semibold tracking-tight text-zinc-100">
        Agent<span className="text-accent">Spend</span>
      </span>
      <h1 className="text-2xl font-semibold text-zinc-50">Welcome to the team.</h1>
      <div className="mt-8 flex justify-center">
        <Suspense fallback={<p className="text-zinc-400">Loading…</p>}>
          <WelcomeContent />
        </Suspense>
      </div>
    </div>
  );
}
