import { NextRequest, NextResponse } from "next/server";
import {
  createAppointment,
  listAppointments,
  getDashboardStats,
  getDoctorBySlug,
  getDoctorById,
  type BookingInput,
} from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/appointments?doctor=<slug|id>&date=YYYY-MM-DD&status=<status>&stats=1
 * Lists appointments (used by the staff dashboard). Optionally includes stats.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const doctorParam = sp.get("doctor") ?? undefined;
  const date = sp.get("date") ?? undefined;
  const status = sp.get("status") ?? undefined;
  const includeStats = sp.get("stats") === "1";

  let doctorId: number | undefined;
  if (doctorParam && doctorParam !== "all") {
    const asId = Number(doctorParam);
    const doctor =
      Number.isInteger(asId) && asId > 0
        ? await getDoctorById(asId)
        : await getDoctorBySlug(doctorParam);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }
    doctorId = doctor.id;
  }

  const appointments = await listAppointments({ doctorId, date, status });
  const body: Record<string, unknown> = { appointments };
  if (includeStats) body.stats = await getDashboardStats();
  return NextResponse.json(body);
}

/**
 * POST /api/appointments
 * Books an appointment. Body:
 * { doctorId, date, startMinute, patientName, patientEmail, patientPhone,
 *   visitType, reason?, isNewPatient? }
 */
export async function POST(req: NextRequest) {
  let payload: Partial<BookingInput>;
  try {
    payload = (await req.json()) as Partial<BookingInput>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const doctorId = Number(payload.doctorId);
  const startMinute = Number(payload.startMinute);
  if (!Number.isInteger(doctorId) || doctorId <= 0) {
    return NextResponse.json({ error: "A valid doctorId is required." }, { status: 400 });
  }
  if (!Number.isInteger(startMinute) || startMinute < 0) {
    return NextResponse.json({ error: "A valid startMinute is required." }, { status: 400 });
  }

  const result = await createAppointment({
    doctorId,
    startMinute,
    date: String(payload.date ?? ""),
    patientName: String(payload.patientName ?? ""),
    patientEmail: String(payload.patientEmail ?? ""),
    patientPhone: String(payload.patientPhone ?? ""),
    visitType: String(payload.visitType ?? ""),
    reason: payload.reason ? String(payload.reason) : "",
    isNewPatient: Boolean(payload.isNewPatient),
  });

  if (!result.ok) {
    const status = result.code === "conflict" ? 409 : result.code === "unavailable" ? 410 : 400;
    return NextResponse.json({ error: result.error, code: result.code }, { status });
  }

  return NextResponse.json({ appointment: result.appointment }, { status: 201 });
}
