import { motion } from "framer-motion";
import { Shield, Users, Activity, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [search, setSearch] = useState("");

  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, created_at")
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

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const filteredUsers = users?.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display text-foreground">Admin Dashboard</h1>
          </div>

          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users" className="font-body">
                <Users className="w-4 h-4 mr-2" /> Users
              </TabsTrigger>
              <TabsTrigger value="logs" className="font-body">
                <Activity className="w-4 h-4 mr-2" /> Audit Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                  />
                  <span className="text-sm text-muted-foreground ml-auto">{users?.length || 0} users</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-2 text-muted-foreground font-medium">Name</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Email</th>
                        <th className="py-3 px-2 text-muted-foreground font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers?.map((u) => (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2 text-foreground">{u.name || "—"}</td>
                          <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-2 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {!filteredUsers?.length && (
                        <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">No users found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

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
                          <td className="py-3 px-2 text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
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
    </div>
  );
};

export default AdminDashboard;
