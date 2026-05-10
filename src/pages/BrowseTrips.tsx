import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, formatDistanceToNow } from "date-fns";

interface Trip {
  id: string;
  destination: string;
  people_count: number;
  stay_weeks: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  user_id: string;
  poster_name: string;
  member_count: number;
}

const TripCard = ({ trip }: { trip: Trip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-display text-lg text-foreground">{trip.destination}</h3>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Posted by {trip.poster_name || "Traveler"} · {formatDistanceToNow(new Date(trip.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="px-2 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-medium font-body">
            {trip.member_count} joined
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-sm font-semibold text-foreground">{trip.people_count}</p>
            <p className="text-xs text-muted-foreground">people</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-sm font-semibold text-foreground">{trip.stay_weeks}</p>
            <p className="text-xs text-muted-foreground">{trip.stay_weeks === 1 ? "week" : "weeks"}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <p className="text-xs font-semibold text-foreground">
              {trip.start_date ? format(new Date(trip.start_date), "MMM d") : "TBD"}
            </p>
            <p className="text-xs text-muted-foreground">
              {trip.end_date ? format(new Date(trip.end_date), "MMM d") : ""}
            </p>
          </div>
        </div>

        <Link to={`/trip/${trip.id}/chat`}>
          <Button variant="teal" className="w-full" size="sm">
            View Trip <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const BrowseTrips = () => {
  const [search, setSearch] = useState("");
  const { data: trips = [], isLoading } = useQuery({
    queryKey: ["browse-trips"],
    queryFn: async () => {
      const { data: tripsData, error } = await supabase
        .from("trips")
        .select("id, destination, people_count, stay_weeks, start_date, end_date, created_at, user_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!tripsData || tripsData.length === 0) return [];

      const userIds = [...new Set(tripsData.map((t) => t.user_id))];
      const tripIds = tripsData.map((t) => t.id);

      const [{ data: profiles }, { data: members }] = await Promise.all([
        supabase.from("profiles_safe").select("id, name").in("id", userIds),
        supabase.from("trip_members").select("trip_id").in("trip_id", tripIds),
      ]);

      const nameMap = new Map((profiles ?? []).map((p: any) => [p.id, p.name]));
      const countMap = new Map<string, number>();
      (members ?? []).forEach((m: any) => {
        countMap.set(m.trip_id, (countMap.get(m.trip_id) ?? 0) + 1);
      });

      return tripsData.map((t) => ({
        ...t,
        poster_name: nameMap.get(t.user_id) ?? "Traveler",
        member_count: countMap.get(t.id) ?? 0,
      })) as Trip[];
    },
  });

  const filtered = trips.filter((t) =>
    t.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">
            Browse Trips
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-6">
            Find travelers heading your way and join them.
          </p>
          {user && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search by destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                aria-label="Search trips by destination"
              />
            </div>
          )}
        </motion.div>

        {!authLoading && !user ? (
          <div className="text-center py-16 bg-card rounded-2xl shadow-card max-w-xl mx-auto p-8">
            <h2 className="text-2xl font-display text-foreground mb-3">Sign in to browse trips</h2>
            <p className="text-muted-foreground font-body mb-6">
              You need an account to view and join trips posted by other travelers.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="lg">Sign In or Create Account</Button>
            </Link>
          </div>
        ) : isLoading || authLoading ? (
          <p className="text-center text-muted-foreground font-body py-16">Loading trips...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body text-lg mb-2">
              {trips.length === 0 ? "No trips have been posted yet." : "No trips found for that destination."}
            </p>
            <p className="text-sm text-muted-foreground font-body mb-4">
              {trips.length === 0 && "Be the first to post a trip and start matching with travelers."}
            </p>
            <Link to="/post">
              <Button variant="hero" size="lg">
                Post Your Own Trip
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseTrips;
