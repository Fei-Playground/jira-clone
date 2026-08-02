import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { projectMock1 } from "@domain/project";
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
                <div className="h-full w-full">
                  <Story />
                </div>
              </ThemeProvider>
            </UserContextProvider>
          ),
          action: async () => ({ status: 200 }),
        },
      ]);

      return (
        <div className="h-screen w-full">
          <RemixStub />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

export const Default: Story = {
  args: {
    project: projectMock1,
  },
};
