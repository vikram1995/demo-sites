import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AcaWidget from "@/components/AcaWidget";

// The original site used an inline SVG data-URI favicon on every page.
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230e7490'/%3E%3Cpath d='M44 22h12v22h22v12H56v22H44V56H22V44h22z' fill='white'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: {
    default:
      "Riverside Family Clinic — Compassionate care for every stage of life",
    template: "%s — Riverside Family Clinic",
  },
  description:
    "Riverside Family Clinic offers family medicine, pediatrics, women's health, urgent care, lab services, and vaccinations in downtown Riverside. Book an appointment today.",
  icons: {
    icon: FAVICON,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <AcaWidget />
      </body>
    </html>
  );
}
