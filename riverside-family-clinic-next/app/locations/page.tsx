import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Locations, Hours & Insurance",
  description:
    "Riverside Family Clinic hours, address, parking, contact details, and accepted insurance plans. Located at 218 Cedar Street, Riverside, WA 98801.",
};

export default function LocationsPage() {
  return (
    <main>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>Locations
          </nav>
          <h1>Location, hours &amp; insurance</h1>
          <p>
            One convenient downtown location with free patient parking, easy
            transit access, and a friendly front desk ready to help you plan your
            visit.
          </p>
        </div>
      </section>

      {/* Hours & Location */}
      <section id="visit">
        <div className="container split">
          <div>
            <p className="eyebrow">Plan your visit</p>
            <h2>Hours &amp; location</h2>
            <p>
              We&apos;re located at{" "}
              <strong>218 Cedar Street, Riverside, WA 98801</strong>, two blocks
              from the Cedar Street transit stop with free patient parking behind
              the building. The entrance is wheelchair accessible.
            </p>
            <table className="hours-table">
              <tbody>
                <tr>
                  <td>Monday – Friday</td>
                  <td>8:00 AM – 7:00 PM</td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>9:00 AM – 4:00 PM</td>
                </tr>
                <tr>
                  <td>Sunday</td>
                  <td>Urgent care only, 10:00 AM – 2:00 PM</td>
                </tr>
                <tr>
                  <td>Holidays</td>
                  <td>Closed (except urgent care)</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: 18 }}>
              Phone: <a href="tel:+15095550142">(509) 555-0142</a> · Email:{" "}
              <a href="mailto:care@riversidefamilyclinic.example">
                care@riversidefamilyclinic.example
              </a>
            </p>
          </div>
          <div>
            <p className="eyebrow">Getting here</p>
            <h2>Directions &amp; parking</h2>
            <ul className="conditions" style={{ columns: 1, marginTop: 8 }}>
              <li>Free patient parking behind the building, off Birch Alley</li>
              <li>Two blocks from the Cedar Street transit stop (routes 4 &amp; 12)</li>
              <li>Wheelchair-accessible entrance and exam rooms</li>
              <li>Bike racks at the front entrance</li>
              <li>Drop-off lane at the Cedar Street entrance</li>
            </ul>
            <div
              style={{
                marginTop: 20,
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                boxShadow: "var(--shadow)",
              }}
            >
              <div
                style={{
                  background: "var(--brand-light)",
                  height: 220,
                  display: "grid",
                  placeItems: "center",
                  color: "var(--brand-dark)",
                  fontWeight: 600,
                }}
              >
                📍 218 Cedar Street, Riverside, WA 98801
              </div>
            </div>
            <p className="price-note">Map is illustrative for this demo site.</p>
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section id="insurance" className="soft">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Coverage</p>
            <h2>Insurance &amp; payment</h2>
            <p>
              We accept most major insurance plans. If you don&apos;t see your
              provider listed, call us and we&apos;ll help verify your coverage
              before your visit.
            </p>
          </div>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <ul className="pill-list" style={{ justifyContent: "center" }}>
              <li>Aetna</li>
              <li>Blue Cross Blue Shield</li>
              <li>Cigna</li>
              <li>UnitedHealthcare</li>
              <li>Medicare</li>
              <li>Medicaid</li>
              <li>Kaiser Permanente</li>
              <li>Self-pay</li>
            </ul>
            <p style={{ marginTop: 22, textAlign: "center" }}>
              A self-pay office visit starts at <strong>$95</strong>. We offer a
              sliding-scale discount for qualifying uninsured patients and accept
              HSA/FSA cards. See full{" "}
              <Link href="/services">services &amp; pricing</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section id="contact">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Get in touch</p>
            <h2>Contact us</h2>
          </div>
          <div className="contact-grid">
            <div className="card">
              <div className="ico" style={{ margin: "0 auto 14px" }}>
                📍
              </div>
              <h3>Visit</h3>
              <p>
                218 Cedar Street
                <br />
                Riverside, WA 98801
              </p>
            </div>
            <div className="card">
              <div className="ico" style={{ margin: "0 auto 14px" }}>
                📞
              </div>
              <h3>Call</h3>
              <p>
                (509) 555-0142
                <br />
                Mon–Sat during clinic hours
              </p>
            </div>
            <div className="card">
              <div className="ico" style={{ margin: "0 auto 14px" }}>
                ✉️
              </div>
              <h3>Email</h3>
              <p>care@riversidefamilyclinic.example</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="soft">
        <div className="container">
          <div className="cta">
            <h2>Ready to plan your visit?</h2>
            <p>
              Book online, call the front desk, or ask our chat assistant about
              hours, directions, and what to bring.
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
