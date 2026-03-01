import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Trash2, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AccountSettings = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const { data: profile, isLoading } = useQuery({
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

  const updateProfile = useMutation({
    mutationFn: async (updates: { name?: string; bio?: string; marketing_opt_in?: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Profile updated" });
    },
  });

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) return;
    setDeleting(true);
    // Delete profile (cascades to trips, donations via FK)
    const { error } = await supabase.from("profiles").delete().eq("id", user!.id);
    if (error) {
      toast({ title: "Error deleting account", description: error.message, variant: "destructive" });
      setDeleting(false);
      return;
    }
    await signOut();
    navigate("/");
    toast({ title: "Account deleted" });
  };

  if (loading || isLoading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-16">
      <div className="max-w-xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display text-foreground mb-8">Account Settings</h1>

          <div className="bg-card rounded-2xl shadow-card p-8 space-y-6 mb-6">
            <h2 className="text-xl font-display text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">Name</Label>
                <Input
                  defaultValue={profile?.name || ""}
                  onBlur={(e) => updateProfile.mutate({ name: e.target.value })}
                  className="h-12"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">Email</Label>
                <Input value={user.email || ""} disabled className="h-12 bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">Bio</Label>
                <Input
                  defaultValue={profile?.bio || ""}
                  onBlur={(e) => updateProfile.mutate({ bio: e.target.value })}
                  className="h-12"
                  placeholder="Tell travelers about yourself"
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-8 space-y-6 mb-6">
            <h2 className="text-xl font-display text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Communication
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-foreground">Marketing emails</p>
                <p className="text-sm text-muted-foreground">Receive trip suggestions and updates</p>
              </div>
              <Switch
                checked={profile?.marketing_opt_in || false}
                onCheckedChange={(checked) => updateProfile.mutate({ marketing_opt_in: checked })}
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-8 space-y-4 border border-destructive/20">
            <h2 className="text-xl font-display text-destructive flex items-center gap-2">
              <Shield className="w-5 h-5" /> Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Permanently delete your account and all associated data (trips, donations). This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountSettings;
