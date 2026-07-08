import { useState } from "react";
import { Form } from "react-router";
import { Button } from "@app/components/button";

export const SignupView = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validate = () => {
    const next: Partial<typeof formData> = {};

    if (!formData.name.trim()) {
      next.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      next.password = "Password is required.";
    } else if (formData.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    return next;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the field error as the user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      e.preventDefault();
      setErrors(nextErrors);
    }
  };

  return (
    <div className="mx-auto max-w-[420px] pt-[10vh]">
      <h1 className="font-primary-black text-5xl text-font">Create account</h1>
      <p className="mb-8 mt-3 font-primary-light text-lg text-font-subtle">
        Sign up to start managing your projects and issues with your team.
      </p>

      <Form method="post" className="flex flex-col gap-5" onSubmit={onSubmit}>
        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="font-primary-bold text-sm text-font"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={formData.name}
            onChange={onChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-xs text-font-danger"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-primary-bold text-sm text-font"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={onChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-xs text-font-danger"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
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
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={onChange}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={inputClass(!!errors.password)}
          />
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-xs text-font-danger"
            >
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="font-primary-bold text-sm text-font"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={onChange}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            className={inputClass(!!errors.confirmPassword)}
          />
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              role="alert"
              className="text-xs text-font-danger"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          name="_action"
          value="signup"
          aria-label="Create account"
          className="mt-2 w-full"
        >
          Create account
        </Button>

        <p className="text-center text-sm text-font-subtle">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-primary-bold text-font-brand hover:underline"
          >
            Sign in
          </a>
        </p>
      </Form>
    </div>
  );
};

const inputClass = (hasError: boolean) =>
  [
    "w-full rounded-md border px-3 py-2 text-sm text-font",
    "bg-elevation-surface placeholder:text-font-subtlest",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError
      ? "border-border-danger"
      : "border-border hover:border-border-brand",
  ].join(" ");
