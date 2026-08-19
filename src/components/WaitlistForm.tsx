"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-zinc-200">
        You&apos;re on the list — we&apos;ll email you the moment early access opens.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-accent focus:outline-none"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 focus:border-accent focus:outline-none"
      >
        <option value="">Role (optional)</option>
        <option value="eng-lead">Eng lead / manager</option>
        <option value="founder">Founder</option>
        <option value="developer">Developer</option>
        <option value="other">Other</option>
      </select>
      <button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Get early access"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:absolute">Something went wrong — try again in a bit.</p>
      )}
    </form>
  );
}
