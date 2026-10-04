"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/departments", label: "Departments" },
  { href: "/doctors", label: "Find a Doctor" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/locations", label: "Locations" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">
          <span className="logo">✚</span>
          <span>
            Riverside Family Clinic
            <small>DOWNTOWN RIVERSIDE</small>
          </span>
        </Link>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link href={link.href} className={isActive ? "active" : undefined}>
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/appointments" className="btn btn-primary nav-book">
              Book appointment
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
