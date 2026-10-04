import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Detailed services and self-pay pricing at Riverside Family Clinic: office visits, urgent care, physicals, women's health, lab work, imaging, and vaccinations. Transparent cash prices and insurance accepted.",
};

export default function ServicesPage() {
  return (
    <main>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>Services &amp; Pricing
          </nav>
          <h1>Services &amp; pricing</h1>
          <p>
            Clear, upfront pricing for the care you need. The cash (self-pay)
            prices below apply when you don&apos;t use insurance. With insurance,
            your cost depends on your plan — we&apos;ll verify your benefits before
            your visit. HSA/FSA cards are welcome.
          </p>
        </div>
      </section>

      <section>
        <div className="container layout">
          {/* Sidebar quick nav */}
          <aside className="sidebar">
            <h4>Services</h4>
            <ul>
              <li><a href="#office-visits">Office Visits</a></li>
              <li><a href="#urgent-care">Urgent Care</a></li>
              <li><a href="#physicals">Physicals &amp; Screenings</a></li>
              <li><a href="#womens-health">Women&apos;s Health</a></li>
              <li><a href="#lab">Laboratory</a></li>
              <li><a href="#imaging">Imaging &amp; Radiology</a></li>
              <li><a href="#vaccinations">Vaccinations</a></li>
            </ul>
            <h4>Billing</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: "0 0 14px" }}>
              Questions about a bill or coverage? Our team can verify benefits
              before you come in.
            </p>
            <Link
              className="btn btn-primary"
              href="/locations#insurance"
              style={{ width: "100%", textAlign: "center" }}
            >
              Insurance &amp; billing
            </Link>
          </aside>

          <div>
            {/* Office Visits */}
            <article className="svc-detail" id="office-visits">
              <h3>Office Visits</h3>
              <p>
                One-on-one time with a family medicine or pediatric provider for
                new concerns, follow-ups, and chronic-condition management. Most
                visits run 20–30 minutes.
              </p>
              <ul className="includes">
                <li>Provider consultation &amp; exam</li>
                <li>Care plan &amp; prescriptions</li>
                <li>Referral coordination</li>
                <li>Patient-portal follow-up</li>
              </ul>
              <table className="price-table" style={{ marginTop: 22 }}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th style={{ textAlign: "right" }}>Self-pay price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="svc-name">New patient visit</div>
                      <div className="svc-desc">First visit, full history &amp; exam</div>
                    </td>
                    <td className="price">$150</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Established patient visit</div>
                      <div className="svc-desc">Routine follow-up or new concern</div>
                    </td>
                    <td className="price">$95</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Chronic care check-in</div>
                      <div className="svc-desc">Diabetes, blood pressure, asthma review</div>
                    </td>
                    <td className="price">$110</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Telehealth visit</div>
                      <div className="svc-desc">Video visit for eligible concerns</div>
                    </td>
                    <td className="price">$75</td>
                  </tr>
                </tbody>
              </table>
              <p className="price-note">
                Sliding-scale discounts available for qualifying uninsured patients.
              </p>
            </article>

            {/* Urgent Care */}
            <article className="svc-detail" id="urgent-care">
              <h3>
                Urgent Care{" "}
                <span className="badge badge-open" style={{ verticalAlign: "middle" }}>
                  Walk-in
                </span>
              </h3>
              <p>
                Walk-in treatment for non-emergency illness and injury during
                clinic hours — no appointment needed. Average wait is under 20
                minutes, and we can run rapid tests on site.
              </p>
              <ul className="includes">
                <li>Walk-in, no appointment</li>
                <li>Rapid strep &amp; COVID-19 testing</li>
                <li>Minor wound &amp; injury care</li>
                <li>On-site X-ray if needed</li>
              </ul>
              <table className="price-table" style={{ marginTop: 22 }}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th style={{ textAlign: "right" }}>Self-pay price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="svc-name">Urgent care visit</div>
                      <div className="svc-desc">Colds, flu, minor injuries, infections</div>
                    </td>
                    <td className="price">$125</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Rapid strep test</div>
                      <div className="svc-desc">Results in about 15 minutes</div>
                    </td>
                    <td className="price">$30</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Rapid COVID-19 test</div>
                      <div className="svc-desc">Antigen test, same-visit result</div>
                    </td>
                    <td className="price">$40</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Simple laceration repair</div>
                      <div className="svc-desc">Cleaning &amp; closure of minor cuts</div>
                    </td>
                    <td className="price">from $180</td>
                  </tr>
                </tbody>
              </table>
              <p className="price-note">
                For life-threatening emergencies, call 911 or go to the nearest ER.
              </p>
            </article>

            {/* Physicals & Screenings */}
            <article className="svc-detail" id="physicals">
              <h3>Physicals &amp; Screenings</h3>
              <p>
                Preventive exams for school, work, sports, and annual wellness,
                plus the screenings that keep small issues from becoming big ones.
              </p>
              <ul className="includes">
                <li>Head-to-toe physical exam</li>
                <li>Vitals &amp; BMI review</li>
                <li>Form completion (school/work)</li>
                <li>Preventive counseling</li>
              </ul>
              <table className="price-table" style={{ marginTop: 22 }}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th style={{ textAlign: "right" }}>Self-pay price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="svc-name">Annual wellness physical</div>
                      <div className="svc-desc">Adult preventive exam</div>
                    </td>
                    <td className="price">$130</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">School / sports physical</div>
                      <div className="svc-desc">Includes required form</div>
                    </td>
                    <td className="price">$55</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Well-child visit</div>
                      <div className="svc-desc">Growth &amp; development check</div>
                    </td>
                    <td className="price">$110</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Employment / DOT physical</div>
                      <div className="svc-desc">Pre-employment or commercial driver</div>
                    </td>
                    <td className="price">$95</td>
                  </tr>
                </tbody>
              </table>
            </article>

            {/* Women's Health */}
            <article className="svc-detail" id="womens-health">
              <h3>Women&apos;s Health</h3>
              <p>
                Well-woman care, screenings, and family-planning support delivered
                by our OB-GYN team. See the{" "}
                <Link href="/departments#womens-health">Women&apos;s Health department</Link>{" "}
                for the full scope of care.
              </p>
              <ul className="includes">
                <li>Well-woman exam</li>
                <li>Contraception counseling</li>
                <li>Cervical cancer screening</li>
                <li>Prenatal visit coordination</li>
              </ul>
              <table className="price-table" style={{ marginTop: 22 }}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th style={{ textAlign: "right" }}>Self-pay price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="svc-name">Well-woman exam</div>
                      <div className="svc-desc">Annual preventive visit</div>
                    </td>
                    <td className="price">$140</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Pap smear screening</div>
                      <div className="svc-desc">Cervical cancer screening</div>
                    </td>
                    <td className="price">$85</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">IUD placement</div>
                      <div className="svc-desc">Device cost billed separately</div>
                    </td>
                    <td className="price">from $200</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Prenatal initial visit</div>
                      <div className="svc-desc">First-trimester intake</div>
                    </td>
                    <td className="price">$160</td>
                  </tr>
                </tbody>
              </table>
            </article>

            {/* Laboratory */}
            <article className="svc-detail" id="lab">
              <h3>Laboratory Services</h3>
              <p>
                Most blood work is drawn and processed in our on-site lab, with
                results typically posted to the patient portal within 24–48 hours.
              </p>
              <ul className="includes">
                <li>On-site blood draw</li>
                <li>Results in 24–48 hours</li>
                <li>Portal result delivery</li>
                <li>Provider follow-up on abnormals</li>
              </ul>
              <table className="price-table" style={{ marginTop: 22 }}>
                <thead>
                  <tr>
                    <th>Test</th>
                    <th style={{ textAlign: "right" }}>Self-pay price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="svc-name">Complete blood count (CBC)</div>
                      <div className="svc-desc">General health screen</div>
                    </td>
                    <td className="price">$25</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Lipid / cholesterol panel</div>
                      <div className="svc-desc">Fasting recommended</div>
                    </td>
                    <td className="price">$35</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Hemoglobin A1C</div>
                      <div className="svc-desc">Diabetes monitoring</div>
                    </td>
                    <td className="price">$30</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Thyroid panel (TSH)</div>
                      <div className="svc-desc">Thyroid function</div>
                    </td>
                    <td className="price">$40</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Pregnancy test (blood)</div>
                      <div className="svc-desc">Quantitative hCG</div>
                    </td>
                    <td className="price">$20</td>
                  </tr>
                </tbody>
              </table>
            </article>

            {/* Imaging */}
            <article className="svc-detail" id="imaging">
              <h3>Imaging &amp; Radiology</h3>
              <p>
                On-site digital X-ray and ultrasound support fast diagnosis without
                a separate trip. Images are read by our partnered radiology group,
                usually the same day.
              </p>
              <ul className="includes">
                <li>Digital X-ray on site</li>
                <li>Diagnostic ultrasound</li>
                <li>Same-day radiology read</li>
                <li>Results sent to your provider</li>
              </ul>
              <table className="price-table" style={{ marginTop: 22 }}>
                <thead>
                  <tr>
                    <th>Study</th>
                    <th style={{ textAlign: "right" }}>Self-pay price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="svc-name">X-ray, single region</div>
                      <div className="svc-desc">e.g. chest, wrist, ankle</div>
                    </td>
                    <td className="price">$90</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">X-ray, additional region</div>
                      <div className="svc-desc">Each added area</div>
                    </td>
                    <td className="price">$45</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Diagnostic ultrasound</div>
                      <div className="svc-desc">Limited, non-OB</div>
                    </td>
                    <td className="price">$140</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Radiology interpretation</div>
                      <div className="svc-desc">Specialist read &amp; report</div>
                    </td>
                    <td className="price">$35</td>
                  </tr>
                </tbody>
              </table>
            </article>

            {/* Vaccinations */}
            <article className="svc-detail" id="vaccinations">
              <h3>Vaccinations</h3>
              <p>
                Seasonal, routine, and travel vaccines for the whole family. No
                appointment is required for seasonal flu clinics during posted
                hours.
              </p>
              <ul className="includes">
                <li>Adult &amp; childhood vaccines</li>
                <li>Travel vaccine counseling</li>
                <li>Walk-in flu clinics</li>
                <li>Immunization records to portal</li>
              </ul>
              <table className="price-table" style={{ marginTop: 22 }}>
                <thead>
                  <tr>
                    <th>Vaccine</th>
                    <th style={{ textAlign: "right" }}>Self-pay price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="svc-name">Seasonal flu shot</div>
                      <div className="svc-desc">Quadrivalent</div>
                    </td>
                    <td className="price">$40</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">COVID-19 booster</div>
                      <div className="svc-desc">Current formulation</div>
                    </td>
                    <td className="price">$0–$50</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Tdap (tetanus)</div>
                      <div className="svc-desc">Booster every 10 years</div>
                    </td>
                    <td className="price">$65</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="svc-name">Shingles (2-dose series)</div>
                      <div className="svc-desc">Price per dose</div>
                    </td>
                    <td className="price">$190</td>
                  </tr>
                </tbody>
              </table>
              <p className="price-note">
                Many vaccines are covered at no cost under preventive care by most
                insurance plans.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="soft">
        <div className="container">
          <div className="cta">
            <h2>Have a question about cost or coverage?</h2>
            <p>
              Ask our chat assistant for an estimate, or call the front desk and
              we&apos;ll verify your insurance benefits before your visit.
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
