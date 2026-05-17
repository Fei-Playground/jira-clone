import cx from "classix";
import { HiOutlineViewBoards } from "react-icons/hi";
import { BsListNested } from "react-icons/bs";
import { useProjectStore } from "@app/ui/main/project";

export const ViewToggle = (): JSX.Element => {
  const { viewMode, setViewMode } = useProjectStore();

  return (
    <div className="inline-flex rounded border border-border-input bg-background-input">
      <button
        onClick={() => setViewMode("kanban")}
        className={cx(
          "flex items-center gap-2 border-none px-3 py-1.5 text-xs transition-all duration-200",
          viewMode === "kanban"
            ? "bg-background-brand-bold text-font-inverse"
            : "bg-transparent text-font hover:bg-background-input-hovered"
        )}
        aria-label="Switch to Kanban view"
      >
        <HiOutlineViewBoards size={16} />
        <span>Kanban</span>
      </button>
      <button
        onClick={() => setViewMode("gantt")}
        className={cx(
          "flex items-center gap-2 border-none px-3 py-1.5 text-xs transition-all duration-200",
          viewMode === "gantt"
            ? "bg-background-brand-bold text-font-inverse"
            : "bg-transparent text-font hover:bg-background-input-hovered"
        )}
        aria-label="Switch to Gantt view"
      >
        <BsListNested size={16} />
        <span>Gantt</span>
      </button>
    </div>
  );
};
