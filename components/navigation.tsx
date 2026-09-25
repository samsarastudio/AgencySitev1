"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const links = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["Photo Experiences", "/photo-experiences"],
  ["Insights", "/insights"],
  ["About", "/about"],
];
export function Navigation() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="InMoment Services home">
        <Logo />
      </Link>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}{" "}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <nav
        id="main-nav"
        aria-label="Main navigation"
        className={open ? "is-open" : ""}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
          }
        }}
      >
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        <Link className="nav-cta" href="/contact" data-event="start_project">
          Start a project <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}
