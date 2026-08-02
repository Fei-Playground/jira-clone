import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { withRemixStub } from "@app/stories/utils";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { BoardView } from "./board.view";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Main/Project/Board/BoardView",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) =>
      withRemixStub(
        <UserContextProvider user={userMock1}>
          <ThemeProvider
            specifiedTheme={Theme.LIGHT}
            specifiedPreference={Preference.SELECTED}
          >
            {/* h-screen on the height chain so column ScrollAreas measure non-zero */}
            <div className="box-border h-screen w-full">
              <Story />
            </div>
          </ThemeProvider>
        </UserContextProvider>
      ),
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};

/** Board with a non-default date window so cards filter by createdAt. */
export const Last7Days: Story = {
  args: {
    project: projectMock1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByLabelText("Filter issues by date");
    await userEvent.click(trigger);
    const option = await canvas.findByRole("option", { name: /last 7 days/i });
    await userEvent.click(option);
  },
};
