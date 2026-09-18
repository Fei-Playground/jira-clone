import cx from "classix";
import { buildHighlightSegments } from "@domain/lorebook";
import { LoreInjectionSnapshot } from "@domain/chat-message";
import { useTranslation } from "@app/store/locale.store";

export const HighlightedMessageText = ({
  text,
  injections,
  isUser,
}: {
  text: string;
  injections: LoreInjectionSnapshot[] | undefined;
  isUser: boolean;
}): JSX.Element => {
  const { t } = useTranslation();
  const segments = buildHighlightSegments(text, injections);

  return (
    <>
      {segments.map((segment, index) => {
        if (!segment.entryId) {
          return <span key={index}>{segment.text}</span>;
        }

        const tooltipTitle = t("companions.lorebook.highlightTooltip", {
          name: segment.entryName ?? "",
        });

        return (
          <span key={index} className="inline">
            <mark
              title={tooltipTitle}
              aria-label={tooltipTitle}
              className={cx(
                "rounded-sm bg-transparent px-0.5 underline decoration-dotted decoration-2 underline-offset-4",
                isUser
                  ? "bg-white/40 text-font-inverse decoration-white"
                  : "bg-background-brand-subtlest text-font-brand decoration-font-brand"
              )}
            >
              {segment.text}
            </mark>
          </span>
        );
      })}
    </>
  );
};
