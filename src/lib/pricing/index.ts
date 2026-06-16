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
import type { EstimateInput, EstimateResult, MarketInfo } from "./types";

export async function priceProject(
  input: EstimateInput,
  opts?: { market?: MarketInfo },
): Promise<EstimateResult> {
  const market = opts?.market ?? (await getMarketFactor());
  const result = estimate(input, market.factor);
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
export * from "./types";
export { ENGINE_VERSION, RULES_VERSION } from "./multipliers";
