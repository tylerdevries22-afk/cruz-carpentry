/**
 * Public pricing API. `priceProject` resolves the live wood-material market
 * factor (CME lumber futures, with graceful fallback) and runs the pure
 * engine, stamping the real market provenance onto the result. Server-only.
 *
 * Pure helpers and the deterministic `estimate(input, factor)` are re-exported
 * for callers that want to supply their own factor (tests, batch reprice, the
 * admin "preview impact" tool).
 */

import "server-only";
import { estimate } from "./engine";
import { getMarketFactor } from "./market";
import { loadRateSnapshot } from "./rate-source";
import type { EstimateInput, EstimateResult, MarketInfo } from "./types";

export async function priceProject(
  input: EstimateInput,
  opts?: { market?: MarketInfo },
): Promise<EstimateResult> {
  const [{ snapshot }, market] = await Promise.all([
    loadRateSnapshot(),
    opts?.market ? Promise.resolve(opts.market) : getMarketFactor(),
  ]);
  const result = estimate(input, market.factor, snapshot);
  // The engine stamps a "supplied" MarketInfo using the factor we passed in; we
  // overwrite it with the real provenance. Guard the invariant so the persisted
  // est_market.factor can never silently disagree with the factor actually
  // applied to the wood rows.
  if (result.market.factor !== market.factor) {
    console.warn(
      `[pricing] market factor drift — applied ${result.market.factor}, recording ${market.factor}`,
    );
  }
  return { ...result, market };
}

export { estimate } from "./engine";
export {
  squareInches,
  squareFeet,
  cubicInches,
  linearFeet,
  boardFeet,
  sheetCount,
} from "./engine";
export { getMarketFactor, computeMarketFactor, fetchLumberIndex } from "./market";
export { loadRateSnapshot } from "./rate-source";
export * from "./types";
export { ENGINE_VERSION, RULES_VERSION } from "./multipliers";
