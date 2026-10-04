import type { Metadata } from "next";
import Link from "next/link";
import DoctorDirectory from "./DoctorDirectory";

export const metadata: Metadata = {
  title: "Find a Doctor",
  description:
    "Meet the board-certified physicians, nurse practitioners, and specialists at Riverside Family Clinic. View profiles, specialties, weekly availability, and who's accepting new patients.",
};

export default function DoctorsPage() {
  return (
    <main>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>Find a Doctor
          </nav>
          <h1>Find a doctor</h1>
          <p>
            Meet the providers who treat you like family. Every physician is
            board-certified, and our nurse practitioners bring decades of combined
            experience. Filter by specialty, then view weekly availability and who
            is currently accepting new patients.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <DoctorDirectory />
        </div>
      </section>

      {/* CTA */}
      <section className="soft">
        <div className="container">
          <div className="cta">
            <h2>Ready to book with a provider?</h2>
            <p>
              Choose a provider above and book online, or let our chat assistant
              match you to the right person based on what you need.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link className="btn btn-ghost" href="/appointments">
                Book an appointment
              </Link>
              <a className="btn btn-ghost" href="tel:+15095550142">
                Call (509) 555-0142
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
