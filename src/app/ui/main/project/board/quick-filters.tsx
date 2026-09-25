import cx from "classix";
import { HiUser } from "react-icons/hi";
import { PriorityIcon } from "@app/components/priority-icon";
import { Button } from "@app/components/button";
import { useProjectStore } from "@app/ui/main/project";

export const QuickFilters = (): JSX.Element => {
  const {
    myIssuesOnly,
    setMyIssuesOnly,
    highPriorityOnly,
    setHighPriorityOnly,
  } = useProjectStore();

  const toggleMyIssues = (): void => setMyIssuesOnly((prev) => !prev);
  const toggleHighPriority = (): void => setHighPriorityOnly((prev) => !prev);

  return (
    <section className="mt-4 flex items-center gap-2">
      <span className="mr-1 font-primary-light text-2xs uppercase text-font-subtlest">
        Quick filters
      </span>
      <FilterButton
        isActive={myIssuesOnly}
        onClick={toggleMyIssues}
        ariaLabel="Toggle show only my issues"
      >
        <HiUser size={14} />
        My issues
      </FilterButton>
      <FilterButton
        isActive={highPriorityOnly}
        onClick={toggleHighPriority}
        ariaLabel="Toggle show only high priority issues"
      >
        <PriorityIcon priority="high" size={14} />
        High priority
      </FilterButton>
    </section>
  );
};

const FilterButton = ({
  isActive,
  onClick,
  ariaLabel,
  children,
}: FilterButtonProps): JSX.Element => (
  <Button
    type="button"
    variant={isActive ? "contained" : "subtlest"}
    color={isActive ? "primary" : "neutral"}
    onClick={onClick}
    aria-pressed={isActive}
    aria-label={ariaLabel}
    className={cx("px-3 py-1.5 text-xs uppercase")}
  >
    {children}
  </Button>
);

interface FilterButtonProps {
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}
