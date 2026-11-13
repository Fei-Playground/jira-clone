import { useState } from "react";
import { Form, useActionData } from "react-router";
import { User, UserId } from "@domain/user/user";
import { userMock1 } from "@domain/user/user.mock";
import { Button } from "@app/components/button/button";
import { UserAvatar } from "@app/components/user-avatar/user-avatar";
import * as Select from "@app/components/select/select";
import { ActionData as LoginActionData } from "@app/routes/login";

export const LoginView = ({ users }: Props) => {
  const [selectedValue, setSelectedValue] = useState<User>(userMock1);
  const actionData = useActionData() as LoginActionData;

  const onValueChange = (userId: UserId) => {
    const foundUser = users.find((user) => user.id === userId);

    if (foundUser) {
      setSelectedValue(foundUser);
    }
  };

  return (
    <div className="mx-auto max-w-[400px] pt-[10vh]">
      <h1 className="font-primary-black text-5xl text-font">
        Select login user
      </h1>
      <h2 className="mb-8 mt-3 font-primary-light text-lg text-font-subtle">
        There is no authentication involved. You can login with any user you
        want! Keep in mind you can only access the projects the user is member
        of. Try to create issues and comments with different users to see how it
        reflects in the UI and database. You can logout on the user avatar.
      </h2>
      <Form method="post" className="mx-auto w-[300px]">
        <Select.Root
          name="user"
          defaultValue={userMock1.id}
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
        <div className="mt-2 flex flex-col gap-1">
          <label
            htmlFor="password"
            className="font-primary-bold text-sm text-font"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="h-[40px] w-full rounded-md border-none bg-background-input p-3 text-font outline-2 hover:bg-background-input-hovered focus-visible:bg-background-input-pressed"
          />
        </div>
        <Button
          type="submit"
          name="_action"
          value="setUser"
          aria-label="Login"
          className="mt-2 w-full"
        >
          Login
        </Button>
        {actionData?.error && (
          <span className="mt-2 block text-center font-primary-light text-sm text-font-danger">
            {actionData.error}
          </span>
        )}
      </Form>
    </div>
  );
};

interface Props {
  users: User[];
}
