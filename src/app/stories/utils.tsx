import type { ReactElement } from "react";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";

type Story = (props: Record<string, never>) => ReactElement;

export const withMainContext = (Story: Story): ReactElement => {
  return (
    <UserContextProvider user={userMock1}>
      <ThemeProvider
        specifiedTheme={Theme.LIGHT}
        specifiedPreference={Preference.SELECTED}
      >
        <div className="h-full w-full">
          <Story {...({} as Record<string, never>)} />
        </div>
      </ThemeProvider>
    </UserContextProvider>
  );
};

export const withRemixStub = (children: ReactElement) => {
  const RemixStub = createRoutesStub([
    {
      path: "/",
      Component: () => <div className="h-full w-full">{children}</div>,
      action: async () => {
        return {
          status: 200,
        };
      },
    },
  ]);

  // Force the stub root to fill its parent so h-full chains (e.g. BoardView) resolve
  return (
    <div className="h-full w-full">
      <RemixStub />
    </div>
  );
};
