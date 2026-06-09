import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, BookOpen } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/teachers")({
  head: () => pageHead("Teachers"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  component: Teachers,
});

const teachers = [
  { id: "FAC-2018-014", name: "Dr. Aamir Khan", dept: "Computer Science", courses: 3, email: "aamir.khan@university.edu", phone: "+92 300 1112233", status: "Active" },
  { id: "FAC-2015-008", name: "Prof. Sana Ali", dept: "Computer Science", courses: 2, email: "sana.ali@university.edu", phone: "+92 300 2223344", status: "Active" },
  { id: "FAC-2020-031", name: "Dr. Hamza Saeed", dept: "Computer Science", courses: 4, email: "hamza.saeed@university.edu", phone: "+92 300 3334455", status: "Active" },
  { id: "FAC-2017-022", name: "Dr. Maria Iqbal", dept: "Computer Science", courses: 2, email: "maria.iqbal@university.edu", phone: "+92 300 4445566", status: "On Leave" },
  { id: "FAC-2019-017", name: "Prof. Nida Rauf", dept: "Mathematics", courses: 2, email: "nida.rauf@university.edu", phone: "+92 300 5556677", status: "Active" },
];

function Teachers() {
  return (
    <AppLayout title="Faculty Directory" subtitle="Browse teachers and contact information for your courses">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {t.name.split(" ").slice(-2).map((p) => p[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{t.id}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t.dept}</div>
                </div>
                <Badge variant={t.status === "Active" ? "secondary" : "outline"}>{t.status}</Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 shrink-0" />
                  {t.courses} active courses
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0" />
                  {t.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  {t.phone}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
