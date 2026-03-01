import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Cookie, Settings2, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getConsentPreferences,
  saveConsentPreferences,
  needsReConsent,
  DEFAULT_PREFERENCES,
  type CookiePreferences,
} from "@/lib/cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [doNotSell, setDoNotSell] = useState(false);

  useEffect(() => {
    if (needsReConsent()) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }

    // Listen for "manage cookies" event from footer link
    const handler = () => {
      const prefs = getConsentPreferences();
      if (prefs) {
        setAnalytics(prefs.analytics);
        setMarketing(prefs.marketing);
        setDoNotSell(prefs.doNotSell);
      }
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener("krash-open-cookie-settings", handler);
    return () => window.removeEventListener("krash-open-cookie-settings", handler);
  }, []);

  const handleAcceptAll = () => {
    saveConsentPreferences({ analytics: true, marketing: true, doNotSell: false });
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    saveConsentPreferences({ analytics: false, marketing: false, doNotSell: false });
    setVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsentPreferences({ analytics, marketing, doNotSell });
    setVisible(false);
    setShowDetails(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent preferences"
          aria-describedby="cookie-description"
          aria-modal="true"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6"
        >
          <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-elevated border border-border p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-foreground text-lg mb-1">We value your privacy</h3>
                <p id="cookie-description" className="text-sm text-muted-foreground font-body leading-relaxed">
                  We use cookies to provide core functionality and, with your consent, to analyze usage and personalize your experience.
                  You can customize your preferences below or read our{" "}
                  <Link to="/privacy#cookies" className="text-primary hover:underline">Cookie Policy</Link> and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details.
                </p>
              </div>
            </div>

            {/* Granular preferences (GDPR requirement: granular control) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 py-4 border-t border-b border-border mb-4">
                    {/* Essential - always on */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-body font-medium text-foreground">Essential Cookies</p>
                        <p className="text-xs text-muted-foreground font-body">Required for authentication, security, and core functionality. Cannot be disabled.</p>
                      </div>
                      <Switch checked disabled aria-label="Essential cookies (always enabled)" />
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-body font-medium text-foreground">Analytics Cookies</p>
                        <p className="text-xs text-muted-foreground font-body">Help us understand how visitors use KRASH so we can improve the experience.</p>
                      </div>
                      <Switch
                        checked={analytics}
                        onCheckedChange={setAnalytics}
                        aria-label="Enable analytics cookies"
                      />
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-body font-medium text-foreground">Marketing Cookies</p>
                        <p className="text-xs text-muted-foreground font-body">Used to deliver relevant content and measure campaign effectiveness.</p>
                      </div>
                      <Switch
                        checked={marketing}
                        onCheckedChange={setMarketing}
                        aria-label="Enable marketing cookies"
                      />
                    </div>

                    {/* CCPA: Do Not Sell */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div>
                        <p className="text-sm font-body font-medium text-foreground">Do Not Sell or Share My Personal Information</p>
                        <p className="text-xs text-muted-foreground font-body">
                          Under the California Consumer Privacy Act (CCPA), you have the right to opt out of the sale or sharing of your personal information.{" "}
                          <Link to="/privacy#your-choices" className="text-primary hover:underline">Learn more</Link>
                        </p>
                      </div>
                      <Switch
                        checked={doNotSell}
                        onCheckedChange={setDoNotSell}
                        aria-label="Do not sell or share my personal information"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-primary hover:underline font-body flex items-center gap-1.5"
                aria-expanded={showDetails}
              >
                <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
                {showDetails ? "Hide preferences" : "Customize preferences"}
              </button>
              <div className="flex gap-2">
                {showDetails ? (
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handleSavePreferences}
                    className="font-body"
                  >
                    Save Preferences
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEssentialOnly}
                      className="font-body"
                    >
                      Essential Only
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={handleAcceptAll}
                      className="font-body"
                    >
                      Accept All
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
