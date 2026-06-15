import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { createRoutesStub, Outlet } from "react-router";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { Header } from "./header";

const meta: Meta<typeof Header> = {
  title: "Pages/Main/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Wraps the real Header inside a routes stub that simulates being on a
 * `/projects/:projectId/<tab>` route. Because the Header reads `useParams()`,
 * supplying a `projectId` in the URL is what makes the four global nav tabs
 * render. `initialEntry` controls which tab is active (teal bottom border).
 */
const renderInProjectRoute = (initialEntry: string): ReactElement => {
  const ProjectLayout = (): ReactElement => (
    <UserContextProvider user={userMock1}>
      <ThemeProvider
        specifiedTheme={Theme.IZZY}
        specifiedPreference={Preference.SELECTED}
      >
        <ProjectContextProvider project={projectMock1}>
          <div className="flex h-full flex-col">
            <Header />
            <Outlet />
          </div>
        </ProjectContextProvider>
      </ThemeProvider>
    </UserContextProvider>
  );

  const TabPlaceholder = ({ label }: { label: string }): ReactElement => (
    <main className="flex flex-1 items-center justify-center p-10 font-primary-light text-font-subtle">
      {label}
    </main>
  );

  const Stub = createRoutesStub([
    {
      path: "/projects/:projectId",
      Component: ProjectLayout,
      action: async () => ({ status: 200 }),
      children: [
        {
          path: "board",
          Component: () => <TabPlaceholder label="🎯 Daily Missions page" />,
        },
        {
          path: "analytics",
          Component: () => <TabPlaceholder label="⭐ Progress & Points page" />,
        },
        {
          path: "rewards",
          Component: () => <TabPlaceholder label="🎁 Rewards page" />,
        },
        {
          path: "review",
          Component: () => <TabPlaceholder label="📋 Daily Review page" />,
        },
      ],
    },
  ]);

  return (
    <div className="h-screen w-full">
      <Stub initialEntries={[initialEntry]} />
    </div>
  );
};

const projectId = projectMock1.id;

/**
 * Header with all four global nav tabs visible and the first tab
 * (🎯 Daily Missions) active, showing the teal bottom border.
 */
export const WithProjectTabs: Story = {
  render: () => renderInProjectRoute(`/projects/${projectId}/board`),
};

/**
 * Same Header with the ⭐ Progress & Points tab active to show the
 * active/highlighted state applied to a different tab.
 */
export const ProgressTabActive: Story = {
  render: () => renderInProjectRoute(`/projects/${projectId}/analytics`),
};

/**
 * Header outside of a project route. With no `projectId` param the
 * global nav tabs are intentionally hidden.
 */
export const NoProject: Story = {
  render: () => {
    const NoProjectLayout = (): ReactElement => (
      <UserContextProvider user={userMock1}>
        <ThemeProvider
          specifiedTheme={Theme.IZZY}
          specifiedPreference={Preference.SELECTED}
        >
          <div className="w-full">
            <Header />
          </div>
        </ThemeProvider>
      </UserContextProvider>
    );

    const Stub = createRoutesStub([
      {
        path: "/",
        Component: NoProjectLayout,
        action: async () => ({ status: 200 }),
      },
    ]);

    return <Stub initialEntries={["/"]} />;
  },
};
