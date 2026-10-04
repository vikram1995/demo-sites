import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: "#fff" }}>
              <span className="logo">✚</span>
              <span>Riverside Family Clinic</span>
            </div>
            <p style={{ marginTop: 14, color: "#94a3b8", maxWidth: "40ch" }}>
              Compassionate primary, pediatric, and urgent care for the Riverside
              community since 2004.
            </p>
          </div>
          <div>
            <h4>Care</h4>
            <ul>
              <li>
                <Link href="/departments">Departments</Link>
              </li>
              <li>
                <Link href="/services">Services &amp; Pricing</Link>
              </li>
              <li>
                <Link href="/doctors">Find a Doctor</Link>
              </li>
              <li>
                <Link href="/services#urgent-care">Urgent Care</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              <li>
                <Link href="/locations">Hours &amp; Location</Link>
              </li>
              <li>
                <Link href="/locations#insurance">Insurance</Link>
              </li>
              <li>
                <Link href="/#faq">FAQ</Link>
              </li>
              <li>
                <Link href="/appointments">Book Appointment</Link>
              </li>
              <li>
                <Link href="/dashboard">Staff Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Riverside Family Clinic. This is a fictional demo site.</span>
          <span>For emergencies, call 911.</span>
        </div>
      </div>
    </footer>
  );
}
