import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/app/styles/app-compiled.css";
import "../src/app/styles/fonts.css";
import "../src/olga/styles/olga-tokens.css";

// Load OLGA Google Fonts in Storybook
const olgaFontLink = document.createElement("link");
olgaFontLink.rel = "stylesheet";
olgaFontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap";
document.head.appendChild(olgaFontLink);

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
