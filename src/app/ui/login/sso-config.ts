/**
 * SSO (Single Sign-On) Provider Configuration
 * Defines supported social authentication providers and their metadata
 */

export interface SsoProvider {
  id: string;
  name: string;
  iconName: string;
  iconLibrary: "ai" | "fa" | "si" | "hi" | "fc";
}

export const SSO_PROVIDERS: SsoProvider[] = [
  {
    id: "google",
    name: "Google",
    iconName: "FcGoogle",
    iconLibrary: "fc" as const,
  },
  {
    id: "github",
    name: "GitHub",
    iconName: "AiFillGithub",
    iconLibrary: "ai",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    iconName: "SiMicrosoft",
    iconLibrary: "si",
  },
  {
    id: "apple",
    name: "Apple",
    iconName: "SiApple",
    iconLibrary: "si",
  },
];
