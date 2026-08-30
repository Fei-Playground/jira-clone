import cx from "classix";
import { HiOutlineViewBoards } from "react-icons/hi";
import { MdOutlineViewTimeline } from "react-icons/md";

export type BoardViewMode = "kanban" | "gantt";

export const ViewToggle = ({ viewMode, onToggle }: Props): JSX.Element => {
  return (
    <div
      className="ml-4 inline-flex items-center rounded bg-background-brand-subtlest p-0.5"
      role="group"
      aria-label="Board view mode"
    >
      <ToggleButton
        active={viewMode === "kanban"}
        onClick={() => onToggle("kanban")}
        ariaLabel="Kanban view"
      >
        <HiOutlineViewBoards size={14} />
        <span>Kanban</span>
      </ToggleButton>
      <ToggleButton
        active={viewMode === "gantt"}
        onClick={() => onToggle("gantt")}
        ariaLabel="Gantt view"
      >
        <MdOutlineViewTimeline size={14} />
        <span>Gantt</span>
      </ToggleButton>
    </div>
  );
};

const ToggleButton = ({
  active,
  onClick,
  ariaLabel,
  children,
}: ToggleButtonProps): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-pressed={active}
    className={cx(
      "flex cursor-pointer items-center gap-1.5 rounded border-none px-3 py-1.5 text-xs duration-150",
      active
        ? "bg-background-brand-bold text-font-inverse"
        : "bg-transparent text-font-brand hover:bg-background-brand-subtlest-hovered"
    )}
  >
    {children}
  </button>
);

interface Props {
  viewMode: BoardViewMode;
  onToggle: (mode: BoardViewMode) => void;
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}
