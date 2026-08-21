"use client";

import { useEffect, useState } from "react";

type Settings = {
  monthlyBudgetUsd: number | null;
  thresholdPct: number | null;
  notifyEmail: string | null;
};

export function BudgetSettings({ teamKey, onSaved }: { teamKey: string; onSaved?: () => void }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [budget, setBudget] = useState("");
  const [threshold, setThreshold] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open || settings) return;
    fetch(`/api/team-settings?key=${teamKey}`)
      .then((r) => r.json())
      .then((s: Settings) => {
        setSettings(s);
        setBudget(s.monthlyBudgetUsd != null ? String(s.monthlyBudgetUsd) : "");
        setThreshold(s.thresholdPct != null ? String(s.thresholdPct) : "80");
        setEmail(s.notifyEmail ?? "");
      })
      .catch(() => setSettings({ monthlyBudgetUsd: null, thresholdPct: null, notifyEmail: null }));
  }, [open, settings, teamKey]);

  async function save() {
    setStatus("saving");
    setMessage("");
    const res = await fetch("/api/team-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: teamKey,
        monthlyBudgetUsd: budget.trim() === "" ? null : Number(budget),
        thresholdPct: threshold.trim() === "" ? undefined : Number(threshold),
        notifyEmail: email.trim() === "" ? undefined : email.trim(),
      }),
    });
    if (res.ok) {
      setStatus("saved");
      setMessage("Saved.");
      onSaved?.();
    } else {
      const body = await res.json().catch(() => ({ error: "could not save" }));
      setStatus("error");
      setMessage(body.error ?? "Could not save.");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500"
      >
        Budget settings
      </button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-200">Budget settings</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          Close
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="text-xs text-zinc-400">
          Monthly budget (USD)
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            inputMode="decimal"
            placeholder="150"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
          />
        </label>
        <label className="text-xs text-zinc-400">
          Alert at (% of budget)
          <input
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            inputMode="numeric"
            placeholder="80"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
          />
        </label>
        <label className="text-xs text-zinc-400">
          Send alerts to
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            placeholder="you@company.com"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {message && (
          <span className={`text-xs ${status === "error" ? "text-amber-300" : "text-zinc-400"}`}>
            {message}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        We check month-to-date spend once a day and email you the first time it crosses your
        threshold. Changing the threshold lets it fire again this month.
      </p>
    </div>
  );
}
