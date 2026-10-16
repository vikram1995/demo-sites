import { NextResponse } from "next/server";
import { listDepartments } from "@/lib/repository";
// Postgres access requires the Node.js runtime (not Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const departments = await listDepartments();
  return NextResponse.json({ departments });
}
