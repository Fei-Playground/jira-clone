import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: [
    { from: "../public/avatars", to: "/avatars" },
    { from: "../public/fonts", to: "/fonts" },
    { from: "../public/images", to: "/images" },
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
