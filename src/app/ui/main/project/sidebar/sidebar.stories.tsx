import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { createRoutesStub } from "react-router";
import { projectMock1 } from "@domain/project";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { withRemixStub } from "@app/stories/utils";
import { Header } from "../../header/header";
import { SidebarProvider, useSidebar } from "../../sidebar.context";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Pages/Project/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    projectName: { control: { type: "text" } },
    projectDescription: { control: { type: "text" } },
    projectImage: { control: { type: "text" } },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

/**
 * Default desktop sidebar (push layout) shown expanded.
 */
export const Default: Story = {
  decorators: [
    (Story) =>
      withRemixStub(
        <SidebarProvider>
          <Story />
        </SidebarProvider>
      ),
  ],
  render: () => (
    <div className="h-screen bg-elevation-surface">
      <Sidebar
        projectName={projectMock1.name}
        projectDescription={projectMock1.description || "Project description"}
        projectImage={projectMock1.image}
      />
    </div>
  ),
};

/**
 * Opens the mobile drawer on mount by calling `openMobile()` from the real
 * SidebarContext, then renders the real Header (with its hamburger button) and
 * the Sidebar together inside a phone-width frame. The result is the actual
 * `isMobileOpen=true` mobile state: drawer slid in from the left over a dark
 * backdrop, with the hamburger header behind it.
 */
const MobilePhoneFrame = (): ReactElement => {
  const { openMobile } = useSidebar();
  useEffect(() => {
    openMobile();
  }, [openMobile]);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-elevation-surface">
      <Header />
      <main className="flex flex-1 items-center justify-center p-6 text-center font-primary-light text-font-subtle">
        🎯 Daily Missions
      </main>
      <Sidebar
        projectName={projectMock1.name}
        projectDescription={projectMock1.description || "Project description"}
        projectImage={projectMock1.image}
      />
    </div>
  );
};

/**
 * Mobile overlay state (`isMobileOpen=true`). The drawer slides in from the
 * left over a dark backdrop, showing the project name, the four nav items and
 * the X close button in the top-right of the drawer. The hamburger (☰) header
 * is visible behind the backdrop.
 */
export const MobileOpen: Story = {
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => {
    const ProjectLayout = (): ReactElement => (
      <UserContextProvider user={userMock1}>
        <ThemeProvider
          specifiedTheme={Theme.IZZY}
          specifiedPreference={Preference.SELECTED}
        >
          <ProjectContextProvider project={projectMock1}>
            <SidebarProvider>
              <MobilePhoneFrame />
            </SidebarProvider>
          </ProjectContextProvider>
        </ThemeProvider>
      </UserContextProvider>
    );

    const Stub = createRoutesStub([
      {
        path: "/projects/:projectId/*",
        Component: ProjectLayout,
        action: async () => ({ status: 200 }),
      },
    ]);

    return <Stub initialEntries={[`/projects/${projectMock1.id}/board`]} />;
  },
};
