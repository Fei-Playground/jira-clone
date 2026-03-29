import type { Meta, StoryObj } from "@storybook/react";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectView } from "./project.view";

const meta: Meta<typeof ProjectView> = {
  title: "Pages/Main/ProjectView",
  component: ProjectView,
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
type Story = StoryObj<typeof ProjectView>;

export const Default: Story = {
  args: {
    name: projectMock1.name,
    description: projectMock1.description,
    image: projectMock1.image,
  },
};

export const WithoutDescription: Story = {
  args: {
    name: projectMock1.name,
    description: undefined,
    image: projectMock1.image,
  },
};

export const WithoutImage: Story = {
  args: {
    name: projectMock1.name,
    description: projectMock1.description,
    image: "",
  },
};
