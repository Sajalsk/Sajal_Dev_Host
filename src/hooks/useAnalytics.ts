import { useEffect } from "react";
import { trackAnalyticsEvent } from "../lib/api";

export function usePageAnalytics() {
  useEffect(() => {
    trackAnalyticsEvent("page_view");
  }, []);
}
