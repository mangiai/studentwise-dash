import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import { fetchStudentResults } from "@/lib/supabase/data";

export const Route = createFileRoute("/results")({
  head: () => pageHead("Results"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentResults(),
  component: Results,
});

function gradeBadge(grade: string) {
  const good = grade.startsWith("A");
  const ok = grade.startsWith("B");
  const cls = good ? "bg-emerald-500/15 text-emerald-600" : ok ? "bg-primary/10 text-primary" : "bg-amber-500/15 text-amber-600";
  return <Badge className={`${cls} border-0 hover:opacity-90`}>{grade}</Badge>;
}

function Results() {
  const { semesters, student } = Route.useLoaderData();
  const cgpa = student?.gpa ?? 0;

  return (
    <AppLayout title="Academic Results" subtitle="Semester grades loaded from Supabase">
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">CGPA</div>
            <div className="text-3xl font-semibold mt-1">{Number(cgpa).toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Out of 4.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Credits Earned</div>
            <div className="text-3xl font-semibold mt-1">{student?.credits_completed ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">{student?.credits_required ?? 130} required for degree</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Semesters</div>
            <div className="text-3xl font-semibold mt-1">{semesters.length}</div>
            <div className="text-xs text-muted-foreground mt-1">With recorded grades</div>
          </CardContent>
        </Card>
      </div>

      {semesters.length === 0 && (
        <p className="text-sm text-muted-foreground">No grades found for your student profile.</p>
      )}

      <div className="space-y-6">
        {semesters.map((sem) => (
          <Card key={sem.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{sem.name}</CardTitle>
              <Badge variant="outline">SGPA {sem.gpa.toFixed(2)}</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sem.courses.map((c) => (
                    <TableRow key={`${sem.name}-${c.code}`}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{c.code}</TableCell>
                      <TableCell className="text-center">{c.credits}</TableCell>
                      <TableCell className="text-center">{gradeBadge(c.grade)}</TableCell>
                      <TableCell className="text-right">{c.points.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
