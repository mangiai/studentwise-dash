import { useRouteContext } from "@tanstack/react-router";

/** Same value on server and client — set in root beforeLoad from runtime env. */
export function useSupabaseConfigured(): boolean {
  return useRouteContext({ from: "__root__", select: (c) => c.supabaseConfigured });
}
