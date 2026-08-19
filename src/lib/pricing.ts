// Approximate list pricing, USD per token. Used to estimate cost from raw
// token counts reported by the uploader. Not exact — actual billing depends
// on the customer's own Anthropic contract/rates. Update as pricing changes.
type Rates = { input: number; output: number; cacheRead: number; cacheWrite: number };

const PRICING: Record<string, Rates> = {
  "claude-opus-5": { input: 0.000015, output: 0.000075, cacheRead: 0.0000015, cacheWrite: 0.0000188 },
  "claude-sonnet-5": { input: 0.000003, output: 0.000015, cacheRead: 0.0000003, cacheWrite: 0.00000375 },
  "claude-haiku-4-5": { input: 0.0000008, output: 0.000004, cacheRead: 0.00000008, cacheWrite: 0.000001 },
};

const DEFAULT_RATES: Rates = PRICING["claude-sonnet-5"];

export function estimateCostUsd(params: {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
}): number {
  const rates = PRICING[params.model] ?? DEFAULT_RATES;
  const cost =
    params.inputTokens * rates.input +
    params.outputTokens * rates.output +
    params.cacheReadTokens * rates.cacheRead +
    params.cacheCreationTokens * rates.cacheWrite;
  return Math.round(cost * 1e6) / 1e6;
}
