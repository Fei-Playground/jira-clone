import { SsoProviderButton } from "./sso-provider-button";
import { SSO_PROVIDERS } from "./sso-config";

export const SsoProviders = (): JSX.Element => {
  const handleSsoClick = (providerId: string) => {
    // Placeholder for OAuth flow integration
    // In the future, this will redirect to OAuth endpoints
    console.log(`Redirecting to ${providerId} OAuth flow...`);
  };

  return (
    <div className="space-y-3">
      {SSO_PROVIDERS.map((provider) => (
        <SsoProviderButton
          key={provider.id}
          provider={provider}
          onClick={() => handleSsoClick(provider.id)}
        />
      ))}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-border-brand" />
        <span className="px-2 text-sm text-font-subtle">Or continue with</span>
        <div className="flex-1 border-t border-border-brand" />
      </div>
    </div>
  );
};
