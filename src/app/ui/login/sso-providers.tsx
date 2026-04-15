import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { SiMicrosoft, SiGitlab } from "react-icons/si";
import cx from "classix";
import { SSOProvider, ssoProviders } from "@domain/auth";
import { Button } from "@app/components/button";

export const SSOProviders = (): JSX.Element => {
  const getIconForProvider = (provider: SSOProvider): JSX.Element => {
    switch (provider.id) {
      case "github":
        return <AiFillGithub size={20} />;
      case "google":
        return <FcGoogle size={20} />;
      case "microsoft":
        return <SiMicrosoft size={20} />;
      case "gitlab":
        return <SiGitlab size={20} />;
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-3">
      <p className="text-center text-sm text-font-subtle">
        Or sign in with SSO
      </p>
      <div className="flex flex-col gap-2">
        {ssoProviders.map((provider) => (
          <a
            key={provider.id}
            href={provider.href}
            aria-label={`Sign in with ${provider.name}`}
          >
            <Button
              color={provider.color}
              variant="subtlest"
              className="w-full"
              type="button"
            >
              <span>{getIconForProvider(provider)}</span>
              <span className="text-sm">Continue with {provider.name}</span>
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
};
