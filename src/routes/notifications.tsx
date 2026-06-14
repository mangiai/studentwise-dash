import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CalendarCheck2, Wallet, BookOpen, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import { fetchNotifications, markNotificationRead, markNotificationsRead } from "@/lib/supabase/data";
import { useRealtimeInvalidate } from "@/hooks/use-realtime-invalidate";

export const Route = createFileRoute("/notifications")({
  head: () => pageHead("Notifications"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchNotifications(),
  component: Notifications,
});

const iconMap = {
  fee: Wallet,
  attendance: CalendarCheck2,
  course: BookOpen,
  announcement: Megaphone,
};

function Notifications() {
  const router = useRouter();
  const { configured, notifications } = Route.useLoaderData();
  const unread = notifications.filter((n) => !n.read).length;

  useRealtimeInvalidate(["notifications"]);

  async function handleMarkAllRead() {
    try {
      await markNotificationsRead();
      toast.success("All notifications marked as read");
      await router.invalidate();
    } catch {
      toast.error("Could not update notifications");
    }
  }

  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead({ data: { id } });
      await router.invalidate();
    } catch {
      toast.error("Could not mark notification as read");
    }
  }

  return (
    <AppLayout title="Notifications" subtitle={`${unread} unread notification${unread === 1 ? "" : "s"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="size-4" />
          Updates from admin actions, fees, courses, and announcements
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>Mark all as read</Button>
        )}
      </div>

      <div className="space-y-3">
        {!configured && (
          <p className="text-sm text-muted-foreground">Supabase is not connected.</p>
        )}
        {notifications.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No notifications yet. Admin enrollments, grade posts, and fee challans will appear here automatically.
          </p>
        )}
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
                {!n.read && (
                  <Button variant="ghost" size="sm" onClick={() => handleMarkRead(n.id)}>
                    Mark read
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
