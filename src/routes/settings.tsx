import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { useAuthUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/settings")({
  head: () => pageHead("Settings"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  component: Settings,
});

function Settings() {
  const authUser = useAuthUser();
  const [fullName, setFullName] = useState(authUser?.fullName ?? "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [feeReminders, setFeeReminders] = useState(true);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Profile settings saved");
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
              <CardDescription>Update your display name and contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSaveProfile}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={authUser?.email ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={authUser?.role ?? ""} disabled className="capitalize" />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification preferences</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Update your password and session settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" placeholder="••••••••" />
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => toast.success("Password updated")}>
                Update password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
