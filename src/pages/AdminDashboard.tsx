import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Activity, Search, MapPin, ShieldAlert, BarChart3, Ban, Unlock, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [tripSearch, setTripSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // ─── Queries ───
  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, avatar_url, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: logs } = useQuery({
    queryKey: ["admin-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: violations } = useQuery({
    queryKey: ["admin-violations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_violations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      // Enrich with user names
      const userIds = [...new Set(data.map((v: any) => v.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds);
      return data.map((v: any) => ({
        ...v,
        profile: profiles?.find((p: any) => p.id === v.user_id),
      }));
    },
    enabled: isAdmin,
  });

  const { data: restrictions } = useQuery({
    queryKey: ["admin-restrictions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_restrictions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set(data.map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds);
      return data.map((r: any) => ({
        ...r,
        profile: profiles?.find((p: any) => p.id === r.user_id),
      }));
    },
    enabled: isAdmin,
  });

  const { data: trips } = useQuery({
    queryKey: ["admin-trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set(data.map((t: any) => t.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);
      // Get member counts
      const tripIds = data.map((t: any) => t.id);
      const { data: members } = await supabase
        .from("trip_members")
        .select("trip_id")
        .in("trip_id", tripIds);
      const memberCounts: Record<string, number> = {};
      members?.forEach((m: any) => {
        memberCounts[m.trip_id] = (memberCounts[m.trip_id] || 0) + 1;
      });
      return data.map((t: any) => ({
        ...t,
        owner: profiles?.find((p: any) => p.id === t.user_id),
        memberCount: memberCounts[t.id] || 0,
      }));
    },
    enabled: isAdmin,
  });

  // ─── Mutations ───
  const liftRestriction = useMutation({
    mutationFn: async (restrictionId: string) => {
      const { error } = await supabase
        .from("chat_restrictions")
        .delete()
        .eq("id", restrictionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-restrictions"] });
      toast({ title: "Restriction lifted" });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: async (tripId: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", tripId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trips"] });
      toast({ title: "Trip deleted" });
    },
  });

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const filteredUsers = users?.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTrips = trips?.filter(
    (t: any) => t.destination.toLowerCase().includes(tripSearch.toLowerCase()) || t.owner?.name?.toLowerCase().includes(tripSearch.toLowerCase())
  );

  // Stats
  const totalUsers = users?.length || 0;
  const totalTrips = trips?.length || 0;
  const totalViolations = violations?.length || 0;
  const activeRestrictions = restrictions?.filter((r: any) =>
    r.is_permanent || (r.restricted_until && new Date(r.restricted_until) > new Date())
  ).length || 0;

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display text-foreground">Admin Dashboard</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: totalUsers, icon: Users, color: "text-primary" },
              { label: "Total Trips", value: totalTrips, icon: MapPin, color: "text-accent-foreground" },
              { label: "Violations", value: totalViolations, icon: ShieldAlert, color: "text-destructive" },
              { label: "Active Bans", value: activeRestrictions, icon: Ban, color: "text-destructive" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl shadow-card p-5">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground font-body">{stat.label}</span>
                </div>
                <p className="text-2xl font-display text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="users">
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="users" className="font-body"><Users className="w-4 h-4 mr-2" /> Users</TabsTrigger>
              <TabsTrigger value="moderation" className="font-body"><ShieldAlert className="w-4 h-4 mr-2" /> Moderation</TabsTrigger>
              <TabsTrigger value="trips" className="font-body"><MapPin className="w-4 h-4 mr-2" /> Trips</TabsTrigger>
              <TabsTrigger value="logs" className="font-body"><Activity className="w-4 h-4 mr-2" /> Audit Logs</TabsTrigger>
            </TabsList>

            {/* ─── Users Tab ─── */}
            <TabsContent value="users">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
                  <span className="text-sm text-muted-foreground ml-auto">{filteredUsers?.length || 0} users</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-2 text-muted-foreground font-medium">User</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Email</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Joined</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Photo</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers?.map((u) => (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2 text-foreground font-medium">{u.name || "—"}</td>
                          <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-2 text-muted-foreground">{format(new Date(u.created_at), "MMM d, yyyy")}</td>
                          <td className="py-3 px-2">
                            {u.avatar_url ? (
                              <Badge variant="outline" className="text-xs">✓ Verified</Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">Missing</Badge>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)}>
                              <Eye className="w-3 h-3 mr-1" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {!filteredUsers?.length && (
                        <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No users found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* ─── Moderation Tab ─── */}
            <TabsContent value="moderation">
              <div className="space-y-6">
                {/* Active Restrictions */}
                <div className="bg-card rounded-2xl shadow-card p-6">
                  <h3 className="font-display text-foreground mb-4 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-destructive" /> Active Restrictions ({activeRestrictions})
                  </h3>
                  {restrictions?.filter((r: any) =>
                    r.is_permanent || (r.restricted_until && new Date(r.restricted_until) > new Date())
                  ).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No active restrictions.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-body">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-3 px-2 text-muted-foreground font-medium">User</th>
                            <th className="py-3 px-2 text-muted-foreground font-medium">Type</th>
                            <th className="py-3 px-2 text-muted-foreground font-medium">Reason</th>
                            <th className="py-3 px-2 text-muted-foreground font-medium">Until</th>
                            <th className="py-3 px-2 text-muted-foreground font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {restrictions
                            ?.filter((r: any) => r.is_permanent || (r.restricted_until && new Date(r.restricted_until) > new Date()))
                            .map((r: any) => (
                              <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                                <td className="py-3 px-2 text-foreground">{r.profile?.name || r.profile?.email || "Unknown"}</td>
                                <td className="py-3 px-2">
                                  <Badge variant={r.is_permanent ? "destructive" : "outline"}>
                                    {r.is_permanent ? "Permanent" : "Temporary"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-2 text-muted-foreground text-xs max-w-[200px] truncate">{r.reason}</td>
                                <td className="py-3 px-2 text-muted-foreground">
                                  {r.is_permanent ? "Never" : format(new Date(r.restricted_until), "MMM d, h:mm a")}
                                </td>
                                <td className="py-3 px-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => liftRestriction.mutate(r.id)}
                                    disabled={liftRestriction.isPending}
                                  >
                                    <Unlock className="w-3 h-3 mr-1" /> Lift
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Recent Violations */}
                <div className="bg-card rounded-2xl shadow-card p-6">
                  <h3 className="font-display text-foreground mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-destructive" /> Recent Violations ({totalViolations})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="py-3 px-2 text-muted-foreground font-medium">User</th>
                          <th className="py-3 px-2 text-muted-foreground font-medium">Type</th>
                          <th className="py-3 px-2 text-muted-foreground font-medium">Content (preview)</th>
                          <th className="py-3 px-2 text-muted-foreground font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {violations?.map((v: any) => (
                          <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-2 text-foreground">{v.profile?.name || "Unknown"}</td>
                            <td className="py-3 px-2">
                              <Badge variant="outline" className="text-xs capitalize">{v.reason}</Badge>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground text-xs max-w-[250px] truncate">
                              {v.blocked_content.substring(0, 50)}…
                            </td>
                            <td className="py-3 px-2 text-muted-foreground text-xs">
                              {format(new Date(v.created_at), "MMM d, h:mm a")}
                            </td>
                          </tr>
                        ))}
                        {!violations?.length && (
                          <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No violations yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ─── Trips Tab ─── */}
            <TabsContent value="trips">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search trips..." value={tripSearch} onChange={(e) => setTripSearch(e.target.value)} className="max-w-xs" />
                  <span className="text-sm text-muted-foreground ml-auto">{filteredTrips?.length || 0} trips</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-2 text-muted-foreground font-medium">Destination</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Owner</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Dates</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Members</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrips?.map((t: any) => (
                        <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2 text-foreground font-medium">{t.destination}</td>
                          <td className="py-3 px-2 text-muted-foreground">{t.owner?.name || "Unknown"}</td>
                          <td className="py-3 px-2 text-muted-foreground text-xs">
                            {t.start_date ? format(new Date(t.start_date), "MMM d") : "—"}
                            {t.end_date ? ` → ${format(new Date(t.end_date), "MMM d, yyyy")}` : ""}
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline">{t.memberCount}/{t.people_count}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm(`Delete trip to ${t.destination}? This cannot be undone.`)) {
                                  deleteTrip.mutate(t.id);
                                }
                              }}
                            >
                              <Trash2 className="w-3 h-3 mr-1" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {!filteredTrips?.length && (
                        <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No trips found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* ─── Audit Logs Tab ─── */}
            <TabsContent value="logs">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-2 text-muted-foreground font-medium">Action</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Table</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs?.map((log) => (
                        <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2 text-foreground">{log.action}</td>
                          <td className="py-3 px-2 text-muted-foreground">{log.target_table || "—"}</td>
                          <td className="py-3 px-2 text-muted-foreground">{format(new Date(log.created_at), "MMM d, h:mm a")}</td>
                        </tr>
                      ))}
                      {!logs?.length && (
                        <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">No audit logs yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">User Details</DialogTitle>
            <DialogDescription>View user profile information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedUser.avatar_url ? (
                  <img src={selectedUser.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-display text-muted-foreground">
                    {selectedUser.name?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <p className="font-display text-foreground text-lg">{selectedUser.name || "No name"}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-body space-y-1">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Joined:</strong> {format(new Date(selectedUser.created_at), "MMMM d, yyyy")}</p>
                <p><strong>Photo:</strong> {selectedUser.avatar_url ? "Uploaded" : "Not uploaded"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
