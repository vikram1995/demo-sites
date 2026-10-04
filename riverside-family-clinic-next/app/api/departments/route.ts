import { NextResponse } from "next/server";
import { listDepartments } from "@/lib/repository";

// SQLite access requires the Node.js runtime (not Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const departments = listDepartments();
  return NextResponse.json({ departments });
}
