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
    viewport: {
      viewports: {
        mobile1: {
          name: "Mobile 1",
          styles: { width: "375px", height: "667px" },
          type: "mobile",
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
      },
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
