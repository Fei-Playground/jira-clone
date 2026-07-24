import { OlgaButton } from "@olga/components/button";
import { ZoneBanner } from "@olga/components/zone-banner";
import { mockMeeting, mockMatches } from "@olga/domain/mock-data";
import type { Meeting, Match } from "@olga/domain/types";

interface MeetingConfirmScreenProps {
  meeting?: Meeting;
  match?: Match;
  onBack?: () => void;
}

/** Generate a minimal .ics file and trigger browser download */
const downloadIcs = (meeting: Meeting, matchName: string): void => {
  const startDate = new Date(meeting.proposedAt);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 min

  const formatIcsDate = (d: Date): string =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OLGA//OLGA v2//EN",
    "BEGIN:VEVENT",
    `UID:${meeting.id}@olga.app`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:OLGA Meeting with ${matchName}`,
    `LOCATION:${meeting.venueName} — ${meeting.zone}`,
    `DESCRIPTION:Arranged via OL-GA · ${meeting.venueName}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `olga-meeting-${meeting.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
};

const formatMeetingTime = (isoString: string): string => {
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

export const MeetingConfirmScreen = ({
  meeting = mockMeeting,
  match = mockMatches[0],
  onBack,
}: MeetingConfirmScreenProps): JSX.Element => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface">
      {/* Header */}
      <div className="border-b border-olga-rule bg-white px-5 pb-5 pt-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-sm text-olga-slate transition-colors hover:text-olga-navy"
          aria-label="Back to messenger"
        >
          ← Messenger
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-olga-approved">
          Meeting confirmed
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-olga-ink">
          You&apos;re set to meet
        </h1>
      </div>

      <div className="flex-1 space-y-5 px-5 py-5">
        {/* Meeting card */}
        <div className="overflow-hidden rounded-xl border-l-4 border-olga-approved bg-white shadow-olga-card">
          <div className="space-y-4 p-5">
            {/* Person */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-olga-navy">
                <span className="font-mono text-xs font-[500] text-white">
                  {match.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-olga-ink">
                  {match.user.name}
                </p>
                <p className="text-xs text-olga-slate">{match.user.employer}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="font-mono text-lg font-[500] text-olga-navy">
                  {match.score}%
                </span>
                <p className="text-[11px] uppercase tracking-wider text-olga-slate">
                  fit
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-olga-rule" />

            {/* Time */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olga-surface">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--olga-slate)"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-olga-slate">
                  When
                </p>
                <p className="mt-0.5 text-sm text-olga-ink">
                  {formatMeetingTime(meeting.proposedAt)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olga-surface">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--olga-slate)"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-olga-slate">
                  Where
                </p>
                <p className="mt-0.5 text-sm text-olga-ink">
                  {meeting.venueName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Zone banner */}
        <ZoneBanner
          zoneName={meeting.zone}
          description="Meet here — this is the active zone at the venue"
        />

        {/* Privacy note */}
        <div className="rounded-lg border border-olga-rule bg-olga-surface px-4 py-3">
          <p className="text-xs leading-relaxed text-olga-slate">
            <span className="font-medium text-olga-ink">Privacy note:</span>{" "}
            Your contact details are not shared. This meeting was arranged
            entirely within OLGA.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 border-t border-olga-rule bg-white px-5 py-4">
        <OlgaButton
          variant="primary"
          fullWidth
          onClick={() => downloadIcs(meeting, match.user.name)}
        >
          Add to calendar (.ics)
        </OlgaButton>
        <OlgaButton variant="ghost" fullWidth onClick={onBack}>
          Back to messages
        </OlgaButton>
      </div>
    </div>
  );
};
