import { Link, useRouter } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUnreadNotificationCount } from "@/lib/supabase/data";

export function NotificationBell() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    void fetchUnreadNotificationCount().then((result) => {
      if (active) setCount(result.count);
    });
    return () => {
      active = false;
    };
  }, [router.state.location.pathname]);

  return (
    <Link to="/notifications" className="relative p-2 rounded-md hover:bg-muted">
      <Bell className="size-5 text-muted-foreground" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold grid place-content-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
