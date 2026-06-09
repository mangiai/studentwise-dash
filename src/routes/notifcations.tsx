import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/notifcations")({
  beforeLoad: () => {
    throw redirect({ to: "/notifications" });
  },
  component: () => null,
});
