import { getPool, ensureReady } from "./db";

/* ------------------------------------------------------------------ */
/* Types (shape returned to the API / client)                         */
/* ------------------------------------------------------------------ */

export type Department = {
  id: number;
  slug: string;
  name: string;
  tag: string;
  icon: string;
  summary: string;
};

export type ScheduleRow = {
  weekday: number; // 0=Sun .. 6=Sat
  startMinute: number;
  endMinute: number;
};

export type Doctor = {
  id: number;
  slug: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  languages: string;
  credentialLabel: string;
  credential: string;
  newPatient: { kind: string; label: string };
  bookable: boolean;
  slotMinutes: number;
  department: { slug: string; name: string };
  schedule: ScheduleRow[];
};

export type Appointment = {
  id: number;
  reference: string;
  doctorId: number;
  doctorName: string;
  departmentName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  visitType: string;
  reason: string;
  isNewPatient: boolean;
  date: string;
  startMinute: number;
  endMinute: number;
  startTime: string; // 'HH:MM'
  endTime: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

export type Slot = {
  startMinute: number;
  endMinute: number;
  startTime: string;
  endTime: string;
  label: string; // human-friendly, e.g. "9:00 AM"
};

export const VISIT_TYPES = [
  "New patient visit",
  "Follow-up",
  "Annual physical / wellness",
  "Sick visit",
  "Consultation",
  "Procedure / screening",
] as const;

/* ------------------------------------------------------------------ */
/* DB access helper                                                    */
/* ------------------------------------------------------------------ */

// Every query path ensures the schema+seed exist first (idempotent, memoised),
// then runs against the shared pool.
async function query<T extends Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureReady();
  const res = await getPool().query(text, params);
  return res.rows as T[];
}

/* ------------------------------------------------------------------ */
/* Time helpers (pure)                                                 */
/* ------------------------------------------------------------------ */

export function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function minutesToLabel(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

// Parse a 'YYYY-MM-DD' string into weekday without timezone drift.
export function weekdayOf(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function todayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function nowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/* ------------------------------------------------------------------ */
/* Row mappers                                                         */
/* ------------------------------------------------------------------ */

type DoctorRow = {
  id: number;
  slug: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  languages: string;
  credential_label: string;
  credential: string;
  new_patient_kind: string;
  new_patient_label: string;
  bookable: number;
  slot_minutes: number;
  dept_slug: string;
  dept_name: string;
};

function mapDoctor(row: DoctorRow, schedule: ScheduleRow[]): Doctor {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    initials: row.initials,
    bio: row.bio,
    languages: row.languages,
    credentialLabel: row.credential_label,
    credential: row.credential,
    newPatient: { kind: row.new_patient_kind, label: row.new_patient_label },
    bookable: row.bookable === 1,
    slotMinutes: row.slot_minutes,
    department: { slug: row.dept_slug, name: row.dept_name },
    schedule,
  };
}

const DOCTOR_SELECT = `
  SELECT d.id, d.slug, d.name, d.role, d.initials, d.bio, d.languages,
         d.credential_label, d.credential, d.new_patient_kind,
         d.new_patient_label, d.bookable, d.slot_minutes,
         dep.slug AS dept_slug, dep.name AS dept_name
  FROM doctors d
  JOIN departments dep ON dep.id = d.department_id
`;

/* ------------------------------------------------------------------ */
/* Departments                                                         */
/* ------------------------------------------------------------------ */

export async function listDepartments(): Promise<Department[]> {
  return query<Department>(
    `SELECT id, slug, name, tag, icon, summary
     FROM departments ORDER BY sort_order, name`
  );
}

/* ------------------------------------------------------------------ */
/* Doctors                                                             */
/* ------------------------------------------------------------------ */

async function scheduleFor(doctorId: number): Promise<ScheduleRow[]> {
  return query<ScheduleRow>(
    `SELECT weekday,
            start_minute AS "startMinute",
            end_minute   AS "endMinute"
     FROM doctor_schedules WHERE doctor_id = $1 ORDER BY weekday`,
    [doctorId]
  );
}

export async function listDoctors(departmentSlug?: string): Promise<Doctor[]> {
  const rows =
    departmentSlug && departmentSlug !== "all"
      ? await query<DoctorRow>(
          `${DOCTOR_SELECT} WHERE dep.slug = $1 ORDER BY d.sort_order`,
          [departmentSlug]
        )
      : await query<DoctorRow>(`${DOCTOR_SELECT} ORDER BY d.sort_order`);
  return Promise.all(rows.map(async (r) => mapDoctor(r, await scheduleFor(r.id))));
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const rows = await query<DoctorRow>(`${DOCTOR_SELECT} WHERE d.slug = $1`, [slug]);
  if (rows.length === 0) return null;
  return mapDoctor(rows[0], await scheduleFor(rows[0].id));
}

export async function getDoctorById(id: number): Promise<Doctor | null> {
  const rows = await query<DoctorRow>(`${DOCTOR_SELECT} WHERE d.id = $1`, [id]);
  if (rows.length === 0) return null;
  return mapDoctor(rows[0], await scheduleFor(rows[0].id));
}

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

/**
 * Compute bookable slots for a doctor on a given date.
 * - Starts from the doctor's working hours for that weekday.
 * - Divides into fixed slot_minutes blocks.
 * - Removes any slot already taken by a confirmed/completed appointment.
 * - Removes slots in the past (for today).
 * Returns [] for non-bookable doctors, days off, or past dates.
 */
export async function getAvailability(
  doctorId: number,
  dateStr: string
): Promise<Slot[]> {
  if (!isValidDateString(dateStr)) return [];

  const doctor = await getDoctorById(doctorId);
  if (!doctor || !doctor.bookable) return [];

  const today = todayStr();
  if (dateStr < today) return []; // no booking in the past

  const weekday = weekdayOf(dateStr);
  const working = doctor.schedule.find((s) => s.weekday === weekday);
  if (!working) return [];

  const takenRows = await query<{ startMinute: number }>(
    `SELECT start_minute AS "startMinute" FROM appointments
     WHERE doctor_id = $1 AND date = $2 AND status != 'cancelled'`,
    [doctorId, dateStr]
  );
  const taken = new Set(takenRows.map((r) => r.startMinute));

  const step = doctor.slotMinutes;
  const minFloor = dateStr === today ? nowMinutes() : -1;

  const slots: Slot[] = [];
  for (let start = working.startMinute; start + step <= working.endMinute; start += step) {
    if (taken.has(start)) continue;
    if (start <= minFloor) continue; // past time today
    const end = start + step;
    slots.push({
      startMinute: start,
      endMinute: end,
      startTime: minutesToHHMM(start),
      endTime: minutesToHHMM(end),
      label: minutesToLabel(start),
    });
  }
  return slots;
}

/* ------------------------------------------------------------------ */
/* Appointments                                                        */
/* ------------------------------------------------------------------ */

type AppointmentRow = {
  id: number;
  reference: string;
  doctor_id: number;
  doctor_name: string;
  department_name: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  visit_type: string;
  reason: string;
  is_new_patient: number;
  date: string;
  start_minute: number;
  end_minute: number;
  status: Appointment["status"];
  created_at: string | Date;
};

function mapAppointment(r: AppointmentRow): Appointment {
  return {
    id: r.id,
    reference: r.reference,
    doctorId: r.doctor_id,
    doctorName: r.doctor_name,
    departmentName: r.department_name,
    patientName: r.patient_name,
    patientEmail: r.patient_email,
    patientPhone: r.patient_phone,
    visitType: r.visit_type,
    reason: r.reason,
    isNewPatient: r.is_new_patient === 1,
    date: r.date,
    startMinute: r.start_minute,
    endMinute: r.end_minute,
    startTime: minutesToHHMM(r.start_minute),
    endTime: minutesToHHMM(r.end_minute),
    status: r.status,
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

const APPOINTMENT_SELECT = `
  SELECT a.id, a.reference, a.doctor_id, a.patient_name, a.patient_email,
         a.patient_phone, a.visit_type, a.reason, a.is_new_patient,
         a.date, a.start_minute, a.end_minute, a.status, a.created_at,
         d.name AS doctor_name, dep.name AS department_name
  FROM appointments a
  JOIN doctors d ON d.id = a.doctor_id
  JOIN departments dep ON dep.id = d.department_id
`;

export type AppointmentFilter = {
  doctorId?: number;
  date?: string;
  status?: string;
};

export async function listAppointments(
  filter: AppointmentFilter = {}
): Promise<Appointment[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filter.doctorId) {
    params.push(filter.doctorId);
    where.push(`a.doctor_id = $${params.length}`);
  }
  if (filter.date) {
    params.push(filter.date);
    where.push(`a.date = $${params.length}`);
  }
  if (filter.status && filter.status !== "all") {
    params.push(filter.status);
    where.push(`a.status = $${params.length}`);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = await query<AppointmentRow>(
    `${APPOINTMENT_SELECT} ${clause} ORDER BY a.date, a.start_minute`,
    params
  );
  return rows.map(mapAppointment);
}

export async function getAppointmentByReference(
  reference: string
): Promise<Appointment | null> {
  const rows = await query<AppointmentRow>(
    `${APPOINTMENT_SELECT} WHERE a.reference = $1`,
    [reference]
  );
  return rows.length ? mapAppointment(rows[0]) : null;
}

/**
 * Return all appointments booked under a patient's email, newest first.
 * The email match is case-insensitive. Optionally filter by status.
 */
export async function listAppointmentsByEmail(
  email: string,
  status?: string
): Promise<Appointment[]> {
  const params: unknown[] = [email];
  const where = ["LOWER(a.patient_email) = LOWER($1)"];
  if (status && status !== "all") {
    params.push(status);
    where.push(`a.status = $${params.length}`);
  }
  const rows = await query<AppointmentRow>(
    `${APPOINTMENT_SELECT} WHERE ${where.join(" AND ")} ORDER BY a.date DESC, a.start_minute DESC`,
    params
  );
  return rows.map(mapAppointment);
}

export type BookingInput = {
  doctorId: number;
  startMinute: number;
  date: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  visitType: string;
  reason?: string;
  isNewPatient?: boolean;
};

export type BookingResult =
  | { ok: true; appointment: Appointment }
  | { ok: false; error: string; code: "validation" | "unavailable" | "conflict" };

function makeReference(): string {
  // RFC-ish short human reference, e.g. RFC-7Q2K8M
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `RFC-${s}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Create an appointment. Validates input, re-checks availability, and inserts.
 * The DB unique constraint on (doctor_id, date, start_minute) is the final
 * guard against a double-booking race.
 */
export async function createAppointment(
  input: BookingInput
): Promise<BookingResult> {
  const name = (input.patientName ?? "").trim();
  const email = (input.patientEmail ?? "").trim();
  const phone = (input.patientPhone ?? "").trim();
  const visitType = (input.visitType ?? "").trim();
  const reason = (input.reason ?? "").trim();

  if (name.length < 2) {
    return { ok: false, code: "validation", error: "Please enter the patient's full name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, code: "validation", error: "Please enter a valid email address." };
  }
  if (phone.replace(/[^\d]/g, "").length < 7) {
    return { ok: false, code: "validation", error: "Please enter a valid phone number." };
  }
  if (!visitType) {
    return { ok: false, code: "validation", error: "Please choose a visit type." };
  }
  if (!isValidDateString(input.date)) {
    return { ok: false, code: "validation", error: "Please choose a valid date." };
  }

  const doctor = await getDoctorById(input.doctorId);
  if (!doctor) {
    return { ok: false, code: "validation", error: "That provider could not be found." };
  }
  if (!doctor.bookable) {
    return { ok: false, code: "unavailable", error: `${doctor.name} is walk-in only and cannot be booked online.` };
  }

  // The requested slot must still be in the generated availability.
  const slots = await getAvailability(input.doctorId, input.date);
  const slot = slots.find((s) => s.startMinute === input.startMinute);
  if (!slot) {
    return { ok: false, code: "unavailable", error: "That time slot is no longer available. Please pick another." };
  }

  await ensureReady();
  const pool = getPool();

  // Generate a unique reference (collisions are astronomically unlikely, but
  // retry a few times defensively; the UNIQUE constraint is the real guard).
  for (let attempt = 0; attempt < 10; attempt++) {
    const reference = makeReference();
    try {
      const res = await pool.query<AppointmentRow>(
        `INSERT INTO appointments
           (reference, doctor_id, patient_name, patient_email, patient_phone,
            visit_type, reason, is_new_patient, date, start_minute, end_minute, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'confirmed')
         RETURNING id`,
        [
          reference, input.doctorId, name, email, phone, visitType, reason,
          input.isNewPatient ? 1 : 0, input.date, slot.startMinute, slot.endMinute,
        ]
      );
      const id = res.rows[0].id;
      const row = (
        await pool.query<AppointmentRow>(`${APPOINTMENT_SELECT} WHERE a.id = $1`, [id])
      ).rows[0];
      return { ok: true, appointment: mapAppointment(row) };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      // 23505 = unique_violation. Could be the reference (retry) or the
      // (doctor, date, start_minute) slot (a genuine double-booking → conflict).
      if (message.includes("duplicate key") || message.includes("23505")) {
        if (message.includes("reference")) continue; // retry with a new ref
        return { ok: false, code: "conflict", error: "That time slot was just booked by someone else. Please pick another." };
      }
      throw err;
    }
  }
  return { ok: false, code: "conflict", error: "Could not generate a unique booking reference. Please try again." };
}

export async function updateAppointmentStatus(
  reference: string,
  status: Appointment["status"]
): Promise<Appointment | null> {
  const rows = await query<{ reference: string }>(
    `UPDATE appointments SET status = $1 WHERE reference = $2 RETURNING reference`,
    [status, reference]
  );
  if (rows.length === 0) return null;
  return getAppointmentByReference(reference);
}

export type DashboardStats = {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  upcoming: number; // confirmed and today or later
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = todayStr();
  const rows = await query<Record<string, string | number | null>>(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
       SUM(CASE WHEN status = 'confirmed' AND date >= $1 THEN 1 ELSE 0 END) AS upcoming
     FROM appointments`,
    [today]
  );
  const row = rows[0] ?? {};
  const num = (v: string | number | null | undefined): number => Number(v ?? 0);
  return {
    total: num(row.total),
    confirmed: num(row.confirmed),
    completed: num(row.completed),
    cancelled: num(row.cancelled),
    upcoming: num(row.upcoming),
  };
}
