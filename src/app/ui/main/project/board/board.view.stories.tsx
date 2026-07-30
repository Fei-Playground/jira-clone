import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { BoardView } from "./board.view";
import {
  BoardHeader,
  type BoardHeaderVariant,
} from "./board-header";
import { ProjectContextProvider } from "../project.store";

const meta: Meta<typeof BoardView> = {
  title: "Pages/Main/Project/Board/BoardView",
  component: BoardView,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    headerVariant: {
      control: "select",
      options: ["balanced", "raised", "compact"],
    },
  },
  decorators: [
    (Story, context) => {
      const isCompare = context.name === "Compare headers";
      const RemixStub = createRoutesStub([
        {
          path: "/",
          Component: () => (
            <UserContextProvider user={userMock1}>
              <ThemeProvider
                specifiedTheme={Theme.LIGHT}
                specifiedPreference={Preference.SELECTED}
              >
                {isCompare ? (
                  <div className="box-border w-full p-4">
                    <Story />
                  </div>
                ) : (
                  <div className="box-border flex h-screen w-full flex-col overflow-hidden p-4">
                    <p className="mb-3 shrink-0 font-primary-light text-sm text-font-subtle">
                      Scroll the board area to see the sticky header. Use the
                      priority dropdown next to search to filter cards.
                    </p>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                      <div className="box-border h-[140vh]">
                        <Story />
                      </div>
                    </div>
                  </div>
                )}
              </ThemeProvider>
            </UserContextProvider>
          ),
          action: async () => ({ status: 200 }),
        },
      ]);

      return <RemixStub />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BoardView>;

/** Default product look — flat sticky bar with soft bottom edge */
export const Default: Story = {
  name: "Balanced (default)",
  args: {
    project: projectMock1,
    headerVariant: "balanced",
  },
};

/** Elevated card-style toolbar with muted divide before avatars */
export const Raised: Story = {
  name: "Raised bar",
  args: {
    project: projectMock1,
    headerVariant: "raised",
  },
};

/** Denser strip with brand underline accent */
export const Compact: Story = {
  name: "Compact strip",
  args: {
    project: projectMock1,
    headerVariant: "compact",
  },
};

const COMPARE_VARIANTS: {
  id: BoardHeaderVariant;
  label: string;
  blurb: string;
}[] = [
  {
    id: "balanced",
    label: "Balanced (default)",
    blurb: "Flat sticky bar · soft border · backdrop blur",
  },
  {
    id: "raised",
    label: "Raised bar",
    blurb: "Elevated rounded card · divider before avatars",
  },
  {
    id: "compact",
    label: "Compact strip",
    blurb: "Denser controls · brand underline accent",
  },
];

/** All three sticky header designs stacked for easy comparison */
export const CompareHeaders: Story = {
  name: "Compare headers",
  // Reuse meta's route stub providers — only replace the board chrome so we
  // can stack headers without nested <Router>s or a full board body.
  render: () => (
    <div className="flex flex-col gap-8 pb-8">
      <p className="font-primary-light text-sm text-font-subtle">
        Compare the three sticky board header designs. Each includes search,
        priority filter, sort, and team avatars.
      </p>
      {COMPARE_VARIANTS.map((variant) => (
        <section key={variant.id} className="flex flex-col gap-2">
          <div>
            <h3 className="font-primary text-base text-font">
              {variant.label}
            </h3>
            <p className="font-primary-light text-xs text-font-subtlest">
              {variant.blurb}
            </p>
          </div>
          <ProjectContextProvider project={projectMock1}>
            <BoardHeader
              users={projectMock1.users}
              variant={variant.id}
            />
          </ProjectContextProvider>
        </section>
      ))}
    </div>
  ),
};
