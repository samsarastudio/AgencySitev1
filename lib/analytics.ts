"use client";
export type AnalyticsEvent = {
  name: string;
  path: string;
  campaign: Record<string, string>;
  properties: Record<string, string | number | boolean>;
};
type Adapter = (event: AnalyticsEvent) => void;
let adapter: Adapter = () => {};
let landingCampaign: Record<string, string> = {};
export const configureAnalytics = (next: Adapter) => {
  adapter = next;
};
export function campaignParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const current = Object.fromEntries(
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].flatMap((k) => {
      const v = params.get(k);
      return v ? [[k, v.slice(0, 200)]] : [];
    }),
  );
  if (Object.keys(current).length) landingCampaign = current;
  return { ...landingCampaign };
}
export function track(
  name: string,
  properties: AnalyticsEvent["properties"] = {},
) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("inmoment-analytics") !== "allowed") return;
    const event = {
      name,
      path: window.location.pathname,
      campaign: campaignParams(),
      properties,
    };
    adapter(event);
    window.dispatchEvent(
      new CustomEvent("inmoment:analytics", { detail: event }),
    );
  } catch {
    /* Storage restrictions or an adapter must not block navigation. */
  }
}
