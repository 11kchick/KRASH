/**
 * Cookie consent utilities for GDPR and CCPA compliance.
 * 
 * GDPR requires: prior consent before non-essential cookies, granular choices,
 * ability to withdraw consent at any time.
 * 
 * CCPA requires: "Do Not Sell or Share My Personal Information" opt-out,
 * right to know what data is collected.
 */

export const COOKIE_CONSENT_KEY = "krash_cookie_consent";

export interface CookiePreferences {
  essential: true; // Always true — cannot be disabled
  analytics: boolean;
  marketing: boolean;
  doNotSell: boolean; // CCPA: "Do Not Sell or Share"
  timestamp: string;
  version: string; // Track policy version for re-consent
}

export const CONSENT_VERSION = "1.0";

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  doNotSell: false,
  timestamp: "",
  version: CONSENT_VERSION,
};

/** Read stored consent preferences, or null if not yet given. */
export function getConsentPreferences(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);

    // Handle legacy format (choice: "all" | "essential")
    if (parsed.choice) {
      return {
        essential: true,
        analytics: parsed.choice === "all",
        marketing: parsed.choice === "all",
        doNotSell: false,
        timestamp: parsed.timestamp || new Date().toISOString(),
        version: "legacy",
      };
    }

    return parsed as CookiePreferences;
  } catch {
    return null;
  }
}

/** Save consent preferences. */
export function saveConsentPreferences(prefs: Omit<CookiePreferences, "essential" | "timestamp" | "version">): void {
  const full: CookiePreferences = {
    ...prefs,
    essential: true,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent("krash-consent-updated", { detail: full }));
}

/** Check if a specific cookie category has been consented to. */
export function hasConsent(category: "analytics" | "marketing"): boolean {
  const prefs = getConsentPreferences();
  if (!prefs) return false;
  return prefs[category] === true;
}

/** Check if user has opted into "Do Not Sell" under CCPA. */
export function hasDoNotSell(): boolean {
  const prefs = getConsentPreferences();
  if (!prefs) return false;
  return prefs.doNotSell === true;
}

/** Check if consent has been given at all (any version). */
export function hasGivenConsent(): boolean {
  return getConsentPreferences() !== null;
}

/** Check if consent needs to be re-collected due to policy version change. */
export function needsReConsent(): boolean {
  const prefs = getConsentPreferences();
  if (!prefs) return true;
  return prefs.version !== CONSENT_VERSION;
}

/** Clear consent (for "withdraw consent" functionality). */
export function clearConsent(): void {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.dispatchEvent(new CustomEvent("krash-consent-updated", { detail: null }));
}
