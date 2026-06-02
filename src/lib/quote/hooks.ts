import { useSyncExternalStore } from "react";
import { getQuotations, subscribe } from "./quotationStorage";
import { isAuthenticated, subscribeAuth } from "./adminAuth";
import type { Quotation } from "./types";

const EMPTY: Quotation[] = [];

// Live list of quotations that re-renders when storage changes.
export function useQuotations(): Quotation[] {
  return useSyncExternalStore(
    subscribe,
    () => getQuotations(),
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