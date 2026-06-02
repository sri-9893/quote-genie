import type { QuotationStatus } from "./pricingData";
import type { EstimatorInput, EstimateResult, Quotation } from "./types";

/**
 * localStorage-backed quotation repository.
 *
 * This module is the ONLY place that touches storage. To migrate to a real
 * backend (Supabase / Firebase), replace the bodies of these functions with
 * API calls and keep the same signatures — the rest of the app won't change.
 */

const STORAGE_KEY = "qe_quotations";
const DRAFT_KEY = "qe_quotation_draft";
const EVENT = "qe_quotations_changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function read(): Quotation[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Quotation[]) : [];
  } catch {
    return [];
  }
}

function write(list: Quotation[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  cache = null; // invalidate snapshot cache
  window.dispatchEvent(new Event(EVENT));
}

function makeId(): string {
  return "QT-" + Date.now().toString(36).toUpperCase() + "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function getQuotations(): Quotation[] {
  return read()
    .slice()
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

// Cached snapshot for useSyncExternalStore (stable reference until changed).
let cache: Quotation[] | null = null;
export function getQuotationsSnapshot(): Quotation[] {
  if (cache === null) cache = getQuotations();
  return cache;
}

export function getQuotation(id: string): Quotation | undefined {
  return read().find((q) => q.id === id);
}

export function saveQuotation(
  input: EstimatorInput,
  estimate: EstimateResult,
): Quotation {
  const quotation: Quotation = {
    ...input,
    id: makeId(),
    createdAt: new Date().toISOString(),
    status: "New",
    estimate,
  };
  const list = read();
  list.push(quotation);
  write(list);
  return quotation;
}

export function updateStatus(id: string, status: QuotationStatus) {
  const list = read().map((q) => (q.id === id ? { ...q, status } : q));
  write(list);
}

export function deleteQuotation(id: string) {
  write(read().filter((q) => q.id !== id));
}

export function subscribe(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => {
    cache = null; // ensure snapshot recomputes (covers cross-tab storage events)
    callback();
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/* ----------------------------- Draft handling ----------------------------- */
// The estimator stores a draft so the Quotation Preview page can read it.

export interface QuotationDraft {
  input: EstimatorInput;
  estimate: EstimateResult;
}

export function saveDraft(draft: QuotationDraft) {
  if (!isBrowser()) return;
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getDraft(): QuotationDraft | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as QuotationDraft) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(DRAFT_KEY);
}