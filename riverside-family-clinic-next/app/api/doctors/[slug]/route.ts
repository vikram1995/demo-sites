import { NextResponse } from "next/server";
import { getDoctorBySlug } from "@/lib/repository";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const doctor = await getDoctorBySlug(params.slug);
  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }
  return NextResponse.json({ doctor });
}
