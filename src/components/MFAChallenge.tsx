import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface MFAChallengeProps {
  factorId: string;
  onVerified: () => void;
  onCancel: () => void;
}

const MFAChallenge = ({ factorId, onVerified, onCancel }: MFAChallengeProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setVerifying(true);
    setError(null);

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      setError(challengeError.message);
      setVerifying(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (verifyError) {
      setError("Invalid code. Please try again.");
      setCode("");
      setVerifying(false);
      return;
    }

    onVerified();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-display text-foreground">Two-Step Verification</h2>
        <p className="text-sm text-muted-foreground font-body text-center">
          Enter the 6-digit code from your authenticator app to continue.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="font-body font-medium text-foreground flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" /> Verification Code
        </Label>
        <Input
          value={code}
          onChange={(e) => {
            setError(null);
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
          }}
          placeholder="000000"
          className="h-14 text-center text-2xl tracking-[0.5em] font-mono"
          maxLength={6}
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter") handleVerify(); }}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive text-center font-body">{error}</p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 font-body" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="hero"
          className="flex-1 font-body"
          onClick={handleVerify}
          disabled={code.length !== 6 || verifying}
        >
          {verifying ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </motion.div>
  );
};

export default MFAChallenge;
