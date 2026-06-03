import {
  packages as defaultPackages,
  features as defaultFeatures,
  urgencyConfig as defaultUrgency,
  packageOrder,
  type PackageInfo,
  type FeatureInfo,
  type PackageKey,
} from "./pricingData";

/**
 * Editable pricing configuration backed by localStorage.
 *
 * The static shape (names, taglines, included services, feature labels) lives
 * in pricingData.ts. This store only overrides the *numeric* values an admin
 * can tune: package base price, per-page cost, base timeline, feature prices
 * and the fast-delivery multiplier.
 *
 * Like quotationStorage, this is the ONLY place that touches storage — swap the
 * bodies for API calls later (Supabase/Firebase) and keep the signatures.
 */

const STORAGE_KEY = "qe_pricing_config";
const EVENT = "qe_pricing_changed";

export interface PackageOverride {
  basePrice: number;
  perPage: number;
  baseTimelineDays: number;
}

export interface PricingConfig {
  packages: Record<PackageKey, PackageOverride>;
  features: Record<string, number>; // feature key -> price
  fastMultiplier: number; // e.g. 1.25 = +25%
}

function isBrowser() {
  return typeof window !== "undefined";
}

// Build the default config straight from pricingData.
export function defaultConfig(): PricingConfig {
  const packages = {} as Record<PackageKey, PackageOverride>;
  for (const key of packageOrder) {
    const p = defaultPackages[key];
    packages[key] = {
      basePrice: p.basePrice,
      perPage: p.perPage,
      baseTimelineDays: p.baseTimelineDays,
    };
  }
  const features: Record<string, number> = {};
  for (const f of defaultFeatures) features[f.key] = f.price;
  return { packages, features, fastMultiplier: defaultUrgency.fast.multiplier };
}

// Merge stored overrides on top of defaults so newly added packages/features
// always have a value even if the saved config is older.
function merge(stored: Partial<PricingConfig> | null): PricingConfig {
  const base = defaultConfig();
  if (!stored) return base;
  const packages = { ...base.packages };
  if (stored.packages) {
    for (const key of packageOrder) {
      if (stored.packages[key]) {
        packages[key] = { ...base.packages[key], ...stored.packages[key] };
      }
    }
  }
  return {
    packages,
    features: { ...base.features, ...(stored.features ?? {}) },
    fastMultiplier: stored.fastMultiplier ?? base.fastMultiplier,
  };
}

function read(): PricingConfig {
  if (!isBrowser()) return defaultConfig();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return merge(raw ? (JSON.parse(raw) as Partial<PricingConfig>) : null);
  } catch {
    return defaultConfig();
  }
}

let cache: PricingConfig | null = null;
const serverSnapshot = defaultConfig();

export function getConfigSnapshot(): PricingConfig {
  if (cache === null) cache = read();
  return cache;
}

export function getServerConfigSnapshot(): PricingConfig {
  return serverSnapshot;
}

export function saveConfig(config: PricingConfig) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  cache = null;
  window.dispatchEvent(new Event(EVENT));
}

export function resetConfig() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  cache = null;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeConfig(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => {
    cache = null;
    callback();
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/* --------------------- Effective (merged) pricing data --------------------- */
// These return full PackageInfo / FeatureInfo objects with the admin's numeric
// overrides applied, so existing UI code keeps working unchanged.

export function getEffectivePackages(
  config: PricingConfig = getConfigSnapshot(),
): Record<PackageKey, PackageInfo> {
  const result = {} as Record<PackageKey, PackageInfo>;
  for (const key of packageOrder) {
    const o = config.packages[key];
    result[key] = {
      ...defaultPackages[key],
      basePrice: o.basePrice,
      perPage: o.perPage,
      baseTimelineDays: o.baseTimelineDays,
    };
  }
  return result;
}

export function getEffectiveFeatures(
  config: PricingConfig = getConfigSnapshot(),
): FeatureInfo[] {
  return defaultFeatures.map((f) => ({
    ...f,
    price: config.features[f.key] ?? f.price,
  }));
}

export function getFastMultiplier(
  config: PricingConfig = getConfigSnapshot(),
): number {
  return config.fastMultiplier;
}