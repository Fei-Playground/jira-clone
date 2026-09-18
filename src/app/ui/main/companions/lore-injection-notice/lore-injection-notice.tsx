import { useState } from "react";
import {
  RiBookOpenLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import { LoreInjectionSnapshot } from "@domain/chat-message";
import { useTranslation } from "@app/store/locale.store";

export const LoreInjectionNotice = ({
  injections,
}: {
  injections: LoreInjectionSnapshot[];
}): JSX.Element | null => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  if (injections.length === 0) return null;

  const names = injections.map((injection) => injection.entryName).join("、");

  return (
    <div className="mb-1 max-w-[65%] rounded-md border border-border bg-elevation-surface-sunken px-3 py-2 text-xs">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-label={
          isExpanded
            ? t("companions.lorebook.injectedNoticeCollapse")
            : t("companions.lorebook.injectedNoticeExpand")
        }
        className="flex w-full items-center gap-1.5 text-font-subtlest hover:text-font"
      >
        <RiBookOpenLine size={14} className="shrink-0" />
        <span className="flex-1 truncate text-left">
          {t("companions.lorebook.injectedNotice", { names })}
        </span>
        {isExpanded ? (
          <RiArrowUpSLine size={16} />
        ) : (
          <RiArrowDownSLine size={16} />
        )}
      </button>

      {isExpanded && (
        <ul className="mt-2 space-y-2 border-t border-border pt-2">
          {injections.map((injection) => (
            <li key={injection.entryId}>
              <p className="font-primary-bold text-font">
                {injection.entryName}
              </p>
              {injection.matchedKeyword && (
                <p className="text-font-subtlest">
                  {t("companions.lorebook.matchedKeyword", {
                    keyword: injection.matchedKeyword,
                  })}
                </p>
              )}
              <p className="mt-0.5 text-font-subtlest">{injection.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
