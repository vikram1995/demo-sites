"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* Types mirrored from the API responses */
type Doctor = {
  id: number;
  slug: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  languages: string;
  newPatient: { kind: string; label: string };
  bookable: boolean;
  slotMinutes: number;
  department: { slug: string; name: string };
};

type Slot = {
  startMinute: number;
  endMinute: number;
  startTime: string;
  endTime: string;
  label: string;
};

type Appointment = {
  reference: string;
  doctorName: string;
  departmentName: string;
  patientName: string;
  visitType: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

const VISIT_TYPES = [
  "New patient visit",
  "Follow-up",
  "Annual physical / wellness",
  "Sick visit",
  "Consultation",
  "Procedure / screening",
];

const STEPS = ["Provider", "Date & time", "Your details", "Confirm"] as const;

/* ---------- date helpers (local, no tz drift) ---------- */
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayStr(): string {
  return toDateStr(new Date());
}
function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return toDateStr(dt);
}
function prettyDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingForm({ initialDoctor }: { initialDoctor?: string }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState<string>(todayStr());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [visitType, setVisitType] = useState(VISIT_TYPES[0]);
  const [reason, setReason] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Appointment | null>(null);

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId) ?? null,
    [doctors, selectedDoctorId]
  );

  const minDate = todayStr();
  const maxDate = addDays(minDate, 60);

  /* Load doctors on mount; preselect from query param if bookable. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error("Failed to load providers.");
        const data = (await res.json()) as { doctors: Doctor[] };
        if (cancelled) return;
        setDoctors(data.doctors);
        if (initialDoctor) {
          const match = data.doctors.find(
            (d) => d.slug === initialDoctor && d.bookable
          );
          if (match) {
            setSelectedDoctorId(match.id);
            setStep(1);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setDoctorsError(
            err instanceof Error ? err.message : "Failed to load providers."
          );
        }
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialDoctor]);

  /* Load availability whenever the doctor or date changes (and we're past step 0). */
  const loadSlots = useCallback(async () => {
    if (!selectedDoctor) return;
    setLoadingSlots(true);
    setSlotError(null);
    setSelectedSlot(null);
    try {
      const res = await fetch(
        `/api/availability?doctor=${selectedDoctor.id}&date=${date}`
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed to load availability.");
      }
      const data = (await res.json()) as { slots: Slot[] };
      setSlots(data.slots);
    } catch (err) {
      setSlotError(err instanceof Error ? err.message : "Failed to load availability.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDoctor, date]);

  useEffect(() => {
    if (step === 1 && selectedDoctor) {
      void loadSlots();
    }
  }, [step, selectedDoctor, date, loadSlots]);

  function chooseDoctor(id: number) {
    setSelectedDoctorId(id);
    setSelectedSlot(null);
    setStep(1);
  }

  async function submit() {
    if (!selectedDoctor || !selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date,
          startMinute: selectedSlot.startMinute,
          patientName,
          patientEmail,
          patientPhone,
          visitType,
          reason,
          isNewPatient,
        }),
      });
      const data = (await res.json()) as { appointment?: Appointment; error?: string; code?: string };
      if (!res.ok || !data.appointment) {
        // If the slot was taken/stale, send the user back to re-pick a time.
        if (data.code === "conflict" || data.code === "unavailable") {
          setStep(1);
          await loadSlots();
        }
        throw new Error(data.error ?? "Could not book the appointment.");
      }
      setConfirmation(data.appointment);
      setStep(4);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not book the appointment.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setConfirmation(null);
    setSelectedDoctorId(null);
    setSelectedSlot(null);
    setSlots([]);
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setReason("");
    setIsNewPatient(false);
    setVisitType(VISIT_TYPES[0]);
    setDate(todayStr());
    setSubmitError(null);
    setStep(0);
  }

  const detailsValid =
    patientName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail.trim()) &&
    patientPhone.replace(/[^\d]/g, "").length >= 7 &&
    visitType.trim().length > 0;

  /* ---------------- Success screen ---------------- */
  if (confirmation) {
    return (
      <div className="booking">
        <div className="booking-success">
          <div className="success-check">✓</div>
          <h2>Appointment confirmed</h2>
          <p>
            Thanks, {confirmation.patientName.split(" ")[0]}. A confirmation has been
            created for your visit. Your reference is{" "}
            <strong>{confirmation.reference}</strong>.
          </p>
          <div className="summary-card">
            <div className="summary-row">
              <span className="k">Provider</span>
              <span className="v">{confirmation.doctorName}</span>
            </div>
            <div className="summary-row">
              <span className="k">Department</span>
              <span className="v">{confirmation.departmentName}</span>
            </div>
            <div className="summary-row">
              <span className="k">Visit type</span>
              <span className="v">{confirmation.visitType}</span>
            </div>
            <div className="summary-row">
              <span className="k">Date</span>
              <span className="v">{prettyDate(confirmation.date)}</span>
            </div>
            <div className="summary-row">
              <span className="k">Time</span>
              <span className="v">
                {formatTime(confirmation.startTime)} – {formatTime(confirmation.endTime)}
              </span>
            </div>
            <div className="summary-row">
              <span className="k">Status</span>
              <span className="v">
                <span className="badge badge-open">{confirmation.status}</span>
              </span>
            </div>
          </div>
          <p className="price-note">
            This is a fictional demo — no real appointment is scheduled and no email
            is sent. Save your reference to look it up later.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <button type="button" className="btn btn-primary" onClick={resetAll}>
              Book another appointment
            </button>
            <Link className="btn btn-ghost" href="/dashboard">
              View in dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking">
      {/* Step indicator */}
      <ol className="stepper">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={i === step ? "active" : i < step ? "done" : undefined}
          >
            <span className="step-num">{i < step ? "✓" : i + 1}</span>
            <span className="step-label">{label}</span>
          </li>
        ))}
      </ol>

      {/* Step 0: choose provider */}
      {step === 0 && (
        <div className="booking-panel">
          <h2>Choose a provider</h2>
          {loadingDoctors && <p className="muted">Loading providers…</p>}
          {doctorsError && <p className="form-error">{doctorsError}</p>}
          {!loadingDoctors && !doctorsError && (
            <div className="provider-list">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  className={`provider-option${doc.bookable ? "" : " disabled"}`}
                  disabled={!doc.bookable}
                  onClick={() => doc.bookable && chooseDoctor(doc.id)}
                >
                  <span className="avatar">{doc.initials}</span>
                  <span className="provider-meta">
                    <span className="provider-name">{doc.name}</span>
                    <span className="provider-role">{doc.role}</span>
                    <span className="provider-dept">{doc.department.name}</span>
                  </span>
                  <span className="provider-cta">
                    {doc.bookable ? (
                      <span className={`badge badge-${doc.newPatient.kind === "open" ? "open" : "wait"}`}>
                        {doc.newPatient.label}
                      </span>
                    ) : (
                      <span className="badge badge-closed">Walk-in only</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: date & time */}
      {step === 1 && selectedDoctor && (
        <div className="booking-panel">
          <h2>Pick a date &amp; time</h2>
          <p className="muted">
            Booking with <strong>{selectedDoctor.name}</strong> ·{" "}
            {selectedDoctor.department.name} · {selectedDoctor.slotMinutes}-min visits
          </p>

          <div className="field">
            <label htmlFor="appt-date">Appointment date</label>
            <input
              id="appt-date"
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="slots-head">
            <span>Available times on {prettyDate(date)}</span>
          </div>

          {loadingSlots && <p className="muted">Checking availability…</p>}
          {slotError && <p className="form-error">{slotError}</p>}
          {!loadingSlots && !slotError && slots.length === 0 && (
            <p className="muted no-slots">
              No open times on this date. {selectedDoctor.name} may not have clinic
              hours that day — try another date.
            </p>
          )}
          {!loadingSlots && slots.length > 0 && (
            <div className="slot-grid">
              {slots.map((s) => (
                <button
                  key={s.startMinute}
                  type="button"
                  className={`slot${selectedSlot?.startMinute === s.startMinute ? " selected" : ""}`}
                  onClick={() => setSelectedSlot(s)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="booking-nav">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
              ← Change provider
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!selectedSlot}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: patient details */}
      {step === 2 && selectedDoctor && selectedSlot && (
        <div className="booking-panel">
          <h2>Your details</h2>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="p-name">Full name *</label>
              <input
                id="p-name"
                type="text"
                value={patientName}
                autoComplete="name"
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Jordan Smith"
              />
            </div>
            <div className="field">
              <label htmlFor="p-email">Email *</label>
              <input
                id="p-email"
                type="email"
                value={patientEmail}
                autoComplete="email"
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="jordan@example.com"
              />
            </div>
            <div className="field">
              <label htmlFor="p-phone">Phone *</label>
              <input
                id="p-phone"
                type="tel"
                value={patientPhone}
                autoComplete="tel"
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="(509) 555-0142"
              />
            </div>
            <div className="field">
              <label htmlFor="p-visit">Visit type *</label>
              <select
                id="p-visit"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
              >
                {VISIT_TYPES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="p-reason">Reason for visit (optional)</label>
            <textarea
              id="p-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or the purpose of the visit."
            />
          </div>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={isNewPatient}
              onChange={(e) => setIsNewPatient(e.target.checked)}
            />
            <span>I am a new patient at Riverside Family Clinic</span>
          </label>

          <div className="booking-nav">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!detailsValid}
              onClick={() => setStep(3)}
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: review & confirm */}
      {step === 3 && selectedDoctor && selectedSlot && (
        <div className="booking-panel">
          <h2>Review &amp; confirm</h2>
          <div className="summary-card">
            <div className="summary-row">
              <span className="k">Provider</span>
              <span className="v">{selectedDoctor.name}</span>
            </div>
            <div className="summary-row">
              <span className="k">Department</span>
              <span className="v">{selectedDoctor.department.name}</span>
            </div>
            <div className="summary-row">
              <span className="k">Date</span>
              <span className="v">{prettyDate(date)}</span>
            </div>
            <div className="summary-row">
              <span className="k">Time</span>
              <span className="v">
                {selectedSlot.label} ({selectedDoctor.slotMinutes} min)
              </span>
            </div>
            <div className="summary-row">
              <span className="k">Visit type</span>
              <span className="v">{visitType}</span>
            </div>
            <div className="summary-row">
              <span className="k">Patient</span>
              <span className="v">{patientName}</span>
            </div>
            <div className="summary-row">
              <span className="k">Contact</span>
              <span className="v">
                {patientEmail} · {patientPhone}
              </span>
            </div>
            {reason.trim() && (
              <div className="summary-row">
                <span className="k">Reason</span>
                <span className="v">{reason.trim()}</span>
              </div>
            )}
            <div className="summary-row">
              <span className="k">New patient</span>
              <span className="v">{isNewPatient ? "Yes" : "No"}</span>
            </div>
          </div>

          {submitError && <p className="form-error">{submitError}</p>}

          <div className="booking-nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(2)}
              disabled={submitting}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? "Booking…" : "Confirm appointment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
