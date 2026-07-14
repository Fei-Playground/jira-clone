import { ErrorBase } from "../error-base";

export const Error500 = ({
  message = "Error 500: Server error",
  href,
}: Props) => {
  // Border wrapper provides visual distinction for 500 errors,
  // separating them from other error types with a danger-colored border
  return (
    <div className="border-4 border-border-danger">
      <ErrorBase variant="500" message={message} href={href} />
    </div>
  );
};

interface Props {
  message?: string;
  href?: string;
}
