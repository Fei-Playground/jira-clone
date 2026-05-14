import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import {
  ThemeProvider,
  Theme,
  Preference,
} from "@app/store/theme.store";
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
    (Story, context) => {
      // Skip remix decorator if story provides its own routing context
      if (context.parameters.skipRemixDecorator) {
        return <Story />;
      }
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

/**
 * Creates a Remix stub with theming and proper route handling.
 * This standalone stub is used for the Retro story to avoid nested Router issues.
 * The story overrides the default decorators to prevent the duplicate Router error.
 */
const createThemedRemixStub = (children: JSX.Element, theme: Theme) => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      element: (
        <UserContextProvider user={userMock1}>
          <ThemeProvider
            specifiedTheme={theme}
            specifiedPreference={Preference.SELECTED}
          >
            <div
              className={`h-screen w-full ${theme} bg-elevation-surface`}
            >
              {children}
            </div>
          </ThemeProvider>
        </UserContextProvider>
      ),
    },
    {
      path: "action/set-theme",
      action: async () => ({ status: 200 }),
    },
    {
      path: "new",
      element: <div>New project panel</div>,
    },
  ]);

  return <RemixStub />;
};

export const Retro: Story = {
  args: {
    projectsSummary: projectsSummary,
  },
  parameters: {
    // Skip the meta-level Remix decorator since this story provides its own Remix stub with Retro theme
    skipRemixDecorator: true,
  },
  render: (args) =>
    createThemedRemixStub(<ProjectsView {...args} />, Theme.RETRO),
};
