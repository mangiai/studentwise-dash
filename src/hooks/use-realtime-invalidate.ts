import { useEffect, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuthUser } from "@/hooks/use-auth";

type RealtimeTable =
  | "enrollments"
  | "notifications"
  | "semester_fees"
  | "course_grades"
  | "attendance_records";

function tableFilter(
  table: RealtimeTable,
  userId: string,
  studentId?: string | null,
) {
  if (table === "notifications") return `user_id=eq.${userId}`;
  if (studentId && (table === "enrollments" || table === "semester_fees" || table === "course_grades")) {
    return `student_id=eq.${studentId}`;
  }
  return undefined;
}

export function useRealtimeInvalidate(tables: RealtimeTable[], studentId?: string | null) {
  const router = useRouter();
  const authUser = useAuthUser();
  const tablesKey = useMemo(() => [...tables].sort().join(","), [tables]);

  useEffect(() => {
    if (!isSupabaseConfigured() || !authUser) return;

    const supabase = getSupabaseBrowserClient();
    const channelName = `portal-sync-${authUser.id}-${tablesKey}`;
    const channel = supabase.channel(channelName);

    for (const table of tablesKey.split(",") as RealtimeTable[]) {
      const filter = tableFilter(table, authUser.id, studentId);
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        () => {
          void router.invalidate();
        },
      );
    }

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [authUser?.id, router, studentId, tablesKey]);
}
