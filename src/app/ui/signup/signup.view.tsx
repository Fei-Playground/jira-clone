import { useState } from "react";
import { Form } from "react-router";
import { Button } from "@app/components/button";

export const SignupView = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="mx-auto max-w-[400px]">
      <h1 className="font-primary-black text-5xl text-font">Create account</h1>
      <h2 className="mb-8 mt-3 font-primary-light text-lg text-font-subtle">
        Sign up to start managing your projects and collaborating with your
        team.
      </h2>

      <Form method="post" className="mx-auto flex w-[300px] flex-col gap-3">
        {/* Full name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="font-primary text-sm text-font-subtle"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Woody Pride"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="box-border w-full resize-none rounded-md border-none bg-background-input p-3 font-primary text-sm text-font outline-2 hover:bg-background-input-hovered focus-visible:bg-background-input-pressed focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="font-primary text-sm text-font-subtle"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="woody@jira.dev"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="box-border w-full resize-none rounded-md border-none bg-background-input p-3 font-primary text-sm text-font outline-2 hover:bg-background-input-hovered focus-visible:bg-background-input-pressed focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="font-primary text-sm text-font-subtle"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="box-border w-full resize-none rounded-md border-none bg-background-input p-3 font-primary text-sm text-font outline-2 hover:bg-background-input-hovered focus-visible:bg-background-input-pressed focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand"
          />
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="font-primary text-sm text-font-subtle"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`box-border w-full resize-none rounded-md border-none p-3 font-primary text-sm text-font outline-2 hover:bg-background-input-hovered focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand ${
              passwordMismatch
                ? "bg-background-danger focus-visible:bg-background-danger"
                : "bg-background-input focus-visible:bg-background-input-pressed"
            }`}
          />
          {passwordMismatch && (
            <p className="font-primary-light text-2xs text-font-danger">
              Passwords do not match.
            </p>
          )}
        </div>

        <Button
          type="submit"
          name="_action"
          value="signup"
          aria-label="Create account"
          className="mt-1 w-full"
          disabled={passwordMismatch}
        >
          Create account
        </Button>

        <p className="text-center font-primary-light text-sm text-font-subtle">
          Already have an account?{" "}
          <a href="/login" className="text-font-brand hover:underline">
            Log in
          </a>
        </p>
      </Form>
    </div>
  );
};
