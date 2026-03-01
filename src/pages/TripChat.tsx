import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, AlertTriangle, Users, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Navigate, Link } from "react-router-dom";
import { format } from "date-fns";

interface Message {
  id: string;
  trip_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: { name: string; avatar_url: string | null };
}

interface Member {
  user_id: string;
  joined_at: string;
  profile?: { name: string; avatar_url: string | null };
}

const TripChat = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch trip info
  const { data: trip } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });

  // Check membership
  const { data: membership, isLoading: membershipLoading } = useQuery({
    queryKey: ["trip-membership", tripId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_members")
        .select("*")
        .eq("trip_id", tripId!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!tripId && !!user,
  });

  // Fetch members with profiles
  const { data: members } = useQuery({
    queryKey: ["trip-members", tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_members")
        .select("user_id, joined_at")
        .eq("trip_id", tripId!);
      if (error) throw error;

      // Fetch profiles for members
      const userIds = data.map((m: any) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", userIds);

      return data.map((m: any) => ({
        ...m,
        profile: profiles?.find((p: any) => p.id === m.user_id),
      })) as Member[];
    },
    enabled: !!tripId && !!membership,
  });

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ["trip-messages", tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_messages")
        .select("*")
        .eq("trip_id", tripId!)
        .order("created_at", { ascending: true });
      if (error) throw error;

      // Fetch profiles for message authors
      const userIds = [...new Set(data.map((m: any) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", userIds);

      return data.map((m: any) => ({
        ...m,
        profile: profiles?.find((p: any) => p.id === m.user_id),
      })) as Message[];
    },
    enabled: !!tripId && !!membership,
  });

  // Realtime subscription
  useEffect(() => {
    if (!tripId || !membership) return;

    const channel = supabase
      .channel(`trip-messages-${tripId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trip_messages",
          filter: `trip_id=eq.${tripId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["trip-messages", tripId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, membership, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !tripId) return;
    setSending(true);
    await supabase.from("trip_messages").insert({
      trip_id: tripId,
      user_id: user.id,
      content: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  if (authLoading || membershipLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!membership) {
    return (
      <div className="min-h-screen bg-gradient-warm pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center p-8 bg-card rounded-2xl shadow-elevated"
        >
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-display text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground font-body mb-6">
            You're not a member of this trip group. You need to join the trip first.
          </p>
          <Link to="/browse">
            <Button variant="hero">Browse Trips</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pt-16 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/browse" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {trip?.destination || "Trip Chat"}
              </h1>
              <p className="text-xs text-muted-foreground font-body">
                <Users className="w-3 h-3 inline mr-1" />
                {members?.length || 0} members
              </p>
            </div>
          </div>

          {/* Member avatars */}
          <div className="flex -space-x-2">
            {members?.slice(0, 5).map((m) => (
              <div key={m.user_id} className="w-8 h-8 rounded-full border-2 border-card overflow-hidden bg-muted">
                {m.profile?.avatar_url ? (
                  <img src={m.profile.avatar_url} alt={m.profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-display text-muted-foreground">
                    {m.profile?.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
            ))}
            {(members?.length || 0) > 5 && (
              <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-body text-muted-foreground">
                +{(members?.length || 0) - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-xs text-destructive font-body">
            <strong>Safety reminder:</strong> Do not share sensitive personal information (bank details, Social Security numbers, passwords, etc.) in this chat unless you are fully comfortable doing so. JourneyNexus is not liable for any information you choose to share.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {(!messages || messages.length === 0) && (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-body">No messages yet. Start the conversation!</p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Discuss accommodations, prices, and get to know your travel group.
              </p>
            </div>
          )}

          {messages?.map((msg) => {
            const isMe = msg.user_id === user.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {msg.profile?.avatar_url ? (
                    <img src={msg.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-display text-muted-foreground">
                      {msg.profile?.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className={`max-w-[70%] ${isMe ? "text-right" : ""}`}>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={`text-xs font-display text-foreground ${isMe ? "ml-auto" : ""}`}>
                      {isMe ? "You" : msg.profile?.name || "Unknown"}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-body">
                      {format(new Date(msg.created_at), "h:mm a")}
                    </span>
                  </div>
                  <div
                    className={`inline-block px-3.5 py-2 rounded-2xl text-sm font-body leading-relaxed ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card shadow-card text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border px-4 py-3">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-11"
            maxLength={2000}
            autoFocus
          />
          <Button
            variant="hero"
            size="icon"
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="h-11 w-11 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TripChat;
