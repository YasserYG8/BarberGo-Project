"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { getMyUserProfile, updateMyUserProfile, uploadProfilePicture, sendVerificationEmail } from "@/lib/domain/profile";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ClientProfile() {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    emailVerified: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyUserProfile();
        setProfileForm({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          address: profile.address || "",
          email: profile.email || "",
          emailVerified: profile.emailVerified || false,
        });
      } catch {
        // Handle error if needed
      }
    };

    fetchProfile();
  }, []);

  const handleVerifyEmail = async () => {
    setSendingEmail(true);
    try {
      await sendVerificationEmail();
      toast("Verification email sent! Please check your inbox.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send verification email.";
      toast(message, "error");
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const { profilePicture } = await uploadProfilePicture(file);
      updateUser({ ...user, profilePicture } as any);
      toast("Profile picture updated successfully", "success");
    } catch (err: unknown) {
      toast("Failed to upload profile picture", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const submitProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSubmitting(true);
    try {
      const updated = await updateMyUserProfile({
        fullName: profileForm.fullName,
        phone: profileForm.phone || undefined,
        address: profileForm.address || undefined,
      });
      updateUser({
        ...user,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
      } as any);
      toast("Profile updated successfully", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast(message, "error");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "B";

  const avatarUrl = user?.profilePicture ? `http://localhost:8121${user.profilePicture}` : undefined;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-stone-50">
          Profile <span className="text-gradient-gold">Settings</span>
        </h1>
        <p className="text-stone-400 mt-1">Update your contact details for smoother bookings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Keep your information up to date so professionals can reach you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="size-24 border border-stone-800">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={user?.fullName} className="object-cover" />}
              <AvatarFallback className="bg-stone-900 text-stone-400 text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-stone-200">Profile Picture</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="relative cursor-pointer" disabled={uploadingPhoto}>
                  {uploadingPhoto ? "Uploading..." : <><Camera className="mr-2 size-4" /> Change Photo</>}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </Button>
              </div>
              <p className="text-xs text-stone-500">JPG, GIF or PNG. Max size of 5MB.</p>
            </div>
          </div>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitProfileUpdate}>
            <div className="sm:col-span-2 space-y-2">
              <Label>Email Address</Label>
              <div className="flex gap-3">
                <Input
                  value={profileForm.email}
                  disabled
                  className="bg-stone-900 text-stone-400"
                />
                {!profileForm.emailVerified ? (
                  <Button type="button" variant="outline" onClick={handleVerifyEmail} disabled={sendingEmail}>
                    {sendingEmail ? "Sending..." : "Verify Email"}
                  </Button>
                ) : (
                  <Button type="button" variant="outline" disabled className="text-emerald-500 border-emerald-500/20">
                    Verified
                  </Button>
                )}
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Full name"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="Phone number"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                placeholder="Address"
                value={profileForm.address}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={profileSubmitting}>
                {profileSubmitting ? "Saving..." : "Save profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
