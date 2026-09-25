"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track, campaignParams } from "@/lib/analytics";
export function Analytics() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const trigger = document.getElementById("privacy-preferences-trigger");
    const show = () => setOpen(true);
    trigger?.addEventListener("click", show);
    const click = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-event]",
      );
      if (target?.dataset.event) track(target.dataset.event);
    };
    document.addEventListener("click", click);
    return () => {
      trigger?.removeEventListener("click", show);
      document.removeEventListener("click", click);
    };
  }, []);
  useEffect(() => {
    if (open) first.current?.focus();
  }, [open]);
  useEffect(() => {
    track("page_view");
    if (path.startsWith("/work/")) track("case_study_view");
    if (path === "/capabilities") track("capabilities_visit");
    campaignParams();
    if (new URLSearchParams(window.location.search).has("utm_source")) track("campaign_landing_visit");
    const timer = path.startsWith("/services/")
      ? setTimeout(() => track("service_engagement"), 15000)
      : undefined;
    return () => clearTimeout(timer);
  }, [path]);
  function choose(value: string) {
    try {
      localStorage.setItem("inmoment-analytics", value);
    } catch {}
    setOpen(false);
    document.getElementById("privacy-preferences-trigger")?.focus();
  }
  return open ? (
    <section
      className="consent-panel"
      role="region"
      aria-label="Cookie preferences"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          document.getElementById("privacy-preferences-trigger")?.focus();
        }
      }}
    >
      <h2>Your privacy choices</h2>
      <p>
        Essential storage remembers this preference. Optional analytics can help
        us understand page visits and interactions. Form contents are never
        included. No advertising trackers are enabled.
      </p>
      <div>
        <button ref={first} onClick={() => choose("denied")}>
          Essential only
        </button>
        <button onClick={() => choose("allowed")}>Allow analytics</button>
      </div>
    </section>
  ) : null;
}
