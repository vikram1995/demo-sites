"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Doctor = {
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
  schedule: { weekday: number; startMinute: number; endMinute: number }[];
};

type Department = { slug: string; name: string };

const WEEKDAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun

function minutesToLabel(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Build a Mon–Sun schedule view; days with no row are "Not scheduled". */
function weeklyRows(doctor: Doctor) {
  const byDay = new Map(doctor.schedule.map((s) => [s.weekday, s]));
  // For walk-in urgent care, collapse weekdays if they share hours — but to keep
  // it simple and accurate we show each scheduled day.
  return WEEK_ORDER.filter((wd) => byDay.has(wd)).map((wd) => {
    const row = byDay.get(wd)!;
    return {
      day: WEEKDAY_LABEL[wd],
      hours: `${minutesToLabel(row.startMinute)} – ${minutesToLabel(row.endMinute)}`,
    };
  });
}

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [docRes, depRes] = await Promise.all([
          fetch("/api/doctors"),
          fetch("/api/departments"),
        ]);
        if (!docRes.ok || !depRes.ok) throw new Error("Failed to load providers.");
        const docData = (await docRes.json()) as { doctors: Doctor[] };
        const depData = (await depRes.json()) as { departments: Department[] };
        if (cancelled) return;
        setDoctors(docData.doctors);
        setDepartments(depData.departments);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load providers.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filters = useMemo(
    () => [{ slug: "all", name: "All providers" }, ...departments],
    [departments]
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? doctors
        : doctors.filter((d) => d.department.slug === filter),
    [filter, doctors]
  );

  if (loading) {
    return <p className="muted">Loading providers…</p>;
  }
  if (error) {
    return <p className="form-error">{error}</p>;
  }

  return (
    <>
      {/* Filter bar */}
      <div className="filter-bar" id="filterBar">
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            className={filter === f.slug ? "active" : undefined}
            onClick={() => setFilter(f.slug)}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="doctor-grid" id="doctorGrid">
        {visible.map((doc) => {
          const rows = weeklyRows(doc);
          return (
            <article
              key={doc.id}
              className="doc-card"
              id={doc.slug}
              data-specialty={doc.department.slug}
            >
              <div className="doc-top">
                <div className="avatar">{doc.initials}</div>
                <div>
                  <h3>{doc.name}</h3>
                  <div className="role">{doc.role}</div>
                </div>
              </div>
              <p className="bio">{doc.bio}</p>
              <div className="doc-meta">
                <div className="row">
                  <span className="k">New patients</span>
                  <span className="v">
                    <span className={`badge badge-${doc.newPatient.kind === "open" ? "open" : "wait"}`}>
                      {doc.newPatient.label}
                    </span>
                  </span>
                </div>
                <div className="row">
                  <span className="k">Languages</span>
                  <span className="v">{doc.languages}</span>
                </div>
                <div className="row">
                  <span className="k">{doc.credentialLabel}</span>
                  <span className="v">{doc.credential}</span>
                </div>
              </div>
              <table className="avail-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.day}>
                      <td>{row.day}</td>
                      <td className="slot">{row.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {doc.bookable ? (
                <Link
                  className="btn btn-primary"
                  href={`/appointments?doctor=${doc.slug}`}
                  style={{ marginTop: 16, textAlign: "center" }}
                >
                  Book with {doc.name.replace(/,.*$/, "")}
                </Link>
              ) : (
                <Link
                  className="btn btn-ghost"
                  href="/services#urgent-care"
                  style={{ marginTop: 16, textAlign: "center" }}
                >
                  Urgent care is walk-in
                </Link>
              )}
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p
          className="price-note"
          id="noMatch"
          style={{ textAlign: "center", marginTop: 30 }}
        >
          No providers match that specialty right now. Call{" "}
          <a href="tel:+15095550142">(509) 555-0142</a> and we&apos;ll help you
          find care.
        </p>
      )}
    </>
  );
}
