import { useState, useEffect } from "react";
import { ShieldCheck, ShieldOff, QrCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface MFAFactor {
  id: string;
  status: string;
  friendly_name?: string;
}

const MFASettings = () => {
  const { toast } = useToast();
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const loadFactors = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (!error && data) {
      setFactors(data.totp || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadFactors(); }, []);

  const verifiedFactors = factors.filter(f => f.status === "verified");
  const isEnabled = verifiedFactors.length > 0;

  const handleEnroll = async () => {
    setEnrolling(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator App",
    });
    if (error) {
      toast({ title: "Failed to set up 2FA", description: error.message, variant: "destructive" });
      setEnrolling(false);
      return;
    }
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setFactorId(data.id);
  };

  const handleVerify = async () => {
    if (!factorId || verifyCode.length !== 6) return;
    setVerifying(true);
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      toast({ title: "Challenge failed", description: challengeError.message, variant: "destructive" });
      setVerifying(false);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verifyCode,
    });
    if (verifyError) {
      toast({ title: "Invalid code", description: "Please check your authenticator app and try again.", variant: "destructive" });
      setVerifying(false);
      return;
    }
    toast({ title: "Two-step verification enabled!", description: "Your account is now more secure." });
    setEnrolling(false);
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerifyCode("");
    setVerifying(false);
    loadFactors();
  };

  const handleUnenroll = async (fId: string) => {
    if (!confirm("Are you sure you want to disable two-step verification? This will make your account less secure.")) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId: fId });
    if (error) {
      toast({ title: "Failed to disable 2FA", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Two-step verification disabled" });
    loadFactors();
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const cancelEnroll = async () => {
    // Unenroll the unverified factor
    if (factorId) {
      await supabase.auth.mfa.unenroll({ factorId });
    }
    setEnrolling(false);
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerifyCode("");
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading security settings...</p>;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!enrolling ? (
          <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <ShieldCheck className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-body font-medium text-foreground">Two-step verification is enabled</p>
                    <p className="text-sm text-muted-foreground font-body">Your account is protected with an authenticator app.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleUnenroll(verifiedFactors[0].id)}>
                  <ShieldOff className="w-4 h-4 mr-2" /> Disable 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border">
                  <ShieldOff className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-body font-medium text-foreground">Two-step verification is off</p>
                    <p className="text-sm text-muted-foreground font-body">Add an extra layer of security to your account using an authenticator app.</p>
                  </div>
                </div>
                <Button variant="hero" size="sm" onClick={handleEnroll}>
                  <ShieldCheck className="w-4 h-4 mr-2" /> Enable 2FA
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="enroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground font-body font-medium mb-1">Set up your authenticator app</p>
              <p className="text-xs text-muted-foreground font-body">
                Scan the QR code below with an app like Google Authenticator, Authy, or 1Password.
              </p>
            </div>

            {qrCode && (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white rounded-xl shadow-card">
                  <img src={qrCode} alt="Scan this QR code" className="w-48 h-48" />
                </div>

                <div className="w-full">
                  <Label className="text-xs text-muted-foreground font-body">Or enter this code manually:</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 rounded-lg bg-muted text-xs font-mono text-foreground break-all">
                      {secret}
                    </code>
                    <Button variant="outline" size="icon" onClick={copySecret} className="flex-shrink-0">
                      {copiedSecret ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <Label className="font-body font-medium text-foreground">Enter the 6-digit code from your app</Label>
                  <Input
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="h-12 text-center text-2xl tracking-[0.5em] font-mono"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1" onClick={cancelEnroll}>Cancel</Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleVerify}
                    disabled={verifyCode.length !== 6 || verifying}
                  >
                    {verifying ? "Verifying..." : "Verify & Enable"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MFASettings;
