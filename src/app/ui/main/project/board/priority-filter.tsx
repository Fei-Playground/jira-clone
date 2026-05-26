import { PriorityId } from "@domain/priority";
import { PriorityIcon } from "@app/components/priority-icon";
import { useProjectStore } from "@app/ui/main/project";
import cx from "classix";

const PRIORITIES: { id: PriorityId; label: string }[] = [
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export const PriorityFilter = (): JSX.Element => {
  const { priorityFilter, setPriorityFilter } = useProjectStore();

  const toggle = (id: PriorityId) => {
    setPriorityFilter((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isActive = (id: PriorityId) => priorityFilter.includes(id);

  return (
    <div className="flex items-center gap-1">
      {PRIORITIES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => toggle(id)}
          aria-label={`Filter by ${label} priority`}
          aria-pressed={isActive(id)}
          className={cx(
            "flex items-center gap-1.5 rounded px-2 py-1.5 text-xs",
            "font-primary transition-colors duration-150",
            isActive(id)
              ? "bg-background-brand-subtlest text-font-brand outline outline-1 outline-border-brand"
              : "bg-transparent text-font-subtlest hover:bg-background-neutral"
          )}
        >
          <PriorityIcon priority={id} size={12} />
          {label}
        </button>
      ))}
    </div>
  );
};
