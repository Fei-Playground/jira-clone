export type SSOProviderType = "github" | "google" | "microsoft" | "gitlab";

export interface SSOProvider {
  id: SSOProviderType;
  name: string;
  color: "primary" | "neutral";
  href: string;
}

export const ssoProviders: SSOProvider[] = [
  {
    id: "github",
    name: "GitHub",
    color: "neutral",
    href: "/auth/github",
  },
  {
    id: "google",
    name: "Google",
    color: "neutral",
    href: "/auth/google",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    color: "neutral",
    href: "/auth/microsoft",
  },
  {
    id: "gitlab",
    name: "GitLab",
    color: "neutral",
    href: "/auth/gitlab",
  },
];
