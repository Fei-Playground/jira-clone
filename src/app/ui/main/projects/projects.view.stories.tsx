import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectsMock } from "@domain/project";
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

const projectsSummary = projectsMock.map((project) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  image: project.image,
  createdAt: project.createdAt,
}));

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
