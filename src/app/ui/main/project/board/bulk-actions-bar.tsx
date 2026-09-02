import { useState, Dispatch, SetStateAction } from "react";
import { useFetcher } from "react-router";
import cx from "classix";
import { Category, CategoryId } from "@domain/category";
import { IssueId } from "@domain/issue";
import { useProjectStore } from "@app/ui/main/project";
import * as Select from "@app/components/select";

interface BulkActionsBarProps {
  categories: Category[];
  setSubmittingIssues: Dispatch<SetStateAction<IssueId[]>>;
}

export const BulkActionsBar = ({
  categories,
  setSubmittingIssues,
}: BulkActionsBarProps): JSX.Element | null => {
  const {
    isSelectMode,
    selectedIssueIds,
    setSelectedIssueIds,
    setIsSelectMode,
  } = useProjectStore();
  const fetcher = useFetcher();
  const [targetCategoryId, setTargetCategoryId] = useState<CategoryId | "">("");

  if (!isSelectMode || selectedIssueIds.length === 0) return null;

  const handleApply = () => {
    if (!targetCategoryId) return;

    const formData = new FormData();
    formData.set("_action", "bulkUpdateIssueCategory");
    formData.set("categoryId", targetCategoryId);
    selectedIssueIds.forEach((id) => formData.append("issueIds", id));

    fetcher.submit(formData, { method: "post" });
    setSubmittingIssues((prev) => [
      ...prev,
      ...selectedIssueIds.filter((id) => !prev.includes(id)),
    ]);
    setSelectedIssueIds([]);
    setIsSelectMode(false);
    setTargetCategoryId("");
  };

  const handleClear = () => {
    setSelectedIssueIds([]);
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-elevation-surface-overlay px-5 py-3 shadow-blue">
      <span className="whitespace-nowrap font-primary-bold text-sm text-font">
        {selectedIssueIds.length}{" "}
        {selectedIssueIds.length === 1 ? "issue" : "issues"} selected
      </span>

      <Select.Root
        value={targetCategoryId}
        onValueChange={(val: string) =>
          setTargetCategoryId(val as CategoryId)
        }
      >
        <Select.Trigger aria-label="Select target status">
          <Select.Value placeholder="Move to…" />
          <Select.TriggerIcon />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport>
            {categories.map((category) => (
              <Select.Item key={category.id} value={category.id}>
                <Select.ItemIndicator />
                <span
                  className={cx(
                    "flex w-fit items-center gap-2 rounded px-1 py-0.5 text-2xs uppercase",
                    category.type === "TODO" &&
                      "bg-background-accent-grey-subtler text-font-accent-grey",
                    category.type === "IN_PROGRESS" &&
                      "bg-background-accent-blue-subtler text-font-accent-blue",
                    category.type === "DONE" &&
                      "bg-background-accent-green-subtler text-font-accent-green"
                  )}
                >
                  <Select.ItemText>{category.name}</Select.ItemText>
                </span>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>

      <button
        onClick={handleApply}
        disabled={!targetCategoryId}
        className={cx(
          "cursor-pointer rounded border-none px-3 py-1.5 font-primary-bold text-sm",
          "bg-background-brand-bold text-font-inverse",
          "hover:bg-background-brand-bold-hovered active:bg-background-brand-bold-pressed",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        Apply
      </button>
      <button
        onClick={handleClear}
        className={cx(
          "cursor-pointer rounded border-none px-3 py-1.5 font-primary-bold text-sm",
          "text-font-subtle hover:bg-background-neutral-hovered active:bg-background-neutral-pressed"
        )}
      >
        Clear
      </button>
    </div>
  );
};
