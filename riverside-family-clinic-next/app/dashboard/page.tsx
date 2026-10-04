import type { Metadata } from "next";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Appointments Dashboard",
  description:
    "Staff dashboard for Riverside Family Clinic — view, filter, and manage booked appointments.",
};

export default function DashboardPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>Appointments Dashboard
          </nav>
          <h1>Appointments dashboard</h1>
          <p>
            Front-desk view of booked appointments. Filter by provider, date, or
            status, and update each appointment as patients are seen or cancel.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <DashboardClient />
        </div>
      </section>
    </main>
  );
}
