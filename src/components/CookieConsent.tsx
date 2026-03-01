import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "triplink_cookie_consent";

type ConsentChoice = "all" | "essential" | null;

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: ConsentChoice) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ choice, timestamp: new Date().toISOString() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6"
        >
          <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-elevated border border-border p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-foreground text-lg mb-1">We value your privacy</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  We use essential cookies for authentication and security. Optional analytics cookies help us improve TripLink. 
                  Read our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConsent("essential")}
                className="font-body"
              >
                Essential Only
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={() => handleConsent("all")}
                className="font-body"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
