import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto text-center px-4">
          <h2 className="text-2xl font-display text-foreground mb-3">Check your email</h2>
          <p className="text-muted-foreground font-body mb-6">We sent a password reset link to <strong>{email}</strong>.</p>
          <Link to="/auth"><Button variant="outline">Back to Sign In</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm font-body">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
          <h1 className="text-3xl font-display text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground font-body mb-8">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-elevated p-8 space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                <Mail className="w-4 h-4 text-primary" /> Email
              </Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" maxLength={255} />
            </div>
            <Button variant="hero" size="xl" className="w-full" type="submit" disabled={loading}>
              Send Reset Link
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
