import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RiMoreLine } from "react-icons/ri";
import cx from "classix";
import { QuickAction } from "@domain/quick-action";
import { Tooltip } from "@app/components/tooltip";
import { useTranslation } from "@app/store/locale.store";

const VISIBLE_COUNT = 6;

// A row of contextual "say this" chips under a chat window. Renders nothing
// when there are no actions — callers don't need to guard for that. A
// normal click sends the chip's text immediately (same path as typing it);
// a Shift-click (or long-press, handled the same way) fills the input
// without sending, so the player can edit before sending.
export const QuickActionBar = ({
  actions,
  onSend,
  onFill,
}: {
  actions: QuickAction[];
  onSend: (text: string) => void;
  onFill: (text: string) => void;
}): JSX.Element | null => {
  const { t } = useTranslation();
  if (actions.length === 0) return null;

  const visible = actions.slice(0, VISIBLE_COUNT);
  const overflow = actions.slice(VISIBLE_COUNT);

  const handleClick = (action: QuickAction, e: React.MouseEvent) => {
    if (action.alwaysFill || e.shiftKey) {
      onFill(action.text);
    } else {
      onSend(action.text);
    }
  };

  return (
    <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1">
      {visible.map((action) => (
        <QuickActionChip
          key={action.id}
          action={action}
          onClick={handleClick}
        />
      ))}
      {overflow.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            aria-label={t("stories.quickAction.more")}
            className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-elevation-surface-raised px-2.5 py-1 text-xs text-font-subtlest hover:bg-background-neutral"
          >
            <RiMoreLine size={14} />
            {t("stories.quickAction.more")}
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={4}
              className="z-50 flex max-w-[280px] flex-col gap-1 rounded bg-elevation-surface-overlay p-2 shadow-md radix-side-top:animate-slide-up"
            >
              {overflow.map((action) => (
                <DropdownMenu.Item
                  key={action.id}
                  onClick={(e) =>
                    handleClick(action, e as unknown as React.MouseEvent)
                  }
                  className="cursor-pointer select-none rounded px-2 py-1.5 text-left text-xs text-font outline-none hover:bg-background-neutral"
                >
                  {sourcePrefix(action.source)}
                  {action.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
};

const sourcePrefix = (source: QuickAction["source"]): string => {
  if (source === "questKeyword") return "🎯 ";
  if (source === "loreKeyword") return "📖 ";
  return "";
};

const QuickActionChip = ({
  action,
  onClick,
}: {
  action: QuickAction;
  onClick: (action: QuickAction, e: React.MouseEvent) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const isQuest = action.source === "questKeyword";
  const isLore = action.source === "loreKeyword";

  const tooltipTitle = isQuest
    ? t("stories.quickAction.advancesQuest")
    : t("stories.quickAction.shiftToFill");

  return (
    <Tooltip title={tooltipTitle}>
      <button
        onClick={(e) => onClick(action, e)}
        aria-label={t("stories.quickAction.sendAriaLabel", {
          text: action.label,
        })}
        className={cx(
          "shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs transition",
          isQuest &&
            "border-border-brand bg-background-brand-subtlest text-font-brand hover:bg-background-brand-subtlest-hovered",
          isLore &&
            "border-border bg-elevation-surface-raised text-font hover:bg-background-neutral",
          !isQuest &&
            !isLore &&
            "border-border bg-elevation-surface-raised text-font-subtlest hover:bg-background-neutral"
        )}
      >
        {sourcePrefix(action.source)}
        <span className="inline-block max-w-[160px] truncate align-middle">
          {action.label}
        </span>
      </button>
    </Tooltip>
  );
};
