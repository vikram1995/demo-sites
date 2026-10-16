import { NextRequest, NextResponse } from "next/server";
import {
  getAppointmentByReference,
  updateAppointmentStatus,
} from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/appointments/cancel
 * Body: { reference: string, email?: string }
 *
 * Cancels an appointment by its booking reference. This is a thin, body-based
 * alternative to `PATCH /api/appointments/:reference { status: 'cancelled' }`,
 * designed so the AI chat assistant's generic server-tool executor (which only
 * speaks GET/POST and maps args to the JSON body) can call it directly.
 *
 * When `email` is provided it must match the appointment's patient email
 * (case-insensitive) — a lightweight ownership check so a visitor can only
 * cancel their own booking from chat.
 */
export async function POST(req: NextRequest) {
  let body: { reference?: string; email?: string };
  try {
    body = (await req.json()) as { reference?: string; email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const reference = typeof body.reference === "string" ? body.reference.trim() : "";
  if (!reference) {
    return NextResponse.json(
      { error: "A booking reference is required." },
      { status: 400 }
    );
  }

  const existing = await getAppointmentByReference(reference);
  if (!existing) {
    return NextResponse.json(
      { error: "No appointment was found for that reference." },
      { status: 404 }
    );
  }

  // Optional ownership check: if an email is supplied it must match.
  if (typeof body.email === "string" && body.email.trim()) {
    const given = body.email.trim().toLowerCase();
    if (given !== existing.patientEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "That email does not match this booking." },
        { status: 403 }
      );
    }
  }

  if (existing.status === "cancelled") {
    // Idempotent: cancelling an already-cancelled appointment is a no-op.
    return NextResponse.json({ appointment: existing, alreadyCancelled: true });
  }

  if (existing.status === "completed") {
    return NextResponse.json(
      { error: "This appointment is already completed and cannot be cancelled." },
      { status: 409 }
    );
  }

  const updated = await updateAppointmentStatus(reference, "cancelled");
  if (!updated) {
    return NextResponse.json(
      { error: "No appointment was found for that reference." },
      { status: 404 }
    );
  }

  return NextResponse.json({ appointment: updated });
}
