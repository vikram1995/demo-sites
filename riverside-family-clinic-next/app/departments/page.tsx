import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Departments",
  description:
    "Explore Riverside Family Clinic's clinical departments: family medicine, pediatrics, women's health, urgent care, cardiology, behavioral health, orthopedics, dermatology, laboratory, and imaging.",
};

export default function DepartmentsPage() {
  return (
    <main>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>Departments
          </nav>
          <h1>Clinical departments</h1>
          <p>
            Riverside Family Clinic brings primary, specialty, and diagnostic
            care together under one roof. Each department is led by
            board-certified physicians and works as one connected care team, so
            your records, referrals, and results move with you.
          </p>
        </div>
      </section>

      <section>
        <div className="container layout">
          {/* Sidebar quick nav */}
          <aside className="sidebar">
            <h4>Jump to department</h4>
            <ul>
              <li><a href="#family-medicine">Family Medicine</a></li>
              <li><a href="#pediatrics">Pediatrics</a></li>
              <li><a href="#womens-health">Women&apos;s Health</a></li>
              <li><a href="#urgent-care">Urgent Care</a></li>
              <li><a href="#cardiology">Cardiology</a></li>
              <li><a href="#behavioral-health">Behavioral Health</a></li>
              <li><a href="#orthopedics">Orthopedics &amp; Sports</a></li>
              <li><a href="#dermatology">Dermatology</a></li>
              <li><a href="#laboratory">Laboratory</a></li>
              <li><a href="#imaging">Imaging &amp; Radiology</a></li>
            </ul>
            <h4>Need help choosing?</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: "0 0 14px" }}>
              Not sure which department fits? Ask our chat assistant or call the
              front desk.
            </p>
            <Link
              className="btn btn-primary"
              href="/appointments"
              style={{ width: "100%", textAlign: "center" }}
            >
              Book a visit
            </Link>
          </aside>

          {/* Department list */}
          <div>
            <article className="dept-card" id="family-medicine">
              <div className="dept-head">
                <div className="ico">👨‍👩‍👧</div>
                <div>
                  <div className="dept-tag">Primary Care</div>
                  <h3>Family Medicine</h3>
                </div>
              </div>
              <p>
                Your medical home for every age. Family medicine providers handle
                annual physicals, ongoing management of chronic conditions, and
                coordinate any specialty referrals you need. Same-day sick visits
                are usually available.
              </p>
              <ul className="conditions">
                <li>Annual wellness &amp; physical exams</li>
                <li>Diabetes &amp; prediabetes management</li>
                <li>High blood pressure &amp; cholesterol</li>
                <li>Asthma &amp; COPD care</li>
                <li>Thyroid &amp; hormone concerns</li>
                <li>Preventive screenings &amp; referrals</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/doctors#anita-rao">See our family medicine team →</Link>
              </p>
            </article>

            <article className="dept-card" id="pediatrics">
              <div className="dept-head">
                <div className="ico">🧸</div>
                <div>
                  <div className="dept-tag">Children&apos;s Health</div>
                  <h3>Pediatrics</h3>
                </div>
              </div>
              <p>
                From newborn checkups to the teenage years, our pediatric team
                partners with families on healthy growth and development. We
                follow the full CDC/AAP immunization schedule and offer school and
                sports physicals year-round.
              </p>
              <ul className="conditions">
                <li>Newborn &amp; well-child visits</li>
                <li>Growth &amp; developmental screening</li>
                <li>Childhood immunizations</li>
                <li>School &amp; sports physicals</li>
                <li>Ear infections &amp; common illness</li>
                <li>ADHD &amp; behavioral guidance</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/doctors#james-cole">Meet our pediatricians →</Link>
              </p>
            </article>

            <article className="dept-card" id="womens-health">
              <div className="dept-head">
                <div className="ico">🌸</div>
                <div>
                  <div className="dept-tag">OB-GYN</div>
                  <h3>Women&apos;s Health</h3>
                </div>
              </div>
              <p>
                Comprehensive care through every stage of life, delivered with a
                gentle, unhurried approach. Our OB-GYN team supports routine
                wellness, family planning, pregnancy, and menopause.
              </p>
              <ul className="conditions">
                <li>Well-woman &amp; pelvic exams</li>
                <li>Contraception counseling</li>
                <li>Prenatal &amp; postpartum care</li>
                <li>Menopause management</li>
                <li>Cervical &amp; breast screenings</li>
                <li>Bone density evaluation</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/doctors#maria-perez">Meet our OB-GYN team →</Link>
              </p>
            </article>

            <article className="dept-card" id="urgent-care">
              <div className="dept-head">
                <div className="ico">🩺</div>
                <div>
                  <div className="dept-tag">
                    Walk-in <span className="badge badge-open">Open now</span>
                  </div>
                  <h3>Urgent Care</h3>
                </div>
              </div>
              <p>
                No appointment needed for non-emergency illness and injury. Our
                walk-in clinic treats most minor conditions with an average wait
                under 20 minutes, and can run rapid tests on site.
              </p>
              <ul className="conditions">
                <li>Colds, flu &amp; sore throat</li>
                <li>Minor cuts &amp; sprains</li>
                <li>Ear &amp; sinus infections</li>
                <li>Rapid strep &amp; COVID-19 testing</li>
                <li>Minor burns &amp; rashes</li>
                <li>Work &amp; travel physicals</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/services#urgent-care">Urgent care details &amp; cost →</Link>
              </p>
            </article>

            <article className="dept-card" id="cardiology">
              <div className="dept-head">
                <div className="ico">❤️</div>
                <div>
                  <div className="dept-tag">Heart &amp; Vascular</div>
                  <h3>Cardiology</h3>
                </div>
              </div>
              <p>
                Visiting cardiology clinic for heart-health evaluation and ongoing
                management. Our cardiologists treat common heart problems and help
                stabilize high cholesterol and high blood pressure, coordinating
                closely with your primary care provider.
              </p>
              <ul className="conditions">
                <li>Heart disease risk assessment</li>
                <li>High blood pressure &amp; angina</li>
                <li>EKG &amp; Holter monitoring</li>
                <li>Echocardiogram (on-site)</li>
                <li>Cholesterol management</li>
                <li>Post-event follow-up care</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/doctors#david-okafor">Meet our cardiologist →</Link>
              </p>
            </article>

            <article className="dept-card" id="behavioral-health">
              <div className="dept-head">
                <div className="ico">🧠</div>
                <div>
                  <div className="dept-tag">Mental &amp; Behavioral</div>
                  <h3>Behavioral Health</h3>
                </div>
              </div>
              <p>
                Confidential support for emotional wellbeing, integrated with your
                primary care so mind and body are treated together. We offer
                counseling, medication management, and referrals to specialty
                care.
              </p>
              <ul className="conditions">
                <li>Anxiety &amp; depression</li>
                <li>Stress &amp; sleep concerns</li>
                <li>Medication management</li>
                <li>Individual counseling</li>
                <li>Substance-use screening</li>
                <li>Grief &amp; life transitions</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/doctors#sarah-lin">Meet our behavioral health team →</Link>
              </p>
            </article>

            <article className="dept-card" id="orthopedics">
              <div className="dept-head">
                <div className="ico">🦴</div>
                <div>
                  <div className="dept-tag">Bone, Joint &amp; Sports</div>
                  <h3>Orthopedics &amp; Sports Medicine</h3>
                </div>
              </div>
              <p>
                Evaluation and non-surgical treatment of muscle, bone, and joint
                injuries, plus sports-medicine care to get active patients back in
                the game. On-site X-ray supports same-visit diagnosis.
              </p>
              <ul className="conditions">
                <li>Sprains, strains &amp; fractures</li>
                <li>Joint &amp; back pain</li>
                <li>Sports injury evaluation</li>
                <li>Bracing &amp; casting</li>
                <li>Joint injections</li>
                <li>Physical therapy referrals</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/doctors#marcus-hill">Meet our orthopedics team →</Link>
              </p>
            </article>

            <article className="dept-card" id="dermatology">
              <div className="dept-head">
                <div className="ico">🧴</div>
                <div>
                  <div className="dept-tag">Skin Health</div>
                  <h3>Dermatology</h3>
                </div>
              </div>
              <p>
                Medical dermatology for skin, hair, and nail concerns, including
                annual skin-cancer screening. Suspicious spots can be biopsied
                during your visit.
              </p>
              <ul className="conditions">
                <li>Acne &amp; eczema</li>
                <li>Skin-cancer screening</li>
                <li>Mole &amp; lesion removal</li>
                <li>Rashes &amp; dermatitis</li>
                <li>Psoriasis management</li>
                <li>Skin biopsies</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/doctors#priya-shah">Meet our dermatologist →</Link>
              </p>
            </article>

            <article className="dept-card" id="laboratory">
              <div className="dept-head">
                <div className="ico">🧪</div>
                <div>
                  <div className="dept-tag">Diagnostics</div>
                  <h3>Laboratory Services</h3>
                </div>
              </div>
              <p>
                A full on-site lab means most blood work is drawn and processed in
                house, with results typically available in 24–48 hours through the
                patient portal.
              </p>
              <ul className="conditions">
                <li>Complete blood count (CBC)</li>
                <li>Cholesterol / lipid panel</li>
                <li>A1C &amp; glucose testing</li>
                <li>Thyroid panels</li>
                <li>Pregnancy testing</li>
                <li>Rapid strep &amp; COVID-19</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/services#lab">Lab services &amp; cost →</Link>
              </p>
            </article>

            <article className="dept-card" id="imaging">
              <div className="dept-head">
                <div className="ico">🩻</div>
                <div>
                  <div className="dept-tag">Radiology</div>
                  <h3>Imaging &amp; Radiology</h3>
                </div>
              </div>
              <p>
                On-site digital X-ray and ultrasound support fast diagnosis
                without a separate trip. Images are read by our partnered
                radiology group, usually the same day.
              </p>
              <ul className="conditions">
                <li>Digital X-ray</li>
                <li>Diagnostic ultrasound</li>
                <li>Bone-density (DEXA) referral</li>
                <li>Fracture &amp; injury imaging</li>
                <li>Chest &amp; sinus imaging</li>
                <li>Same-day radiology reads</li>
              </ul>
              <p style={{ marginTop: 16 }}>
                <Link href="/services#imaging">Imaging services &amp; cost →</Link>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="soft">
        <div className="container">
          <div className="cta">
            <h2>Not sure which department you need?</h2>
            <p>
              Tell us what&apos;s going on and we&apos;ll point you to the right
              care. Book online, call the front desk, or ask our chat assistant in
              the corner.
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
