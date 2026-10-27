import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectsMock, projectToProjectSummary } from "@domain/project";
import { ProjectsView } from "./projects.view";

const meta: Meta<typeof ProjectsView> = {
  title: "Pages/Main/ProjectsView",
  component: ProjectsView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return withRemixStub(withMainContext(Story));
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectsView>;

const projectsSummary = projectsMock.map(projectToProjectSummary);

export const Default: Story = {
  args: {
    projectsSummary: projectsSummary,
  },
};

export const SingleProject: Story = {
  args: {
    projectsSummary: projectsSummary.slice(0, 1),
  },
};

export const Empty: Story = {
  args: {
    projectsSummary: [],
  },
};
