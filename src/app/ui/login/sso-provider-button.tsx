import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { SiMicrosoft, SiApple } from "react-icons/si";
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
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded p-2 text-font hover:opacity-90 active:opacity-75 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={`Sign in with ${provider.name}`}
      style={{
        backgroundColor: "#0959e5",
        color: "white",
      }}
    >
      {IconComponent && <IconComponent size={20} className="flex-shrink-0" />}
      <span>Sign in with {provider.name}</span>
    </button>
  );
};

interface SsoProviderButtonProps {
  provider: SsoProvider;
  onClick?: () => void;
}
