import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/results")({
  head: () => pageHead("Results"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  component: Results,
});

const semesters = [
  {
    name: "Fall 2025",
    gpa: 3.72,
    courses: [
      { code: "CS-304", name: "Database Systems", credits: 3, grade: "A", points: 12 },
      { code: "CS-307", name: "Operating Systems", credits: 3, grade: "A-", points: 11.1 },
      { code: "CS-401", name: "Software Engineering", credits: 4, grade: "B+", points: 13.2 },
      { code: "MATH-204", name: "Discrete Mathematics", credits: 3, grade: "B", points: 9 },
    ],
  },
  {
    name: "Spring 2025",
    gpa: 3.65,
    courses: [
      { code: "CS-301", name: "Data Structures", credits: 3, grade: "A-", points: 11.1 },
      { code: "CS-302", name: "Computer Architecture", credits: 3, grade: "B+", points: 9.9 },
      { code: "CS-303", name: "Theory of Automata", credits: 3, grade: "A", points: 12 },
    ],
  },
];

function gradeBadge(grade: string) {
  const good = grade.startsWith("A");
  const ok = grade.startsWith("B");
  const cls = good
    ? "bg-emerald-500/15 text-emerald-600"
    : ok
      ? "bg-primary/10 text-primary"
      : "bg-amber-500/15 text-amber-600";
  return <Badge className={`${cls} border-0 hover:opacity-90`}>{grade}</Badge>;
}

function Results() {
  const cgpa = 3.68;

  return (
    <AppLayout title="Academic Results" subtitle="View semester grades and cumulative performance">
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">CGPA</div>
            <div className="text-3xl font-semibold mt-1">{cgpa.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Out of 4.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Credits Earned</div>
            <div className="text-3xl font-semibold mt-1">96</div>
            <div className="text-xs text-muted-foreground mt-1">130 required for degree</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Standing</div>
            <div className="text-3xl font-semibold mt-1 text-emerald-600">Good</div>
            <div className="text-xs text-muted-foreground mt-1">Dean's list eligible</div>
          </CardContent>
        </Card>
      </div>

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
                    <TableRow key={c.code}>
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
