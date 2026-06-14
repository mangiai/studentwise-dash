import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireStaff } from "@/lib/auth-guards";
import { loadAdminPageData, SELECT_CONTENT_CLASS } from "@/lib/admin/shared";
import { adminCreateNotification } from "@/lib/supabase/data";

export const Route = createFileRoute("/admin/notifications")({
  head: () => pageHead("Send Notifications"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: loadAdminPageData,
  component: AdminNotifications,
});

const emptyForm = {
  target: "all_students" as "student" | "all_students" | "role",
  studentId: "",
  role: "student" as "student" | "teacher" | "admin" | "moderator",
  type: "announcement" as "fee" | "attendance" | "course" | "announcement",
  title: "",
  body: "",
};

function AdminNotifications() {
  const { students } = Route.useLoaderData();
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Enter a title and message");
      return;
    }
    if (form.target === "student" && !form.studentId) {
      toast.error("Select a student");
      return;
    }

    setSending(true);
    try {
      const result = await adminCreateNotification({
        data: {
          target: form.target,
          studentId: form.target === "student" ? form.studentId : undefined,
          role: form.target === "role" ? form.role : undefined,
          type: form.type,
          title: form.title.trim(),
          body: form.body.trim(),
        },
      });
      toast.success(`Notification sent to ${result.sent} recipient${result.sent === 1 ? "" : "s"}`);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send notification");
    } finally {
      setSending(false);
    }
  }

  return (
    <AdminLayout title="Notifications" subtitle="Send announcements and alerts to students or staff">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Compose notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSend}>
            <div className="grid gap-2">
              <Label>Target audience</Label>
              <Select
                value={form.target}
                onValueChange={(v) => setForm({ ...form, target: v as typeof form.target })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLASS}>
                  <SelectItem value="all_students">All students</SelectItem>
                  <SelectItem value="student">Specific student</SelectItem>
                  <SelectItem value="role">By role</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.target === "student" && (
              <div className="grid gap-2">
                <Label>Student</Label>
                <Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {form.target === "role" && (
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as typeof form.role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="moderator">Moderators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as typeof form.type })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLASS}>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notif-title">Title</Label>
              <Input
                id="notif-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Notification title"
                disabled={sending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notif-body">Message</Label>
              <Textarea
                id="notif-body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write your message..."
                rows={5}
                disabled={sending}
              />
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90 w-fit" disabled={sending}>
              <Send className="size-4" />
              {sending ? "Sending..." : "Send notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
