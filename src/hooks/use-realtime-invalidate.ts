import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuthUser } from "@/hooks/use-auth";

type RealtimeTable =
  | "enrollments"
  | "notifications"
  | "semester_fees"
  | "course_grades"
  | "attendance_records";

export function useRealtimeInvalidate(tables: RealtimeTable[], studentId?: string | null) {
  const router = useRouter();
  const authUser = useAuthUser();

  useEffect(() => {
    if (!isSupabaseConfigured() || !authUser) return;

    const supabase = getSupabaseBrowserClient();
    const channel = supabase.channel(`portal-sync-${authUser.id}`);

    for (const table of tables) {
      const filter =
        table === "enrollments" && studentId
          ? `student_id=eq.${studentId}`
          : table === "notifications"
            ? `user_id=eq.${authUser.id}`
            : table === "semester_fees" && studentId
              ? `student_id=eq.${studentId}`
              : table === "course_grades" && studentId
                ? `student_id=eq.${studentId}`
                : undefined;

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

    void channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [authUser, router, studentId, tables]);
}
