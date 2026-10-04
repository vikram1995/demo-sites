import Link from "next/link";

export default function HomePage() {
  return (
    <main id="top">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Trusted since 2004</p>
            <h1>Compassionate care for every stage of life</h1>
            <p className="lead">
              Family medicine, pediatrics, and urgent care under one roof.
              Same-day appointments available, with a friendly team that knows
              your name.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/appointments">
                Book an appointment
              </Link>
              <Link className="btn btn-ghost" href="/services">
                Explore services
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>Walk-in urgent care today</h3>
            <p style={{ color: "var(--muted)" }}>
              No appointment needed for minor injuries, colds, and flu. Average
              wait under 20 minutes.
            </p>
            <div className="hero-stats">
              <div>
                <div className="num">20+</div>
                <div className="label">Years serving Riverside</div>
              </div>
              <div>
                <div className="num">8</div>
                <div className="label">Board-certified providers</div>
              </div>
              <div>
                <div className="num">4.9★</div>
                <div className="label">Average patient rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What we offer</p>
            <h2>Comprehensive care for the whole family</h2>
            <p>
              From routine checkups to urgent needs, our clinic brings primary
              and specialty care together in one convenient location.
            </p>
          </div>
          <div className="grid cols-3">
            <div className="card">
              <div className="ico">👨‍👩‍👧</div>
              <h3>Family Medicine</h3>
              <p>
                Annual physicals, chronic condition management (diabetes,
                hypertension, asthma), and preventive screenings for adults.
              </p>
            </div>
            <div className="card">
              <div className="ico">🧸</div>
              <h3>Pediatrics</h3>
              <p>
                Well-child visits, growth tracking, school and sports physicals,
                and the full childhood immunization schedule.
              </p>
            </div>
            <div className="card">
              <div className="ico">🩺</div>
              <h3>Urgent Care</h3>
              <p>
                Walk-in treatment for colds, flu, minor cuts, sprains, ear
                infections, and rapid strep or COVID-19 testing.
              </p>
            </div>
            <div className="card">
              <div className="ico">🌸</div>
              <h3>Women&apos;s Health</h3>
              <p>
                Well-woman exams, contraception counseling, prenatal care, and
                menopause management with our dedicated OB-GYN team.
              </p>
            </div>
            <div className="card">
              <div className="ico">🧪</div>
              <h3>On-site Lab</h3>
              <p>
                Blood work, cholesterol panels, A1C, and pregnancy tests
                processed in-house with most results in 24–48 hours.
              </p>
            </div>
            <div className="card">
              <div className="ico">💉</div>
              <h3>Vaccinations</h3>
              <p>
                Flu shots, COVID-19 boosters, tetanus, shingles, and travel
                vaccines. No appointment required for seasonal flu clinics.
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 34 }}>
            <Link className="btn btn-primary" href="/services">
              View all services &amp; pricing
            </Link>
            <Link
              className="btn btn-ghost"
              href="/departments"
              style={{ marginLeft: 10 }}
            >
              Browse departments
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="soft">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Meet the team</p>
            <h2>Providers who treat you like family</h2>
            <p>
              Our board-certified physicians and nurse practitioners bring
              decades of combined experience in family and pediatric care.
            </p>
          </div>
          <div className="grid cols-4">
            <div className="card doctor">
              <div className="avatar">AR</div>
              <h3>Dr. Anita Rao, MD</h3>
              <div className="role">Family Medicine</div>
              <p>Lead physician. 18 years in primary care and preventive medicine.</p>
            </div>
            <div className="card doctor">
              <div className="avatar">JC</div>
              <h3>Dr. James Cole, MD</h3>
              <div className="role">Pediatrics</div>
              <p>Pediatrician focused on newborn and adolescent health.</p>
            </div>
            <div className="card doctor">
              <div className="avatar">MP</div>
              <h3>Dr. Maria Perez, DO</h3>
              <div className="role">Women&apos;s Health / OB-GYN</div>
              <p>Prenatal care and well-woman exams with a gentle approach.</p>
            </div>
            <div className="card doctor">
              <div className="avatar">TN</div>
              <h3>Thomas Nguyen, NP</h3>
              <div className="role">Urgent Care</div>
              <p>Nurse practitioner leading our same-day walk-in clinic.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 34 }}>
            <Link className="btn btn-primary" href="/doctors">
              Meet all providers &amp; view availability
            </Link>
          </div>
        </div>
      </section>

      {/* Hours & Location + Insurance */}
      <section id="visit">
        <div className="container split">
          <div>
            <p className="eyebrow">Plan your visit</p>
            <h2>Hours &amp; location</h2>
            <p>
              We&apos;re located at{" "}
              <strong>218 Cedar Street, Riverside, WA 98801</strong>, two blocks
              from the Cedar Street transit stop with free patient parking behind
              the building.
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
          <div id="insurance">
            <p className="eyebrow">Coverage</p>
            <h2>Insurance &amp; payment</h2>
            <p>
              We accept most major insurance plans. If you don&apos;t see your
              provider listed, call us and we&apos;ll help verify your coverage.
            </p>
            <ul className="pill-list">
              <li>Aetna</li>
              <li>Blue Cross Blue Shield</li>
              <li>Cigna</li>
              <li>UnitedHealthcare</li>
              <li>Medicare</li>
              <li>Medicaid</li>
              <li>Kaiser Permanente</li>
              <li>Self-pay</li>
            </ul>
            <p style={{ marginTop: 18 }}>
              A self-pay office visit starts at <strong>$95</strong>. We offer a
              sliding-scale discount for qualifying uninsured patients and accept
              HSA/FSA cards.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="soft">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Good to know</p>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq" style={{ maxWidth: 760, margin: "0 auto" }}>
            <details>
              <summary>Do I need an appointment for urgent care?</summary>
              <p>
                No. Urgent care is walk-in during clinic hours. For routine
                visits and physicals, booking ahead is recommended so you can see
                your preferred provider.
              </p>
            </details>
            <details>
              <summary>How do I book or cancel an appointment?</summary>
              <p>
                Call (509) 555-0142, use the &quot;Book Appointment&quot; button
                on this page, or ask the chat assistant in the corner. Please give
                at least 24 hours&apos; notice to cancel or reschedule.
              </p>
            </details>
            <details>
              <summary>Do you see new patients?</summary>
              <p>
                Yes, we&apos;re accepting new patients of all ages. Bring a photo
                ID, your insurance card, and a list of current medications to your
                first visit.
              </p>
            </details>
            <details>
              <summary>Can I get my lab results online?</summary>
              <p>
                Yes. Results are posted to our patient portal, typically within
                24–48 hours. Your provider will call you directly about any result
                needing follow-up.
              </p>
            </details>
            <details>
              <summary>What should I do for a medical emergency?</summary>
              <p>
                For life-threatening emergencies call 911 or go to the nearest
                emergency room. Our urgent care handles non-emergency issues only.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact">
        <div className="container">
          <div className="cta">
            <h2>Ready to see a provider?</h2>
            <p>
              Book online in under a minute, call our front desk, or ask our chat
              assistant for help finding the right visit type.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <a className="btn btn-ghost" href="tel:+15095550142">
                Call (509) 555-0142
              </a>
              <a
                className="btn btn-ghost"
                href="mailto:care@riversidefamilyclinic.example"
              >
                Email us
              </a>
            </div>
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
    </main>
  );
}
