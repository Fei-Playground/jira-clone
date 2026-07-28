import type { LoaderFunction, MetaFunction } from "react-router";
import { data as json } from "react-router";
import { useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { ProjectSummary, ProjectId } from "@domain/project";
import { getProjectSummary } from "@infrastructure/db/project";
import { ActivityTimelineView } from "@app/ui/main/project/activity";
import { Error500 } from "@app/components/error-500";
import { formatTags, formatProperties } from "@utils/meta";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  const { projectSummary } = data as unknown as LoaderData;
  const title = "Jira clone - Project Activity";
  const description = "View all project events and team activities.";
  const image = "https://jira-clone.fly.dev/static/images/readme/project.png";
  const url = `https://jira-clone.fly.dev/projects/${projectSummary.id}/activity`;

  const tags = {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    title: title,
    description: description,
    "twitter:card": "summary_large_image",
    "twitter:site": url,
    "twitter:domain": "jira-clone.fly.dev",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:image:width": "1457",
    "twitter:image:height": "872",
    "twitter:image:alt": title,
    "twitter:creator": "@Jack_DanielSG",
    "twitter:creator:id": "Jack_DanielSG",
  };

  const properties = {
    "og:url": url,
    "og:type": "website",
    "og:site_name": title,
    "og:title": title,
    "og:description": description,
    "og:image": image,
  };

  return [{ title }, ...formatTags(tags), ...formatProperties(properties)];
};

type LoaderData = {
  projectSummary: ProjectSummary;
};

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.projectId as ProjectId;

  invariant(params.projectId, `params.projectId is required`);

  const projectSummary = await getProjectSummary(projectId);

  if (!projectSummary) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json<LoaderData>({ projectSummary });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  const errorMessage = "The activity page failed. Navigate to the board page";

  return (
    <div className="flex h-full items-center justify-center">
      <Error500 message={errorMessage} href="board" />
    </div>
  );
}

export default function ActivityRoute() {
  const { projectSummary } = useLoaderData() as LoaderData;
  return <ActivityTimelineView projectName={projectSummary.name} />;
}
