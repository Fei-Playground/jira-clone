import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { createRoutesStub } from "react-router";
import {
  ThemeProvider,
  Theme,
  Preference,
} from "@app/store/theme.store";
import { ColorPaletteProvider } from "@app/store/color-palette.store";
import { ColorPalettePanel } from "./color-palette-panel";

const withProviders = (Story: () => React.ReactElement): React.ReactElement => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <ThemeProvider
          specifiedTheme={Theme.LIGHT}
          specifiedPreference={Preference.SELECTED}
        >
          <ColorPaletteProvider>
            <div className="flex min-h-[520px] items-start justify-end p-4">
              <Story />
            </div>
          </ColorPaletteProvider>
        </ThemeProvider>
      ),
    },
  ]);
  return <Stub />;
};

const meta: Meta<typeof ColorPalettePanel> = {
  title: "Pages/Main/Header/ColorPalettePanel",
  component: ColorPalettePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [(Story) => withProviders(Story)],
};

export default meta;
type Story = StoryObj<typeof ColorPalettePanel>;

/**
 * The panel in its open/expanded state: preset theme buttons with color-dot
 * previews and all color pickers (App Colors, Board Columns, Task Priority)
 * visible. The play() clicks the palette trigger to open the Radix dialog.
 */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByLabelText(
      "Open color palette settings"
    );
    await userEvent.click(trigger);
    // Dialog content is portaled to document.body
    const doc = within(document.body);
    await waitFor(() =>
      expect(doc.getByText("Color Customization")).toBeInTheDocument()
    );
  },
};

/**
 * The default closed state: just the palette icon trigger button.
 */
export const Trigger: Story = {};
