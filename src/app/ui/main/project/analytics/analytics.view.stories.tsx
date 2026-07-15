import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { projectMock1, projectMock2, Project } from "@domain/project";
import { AnalyticsView } from "./analytics.view";

/**
 * AnalyticsView reads its data from `useLoaderData()`, and its provider chain
 * (ThemeProvider → useFetcher) must live INSIDE a data router. So we build a
 * createRoutesStub whose route Component renders the providers around the
 * AnalyticsView, and whose `loader` returns the mock `{ project }` that
 * `useLoaderData` consumes.
 */
const buildStub = (project: Project) =>
  createRoutesStub([
    {
      path: "/",
      loader: () => ({ project }),
      Component: () => (
        <UserContextProvider user={userMock1}>
          <ThemeProvider
            specifiedTheme={Theme.LIGHT}
            specifiedPreference={Preference.SELECTED}
          >
            <div className="p-6">
              <AnalyticsView />
            </div>
          </ThemeProvider>
        </UserContextProvider>
      ),
    },
  ]);

const meta: Meta<typeof AnalyticsView> = {
  title: "Pages/Main/Project/AnalyticsView",
  component: AnalyticsView,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AnalyticsView>;

/**
 * projectMock1 has 5 issues with distinct event types:
 * standup, planning, review, retrospective, workshop.
 */
export const WithProject: Story = {
  render: () => {
    const Stub = buildStub(projectMock1);
    return <Stub />;
  },
};

/**
 * projectMock2 has 3 issues: demo, one_on_one, workshop.
 */
export const SecondProject: Story = {
  render: () => {
    const Stub = buildStub(projectMock2);
    return <Stub />;
  },
};
