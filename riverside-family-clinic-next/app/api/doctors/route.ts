import { NextRequest, NextResponse } from "next/server";
import { listDoctors } from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const department = req.nextUrl.searchParams.get("department") ?? undefined;
  const doctors = listDoctors(department);
  return NextResponse.json({ doctors });
}
