import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventTypeId } from "@domain/event-type";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider, useProjectStore } from "@app/ui/main/project";
import { SelectEventTypeFilter } from "./select-event-type-filter";

// Renders the real filter button, optionally pre-seeding the active
// event-type filter so the count badge ('Event Type · N') is visible.
const FilterHarness = ({
  initialFilter = [],
}: {
  initialFilter?: EventTypeId[];
}): JSX.Element => {
  const { setEventTypeFilter } = useProjectStore();
  useEffect(() => {
    setEventTypeFilter(initialFilter);
  }, [setEventTypeFilter]);
  return <SelectEventTypeFilter />;
};

const meta: Meta<typeof FilterHarness> = {
  title: "Pages/Main/Project/Board/SelectEventTypeFilter",
  component: FilterHarness,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        <div className="p-4">
          <Story />
        </div>
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilterHarness>;

export const Default: Story = {
  args: {
    initialFilter: [],
  },
};

export const ActiveFilter: Story = {
  args: {
    initialFilter: ["standup", "planning"],
  },
};
