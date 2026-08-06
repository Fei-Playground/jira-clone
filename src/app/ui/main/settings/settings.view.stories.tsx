import type { Meta, StoryObj, Decorator } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { withRemixStub } from "@app/stories/utils";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { SettingsView } from "./settings.view";

type StoryFn = (props: Record<string, never>) => ReactElement;

const withThemeContext =
  (theme: Theme): Decorator =>
  (Story) => {
    return withRemixStub(
      (
        <UserContextProvider user={userMock1}>
          <ThemeProvider
            specifiedTheme={theme}
            specifiedPreference={Preference.SELECTED}
          >
            <div className="w-full min-h-screen bg-elevation-surface text-font">
              <Story {...({} as Record<string, never>)} />
            </div>
          </ThemeProvider>
        </UserContextProvider>
      ) as ReactElement
    );
  };

const meta: Meta<typeof SettingsView> = {
  title: "Pages/Main/Settings",
  component: SettingsView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SettingsView>;

/** Appearance section with dark mode switch off (light theme). */
export const LightMode: Story = {
  name: "Light mode (off)",
  decorators: [withThemeContext(Theme.LIGHT)],
  globals: {
    theme: "light",
  },
};

/** Appearance section with dark mode switch on (dark theme). */
export const DarkMode: Story = {
  name: "Dark mode (on)",
  decorators: [withThemeContext(Theme.DARK)],
  globals: {
    theme: "dark",
  },
};
