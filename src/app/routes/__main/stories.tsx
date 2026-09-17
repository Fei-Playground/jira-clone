import type { MetaFunction } from "react-router";
import { StoriesView } from "@app/ui/main/stories";

export const meta: MetaFunction = () => {
  return [{ title: "Jira clone - Stories" }];
};

export default function StoriesRoute() {
  return <StoriesView />;
}
