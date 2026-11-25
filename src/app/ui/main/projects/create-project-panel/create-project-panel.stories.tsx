import type { Meta, StoryObj } from "@storybook/react-vite";
import { projectMock1 } from "@domain/project/project.mock";
import { usersMock } from "@domain/user/user.mock";
import { withRemixStub, withMainContext } from "@app/stories/utils";
import { CreateProjectPanelView } from "./create-project-panel.view";

const meta: Meta<typeof CreateProjectPanelView> = {
  title: "Pages/Projects/CreateProjectPanelView",
  component: CreateProjectPanelView,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    project: {
      control: {
        type: "object",
      },
    },
    users: {
      control: {
        type: "object",
      },
    },
  },
  decorators: [(Story) => withRemixStub(withMainContext(Story))],
};

export default meta;
type Story = StoryObj<typeof CreateProjectPanelView>;

export const Default: Story = {
  args: {
    project: projectMock1,
    users: usersMock,
  },
};
