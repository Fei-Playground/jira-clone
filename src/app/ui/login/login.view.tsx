import { useState } from "react";
import { Form } from "react-router";
import { User, userMock1 } from "@domain/user";
import { Button } from "@app/components/button";
import { UserGrid } from "./user-grid";

export const LoginView = ({ users }: Props) => {
  const [selectedValue, setSelectedValue] = useState<User>(userMock1);

  const onValueChange = (user: User) => {
    setSelectedValue(user);
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* HERO PANEL - Desktop only */}
      <div className="hidden flex-col items-center justify-center bg-background-brand-bold lg:flex lg:w-2/5 lg:gap-6">
        <div className="flex flex-col items-center gap-4 px-8">
          <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
          <h1 className="text-center font-primary-black text-4xl text-font-inverse">
            Jira Clone
          </h1>
          <p className="text-center font-primary-light text-lg text-font-inverse opacity-80">
            Manage your projects, beautifully.
          </p>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="flex w-full flex-col items-center justify-center gap-8 bg-elevation-surface px-6 py-8 lg:w-3/5 lg:px-12 lg:py-0">
        {/* MOBILE HEADER */}
        <div className="flex items-center gap-3 self-start lg:hidden">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-primary-bold text-xl text-font-inverse">
            Jira Clone
          </span>
        </div>

        {/* FORM CONTENT */}
        <Form method="post" className="w-full max-w-md">
          <h2 className="mb-2 font-primary-black text-3xl text-font-danger">
            Welcome back
          </h2>
          <p className="mb-8 font-primary-light text-base text-font-subtle">
            Select your user to continue
          </p>

          {/* USER GRID */}
          <UserGrid
            users={users}
            selectedUser={selectedValue}
            onUserSelect={onValueChange}
          />

          {/* HIDDEN INPUT FOR FORM DATA */}
          <input type="hidden" name="user" value={selectedValue.id} />

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            name="_action"
            value="setUser"
            color="primary"
            variant="contained"
            className="mt-6 w-full"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

interface Props {
  users: User[];
}
