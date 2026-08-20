import { Resend } from "resend";

let cached: Resend | null = null;

/** Server-side Resend client. Returns null when RESEND_API_KEY isn't set. */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}
