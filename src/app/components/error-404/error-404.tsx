import { ErrorBase } from "../error-base";

export const Error404 = ({ message = "Page not found", href }: Props) => {
  return <ErrorBase variant="404" message={message} href={href} />;
};

interface Props {
  message: string;
  href: string;
}
