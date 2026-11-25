import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../public/avatars", "../public/fonts", "../public/images"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // The onboarding checklist widget crashes the Storybook 10.3 manager with
  // "Cannot destructure property 'status' of 'items[item.id]'".
  features: { sidebarOnboardingChecklist: false },
};
export default config;
