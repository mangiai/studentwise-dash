import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import { fetchTeachersDirectory } from "@/lib/supabase/data";

export const Route = createFileRoute("/teachers")({
  head: () => pageHead("Teachers"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchTeachersDirectory(),
  component: Teachers,
});

function Teachers() {
  const { configured, teachers } = Route.useLoaderData();

  return (
    <AppLayout title="Faculty Directory" subtitle="Browse teachers from the live university database">
      {!configured && (
        <p className="text-sm text-muted-foreground mb-4">Supabase is not connected.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teachers.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">
            No teachers found. Run the seed script in Supabase SQL Editor (see supabase/seed-cloud-complete.sql).
          </p>
        )}
        {teachers.map((t) => {
          const initials = (t.name ?? "?")
            .split(" ")
            .filter(Boolean)
            .slice(-2)
            .map((p: string) => p[0])
            .join("")
            .toUpperCase();
          return (
          <Card key={t.id}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{t.id}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t.dept}</div>
                </div>
                <Badge variant={t.status === "Active" ? "secondary" : "outline"}>{t.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="size-4 shrink-0" />
                {t.courses} active courses
              </div>
              <Button variant="outline" size="sm" className="w-full">View profile</Button>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
