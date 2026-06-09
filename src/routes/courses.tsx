import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, BookOpen, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/courses")({ component: Courses });

const courses = [
  { name: "Database Systems", code: "CS-304", teacher: "Dr. Aamir Khan", credits: 3, att: 82, status: "Ongoing" },
  { name: "Operating Systems", code: "CS-307", teacher: "Prof. Sana Ali", credits: 3, att: 68, status: "Ongoing" },
  { name: "Software Engineering", code: "CS-401", teacher: "Dr. Hamza Saeed", credits: 4, att: 91, status: "Ongoing" },
  { name: "Computer Networks", code: "CS-403", teacher: "Dr. Maria Iqbal", credits: 3, att: 74, status: "Ongoing" },
  { name: "Artificial Intelligence", code: "CS-411", teacher: "Dr. Bilal Tariq", credits: 3, att: 88, status: "Ongoing" },
  { name: "Discrete Mathematics", code: "MATH-204", teacher: "Prof. Nida Rauf", credits: 3, att: 65, status: "Ongoing" },
];

function attBadge(att: number) {
  if (att < 75) return <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15 border-0"><AlertTriangle className="size-3 mr-1" />Short Attendance</Badge>;
  if (att < 85) return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15 border-0">At Risk</Badge>;
  return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 border-0">On Track</Badge>;
}

function Courses() {
  return (
    <AppLayout title="Enrolled Courses" subtitle="6 active courses · 19 credit hours this semester">
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
                    <TableHead className="text-right">Action</TableHead>
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
                      <TableCell className="text-right"><Button size="sm" variant="ghost">View</Button></TableCell>
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
