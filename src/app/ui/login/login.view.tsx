import { useState } from "react";
import { Form } from "react-router";
import { User, UserId, userMock1 } from "@domain/user";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import * as Select from "@app/components/select";

export const LoginView = ({ users }: Props) => {
  const [selectedValue, setSelectedValue] = useState<User>(userMock1);

  const onValueChange = (userId: UserId) => {
    const foundUser = users.find((user) => user.id === userId);

    if (foundUser) {
      setSelectedValue(foundUser);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel: Branding Section */}
      <div className="hidden flex-col justify-between bg-background-brand-bold px-[40px] py-[40px] text-font-inverse lg:flex lg:w-1/2">
        {/* Logo and Brand */}
        <div>
          <div className="mb-8 flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Jira Clone Logo"
              className="h-[40px] w-[40px]"
            />
            <h1 className="font-primary-black text-2xl">Jira Clone</h1>
          </div>
          <p className="font-primary-light text-lg leading-relaxed">
            Manage your projects with ease
          </p>
        </div>

        {/* Decorative Abstract Shapes */}
        <div className="relative h-[300px] w-full">
          <div
            className="absolute right-12 top-0 h-[120px] w-[120px] rounded-full opacity-20"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <div
            className="absolute bottom-20 left-4 h-[80px] w-[80px] rounded-lg opacity-20"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <div
            className="absolute bottom-32 right-20 h-[100px] w-[100px] rotate-45 opacity-20"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex w-full flex-col items-center justify-center bg-elevation-surface px-6 py-12 lg:w-1/2 lg:px-[40px]">
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-2">
            <h2 className="font-primary-black text-4xl text-font-danger">
              Welcome back
            </h2>
          </div>

          {/* Subtitle */}
          <p className="mb-8 font-primary-light text-base text-font-subtle">
            This is a demo Jira clone with no real authentication. Select a
            user profile to continue.
          </p>

          {/* Login Form */}
          <Form method="post" className="space-y-6">
            {/* User Select */}
            <div className="space-y-2">
              <label
                htmlFor="user-select"
                className="block font-primary-bold text-sm text-font"
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
                  className="flex w-full items-center justify-between gap-2 rounded-md border border-border-input bg-elevation-surface px-3 py-2"
                  aria-label="Open user select"
                >
                  <div className="flex flex-1 items-center gap-3 overflow-hidden">
                    <UserAvatar {...selectedValue} size={32} />
                    <div className="flex-1 truncate">
                      <Select.Value />
                    </div>
                  </div>
                  <Select.TriggerIcon />
                </Select.Trigger>
                <Select.Content>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    {users.map((user, index) => (
                      <Select.Item key={index} value={user.id}>
                        <Select.ItemIndicator />
                        <UserAvatar {...user} size={32} />
                        <Select.ItemText>{user.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                    <Select.Separator />
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Root>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              name="_action"
              value="setUser"
              aria-label="Sign in"
              className="w-full py-2.5 text-base font-primary-bold"
            >
              Sign In
            </Button>
          </Form>

          {/* Demo Info */}
          <div className="mt-8 border-t border-border pt-6 text-xs text-font-subtlest">
            <p className="mb-2 font-primary-bold text-font-subtle">
              Demo Information
            </p>
            <p className="leading-relaxed">
              You can only access projects your selected user is a member of.
              Try creating issues and comments with different users to see how
              changes are reflected across the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  users: User[];
}
