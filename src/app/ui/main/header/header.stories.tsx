import type { Meta, StoryObj } from "@storybook/react-vite";
import { userMock1 } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { ThemeProvider, Theme, Preference } from "@app/store/theme.store";
import { LocaleProvider } from "@app/store/locale.store";
import { Locale } from "@app/locales";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { Header } from "./header";

const meta: Meta<typeof Header> = {
  title: "Pages/Main/Header",
  component: Header,
  parameters: {
    layout: "top",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-full">{withRemixStub(withMainContext(Story))}</div>
    ),
  ],
};

// Same real Header, but with the app's LocaleProvider pinned to Chinese so the
// logo title and every tooltip/aria label come from the zh dictionary.
export const ChineseLocale: Story = {
  decorators: [
    (Story) => (
      <div className="w-full">
        {withRemixStub(
          <LocaleProvider specifiedLocale={Locale.ZH}>
            <UserContextProvider user={userMock1}>
              <ThemeProvider
                specifiedTheme={Theme.LIGHT}
                specifiedPreference={Preference.SELECTED}
              >
                <div className="w-full">
                  <Story />
                </div>
              </ThemeProvider>
            </UserContextProvider>
          </LocaleProvider>
        )}
      </div>
    ),
  ],
};
