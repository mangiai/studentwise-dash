import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CalendarCheck2, Wallet, BookOpen, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/notifications")({
  head: () => pageHead("Notifications"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  component: Notifications,
});

const notifications = [
  { id: 1, type: "fee", title: "Fee payment reminder", body: "Spring semester fee is due by March 15, 2026.", time: "2 hours ago", read: false },
  { id: 2, type: "attendance", title: "Short attendance alert", body: "Operating Systems attendance is below 75%.", time: "Yesterday", read: false },
  { id: 3, type: "course", title: "New assignment posted", body: "Software Engineering — Project milestone 2 is now live.", time: "2 days ago", read: true },
  { id: 4, type: "announcement", title: "Spring break schedule", body: "Campus will be closed March 20–27 for spring break.", time: "3 days ago", read: true },
  { id: 5, type: "course", title: "Exam timetable updated", body: "Final exam schedule for CS department has been published.", time: "1 week ago", read: true },
];

const iconMap = {
  fee: Wallet,
  attendance: CalendarCheck2,
  course: BookOpen,
  announcement: Megaphone,
};

function Notifications() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout title="Notifications" subtitle={`${unread} unread notification${unread === 1 ? "" : "s"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="size-4" />
          Stay updated on fees, attendance, and announcements
        </div>
        <Button variant="outline" size="sm">Mark all as read</Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon = iconMap[n.type as keyof typeof iconMap] ?? Bell;
          return (
            <Card key={n.id} className={cn(!n.read && "border-primary/30 bg-primary/[0.02]")}>
              <CardContent className="p-4 flex gap-4">
                <div className="size-10 rounded-lg bg-muted grid place-content-center shrink-0">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{n.title}</div>
                    {!n.read && <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
                  <div className="text-xs text-muted-foreground mt-2">{n.time}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
