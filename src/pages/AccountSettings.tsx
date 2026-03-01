import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Trash2, Mail, User, Camera, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CameraCapture from "@/components/CameraCapture";
import MFASettings from "@/components/MFASettings";

const AccountSettings = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    mutationFn: async (updates: { name?: string; bio?: string; marketing_opt_in?: boolean; avatar_url?: string }) => {
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

  const handlePhotoCapture = async (blob: Blob) => {
    if (!user) return;
    setUploading(true);
    try {
      const filePath = `${user.id}/profile-photo.jpg`;
      // Remove old photo first
      await supabase.storage.from("profile-photos").remove([filePath]);
      // Upload new photo
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, blob, { contentType: "image/jpeg", upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(filePath);

      // Add cache-buster to avoid stale images
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      await updateProfile.mutateAsync({ avatar_url: avatarUrl });
      setShowCamera(false);
      toast({ title: "Profile photo updated!" });
    } catch (err: any) {
      toast({ title: "Failed to upload photo", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) return;
    setDeleting(true);
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

          {/* Profile Photo Section */}
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-6 mb-6">
            <h2 className="text-xl font-display text-foreground flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" /> Profile Photo
            </h2>
            {!profile?.avatar_url && !showCamera && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-body font-medium">
                  ⚠️ Profile photo required — you must take a live photo before posting or joining trips.
                </p>
              </div>
            )}
            {showCamera ? (
              <CameraCapture
                onCapture={handlePhotoCapture}
                onCancel={() => setShowCamera(false)}
                existingPhotoUrl={profile?.avatar_url}
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Your profile photo"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-muted-foreground/30">
                    <Camera className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant={profile?.avatar_url ? "outline" : "hero"}
                  onClick={() => setShowCamera(true)}
                  disabled={uploading}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {profile?.avatar_url ? "Retake Photo" : "Take Profile Photo"}
                </Button>
                <p className="text-xs text-muted-foreground text-center font-body">
                  For safety, photos must be taken live — no uploads allowed.
                </p>
              </div>
            )}
          </div>

          {/* Profile Info */}
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

          {/* Communication */}
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

          {/* Security - 2FA */}
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-6 mb-6">
            <h2 className="text-xl font-display text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Two-Step Verification
            </h2>
            <MFASettings />
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-4 border border-destructive/20">
            <h2 className="text-xl font-display text-destructive flex items-center gap-2">
              <Shield className="w-5 h-5" /> Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Permanently delete your account and all associated data (trips, feedback). This action cannot be undone.
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
