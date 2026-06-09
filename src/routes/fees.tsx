import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/fees")({ head: () => pageHead("Fees"), component: Fees });

const history = [
  { date: "Aug 12, 2026", desc: "Spring '26 — Installment 2", method: "Bank Transfer", amount: 49000, status: "Paid" },
  { date: "Mar 04, 2026", desc: "Spring '26 — Installment 1", method: "Credit Card", amount: 49000, status: "Paid" },
  { date: "Oct 18, 2025", desc: "Fall '25 — Full Payment", method: "Bank Transfer", amount: 98000, status: "Paid" },
  { date: "Mar 09, 2025", desc: "Spring '25 — Installment 1", method: "Cheque", amount: 49000, status: "Paid" },
];

function Fees() {
  return (
    <AppLayout title="Fee Management" subtitle="View, pay, and track your semester fees">
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <div className="text-xs opacity-80 uppercase tracking-wide">Fall Semester 2026</div>
            <div className="text-3xl font-semibold mt-1">PKR 98,000.00</div>
            <div className="text-sm opacity-90 mt-1">Total semester fee</div>
          </div>
          <CardContent className="grid sm:grid-cols-3 gap-4 p-6">
            <div><div className="text-xs text-muted-foreground">Paid</div><div className="text-lg font-semibold text-emerald-600">PKR 49,000</div></div>
            <div><div className="text-xs text-muted-foreground">Pending</div><div className="text-lg font-semibold text-amber-600">PKR 49,000</div></div>
            <div><div className="text-xs text-muted-foreground">Due Date</div><div className="text-lg font-semibold">Dec 15, 2026</div></div>
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

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[
          { title: "Installment 1", amount: 49000, due: "Aug 30, 2026", status: "Paid", icon: CheckCircle2, tint: "text-emerald-600 bg-emerald-500/10" },
          { title: "Installment 2", amount: 49000, due: "Dec 15, 2026", status: "Pending", icon: Clock, tint: "text-amber-600 bg-amber-500/10" },
          { title: "Full Payment", amount: 98000, due: "One-time", status: "Optional", icon: AlertCircle, tint: "text-accent bg-accent/10" },
        ].map((p) => (
          <Card key={p.title}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className={`size-10 rounded-lg grid place-content-center ${p.tint}`}><p.icon className="size-5" /></div>
                <Badge variant={p.status === "Paid" ? "secondary" : "outline"} className={p.status === "Paid" ? "bg-emerald-500/15 text-emerald-600 border-0" : ""}>
                  {p.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{p.title}</div>
                <div className="text-2xl font-semibold mt-1">PKR {p.amount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">Due: {p.due}</div>
              </div>
              {p.status !== "Paid" ? (
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Pay Now</Button>
              ) : (
                <Button variant="outline" className="w-full"><Download className="size-4" /> Receipt</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

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
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{h.date}</TableCell>
                  <TableCell className="font-medium">{h.desc}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.method}</TableCell>
                  <TableCell className="text-right font-medium">PKR {h.amount.toLocaleString()}</TableCell>
                  <TableCell><Badge className="bg-emerald-500/15 text-emerald-600 border-0 hover:bg-emerald-500/15">{h.status}</Badge></TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="ghost"><Download className="size-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
