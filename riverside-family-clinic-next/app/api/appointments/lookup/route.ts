import { NextRequest, NextResponse } from "next/server";
import { listAppointmentsByEmail } from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/appointments/lookup
 * Body: { email: string, status?: 'confirmed'|'cancelled'|'completed'|'all' }
 *
 * Returns the appointments booked under a patient's email. Body-based POST so
 * the AI chat assistant's generic server-tool executor can call it directly.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; status?: string };
  try {
    body = (await req.json()) as { email?: string; status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) {
    return NextResponse.json(
      { error: "An email address is required to look up appointments." },
      { status: 400 }
    );
  }

  const appointments = await listAppointmentsByEmail(email, body.status);
  return NextResponse.json({ appointments });
}
