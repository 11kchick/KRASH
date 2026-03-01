import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, ArrowRight, Check, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";

const PostTrip = () => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [destination, setDestination] = useState("");
  const [people, setPeople] = useState("");
  const [weeks, setWeeks] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading || profileLoading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;

  const hasProfilePhoto = !!profile?.avatar_url;

  if (!hasProfilePhoto) {
    return (
      <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center p-8 bg-card rounded-2xl shadow-elevated"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Camera className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-display text-foreground mb-3">Profile Photo Required</h2>
          <p className="text-muted-foreground font-body mb-6">
            For the safety of all travelers, you must take a live profile photo before posting a trip. Head to your account settings to capture one.
          </p>
          <Link to="/account">
            <Button variant="hero" size="lg">
              <Camera className="w-5 h-5 mr-2" /> Go to Account Settings
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !people || !weeks) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Trip posted!", description: "We'll match you with travelers heading the same way." });
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
          <h2 className="text-2xl font-display text-foreground mb-3">Trip Posted!</h2>
          <p className="text-muted-foreground font-body mb-2">
            <strong>{people} {Number(people) === 1 ? "person" : "people"}</strong> heading to <strong>{destination}</strong> for <strong>{weeks} {Number(weeks) === 1 ? "week" : "weeks"}</strong>.
          </p>
          <p className="text-sm text-muted-foreground font-body mb-6">
            We'll notify you when travelers match with your trip.
          </p>
          <Button variant="hero" onClick={() => setSubmitted(false)}>
            Post Another Trip
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">Post Your Trip</h1>
          <p className="text-muted-foreground font-body text-lg mb-8">
            Just three things — that's all we need to find your match.
          </p>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-elevated p-8 space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Where are you going?
              </Label>
              <Input
                placeholder="e.g. Colorado, Austin TX, Miami..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                <Users className="w-4 h-4 text-primary" />
                How many people in your group?
              </Label>
              <Input
                type="number"
                min="1"
                max="20"
                placeholder="e.g. 2"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                How long are you staying? (weeks)
              </Label>
              <Input
                type="number"
                min="1"
                max="52"
                placeholder="e.g. 3"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <Button variant="hero" size="xl" className="w-full" type="submit">
              Post My Trip <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostTrip;
