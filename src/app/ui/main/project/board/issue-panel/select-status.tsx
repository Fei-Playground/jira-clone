import { useState } from "react";
import cx from "classix";
import { CategoryId, CategoryType } from "@domain/category";
import { useProjectStore } from "@app/ui/main/project";
import * as Select from "@app/components/select";

export const SelectStatus = ({ initStatus }: Props): JSX.Element => {
  const projectStore = useProjectStore();
  const categories = projectStore.project.categories;
  const initCategory = categories.find(
    (category) => category.type === initStatus
  );

  if (!initCategory) {
    throw new Error("No default category found");
  }

  const defaultValue = initCategory.id;
  const [selectedValue, setSelectedValue] = useState<CategoryId>(defaultValue);
  const selectedStatus = categories.find(
    (category) => category.id === selectedValue
  )?.type as CategoryType;

  const onValueChange = (value: CategoryId): void => {
    setSelectedValue(value);
  };

  return (
    <Select.Root
      name="status"
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <Select.Trigger
        aria-label="Open status select"
        className={cx(
          selectedStatus === "TODO" &&
            "!bg-background-accent-grey-subtlest !text-font-accent-grey hover:!bg-background-accent-grey-subtler",
          selectedStatus === "IN_PROGRESS" &&
            "!bg-background-accent-blue-subtlest !text-font-accent-blue hover:!bg-background-accent-blue-subtler",
          selectedStatus === "DONE" &&
            "!bg-background-accent-green-subtlest !text-font-accent-green hover:!bg-background-accent-green-subtler"
        )}
      >
        <Select.Value className="pt-1" />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {categories.map((category, index) => (
            <Select.Item key={index} value={category.id}>
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
          <Select.Separator />
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};

interface Props {
  initStatus: CategoryType;
}
