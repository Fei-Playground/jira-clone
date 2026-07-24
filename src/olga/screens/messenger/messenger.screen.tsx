import { useState } from "react";
import { ChatBubble } from "@olga/components/chat-bubble";
import { MatchScoreDisplay } from "@olga/components/match-score";
import { mockMessages, mockMatches } from "@olga/domain/mock-data";
import { formatDistanceToNow } from "@olga/utils/format-time";

export const MessengerScreen = ({
  matchId = "match-01",
}: MessengerScreenProps): JSX.Element => {
  const match = mockMatches.find((m) => m.id === matchId);
  const [messages, setMessages] = useState(
    mockMessages.filter((m) => m.matchId === matchId)
  );
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        matchId,
        variant: "own",
        text,
        sentAt: Date.now(),
      },
    ]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!match) return <div className="p-8 text-olga-slate">Match not found</div>;

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-white">
      {/* Header */}
      <div className="border-b border-olga-rule px-5 pb-4 pt-10">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
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
          <div className="ml-auto">
            <MatchScoreDisplay score={match.score} explanation="" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            variant={msg.variant}
            message={msg.text}
            timestamp={formatDistanceToNow(msg.sentAt)}
          />
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-olga-rule bg-white px-5 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-lg border border-olga-rule px-3 py-3 text-sm text-olga-ink outline-none placeholder:text-olga-slate-lt focus:border-olga-navy"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olga-navy transition-opacity disabled:opacity-40"
            aria-label="Send message"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="m22 2-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface MessengerScreenProps {
  matchId?: string;
}
