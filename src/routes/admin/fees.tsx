import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, RefreshCw } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireStaff } from "@/lib/auth-guards";
import { loadAdminPageData, matchesSearch, SELECT_CONTENT_CLASS } from "@/lib/admin/shared";
import { CURRENT_SEMESTER } from "@/lib/constants";
import { adminRegenerateChallan, adminUpdateChallanStatus } from "@/lib/supabase/data";

const FEE_STATUSES = ["Paid", "Pending", "Overdue"] as const;

export const Route = createFileRoute("/admin/fees")({
  head: () => pageHead("Fees & Challans"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: loadAdminPageData,
  component: AdminFees,
});

function AdminFees() {
  const router = useRouter();
  const { students } = Route.useLoaderData();

  const [search, setSearch] = useState("");
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (s) =>
          !search ||
          matchesSearch(s.name, search) ||
          matchesSearch(s.id, search) ||
          matchesSearch(s.dept, search) ||
          matchesSearch(s.fee, search),
      ),
    [students, search],
  );

  async function handleRegenerateChallan(studentId: string) {
    setRegeneratingId(studentId);
    try {
      await adminRegenerateChallan({ data: { studentId } });
      toast.success("Challan regenerated for current semester");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not regenerate challan");
    } finally {
      setRegeneratingId(null);
    }
  }

  async function handleStatusChange(studentId: string, status: string) {
    if (!FEE_STATUSES.includes(status as (typeof FEE_STATUSES)[number])) return;

    setUpdatingId(studentId);
    try {
      await adminUpdateChallanStatus({
        data: { studentId, status: status as (typeof FEE_STATUSES)[number] },
      });
      toast.success(`Challan status set to ${status}`);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update challan status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminLayout title="Fees & Challans" subtitle={`Manage challan status for ${CURRENT_SEMESTER}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
          <CardTitle className="text-base">Student fee status</CardTitle>
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Challan status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
              {filteredStudents.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                  <TableCell>{s.dept}</TableCell>
                  <TableCell>{CURRENT_SEMESTER}</TableCell>
                  <TableCell>
                    <Select
                      value={s.fee}
                      disabled={updatingId === s.id}
                      onValueChange={(value) => void handleStatusChange(s.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={SELECT_CONTENT_CLASS}>
                        {FEE_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleRegenerateChallan(s.id)}
                      disabled={regeneratingId === s.id}
                    >
                      <RefreshCw className={`size-4 ${regeneratingId === s.id ? "animate-spin" : ""}`} />
                      {regeneratingId === s.id ? "Regenerating..." : "Regenerate challan"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
