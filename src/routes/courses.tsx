import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, BookOpen, ChevronRight } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import { fetchStudentCourses } from "@/lib/supabase/data";

export const Route = createFileRoute("/courses")({
  head: () => pageHead("Courses"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentCourses(),
  component: Courses,
});

function attBadge(att: number) {
  if (att < 75) return <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15 border-0"><AlertTriangle className="size-3 mr-1" />Short Attendance</Badge>;
  if (att < 85) return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15 border-0">At Risk</Badge>;
  return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 border-0">On Track</Badge>;
}

function Courses() {
  const { configured, courses } = Route.useLoaderData();
  const credits = courses.reduce((a, c) => a + c.credits, 0);

  return (
    <AppLayout title="Enrolled Courses" subtitle={`${courses.length} active courses · ${credits} credit hours this semester`}>
      {!configured && <p className="text-sm text-muted-foreground mb-4">Supabase not configured.</p>}
      {courses.length === 0 && (
        <p className="text-sm text-muted-foreground">No courses enrolled for Spring 2026.</p>
      )}
      <Tabs defaultValue="cards" className="w-full">
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((c) => (
              <Card key={c.code} className="overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground font-mono">{c.code}</div>
                      <div className="font-semibold mt-0.5">{c.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{c.teacher}</div>
                    </div>
                    <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-content-center"><BookOpen className="size-5" /></div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant="outline">{c.credits} credits</Badge>
                    {attBadge(c.att)}
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className={`font-medium ${c.att < 75 ? "text-destructive" : ""}`}>{c.att}%</span>
                    </div>
                    <Progress value={c.att} className={`h-2 ${c.att < 75 ? "[&>div]:bg-destructive" : ""}`} />
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    View Details <ChevronRight className="size-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((c) => (
                    <TableRow key={c.code}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{c.code}</TableCell>
                      <TableCell>{c.teacher}</TableCell>
                      <TableCell className="text-center">{c.credits}</TableCell>
                      <TableCell className="w-48">
                        <div className="flex items-center gap-2">
                          <Progress value={c.att} className={`h-1.5 ${c.att < 75 ? "[&>div]:bg-destructive" : ""}`} />
                          <span className={`text-xs w-9 ${c.att < 75 ? "text-destructive font-medium" : ""}`}>{c.att}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{attBadge(c.att)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
