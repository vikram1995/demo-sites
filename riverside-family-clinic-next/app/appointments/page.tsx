import type { Metadata } from "next";
import Link from "next/link";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book an appointment online with a Riverside Family Clinic provider. Choose your doctor, pick a real open time slot, and confirm in under a minute.",
};

export default function AppointmentsPage({
  searchParams,
}: {
  searchParams: { doctor?: string };
}) {
  const initialDoctor =
    typeof searchParams.doctor === "string" ? searchParams.doctor : undefined;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>Book an Appointment
          </nav>
          <h1>Book an appointment</h1>
          <p>
            Choose a provider, pick an open time from their real schedule, and
            confirm. Need urgent care? That&apos;s walk-in — no booking required.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <BookingForm initialDoctor={initialDoctor} />
        </div>
      </section>
    </main>
  );
}
