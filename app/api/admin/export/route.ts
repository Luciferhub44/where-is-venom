import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { listTransactions, type TransactionRecord } from "@/lib/kv";

export const runtime = "nodejs";

const COLUMNS: (keyof TransactionRecord)[] = [
  "recordedAt",
  "type",
  "reference",
  "amount",
  "currency",
  "qty",
  "email",
  "name",
  "phone",
  "street",
  "city",
  "state",
  "country",
  "notes",
  "paidAt",
];

function csvCell(value: unknown): string {
  const str = value === undefined || value === null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await listTransactions(5000);
  const rows = [
    COLUMNS.join(","),
    ...transactions.map((t) => COLUMNS.map((c) => csvCell(t[c])).join(",")),
  ];

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wiv-transactions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
