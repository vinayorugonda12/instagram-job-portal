import { supabase } from "./supabase";

export async function trackEvent({
  eventType,
  jobId = null,
  userId = null,
}) {
  try {
    const sessionId = getSessionId();

    const { error } = await supabase
      .from("analytics_events")
      .insert([
        {
          event_type: eventType,
          job_id: jobId,
          user_id: userId,
          session_id: sessionId,
        },
      ]);

    if (error) {
      console.error("Analytics error:", error);
    }
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

function getSessionId() {
  let sessionId = sessionStorage.getItem("analytics_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    sessionStorage.setItem(
      "analytics_session_id",
      sessionId
    );
  }

  return sessionId;
}