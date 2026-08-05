import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { MainLayout } from "./main.layout";

const meta: Meta<typeof MainLayout> = {
  title: "Pages/Main/MainLayout",
  component: MainLayout,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
          html, body, #storybook-root {
            height: 100%;
            margin: 0;
          }
        `}</style>
        <div className="flex h-full min-h-0 flex-col">
          <Story />
        </div>
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

export const Default: Story = {
  args: {
    user: userMock1,
  },
  render: (args) => {
    const RemixStub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <ThemeProvider
            specifiedTheme={Theme.LIGHT}
            specifiedPreference={Preference.SELECTED}
          >
            <div className="flex h-full min-h-0 flex-col">
              <MainLayout {...args} />
            </div>
          </ThemeProvider>
        ),
        children: [
          {
            index: true,
            Component: () => (
              <div className="p-6">
                <h1 className="text-xl font-semibold text-font">Page content</h1>
                <p className="mt-2 text-font-subtle">
                  Main content area — the footer sits at the bottom of the layout.
                </p>
              </div>
            ),
          },
        ],
      },
    ]);

    return <RemixStub />;
  },
};
