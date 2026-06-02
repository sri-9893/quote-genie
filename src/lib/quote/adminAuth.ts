/**
 * Demo admin auth using localStorage. Replace with real auth
 * (Supabase Auth / Firebase Auth) later — keep these signatures.
 */
const SESSION_KEY = "qe_admin_session";
const EVENT = "qe_admin_auth_changed";

// Demo credentials (front-end only — never do this in production).
export const ADMIN_EMAIL = "admin@company.com";
export const ADMIN_PASSWORD = "admin123";

function isBrowser() {
  return typeof window !== "undefined";
}

export function login(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (isBrowser()) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email, at: Date.now() }));
      window.dispatchEvent(new Event(EVENT));
    }
    return true;
  }
  return false;
}

export function logout() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  return !!window.localStorage.getItem(SESSION_KEY);
}

export function getAdminEmail(): string | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw).email as string) : null;
  } catch {
    return null;
  }
}

export function subscribeAuth(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}