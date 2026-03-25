import type { PartialStoryFn } from "@storybook/csf";
import { unstable_createRemixStub as createRemixStub } from "@remix-run/testing";
import { createContext, useContext } from "react";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { Theme, Preference } from "@app/store/theme.store";

type Story = PartialStoryFn<any, Record<string, never>>;

// Story-safe theme context that doesn't use useFetcher from Remix
type ThemeContextType = {
  theme: Theme | null;
  preference: Preference | null;
  setTheme: (theme: Theme, preference?: Preference) => void;
};

const StoryThemeContext = createContext<ThemeContextType | null>(null);

// Story-safe ThemeProvider that doesn't use Remix hooks
const StoryThemeProvider = ({
  children,
  theme,
}: {
  children: JSX.Element;
  theme: Theme;
}): JSX.Element => {
  const value: ThemeContextType = {
    theme,
    preference: Preference.SELECTED,
    setTheme: () => {}, // No-op for stories
  };
  return (
    <StoryThemeContext.Provider value={value}>
      {children}
    </StoryThemeContext.Provider>
  );
};

export const withMainContext = (Story: Story): JSX.Element => {
  return (
    <UserContextProvider user={userMock1}>
      <StoryThemeProvider theme={Theme.LIGHT}>
        <div className="w-full">
          <Story />
        </div>
      </StoryThemeProvider>
    </UserContextProvider>
  );
};

export const withMainContextDark = (Story: Story): JSX.Element => {
  return (
    <UserContextProvider user={userMock1}>
      <StoryThemeProvider theme={Theme.DARK}>
        <Story />
      </StoryThemeProvider>
    </UserContextProvider>
  );
};

export const withRemixStub = (children: JSX.Element) => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      element: children,
      action: async () => {
        return {
          status: 200,
        };
      },
    },
  ]);

  return <RemixStub />;
};
