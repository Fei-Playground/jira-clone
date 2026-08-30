import type { LoaderFunction, MetaFunction } from "react-router";
import { data as json, redirect } from "react-router";
import invariant from "tiny-invariant";
import { Project, ProjectId } from "@domain/project";
import { getProject } from "@infrastructure/db/project";
import { GanttView } from "@app/ui/main/project/gantt";
import { Error500 } from "@app/components/error-500";
import { formatTags, formatProperties } from "@utils/meta";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  const { project } = data as unknown as LoaderData;
  const title = "Jira clone - Gantt";
  const description =
    "Plan deliverables on a timeline. Add milestones as diamond markers for key dates.";
  const image = "https://jira-clone.fly.dev/static/images/readme/project.png";
  const url = `https://jira-clone.fly.dev/projects/${project.id}/gantt`;

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
  project: Project;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const projectId = params.projectId as ProjectId;

  invariant(params.projectId, `params.projectId is required`);

  const project: Project | null = await getProject(projectId);

  if (!project) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  if (url.pathname === `/projects/${projectId}`) {
    return redirect(`/projects/${projectId}/gantt`);
  }

  return json<LoaderData>({ project });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  const errorMessage = "The Gantt page failed. Navigate to the board page";

  return (
    <div className="flex h-full items-center justify-center">
      <Error500 message={errorMessage} href="board" />
    </div>
  );
}

export default function GanttRoute() {
  return <GanttView />;
}
