import Link from "next/link";
import { Logo } from "./logo";
export function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer-top">
        <div>
          <Link
            href="/"
            className="brand-link"
            aria-label="InMoment Services home"
          >
            <Logo />
          </Link>
          <p>
            Ideas made interactive.
            <br />
            Experiences made real.
          </p>
          <a href="mailto:hello@inmomentservices.com" data-event="email_click">
            hello@inmomentservices.com ↗
          </a>
        </div>
        <div className="footer-links">
          {[
            ["Work", "/work"],
            ["Services", "/services"],
            ["Photo Experiences", "/photo-experiences"],
            ["Insights", "/insights"],
            ["About", "/about"],
            ["For Agencies", "/for-agencies"],
            ["Capabilities", "/capabilities"],
            ["Contact", "/contact"],
            ["FAQ", "/faq"],
            ["Event packages", "/packages"],
            ["Gallery", "/gallery"],
            ["Newsletter", "/newsletter"],
            ["Visit FrameFlix ↗", "https://frameflix.inmomentservices.com"],
          ].map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} InMoment Services</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <button type="button" id="privacy-preferences-trigger">
            Cookie preferences
          </button>
        </div>
        <span>From idea to in-person.</span>
      </div>
    </footer>
  );
}
