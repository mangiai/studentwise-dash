import { APP_NAME } from "@/lib/brand";

export function openFeeInvoice(invoice: {
  challanNo: string;
  semester: string;
  studentId: string;
  studentName: string;
  issuedAt: string;
  dueDate: string;
  lineItems: { label: string; amount: number }[];
  total: number;
  paid: number;
  pending: number;
}) {
  const rows = invoice.lineItems
    .map(
      (item) =>
        `<tr><td>${item.label}</td><td style="text-align:right">PKR ${item.amount.toLocaleString()}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Fee Challan ${invoice.challanNo}</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:24px;color:#111}
  h1{font-size:1.5rem;margin:0} .muted{color:#666;font-size:.875rem}
  table{width:100%;border-collapse:collapse;margin:24px 0}
  td,th{padding:10px;border-bottom:1px solid #e5e5e5}
  .total{font-weight:700;font-size:1.1rem}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
  .box{border:1px solid #ddd;border-radius:8px;padding:16px;margin-top:16px}
</style></head><body>
  <div class="header">
    <div><h1>${APP_NAME} University</h1><div class="muted">Semester Fee Challan (Demo)</div></div>
    <div style="text-align:right"><div class="muted">Challan No.</div><div><strong>${invoice.challanNo}</strong></div></div>
  </div>
  <div class="box">
    <div><strong>${invoice.studentName}</strong></div>
    <div class="muted">${invoice.studentId} · ${invoice.semester}</div>
    <div class="muted">Issued: ${invoice.issuedAt} · Due: ${invoice.dueDate}</div>
  </div>
  <table><thead><tr><th>Description</th><th style="text-align:right">Amount (PKR)</th></tr></thead><tbody>
    ${rows}
    <tr class="total"><td>Total</td><td style="text-align:right">PKR ${invoice.total.toLocaleString()}</td></tr>
    <tr><td>Paid</td><td style="text-align:right">PKR ${invoice.paid.toLocaleString()}</td></tr>
    <tr><td>Pending</td><td style="text-align:right">PKR ${invoice.pending.toLocaleString()}</td></tr>
  </tbody></table>
  <p class="muted">This is a demo invoice for presentation purposes only. No real payment is processed.</p>
  <script>window.onload=function(){window.print()}</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  return true;
}
