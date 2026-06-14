import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import {
  fetchUserSettings,
  updateUserProfile,
  updateNotificationPreferences,
  changeUserPassword,
} from "@/lib/supabase/data";

export const Route = createFileRoute("/settings")({
  head: () => pageHead("Settings"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchUserSettings(),
  component: Settings,
});

function Settings() {
  const router = useRouter();
  const { settings } = Route.useLoaderData();

  const [fullName, setFullName] = useState(settings?.fullName ?? "");
  const [emailNotifs, setEmailNotifs] = useState(settings?.notifyEmail ?? true);
  const [pushNotifs, setPushNotifs] = useState(settings?.notifyPush ?? true);
  const [feeReminders, setFeeReminders] = useState(settings?.notifyFeeReminders ?? true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFullName(settings.fullName);
      setEmailNotifs(settings.notifyEmail);
      setPushNotifs(settings.notifyPush);
      setFeeReminders(settings.notifyFeeReminders);
    }
  }, [settings]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({ data: { fullName: fullName.trim() } });
      toast.success("Profile updated");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNotifications() {
    setSaving(true);
    try {
      await updateNotificationPreferences({
        data: {
          notifyEmail: emailNotifs,
          notifyPush: pushNotifs,
          notifyFeeReminders: feeReminders,
        },
      });
      toast.success("Notification preferences saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save preferences");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordUpdate() {
    if (!currentPassword || !newPassword) {
      toast.error("Enter current and new password");
      return;
    }
    setSaving(true);
    try {
      await changeUserPassword({ data: { currentPassword, newPassword } });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout title="Settings" subtitle="Manage your account and notification preferences">
      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile information</CardTitle>
              <CardDescription>Update your display name. Email is managed by your login account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSaveProfile}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={settings?.email ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={settings?.role ?? ""} disabled className="capitalize" />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={saving}>
                  Save changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification preferences</CardTitle>
              <CardDescription>Stored in your profile and used for in-app alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "email", label: "Email notifications", desc: "Receive updates via email", checked: emailNotifs, onChange: setEmailNotifs },
                { id: "push", label: "Push notifications", desc: "Browser alerts for urgent items", checked: pushNotifs, onChange: setPushNotifs },
                { id: "fees", label: "Fee reminders", desc: "Reminders before payment deadlines", checked: feeReminders, onChange: setFeeReminders },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
              ))}
              <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveNotifications} disabled={saving}>
                Save preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Update your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={handlePasswordUpdate} disabled={saving}>
                Update password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
