"use client";
import { useEffect, useState } from "react";
export function useQueryState(keys: string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  const signature = keys.join(",");
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search);
      setValues(
        Object.fromEntries(
          signature.split(",").map((k) => [k, q.get(k) || ""]),
        ),
      );
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [signature]);
  const update = (key: string, value: string, replace = false) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      url.pathname + url.search + url.hash,
    );
    setValues((v) => ({ ...v, [key]: value }));
  };
  return { values, update };
}
