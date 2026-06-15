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
    <div className="mx-auto max-w-[480px] pt-[8vh] text-center">
      <div className="mb-6 text-5xl">✨</div>
      <h1 className="font-primary-black text-4xl text-font">
        Izzy&apos;s Independence Board
      </h1>
      <p className="mb-2 mt-3 font-primary-light text-lg text-font-subtle">
        Who&apos;s here today?
      </p>
      <p className="mb-8 font-primary-light text-sm italic text-font-subtlest">
        &quot;Freedom grows when responsibility grows.&quot;
      </p>
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
        <Button
          type="submit"
          name="_action"
          value="setUser"
          aria-label="Login"
          className="mt-4 w-full"
        >
          Let&apos;s Go! 🚀
        </Button>
      </Form>
    </div>
  );
};

interface Props {
  users: User[];
}
