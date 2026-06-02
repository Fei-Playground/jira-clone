import type { MetaFunction } from "react-router";
import { Error404 } from "@app/components/error-404";
import { formatTags } from "@utils/meta";

/**
 * Meta tags for the 404 Not Found page.
 * Provides SEO-friendly title and description for users and search engines.
 */
export const meta: MetaFunction = () => {
  const title = "Jira clone - Not Found";
  const description =
    "The page you are looking for does not exist. Navigate back to the main page.";

  const tags = {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: title,
    description: description,
  };

  return [{ title }, ...formatTags(tags)];
};

/**
 * 404 Not Found route component.
 * Displays a centered error message when users navigate to a non-existent page.
 */
export default function NotFound404Route() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Error404
        message="It seems that you have lost! Go to the main page"
        href="/"
      />
    </div>
  );
}
