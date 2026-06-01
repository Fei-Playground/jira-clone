import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../public/avatars", "../public/fonts", "../public/images"],
  addons: ["@storybook/addon-viewport", "@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
