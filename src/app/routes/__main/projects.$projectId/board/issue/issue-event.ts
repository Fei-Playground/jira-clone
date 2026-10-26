import type { LoaderFunctionArgs } from "react-router";
import { eventStream } from "remix-utils/sse/server";
import { EVENTS } from "@app/events";
import { emitter } from "@app/events/emitter.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, (send) => {
    // Emitters pass Date.now(); SSE data must be a string.
    const handleIssueCreated = (timestamp: number) => {
      send({ event: EVENTS.ISSUE_CREATED, data: String(timestamp) });
    };

    const handleIssueChanged = (timestamp: number) => {
      send({ event: EVENTS.ISSUE_CHANGED, data: String(timestamp) });
    };

    const handleIssueDeleted = (timestamp: number) => {
      send({ event: EVENTS.ISSUE_DELETED, data: String(timestamp) });
    };

    emitter.on(EVENTS.ISSUE_CREATED, handleIssueCreated);
    emitter.on(EVENTS.ISSUE_CHANGED, handleIssueChanged);
    emitter.on(EVENTS.ISSUE_DELETED, handleIssueDeleted);

    return () => {
      emitter.off(EVENTS.ISSUE_CHANGED, handleIssueChanged);
      emitter.off(EVENTS.ISSUE_CREATED, handleIssueCreated);
      emitter.off(EVENTS.ISSUE_DELETED, handleIssueDeleted);
    };
  });
}
