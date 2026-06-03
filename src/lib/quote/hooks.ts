import { useSyncExternalStore } from "react";
import { getQuotationsSnapshot, subscribe } from "./quotationStorage";
import { isAuthenticated, subscribeAuth } from "./adminAuth";
import {
  getConfigSnapshot,
  getServerConfigSnapshot,
  subscribeConfig,
  getEffectivePackages,
  getEffectiveFeatures,
  getFastMultiplier,
  type PricingConfig,
} from "./pricingStore";
import type { Quotation } from "./types";

const EMPTY: Quotation[] = [];

// Live list of quotations that re-renders when storage changes.
export function useQuotations(): Quotation[] {
  return useSyncExternalStore(
    subscribe,
    getQuotationsSnapshot,
    () => EMPTY,
  );
}

// Reactive admin auth flag (false during SSR).
export function useAdminAuth(): boolean {
  return useSyncExternalStore(
    subscribeAuth,
    () => isAuthenticated(),
    () => false,
  );
}

// Live pricing config that re-renders when an admin edits prices.
export function usePricingConfig(): PricingConfig {
  return useSyncExternalStore(
    subscribeConfig,
    getConfigSnapshot,
    getServerConfigSnapshot,
  );
}

// Convenience hooks returning effective (merged) pricing data.
export function useEffectivePackages() {
  const config = usePricingConfig();
  return getEffectivePackages(config);
}

export function useEffectiveFeatures() {
  const config = usePricingConfig();
  return getEffectiveFeatures(config);
}

export function useFastMultiplier() {
  const config = usePricingConfig();
  return getFastMultiplier(config);
}