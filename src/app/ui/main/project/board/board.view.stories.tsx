import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
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
    (Story) => {
      const RemixStub = createRoutesStub([
        {
          path: "/",
          Component: () => (
            <UserContextProvider user={userMock1}>
              <ThemeProvider
                specifiedTheme={Theme.LIGHT}
                specifiedPreference={Preference.SELECTED}
              >
                <div className="box-border h-screen w-full p-6">
                  <Story />
                </div>
              </ThemeProvider>
            </UserContextProvider>
          ),
        },
      ]);
      return <RemixStub />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

/** Full board toolbar with Search, avatars, Dates filter defaulting to "All dates", and Sort. */
export const Default: Story = {
  args: {
    project: projectMock1,
  },
};

/** Active dates filter (Last 7 days) so toolbar shows selected styling and columns filter by createdAt. */
export const Last7DaysFilter: Story = {
  args: {
    project: projectMock1,
    initialDateFilter: "last_7_days",
  },
};
