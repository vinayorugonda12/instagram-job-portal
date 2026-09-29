import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../lib/analytics";

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent({
      eventType: "PAGE_VIEW",
    });
  }, [location.pathname]);

  return null;
}

export default PageTracker;