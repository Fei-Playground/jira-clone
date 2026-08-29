import { useState } from "react";
import { Form } from "react-router";
import { Button } from "@app/components/button";
import { Input } from "@app/components/input";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

// Minimum password length for security
const MIN_PASSWORD_LENGTH = 6;

// Basic email validation pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginView = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (value: string): boolean => {
    if (!value || textAreOnlySpaces(value)) {
      setEmailError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value || textAreOnlySpaces(value)) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear errors on change if there was an existing error
    if (emailError) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    // Clear errors on change if there was an existing error
    if (passwordError) {
      validatePassword(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    // Prevent form submission if validation fails
    if (!isEmailValid || !isPasswordValid) {
      e.preventDefault();
    }
  };

  return (
    <div className="mx-auto max-w-[400px] pt-[10vh]">
      <h1 className="font-primary-black text-5xl text-font-danger">Login</h1>
      <h2 className="mb-8 mt-3 font-primary-light text-lg text-font-subtle">
        Enter your email and password to access your account
      </h2>
      <Form method="post" className="mx-auto w-[300px]" onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          id="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => validateEmail(email)}
          error={emailError}
          autoComplete="email"
          containerClassName="mb-4"
        />
        <Input
          type="password"
          name="password"
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          autoComplete="current-password"
          containerClassName="mb-4"
        />
        <Button
          type="submit"
          name="_action"
          value="login"
          aria-label="Login"
          className="mt-2 w-full"
        >
          Login
        </Button>
      </Form>
    </div>
  );
};
