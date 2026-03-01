import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import TOSModal from "@/components/TOSModal";
import MFAChallenge from "@/components/MFAChallenge";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(100),
});

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [showMFA, setShowMFA] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !tosAccepted) {
      setShowTOS(true);
      return;
    }
    await performSubmit();
  };

  const performSubmit = async () => {
    setLoading(true);

    try {
      if (mode === "signup") {
        const parsed = signupSchema.parse({ email, password, name });
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            data: { full_name: parsed.name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "We sent you a verification link." });
      } else {
        const parsed = loginSchema.parse({ email, password });
        const { data, error } = await supabase.auth.signInWithPassword({
          email: parsed.email,
          password: parsed.password,
        });
        if (error) throw error;

        // Check if MFA is required
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalData && aalData.nextLevel === "aal2" && aalData.currentLevel !== "aal2") {
          // User has MFA enrolled, need to verify
          const { data: factorsData } = await supabase.auth.mfa.listFactors();
          const totpFactor = factorsData?.totp?.find(f => f.status === "verified");
          if (totpFactor) {
            setMfaFactorId(totpFactor.id);
            setShowMFA(true);
            setLoading(false);
            return;
          }
        }

        navigate("/");
      }
    } catch (err: any) {
      const msg = err?.issues?.[0]?.message || err?.message || "Something went wrong";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }

    setLoading(false);
  };

  if (showMFA && mfaFactorId) {
    return (
      <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-elevated p-8">
            <MFAChallenge
              factorId={mfaFactorId}
              onVerified={() => navigate("/")}
              onCancel={async () => {
                await supabase.auth.signOut();
                setShowMFA(false);
                setMfaFactorId(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display text-foreground mb-2 text-center">
            {mode === "login" ? "Welcome Back" : "Join KRASH"}
          </h1>
          <p className="text-muted-foreground font-body text-center mb-8">
            {mode === "login" ? "Sign in to your account" : "Create your account to start connecting"}
          </p>

          <div className="bg-card rounded-2xl shadow-elevated p-8 space-y-6">
            <Button
              variant="outline"
              className="w-full h-12 font-body"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground font-body">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                    <User className="w-4 h-4 text-primary" /> Name
                  </Label>
                  <Input
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    maxLength={100}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                  <Mail className="w-4 h-4 text-primary" /> Email
                </Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                  <Lock className="w-4 h-4 text-primary" /> Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <Link to="/forgot-password" className="text-sm text-primary hover:underline font-body block">
                  Forgot password?
                </Link>
              )}

              <Button variant="hero" size="xl" className="w-full" type="submit" disabled={loading}>
                {mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            <p className="text-sm text-center text-muted-foreground font-body">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary hover:underline font-medium"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>

            {mode === "signup" && (
              <p className="text-xs text-center text-muted-foreground font-body">
                {tosAccepted ? (
                  <span className="text-primary">✓ You accepted our Terms of Service and{" "}
                    <Link to="/privacy" className="hover:underline">Privacy Policy</Link>.</span>
                ) : (
                  <>You'll need to accept our{" "}
                    <button onClick={() => setShowTOS(true)} className="text-primary hover:underline">Terms</button> and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> to sign up.</>
                )}
              </p>
            )}
          </div>

          <TOSModal
            open={showTOS}
            onAccept={() => {
              setTosAccepted(true);
              setShowTOS(false);
            }}
            onDecline={() => setShowTOS(false)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
