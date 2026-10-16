import { NextRequest, NextResponse } from "next/server";
import {
  getAppointmentByReference,
  updateAppointmentStatus,
  type Appointment,
} from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES: Appointment["status"][] = [
  "confirmed",
  "cancelled",
  "completed",
];

export async function GET(
  _req: NextRequest,
  { params }: { params: { reference: string } }
) {
  const appointment = await getAppointmentByReference(params.reference);
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }
  return NextResponse.json({ appointment });
}

/**
 * PATCH /api/appointments/:reference  { status: 'confirmed'|'cancelled'|'completed' }
 * Used by the staff dashboard to update an appointment's status.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  let body: { status?: string };
  try {
    body = (await req.json()) as { status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const status = body.status as Appointment["status"] | undefined;
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const updated = await updateAppointmentStatus(params.reference, status);
  if (!updated) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }
  return NextResponse.json({ appointment: updated });
}
