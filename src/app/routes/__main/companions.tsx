import type { MetaFunction } from "react-router";
import { CompanionsView } from "@app/ui/main/companions";

export const meta: MetaFunction = () => {
  return [{ title: "Jira clone - Companions" }];
};

export default function CompanionsRoute() {
  return <CompanionsView />;
}
