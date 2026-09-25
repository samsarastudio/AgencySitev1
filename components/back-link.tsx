"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export function BackLink({ href, label }: { href: string; label: string }) {
  const [target, setTarget] = useState(href);
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (from && from.split("?")[0] === href) setTarget(from);
  }, [href]);
  return (
    <Link className="text-link" href={target}>
      ← {label}
    </Link>
  );
}
