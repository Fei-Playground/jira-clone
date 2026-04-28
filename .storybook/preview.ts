import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/app/styles/app-compiled.css";
import "../src/app/styles/fonts.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "var(--color-elevation-surface)" },
        { name: "overlay", value: "var(--color-elevation-surface-overlay)" },
        { name: "raised", value: "var(--color-elevation-surface-raised)" },
        { name: "sunken", value: "var(--color-elevation-surface-sunken)" },
      ],
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
        lava: "lava",
        lime: "lime",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
