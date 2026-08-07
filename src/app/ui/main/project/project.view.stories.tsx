import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { ProjectView } from "./project.view";
import { BoardView } from "./board/board.view";

const withProjectBoardRoute = (Story: React.ComponentType) => {
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
      children: [
        {
          index: true,
          Component: () => <BoardView project={projectMock1} />,
        },
        {
          path: "board",
          Component: () => <BoardView project={projectMock1} />,
        },
      ],
    },
  ]);

  return (
    <div className="h-screen">
      <RemixStub initialEntries={["/board"]} />
    </div>
  );
};

const meta: Meta<typeof ProjectView> = {
  title: "Pages/Main/ProjectView",
  component: ProjectView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withProjectBoardRoute],
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
