import { useState } from "react";
import { Form } from "react-router";
import { User, UserId, userMock1 } from "@domain/user";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import * as Select from "@app/components/select";

export const LoginView = ({ users }: Props) => {
  // Use the first user from props if available, fallback to userMock1
  const defaultUser = users.length > 0 ? users[0] : userMock1;
  const [selectedValue, setSelectedValue] = useState<User>(defaultUser);

  const onValueChange = (userId: UserId) => {
    const foundUser = users.find((user) => user.id === userId);

    if (foundUser) {
      setSelectedValue(foundUser);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hero */}
      <div className="hidden bg-background-brand-bold px-[40px] py-[40px] text-font-inverse lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center">
        <div className="max-w-sm text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Jira Clone Logo"
              width={64}
              height={64}
            />
          </div>
          {/* App Name */}
          <h1 className="mb-3 font-primary-black text-4xl">Jira Clone</h1>
          {/* Tagline */}
          <p className="mb-12 font-primary-light text-lg opacity-90">
            Manage your projects with ease
          </p>
          {/* Feature Bullets */}
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-font-inverse"></span>
              <span className="font-primary-light">
                Organize issues and tasks
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-font-inverse"></span>
              <span className="font-primary-light">
                Collaborate with your team
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-font-inverse"></span>
              <span className="font-primary-light">
                Track project analytics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center bg-elevation-surface px-4 py-8 lg:w-1/2 lg:px-0">
        <div className="w-full max-w-sm rounded-lg bg-elevation-surface-raised p-8 shadow-md lg:max-w-sm">
          {/* Heading */}
          <h2 className="text-red-500 mb-2 font-primary-black text-3xl">
            Welcome back
          </h2>
          {/* Subheading */}
          <p className="mb-8 font-primary-light text-sm text-font-subtle">
            Select your profile to continue
          </p>

          {/* Form */}
          <Form method="post">
            {/* User Select */}
            <div className="mb-6">
              <Select.Root
                name="user"
                defaultValue={defaultUser.id}
                onValueChange={onValueChange}
              >
                <Select.Trigger
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
                    {users.map((user) => (
                      <Select.Item key={user.id} value={user.id}>
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

            {/* Login Button */}
            <Button
              type="submit"
              name="_action"
              value="setUser"
              aria-label="Login"
              className="w-full"
            >
              Login
            </Button>
          </Form>

          {/* Demo Note */}
          <p className="mt-8 text-center font-primary-light text-xs text-font-subtlest">
            No password needed — this is a demo app
          </p>
        </div>
      </div>
    </div>
  );
};

interface Props {
  users: User[];
}
