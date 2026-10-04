"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Doctor = { id: number; slug: string; name: string };

type Appointment = {
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
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

type Stats = {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  upcoming: number;
};

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function prettyDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardClient() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const [doctorFilter, setDoctorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = (await res.json()) as { doctors: Doctor[] };
        setDoctors(data.doctors);
      } catch {
        /* non-fatal: filter just won't populate */
      }
    })();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ stats: "1" });
      if (doctorFilter !== "all") params.set("doctor", doctorFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (dateFilter) params.set("date", dateFilter);
      const res = await fetch(`/api/appointments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load appointments.");
      const data = (await res.json()) as { appointments: Appointment[]; stats?: Stats };
      setAppointments(data.appointments);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [doctorFilter, statusFilter, dateFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(reference: string, status: Appointment["status"]) {
    setUpdating(reference);
    try {
      const res = await fetch(`/api/appointments/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setUpdating(null);
    }
  }

  const statCards = useMemo(
    () => [
      { label: "Total", value: stats?.total ?? 0 },
      { label: "Upcoming", value: stats?.upcoming ?? 0 },
      { label: "Confirmed", value: stats?.confirmed ?? 0 },
      { label: "Completed", value: stats?.completed ?? 0 },
      { label: "Cancelled", value: stats?.cancelled ?? 0 },
    ],
    [stats]
  );

  function clearFilters() {
    setDoctorFilter("all");
    setStatusFilter("all");
    setDateFilter("");
  }

  const badgeClass = (status: Appointment["status"]) =>
    status === "confirmed"
      ? "badge-open"
      : status === "cancelled"
        ? "badge-closed"
        : "badge-wait";

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="dash-stats">
        {statCards.map((s) => (
          <div key={s.label} className="dash-stat">
            <div className="num">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="dash-filters">
        <div className="field">
          <label htmlFor="f-doctor">Provider</label>
          <select
            id="f-doctor"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="all">All providers</option>
            {doctors.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-status">Status</label>
          <select
            id="f-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-date">Date</label>
          <input
            id="f-date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-ghost" onClick={clearFilters}>
          Clear filters
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => void load()}>
          Refresh
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading && <p className="muted">Loading appointments…</p>}

      {!loading && appointments.length === 0 && (
        <div className="dash-empty">
          <p>No appointments match these filters.</p>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className={a.status === "cancelled" ? "row-cancelled" : undefined}>
                  <td className="mono">{a.reference}</td>
                  <td>{prettyDate(a.date)}</td>
                  <td>
                    {formatTime(a.startTime)}–{formatTime(a.endTime)}
                  </td>
                  <td>
                    <div className="patient-cell">
                      <strong>{a.patientName}</strong>
                      {a.isNewPatient && <span className="tag-new">New</span>}
                      <small>{a.patientEmail}</small>
                      <small>{a.patientPhone}</small>
                    </div>
                  </td>
                  <td>
                    {a.doctorName}
                    <br />
                    <small className="muted">{a.departmentName}</small>
                  </td>
                  <td>
                    {a.visitType}
                    {a.reason && <div className="reason">{a.reason}</div>}
                  </td>
                  <td>
                    <span className={`badge ${badgeClass(a.status)}`}>{a.status}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      {a.status !== "completed" && (
                        <button
                          type="button"
                          className="mini-btn"
                          disabled={updating === a.reference}
                          onClick={() => changeStatus(a.reference, "completed")}
                        >
                          Complete
                        </button>
                      )}
                      {a.status === "cancelled" ? (
                        <button
                          type="button"
                          className="mini-btn"
                          disabled={updating === a.reference}
                          onClick={() => changeStatus(a.reference, "confirmed")}
                        >
                          Reinstate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="mini-btn danger"
                          disabled={updating === a.reference}
                          onClick={() => changeStatus(a.reference, "cancelled")}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
