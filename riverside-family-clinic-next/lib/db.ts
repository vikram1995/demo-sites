import { Pool, type PoolClient } from "pg";

/**
 * Postgres connection pool singleton.
 *
 * The demo originally used better-sqlite3 with a file on disk. That does not
 * survive on serverless/stateless hosts (Vercel's filesystem is read-only and
 * ephemeral), so appointments would vanish. We use Postgres (Neon) instead so
 * bookings persist.
 *
 * Next.js (dev) re-evaluates modules on hot reload, which would otherwise open
 * a new pool on every change and leak connections. We stash the pool on
 * globalThis so a single pool survives reloads.
 */

const connectionString = process.env.DATABASE_URL;

type GlobalWithDb = typeof globalThis & {
  __clinicPool?: Pool;
  __clinicInit?: Promise<void>;
};

const g = globalThis as GlobalWithDb;

function createPool(): Pool {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. The Riverside demo needs a Postgres connection string (Neon). " +
        "Set it locally in .env.local and as an environment variable on your host."
    );
  }
  // Neon (and most managed Postgres) require TLS. If the URL already carries
  // sslmode=require, pg honours it; we also enable ssl defensively with
  // rejectUnauthorized:false so the managed CA chain is accepted.
  const needsSsl = /neon\.tech|sslmode=require/.test(connectionString);
  return new Pool({
    connectionString,
    max: 5,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
}

export function getPool(): Pool {
  if (!g.__clinicPool) {
    g.__clinicPool = createPool();
  }
  return g.__clinicPool;
}

/**
 * Ensure the schema exists and the seed data is loaded. Idempotent and
 * memoised: the first caller runs it, everyone else awaits the same promise.
 */
export function ensureReady(): Promise<void> {
  if (!g.__clinicInit) {
    g.__clinicInit = (async () => {
      const pool = getPool();
      const client = await pool.connect();
      try {
        await migrate(client);
        await seed(client);
      } finally {
        client.release();
      }
    })().catch((err) => {
      // Reset so a later request can retry (e.g. transient DB startup on Neon).
      g.__clinicInit = undefined;
      throw err;
    });
  }
  return g.__clinicInit;
}

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

async function migrate(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id          SERIAL PRIMARY KEY,
      slug        TEXT NOT NULL UNIQUE,
      name        TEXT NOT NULL,
      tag         TEXT NOT NULL,
      icon        TEXT NOT NULL,
      summary     TEXT NOT NULL,
      sort_order  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id               SERIAL PRIMARY KEY,
      slug             TEXT NOT NULL UNIQUE,
      name             TEXT NOT NULL,
      role             TEXT NOT NULL,
      initials         TEXT NOT NULL,
      department_id    INTEGER NOT NULL REFERENCES departments(id),
      bio              TEXT NOT NULL,
      languages        TEXT NOT NULL,
      credential_label TEXT NOT NULL,
      credential       TEXT NOT NULL,
      new_patient_kind TEXT NOT NULL,
      new_patient_label TEXT NOT NULL,
      bookable         INTEGER NOT NULL DEFAULT 1,
      slot_minutes     INTEGER NOT NULL DEFAULT 30,
      sort_order       INTEGER NOT NULL DEFAULT 0
    );

    -- Weekly recurring working hours. weekday: 0=Sun .. 6=Sat.
    -- start_minute/end_minute are minutes from midnight. A day with no row = off.
    CREATE TABLE IF NOT EXISTS doctor_schedules (
      id           SERIAL PRIMARY KEY,
      doctor_id    INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
      weekday      INTEGER NOT NULL,
      start_minute INTEGER NOT NULL,
      end_minute   INTEGER NOT NULL,
      UNIQUE (doctor_id, weekday)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id            SERIAL PRIMARY KEY,
      reference     TEXT NOT NULL UNIQUE,
      doctor_id     INTEGER NOT NULL REFERENCES doctors(id),
      patient_name  TEXT NOT NULL,
      patient_email TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      visit_type    TEXT NOT NULL,
      reason        TEXT NOT NULL DEFAULT '',
      is_new_patient INTEGER NOT NULL DEFAULT 0,
      date          TEXT NOT NULL,
      start_minute  INTEGER NOT NULL,
      end_minute    INTEGER NOT NULL,
      status        TEXT NOT NULL DEFAULT 'confirmed',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      -- A doctor cannot have two appointments starting at the same time on a day.
      UNIQUE (doctor_id, date, start_minute)
    );

    CREATE INDEX IF NOT EXISTS idx_appt_doctor_date
      ON appointments (doctor_id, date);
    CREATE INDEX IF NOT EXISTS idx_appt_date
      ON appointments (date);
  `);
}

/* ------------------------------------------------------------------ */
/* Seed data (derived from the clinic's existing content)             */
/* ------------------------------------------------------------------ */

type SeedSchedule = { weekday: number; start: number; end: number };

type SeedDoctor = {
  slug: string;
  name: string;
  role: string;
  initials: string;
  department: string;
  bio: string;
  languages: string;
  credentialLabel: string;
  credential: string;
  newPatientKind: "open" | "wait";
  newPatientLabel: string;
  bookable: boolean;
  slotMinutes: number;
  schedule: SeedSchedule[];
};

// Helpers to keep schedules readable. hhmm("08:00") -> 480.
const hhmm = (s: string): number => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
const day = (weekday: number, start: string, end: string): SeedSchedule => ({
  weekday,
  start: hhmm(start),
  end: hhmm(end),
});

const DEPARTMENTS: {
  slug: string;
  name: string;
  tag: string;
  icon: string;
  summary: string;
}[] = [
  { slug: "family-medicine", name: "Family Medicine", tag: "Primary Care", icon: "👨‍👩‍👧", summary: "Your medical home for every age — physicals, chronic-condition management, and referrals." },
  { slug: "pediatrics", name: "Pediatrics", tag: "Children's Health", icon: "🧸", summary: "Newborn to teen care, immunizations, and school & sports physicals." },
  { slug: "womens-health", name: "Women's Health", tag: "OB-GYN", icon: "🌸", summary: "Well-woman care, family planning, prenatal care, and menopause management." },
  { slug: "urgent-care", name: "Urgent Care", tag: "Walk-in", icon: "🩺", summary: "Walk-in treatment for non-emergency illness and injury." },
  { slug: "cardiology", name: "Cardiology", tag: "Heart & Vascular", icon: "❤️", summary: "Visiting heart-health clinic for evaluation and ongoing management." },
  { slug: "behavioral-health", name: "Behavioral Health", tag: "Mental & Behavioral", icon: "🧠", summary: "Confidential counseling and medication management, integrated with primary care." },
  { slug: "orthopedics", name: "Orthopedics & Sports Medicine", tag: "Bone, Joint & Sports", icon: "🦴", summary: "Non-surgical treatment of muscle, bone, and joint injuries." },
  { slug: "dermatology", name: "Dermatology", tag: "Skin Health", icon: "🧴", summary: "Medical dermatology including annual skin-cancer screening." },
];

const DOCTORS: SeedDoctor[] = [
  {
    slug: "anita-rao",
    name: "Dr. Anita Rao, MD",
    role: "Family Medicine · Lead Physician",
    initials: "AR",
    department: "family-medicine",
    bio: "Lead physician with 18 years in primary and preventive care. Dr. Rao focuses on chronic-disease management and building long-term relationships with families across generations.",
    languages: "English, Hindi",
    credentialLabel: "Board cert.",
    credential: "Am. Board of Family Medicine",
    newPatientKind: "open",
    newPatientLabel: "Accepting",
    bookable: true,
    slotMinutes: 30,
    schedule: [day(1, "08:00", "16:00"), day(2, "08:00", "16:00"), day(4, "10:00", "18:00"), day(5, "08:00", "14:00")],
  },
  {
    slug: "james-cole",
    name: "Dr. James Cole, MD",
    role: "Pediatrics",
    initials: "JC",
    department: "pediatrics",
    bio: "Pediatrician focused on newborn and adolescent health. Dr. Cole is known for a calm, kid-friendly manner and takes extra time to walk parents through developmental milestones.",
    languages: "English, Spanish",
    credentialLabel: "Board cert.",
    credential: "Am. Board of Pediatrics",
    newPatientKind: "open",
    newPatientLabel: "Accepting",
    bookable: true,
    slotMinutes: 30,
    schedule: [day(1, "09:00", "17:00"), day(3, "09:00", "17:00"), day(4, "09:00", "17:00"), day(5, "09:00", "15:00")],
  },
  {
    slug: "maria-perez",
    name: "Dr. Maria Perez, DO",
    role: "Women's Health / OB-GYN",
    initials: "MP",
    department: "womens-health",
    bio: "Provides prenatal care and well-woman exams with a gentle, patient-centered approach. Dr. Perez supports patients through pregnancy, family planning, and menopause.",
    languages: "English, Spanish",
    credentialLabel: "Board cert.",
    credential: "Am. Board of OB-GYN",
    newPatientKind: "wait",
    newPatientLabel: "Waitlist",
    bookable: true,
    slotMinutes: 40,
    schedule: [day(1, "08:00", "15:00"), day(2, "08:00", "15:00"), day(3, "08:00", "15:00")],
  },
  {
    slug: "thomas-nguyen",
    name: "Thomas Nguyen, NP",
    role: "Urgent Care",
    initials: "TN",
    department: "urgent-care",
    bio: "Nurse practitioner leading our same-day walk-in clinic. Thomas handles minor injuries and acute illness efficiently, and is a familiar face for families needing fast, friendly care.",
    languages: "English, Vietnamese",
    credentialLabel: "Credential",
    credential: "Family NP (FNP-C)",
    newPatientKind: "open",
    newPatientLabel: "Walk-in",
    bookable: false,
    slotMinutes: 30,
    schedule: [day(1, "08:00", "19:00"), day(2, "08:00", "19:00"), day(3, "08:00", "19:00"), day(4, "08:00", "19:00"), day(5, "08:00", "19:00"), day(6, "09:00", "16:00"), day(0, "10:00", "14:00")],
  },
  {
    slug: "david-okafor",
    name: "Dr. David Okafor, MD",
    role: "Cardiology (Visiting)",
    initials: "DO",
    department: "cardiology",
    bio: "Cardiologist running our weekly heart-health clinic. Dr. Okafor treats common heart problems, manages high cholesterol and blood pressure, and coordinates closely with primary care.",
    languages: "English",
    credentialLabel: "Board cert.",
    credential: "Am. Board of Internal Medicine (Cardiology)",
    newPatientKind: "open",
    newPatientLabel: "By referral",
    bookable: true,
    slotMinutes: 45,
    schedule: [day(2, "09:00", "16:00"), day(4, "09:00", "16:00")],
  },
  {
    slug: "sarah-lin",
    name: "Dr. Sarah Lin, PsyD",
    role: "Behavioral Health",
    initials: "SL",
    department: "behavioral-health",
    bio: "Clinical psychologist offering confidential counseling for anxiety, depression, and life transitions, integrated with your primary care team for whole-person support.",
    languages: "English, Mandarin",
    credentialLabel: "Credential",
    credential: "Licensed Clinical Psychologist",
    newPatientKind: "open",
    newPatientLabel: "Accepting",
    bookable: true,
    slotMinutes: 50,
    schedule: [day(1, "11:00", "19:00"), day(2, "11:00", "19:00"), day(3, "11:00", "19:00"), day(5, "09:00", "13:00")],
  },
  {
    slug: "marcus-hill",
    name: "Dr. Marcus Hill, MD",
    role: "Orthopedics & Sports Medicine",
    initials: "MH",
    department: "orthopedics",
    bio: "Orthopedic and sports-medicine physician treating sprains, fractures, and joint pain. Dr. Hill emphasizes non-surgical recovery and getting active patients back to their routines.",
    languages: "English",
    credentialLabel: "Board cert.",
    credential: "Am. Board of Orthopaedic Surgery",
    newPatientKind: "open",
    newPatientLabel: "Accepting",
    bookable: true,
    slotMinutes: 30,
    schedule: [day(1, "08:00", "16:00"), day(3, "08:00", "16:00"), day(4, "08:00", "16:00")],
  },
  {
    slug: "priya-shah",
    name: "Dr. Priya Shah, MD",
    role: "Dermatology",
    initials: "PS",
    department: "dermatology",
    bio: "Medical dermatologist treating acne, eczema, and skin conditions, with a focus on annual skin-cancer screening and same-visit biopsies of suspicious lesions.",
    languages: "English, Gujarati",
    credentialLabel: "Board cert.",
    credential: "Am. Board of Dermatology",
    newPatientKind: "wait",
    newPatientLabel: "Waitlist",
    bookable: true,
    slotMinutes: 30,
    schedule: [day(2, "08:30", "16:30"), day(3, "08:30", "16:30"), day(5, "08:30", "12:30")],
  },
];

async function seed(client: PoolClient): Promise<void> {
  const { rows } = await client.query<{ c: string }>(
    "SELECT COUNT(*) AS c FROM departments"
  );
  if (Number(rows[0]?.c ?? 0) > 0) return; // already seeded

  await client.query("BEGIN");
  try {
    const deptIdBySlug = new Map<string, number>();
    for (let i = 0; i < DEPARTMENTS.length; i++) {
      const d = DEPARTMENTS[i];
      const res = await client.query<{ id: number }>(
        `INSERT INTO departments (slug, name, tag, icon, summary, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [d.slug, d.name, d.tag, d.icon, d.summary, i]
      );
      deptIdBySlug.set(d.slug, res.rows[0].id);
    }

    for (let i = 0; i < DOCTORS.length; i++) {
      const doc = DOCTORS[i];
      const departmentId = deptIdBySlug.get(doc.department);
      if (departmentId === undefined) {
        throw new Error(`Unknown department for doctor ${doc.slug}: ${doc.department}`);
      }
      const res = await client.query<{ id: number }>(
        `INSERT INTO doctors
           (slug, name, role, initials, department_id, bio, languages,
            credential_label, credential, new_patient_kind, new_patient_label,
            bookable, slot_minutes, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING id`,
        [
          doc.slug, doc.name, doc.role, doc.initials, departmentId, doc.bio,
          doc.languages, doc.credentialLabel, doc.credential, doc.newPatientKind,
          doc.newPatientLabel, doc.bookable ? 1 : 0, doc.slotMinutes, i,
        ]
      );
      const doctorId = res.rows[0].id;
      for (const s of doc.schedule) {
        await client.query(
          `INSERT INTO doctor_schedules (doctor_id, weekday, start_minute, end_minute)
           VALUES ($1, $2, $3, $4)`,
          [doctorId, s.weekday, s.start, s.end]
        );
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}
