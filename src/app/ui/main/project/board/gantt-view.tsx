import { useMemo } from "react";
import { Link } from "@remix-run/react";
import cx from "classix";
import { Category, CategoryType } from "@domain/category";
import { Issue } from "@domain/issue";
import { ScrollArea } from "@app/components/scroll-area";
import { useProjectStore } from "@app/ui/main/project";
import { useSortBy } from "@app/hooks/useSortBy";

interface GanttViewProps {
  categories: Category[];
}

const categoryColorMap: Record<CategoryType, string> = {
  TODO: "bg-[var(--Blue500)]",
  IN_PROGRESS: "bg-[var(--Blue700)]",
  DONE: "bg-[var(--Green500)]",
};

export const GanttView = ({ categories }: GanttViewProps): JSX.Element => {
  const { search } = useProjectStore();
  const sortBy = useSortBy();

  const allIssues = useMemo(() => {
    const issues: Issue[] = [];
    categories.forEach((category) => {
      category.issues.forEach((issue) => {
        issues.push(issue);
      });
    });
    return issues.filter((issue) =>
      issue.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const { minDate, maxDate, dateRange } = useMemo(() => {
    if (allIssues.length === 0) {
      const now = Date.now();
      return {
        minDate: now,
        maxDate: now,
        dateRange: 1,
      };
    }

    const dates = allIssues.flatMap((issue) => [
      issue.createdAt,
      issue.updatedAt,
    ]);
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const range = max - min || 1;

    return {
      minDate: min,
      maxDate: max,
      dateRange: range,
    };
  }, [allIssues]);

  const generateTimelineDates = (): Date[] => {
    const dates: Date[] = [];
    const start = new Date(minDate);
    const end = new Date(maxDate);

    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 7) {
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date);
      }
    } else if (daysDiff <= 31) {
      for (let i = 0; i <= Math.ceil(daysDiff / 2); i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i * 2);
        dates.push(date);
      }
    } else {
      const monthsDiff = Math.ceil(daysDiff / 30);
      for (let i = 0; i <= monthsDiff; i++) {
        const date = new Date(start);
        date.setMonth(start.getMonth() + i);
        dates.push(date);
      }
    }

    return dates;
  };

  const timelineDates = generateTimelineDates();

  const formatDate = (date: Date): string => {
    const daysDiff = Math.ceil(
      (new Date(maxDate).getTime() - new Date(minDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 7) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (daysDiff <= 31) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  };

  const calculateBarPosition = (
    startDate: number,
    endDate: number
  ): { left: string; width: string } => {
    const start = ((startDate - minDate) / dateRange) * 100;
    const end = ((endDate - minDate) / dateRange) * 100;
    const width = Math.max(end - start, 1);

    return {
      left: `${start}%`,
      width: `${width}%`,
    };
  };

  if (allIssues.length === 0) {
    return (
      <div className="mt-12 flex h-full items-center justify-center">
        <p className="font-primary-light text-sm text-font-subtlest">
          No issues to display in Gantt view
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12 flex h-full flex-col">
      <ScrollArea>
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="mb-4 flex gap-2 border-b border-border-input pb-2">
            <div className="w-[200px] shrink-0 font-primary-bold text-xs text-font">
              Task
            </div>
            <div className="relative flex-1">
              <div className="flex justify-between">
                {timelineDates.map((date, index) => (
                  <div
                    key={index}
                    className="font-primary-light text-2xs text-font-subtlest"
                  >
                    {formatDate(date)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="flex flex-col gap-2">
            {allIssues.map((issue) => {
              const barPosition = calculateBarPosition(
                issue.createdAt,
                issue.updatedAt
              );
              const categoryType = issue.categoryType || "TODO";
              const barColor = categoryColorMap[categoryType];
              const issueLink = sortBy
                ? `issue/${issue.id}?sortBy=${sortBy}`
                : `issue/${issue.id}`;

              return (
                <div key={issue.id} className="flex gap-2">
                  <div className="w-[200px] shrink-0 truncate font-primary text-xs text-font">
                    <Link
                      to={issueLink}
                      className="hover:text-font-brand hover:underline"
                    >
                      {issue.name}
                    </Link>
                  </div>
                  <div className="relative flex-1">
                    <div className="relative h-6 rounded-sm border border-border-input bg-background-input">
                      <div
                        className={cx(
                          "absolute top-0 h-full rounded-sm",
                          barColor
                        )}
                        style={{
                          left: barPosition.left,
                          width: barPosition.width,
                        }}
                        title={`${issue.name} (${new Date(
                          issue.createdAt
                        ).toLocaleDateString()} - ${new Date(
                          issue.updatedAt
                        ).toLocaleDateString()})`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </section>
  );
};
