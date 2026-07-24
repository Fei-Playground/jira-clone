import cx from "classix";

export const ChatBubble = ({
  variant,
  message,
  timestamp,
}: ChatBubbleProps): JSX.Element => {
  const isOwn = variant === "own";

  return (
    <div className={cx("flex w-full", isOwn ? "justify-end" : "justify-start")}>
      <div className={cx("max-w-[80%]", isOwn ? "items-end" : "items-start")}>
        <div
          className={cx(
            "px-4 py-3 text-sm leading-relaxed",
            isOwn
              ? "rounded-[12px_12px_4px_12px] bg-olga-navy text-white"
              : "rounded-[12px_12px_12px_4px] bg-olga-surface text-olga-ink"
          )}
        >
          {message}
        </div>
        <p
          className={cx(
            "mt-1 text-[11px] text-olga-slate-lt",
            isOwn ? "text-right" : "text-left"
          )}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
};

interface ChatBubbleProps {
  variant: "own" | "other";
  message: string;
  timestamp: string;
}
