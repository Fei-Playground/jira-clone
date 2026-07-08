import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { useEffect } from "react";
import { SignupView } from "./signup.view";

const meta: Meta<typeof SignupView> = {
  title: "Pages/Signup",
  component: SignupView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      const RemixStub = createRoutesStub([
        {
          path: "/",
          Component: () => <Story />,
          action: async () => {
            return {
              status: 200,
            };
          },
        },
      ]);

      return <RemixStub />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SignupView>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-elevation-surface">
        <Story />
      </div>
    ),
  ],
};

export const WithErrors: Story = {
  decorators: [
    (Story) => {
      return (
        <WithErrorsWrapper>
          <Story />
        </WithErrorsWrapper>
      );
    },
  ],
};

function WithErrorsWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Simulate form submission with invalid data to show validation errors
    const timer = setTimeout(() => {
      const form = document.querySelector("form");
      if (form) {
        // Fill form with invalid data
        const nameInput = document.querySelector(
          'input[name="name"]'
        ) as HTMLInputElement;
        const emailInput = document.querySelector(
          'input[name="email"]'
        ) as HTMLInputElement;
        const passwordInput = document.querySelector(
          'input[name="password"]'
        ) as HTMLInputElement;
        const confirmPasswordInput = document.querySelector(
          'input[name="confirmPassword"]'
        ) as HTMLInputElement;

        if (nameInput) nameInput.value = "";
        if (emailInput) emailInput.value = "invalid";
        if (passwordInput) passwordInput.value = "short";
        if (confirmPasswordInput) confirmPasswordInput.value = "mismatch";

        // Trigger form submit to show validation errors
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true })
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
