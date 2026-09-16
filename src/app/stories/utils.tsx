import type { ReactElement } from "react";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { LocaleProvider } from "@app/store/locale.store";
import { DEFAULT_LOCALE } from "@app/locales";

type Story = (props: Record<string, never>) => ReactElement;

export const withMainContext = (Story: Story): ReactElement => {
  return (
    <LocaleProvider specifiedLocale={DEFAULT_LOCALE}>
      <UserContextProvider user={userMock1}>
        <ThemeProvider
          specifiedTheme={Theme.LIGHT}
          specifiedPreference={Preference.SELECTED}
        >
          <div className="w-full">
            <Story {...({} as Record<string, never>)} />
          </div>
        </ThemeProvider>
      </UserContextProvider>
    </LocaleProvider>
  );
};

export const withRemixStub = (children: ReactElement) => {
  const RemixStub = createRoutesStub([
    {
      path: "/",
      Component: () => children,
      action: async () => {
        return {
          status: 200,
        };
      },
    },
  ]);

  return <RemixStub />;
};
