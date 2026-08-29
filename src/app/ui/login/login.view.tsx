import { useState } from "react";

import { HiCheckCircle } from "react-icons/hi";
import { Form } from "react-router";

import cx from "classix";

import * as Select from "@app/components/select";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import { User, UserId, userMock1 } from "@domain/user";

export const LoginView = ({ users }: Props) => {
  const [selectedValue, setSelectedValue] = useState<User>(userMock1);

  const onValueChange = (userId: UserId) => {
    const foundUser = users.find((user) => user.id === userId);
    if (foundUser) {
      setSelectedValue(foundUser);
    }
  };

  const features = [
    "Real-time collaboration",
    "Efficient task management",
    "Team productivity boost",
  ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-elevation-surface">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:relative lg:overflow-hidden bg-background-brand-bold text-font-inverse"
      >
        {/* Decorative grid background */}
        <svg
          className="absolute inset-0 opacity-10"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <img
              src="/images/logo.png"
              alt="Jira Clone"
              className="h-[80px] w-[80px]"
            />
            <h1 className="font-primary-black text-5xl">
              Jira Clone
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-xl font-primary-light">
            Manage your projects with ease
          </p>

          {/* Features */}
          <div className="flex flex-col gap-4 pt-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <HiCheckCircle size={24} className="flex-shrink-0" />
                <span className="font-primary text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating decorative shapes */}
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-white opacity-5 blur-3xl" />
        <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-white opacity-5 blur-3xl" />
      </div>

      {/* Right Panel - Form */}
      <div
        className={cx(
          "flex w-full flex-col items-center justify-center px-6",
          "lg:w-1/2"
        )}
      >
        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-primary-black text-4xl text-font">
              Welcome back
            </h1>
            <p className="mt-3 font-primary-light text-font-subtle">
              Select your profile to continue
            </p>
          </div>

          {/* Form */}
          <Form method="post" className="flex flex-col gap-6">
            {/* Select Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="user-select"
                className="font-primary-bold text-sm text-font-subtle"
              >
                User Profile
              </label>
              <Select.Root
                name="user"
                defaultValue={userMock1.id}
                onValueChange={onValueChange}
              >
                <Select.Trigger
                  id="user-select"
                  className="flex w-full justify-between"
                  aria-label="Open user select"
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar {...selectedValue} />
                    <Select.Value />
                  </div>
                  <Select.TriggerIcon />
                </Select.Trigger>
                <Select.Content>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    {users.map((user, index) => (
                      <Select.Item key={index} value={user.id}>
                        <Select.ItemIndicator />
                        <UserAvatar {...user} />
                        <Select.ItemText>{user.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                    <Select.Separator />
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Root>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              name="_action"
              value="setUser"
              aria-label="Login"
              className="w-full py-3 text-base font-primary-bold"
            >
              Login
            </Button>
          </Form>

          {/* Footer Note */}
          <p className="mt-8 text-center font-primary-light text-xs text-font-subtlest">
            This is a demo application. No authentication required. Select any
            user to explore the project board.
          </p>
        </div>
      </div>
    </div>
  );
};

interface Props {
  users: User[];
}
