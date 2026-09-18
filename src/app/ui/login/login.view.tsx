import { useState } from "react";
import { Form } from "react-router";
import { User, UserId, userMock1 } from "@domain/user";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import * as Select from "@app/components/select";
import { useTranslation } from "@app/store/locale.store";

export const LoginView = ({ users }: Props) => {
  const [selectedValue, setSelectedValue] = useState<User>(userMock1);
  const { t } = useTranslation();

  const onValueChange = (userId: UserId) => {
    const foundUser = users.find((user) => user.id === userId);

    if (foundUser) {
      setSelectedValue(foundUser);
    }
  };

  return (
    <div className="mx-auto max-w-[400px] pt-[10vh]">
      <h1 className="font-primary-black text-5xl text-font">
        {t("login.title")}
      </h1>
      <h2 className="mb-8 mt-3 font-primary-light text-lg text-font-subtle">
        {t("login.description")}
      </h2>
      <Form method="post" className="mx-auto w-[300px]">
        <Select.Root
          name="user"
          defaultValue={userMock1.id}
          onValueChange={onValueChange}
        >
          <Select.Trigger
            className="flex w-full justify-between"
            aria-label={t("login.openUserSelect")}
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
          aria-label={t("login.loginButton")}
          className="mt-2 w-full"
        >
          {t("login.loginButton")}
        </Button>
      </Form>
    </div>
  );
};

interface Props {
  users: User[];
}
