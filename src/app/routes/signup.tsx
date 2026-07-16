import type { ActionFunction, MetaFunction } from "react-router";
import { redirect } from "react-router";
import { SignupView } from "@app/ui/signup";
import { formatTags, formatProperties } from "@utils/meta";

export const meta: MetaFunction = () => {
  const title = "Jira clone - Sign up";
  const description = "Create a new account to start managing your projects.";
  const url = "https://jira-clone.fly.dev/signup";

  const tags = {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: title,
    description: description,
  };

  const properties = {
    "og:url": url,
    "og:type": "website",
    "og:site_name": title,
    "og:title": title,
    "og:description": description,
  };

  return [{ title }, ...formatTags(tags), ...formatProperties(properties)];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === "signup") {
    return redirect("/login");
  }

  console.error("Unknown action", _action);
  return null;
};

export default function SignupRoute() {
  return <SignupView />;
}
