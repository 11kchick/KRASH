import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { format, isPast, addDays } from "date-fns";

const MyTrips = () => {
  const { user, loading } = useAuth();

  const { data: memberships, isLoading } = useQuery({
    queryKey: ["my-trips", user?.id],
    queryFn: async () => {
      // Get all trips user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from("trip_members")
        .select("trip_id, joined_at")
        .eq("user_id", user!.id);
      if (memberError) throw memberError;
      if (!memberData?.length) return [];

      const tripIds = memberData.map((m: any) => m.trip_id);

      // Get trip details
      const { data: trips, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .in("id", tripIds)
        .order("created_at", { ascending: false });
      if (tripError) throw tripError;

      // Get member counts and profiles for each trip
      const results = await Promise.all(
        (trips || []).map(async (trip: any) => {
          const { data: members } = await supabase
            .from("trip_members")
            .select("user_id")
            .eq("trip_id", trip.id);

          const userIds = members?.map((m: any) => m.user_id) || [];
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, name, avatar_url")
            .in("id", userIds);

          return {
            ...trip,
            memberCount: members?.length || 0,
            members: profiles || [],
            isOwner: trip.user_id === user!.id,
          };
        })
      );

      return results;
    },
    enabled: !!user,
  });

  if (loading || isLoading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;

  const now = new Date();
  const activeTrips = memberships?.filter((t: any) => !t.end_date || !isPast(addDays(new Date(t.end_date), 30))) || [];
  const pastTrips = memberships?.filter((t: any) => t.end_date && isPast(addDays(new Date(t.end_date), 30))) || [];

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-3">My Trips</h1>
          <p className="text-muted-foreground font-body text-lg">
            Your current and past trips — and the people you traveled with.
          </p>
        </motion.div>

        {(!memberships || memberships.length === 0) && (
          <div className="text-center py-16">
            <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-body text-lg mb-4">You haven't joined any trips yet.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/post"><Button variant="hero">Post a Trip</Button></Link>
              <Link to="/browse"><Button variant="warm">Browse Trips</Button></Link>
            </div>
          </div>
        )}

        {activeTrips.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-display text-foreground mb-4">Active Trips</h2>
            <div className="space-y-4">
              {activeTrips.map((trip: any) => (
                <TripCard key={trip.id} trip={trip} userId={user.id} chatActive />
              ))}
            </div>
          </div>
        )}

        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-xl font-display text-foreground mb-4">Past Trips</h2>
            <div className="space-y-4">
              {pastTrips.map((trip: any) => (
                <TripCard key={trip.id} trip={trip} userId={user.id} chatActive={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TripCard = ({ trip, userId, chatActive }: { trip: any; userId: string; chatActive: boolean }) => {
  const tripEnded = trip.end_date && isPast(new Date(trip.end_date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl shadow-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg text-foreground">{trip.destination}</h3>
            {trip.isOwner && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body">Owner</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
            {trip.start_date && trip.end_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(trip.start_date), "MMM d")} – {format(new Date(trip.end_date), "MMM d, yyyy")}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {trip.memberCount} members
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tripEnded && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-body">
              {chatActive ? "Chat: read-only soon" : "Archived"}
            </span>
          )}
          <Link to={`/trip/${trip.id}/chat`}>
            <Button variant={chatActive ? "hero" : "outline"} size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              {chatActive ? "Open Chat" : "View Chat"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Member avatars and names */}
      <div className="flex items-center gap-2 flex-wrap">
        {trip.members.map((member: any) => (
          <div
            key={member.id}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs font-body"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden bg-muted">
              {member.avatar_url ? (
                <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-display text-muted-foreground">
                  {member.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <span className="text-foreground">{member.id === userId ? "You" : member.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyTrips;
