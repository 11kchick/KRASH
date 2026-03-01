import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Check, Lightbulb, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

const categories = [
  { value: "question", label: "Question", icon: HelpCircle, description: "Ask us anything about JourneyNexus" },
  { value: "idea", label: "Idea / Suggestion", icon: Lightbulb, description: "Share a feature idea or improvement" },
  { value: "concern", label: "Concern / Issue", icon: AlertTriangle, description: "Report a problem or safety concern" },
  { value: "general", label: "General", icon: MessageSquare, description: "Anything else on your mind" },
];

const FeedbackPage = () => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({ title: "Please write a message", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      category,
      message: message.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Feedback submitted!", description: "Thanks for helping us improve." });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-display text-foreground mb-3">Thanks for Your Feedback!</h2>
          <p className="text-muted-foreground font-body mb-6">
            We read every message. Your input helps make JourneyNexus better for everyone.
          </p>
          <Button variant="hero" onClick={() => { setSubmitted(false); setMessage(""); }}>
            Submit Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium font-body">Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Share Your Thoughts
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-8">
            Have a question, concern, or idea? We'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-elevated p-8 space-y-6">
            <div className="space-y-3">
              <Label className="font-body font-medium text-foreground">What's this about?</Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      category === cat.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <cat.icon className={`w-5 h-5 mb-2 ${category === cat.value ? "text-primary" : "text-muted-foreground"}`} />
                    <p className={`text-sm font-display ${category === cat.value ? "text-foreground" : "text-muted-foreground"}`}>{cat.label}</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body font-medium text-foreground">Your message</Label>
              <Textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={2000}
                className="resize-none text-base"
              />
              <p className="text-xs text-muted-foreground text-right font-body">{message.length}/2000</p>
            </div>

            <Button variant="hero" size="xl" className="w-full" type="submit" disabled={submitting}>
              <Send className="w-5 h-5 mr-2" />
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;
