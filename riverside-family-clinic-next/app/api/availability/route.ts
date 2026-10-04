import { NextRequest, NextResponse } from "next/server";
import {
  getAvailability,
  getDoctorBySlug,
  getDoctorById,
  isValidDateString,
  type Doctor,
} from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/availability?doctor=<slug|id>&date=YYYY-MM-DD
 * Returns the open slots for a provider on a given day.
 */
export function GET(req: NextRequest) {
  const doctorParam = req.nextUrl.searchParams.get("doctor");
  const date = req.nextUrl.searchParams.get("date");

  if (!doctorParam) {
    return NextResponse.json({ error: "Missing 'doctor' parameter." }, { status: 400 });
  }
  if (!date || !isValidDateString(date)) {
    return NextResponse.json({ error: "Missing or invalid 'date' (expected YYYY-MM-DD)." }, { status: 400 });
  }

  let doctor: Doctor | null;
  const asId = Number(doctorParam);
  doctor = Number.isInteger(asId) && asId > 0 ? getDoctorById(asId) : getDoctorBySlug(doctorParam);
  if (!doctor) {
    doctor = getDoctorBySlug(doctorParam); // fall back if numeric-looking slug
  }
  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
  }

  const slots = getAvailability(doctor.id, date);
  return NextResponse.json({
    doctor: { id: doctor.id, slug: doctor.slug, name: doctor.name, bookable: doctor.bookable, slotMinutes: doctor.slotMinutes },
    date,
    slots,
  });
}
