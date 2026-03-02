import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Share, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-display text-foreground mb-3">Get the KRASH App</h1>
          <p className="text-muted-foreground font-body mb-8">
            Install KRASH on your phone for the best experience — quick access, offline support, and push notifications.
          </p>

          {isInstalled ? (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-display text-foreground mb-2">Already Installed!</h2>
              <p className="text-muted-foreground font-body">
                KRASH is on your home screen. Open it from there for the best experience.
              </p>
            </div>
          ) : deferredPrompt ? (
            <div className="bg-card rounded-2xl shadow-elevated p-8 space-y-4">
              <Button variant="hero" size="xl" className="w-full" onClick={handleInstall}>
                <Download className="w-5 h-5 mr-2" /> Install KRASH
              </Button>
              <p className="text-xs text-muted-foreground font-body">
                No app store needed — installs directly to your home screen.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-elevated p-8 space-y-6">
              {isIOS ? (
                <>
                  <h2 className="text-lg font-display text-foreground">Install on iPhone / iPad</h2>
                  <ol className="text-left space-y-4 text-muted-foreground font-body">
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                      <span>Tap the <Share className="w-4 h-4 inline text-primary" /> <strong>Share</strong> button in Safari</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                      <span>Scroll down and tap <Plus className="w-4 h-4 inline text-primary" /> <strong>Add to Home Screen</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                      <span>Tap <strong>Add</strong> — that's it!</span>
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-display text-foreground">Install on Android</h2>
                  <ol className="text-left space-y-4 text-muted-foreground font-body">
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                      <span>Tap the <MoreVertical className="w-4 h-4 inline text-primary" /> <strong>menu</strong> in Chrome</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                      <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                      <span>Confirm — KRASH is now on your home screen!</span>
                    </li>
                  </ol>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InstallApp;
