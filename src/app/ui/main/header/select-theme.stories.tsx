import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import {
  ThemeProvider,
  Theme,
  Preference,
} from "@app/store/theme.store";
import { SelectTheme } from "./select-theme";

/**
 * Creates a Remix stub with the necessary routes for theme switching.
 * This includes the main route and the theme action route that handles theme persistence.
 */
const createThemeRemixStub = (children: JSX.Element) => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      element: children,
    },
    {
      path: "action/set-theme",
      action: async () => {
        return { status: 200 };
      },
    },
  ]);

  return <RemixStub />;
};

/**
 * Wraps a component with theme context providers for Storybook rendering.
 * Provides user context and theme context with a specified theme.
 */
const withThemeContext = (Story: React.ComponentType, theme: Theme) => {
  return (
    <UserContextProvider user={userMock1}>
      <ThemeProvider
        specifiedTheme={theme}
        specifiedPreference={Preference.SELECTED}
      >
        <div className={`w-full ${theme}`}>
          <Story />
        </div>
      </ThemeProvider>
    </UserContextProvider>
  );
};

const meta: Meta<typeof SelectTheme> = {
  title: "Pages/Main/Header/SelectTheme",
  component: SelectTheme,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SelectTheme>;

export const Default: Story = {
  render: () => (
    <div className="light bg-elevation-surface p-4">
      {createThemeRemixStub(withThemeContext(SelectTheme, Theme.LIGHT))}
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-elevation-surface p-4">
      {createThemeRemixStub(withThemeContext(SelectTheme, Theme.DARK))}
    </div>
  ),
};

export const Retro: Story = {
  render: () => (
    <div className="retro bg-elevation-surface p-4">
      {createThemeRemixStub(withThemeContext(SelectTheme, Theme.RETRO))}
    </div>
  ),
};
