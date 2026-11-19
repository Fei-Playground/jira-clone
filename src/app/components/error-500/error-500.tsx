import { ErrorBase } from "../error-base";

export const Error500 = ({
  message = "Something went wrong on our side",
  href,
}: Props) => {
  return <ErrorBase variant="500" message={message} href={href} />;
};

interface Props {
  message: string;
  href: string;
}
