import type { Meta, StoryObj } from "@storybook/react-vite";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { EditBox } from "./edit-box";

const meta: Meta<typeof EditBox> = {
  title: "Pages/Main/Project/Board/IssuePanel/EditBox",
  component: EditBox,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        <div className="w-[480px] bg-elevation-surface p-6">
          <Story />
        </div>
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EditBox>;

export const Default: Story = {
  args: {
    defaultMessage: "",
    save: () => undefined,
  },
};

export const WithPartialMention: Story = {
  args: {
    defaultMessage: "Hey @Bu",
    autofocus: true,
    save: () => undefined,
  },
};

export const WithInsertedMention: Story = {
  args: {
    defaultMessage: "Hey @Buzz Lightyear, can you review this?",
    save: () => undefined,
  },
};
