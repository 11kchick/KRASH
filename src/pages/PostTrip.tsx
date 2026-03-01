import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, ArrowRight, Check, Camera, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PostTrip = () => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [people, setPeople] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !people || !startDate || !endDate) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (endDate <= startDate) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    const weeks = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));

    const { data, error } = await supabase.from("trips").insert({
      user_id: user.id,
      destination: destination.trim(),
      people_count: Number(people),
      stay_weeks: weeks,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
    }).select("id").single();

    setSubmitting(false);

    if (error) {
      toast({ title: "Failed to post trip", description: error.message, variant: "destructive" });
      return;
    }

    setSubmitted(true);
    toast({ title: "Trip posted!", description: "Your group chat is ready." });

    // Navigate to chat after a moment
    setTimeout(() => navigate(`/trip/${data.id}/chat`), 2000);
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
            <strong>{people} {Number(people) === 1 ? "person" : "people"}</strong> heading to <strong>{destination}</strong>.
          </p>
          <p className="text-sm text-muted-foreground font-body mb-2">
            {startDate && endDate && `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`}
          </p>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Redirecting to your group chat...
          </p>
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
            Tell us the details and we'll set up your group.
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
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground font-body">You can be vague (just a state) or specific (city, state).</p>
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
              <p className="text-xs text-muted-foreground font-body">Include yourself and any under-18 travelers.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full h-12 justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM d, yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-body font-medium text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full h-12 justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM d, yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-body">
              Dates are flexible — other group members can suggest changes in the group chat.
            </p>

            <Button variant="hero" size="xl" className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post My Trip"} <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostTrip;
