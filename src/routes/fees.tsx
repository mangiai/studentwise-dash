import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import { fetchStudentFees } from "@/lib/supabase/data";

export const Route = createFileRoute("/fees")({
  head: () => pageHead("Fees"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentFees(),
  component: Fees,
});

function Fees() {
  const { fees, history } = Route.useLoaderData();

  return (
    <AppLayout title="Fee Management" subtitle="View, pay, and track your semester fees">
      {!fees && (
        <p className="text-sm text-muted-foreground mb-4">No fee record linked to your student profile.</p>
      )}
      {fees && (
        <>
          <div className="grid gap-4 lg:grid-cols-3 mb-6">
            <Card className="lg:col-span-2 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
                <div className="text-xs opacity-80 uppercase tracking-wide">{fees.semester}</div>
                <div className="text-3xl font-semibold mt-1">PKR {fees.total.toLocaleString()}</div>
                <div className="text-sm opacity-90 mt-1">Total semester fee</div>
              </div>
              <CardContent className="grid sm:grid-cols-3 gap-4 p-6">
                <div><div className="text-xs text-muted-foreground">Paid</div><div className="text-lg font-semibold text-emerald-600">PKR {fees.paid.toLocaleString()}</div></div>
                <div><div className="text-xs text-muted-foreground">Pending</div><div className="text-lg font-semibold text-amber-600">PKR {fees.pending.toLocaleString()}</div></div>
                <div><div className="text-xs text-muted-foreground">Due Date</div><div className="text-lg font-semibold">{fees.dueDate}</div></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-primary hover:bg-primary/90">Pay Full Fee</Button>
                <Button variant="outline" className="w-full"><Download className="size-4" /> Download Voucher</Button>
                <Button variant="ghost" className="w-full">Request Installment</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="size-10 rounded-lg grid place-content-center text-emerald-600 bg-emerald-500/10"><CheckCircle2 className="size-5" /></div>
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 border-0">Paid</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount paid</div>
                  <div className="text-2xl font-semibold mt-1">PKR {fees.paid.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="size-10 rounded-lg grid place-content-center text-amber-600 bg-amber-500/10"><Clock className="size-5" /></div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Outstanding</div>
                  <div className="text-2xl font-semibold mt-1">PKR {fees.pending.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Due: {fees.dueDate}</div>
                </div>
                {fees.pending > 0 && (
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Pay Now</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No transactions yet.</TableCell></TableRow>
              )}
              {history.map((h, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{h.date}</TableCell>
                  <TableCell className="font-medium">{h.desc}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.method}</TableCell>
                  <TableCell className="text-right font-medium">PKR {h.amount.toLocaleString()}</TableCell>
                  <TableCell><Badge className="bg-emerald-500/15 text-emerald-600 border-0 hover:bg-emerald-500/15">{h.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
