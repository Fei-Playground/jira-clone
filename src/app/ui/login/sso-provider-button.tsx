import cx from "classix";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { SiMicrosoft, SiApple } from "react-icons/si";
import { Button } from "@app/components/button";
import { SsoProvider } from "./sso-config";

const ICON_MAP: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  FcGoogle,
  AiFillGithub,
  SiMicrosoft,
  SiApple,
};

export const SsoProviderButton = ({
  provider,
  onClick,
}: SsoProviderButtonProps): JSX.Element => {
  const IconComponent = ICON_MAP[provider.iconName];

  return (
    <Button
      variant="contained"
      color="neutral"
      size="md"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2"
      aria-label={`Sign in with ${provider.name}`}
    >
      {IconComponent && <IconComponent size={20} className="flex-shrink-0" />}
      <span>Sign in with {provider.name}</span>
    </Button>
  );
};

interface SsoProviderButtonProps {
  provider: SsoProvider;
  onClick?: () => void;
}
