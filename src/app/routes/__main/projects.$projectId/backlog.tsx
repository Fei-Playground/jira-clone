import type { LoaderFunction, MetaFunction } from "react-router";
import { data as json } from "react-router";
import { useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { ProjectSummary, ProjectId } from "@domain/project";
import { Issue } from "@domain/issue";
import { isValidSort, DEFAULT_BACKLOG_SORT } from "@domain/filter";
import { getProjectSummary } from "@infrastructure/db/project";
import { getBacklogIssues } from "@infrastructure/db/issue";
import { BacklogView } from "@app/ui/main/project/backlog";
import { Error500 } from "@app/components/error-500";
import { formatTags, formatProperties } from "@utils/meta";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  const { project } = data as unknown as LoaderData;
  const title = "Jira clone - Backlog";
  const description =
    "See every issue of the project in one list, sorted by priority or date.";
  const image = "https://jira-clone.fly.dev/static/images/readme/project.png";
  const url = `https://jira-clone.fly.dev/projects/${project.id}/backlog`;

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
  project: ProjectSummary;
  issues: Issue[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const sortByParam = url.searchParams.get("sortBy") as string;
  const sortBy = isValidSort(sortByParam) ? sortByParam : DEFAULT_BACKLOG_SORT;
  const projectId = params.projectId as ProjectId;

  invariant(params.projectId, `params.projectId is required`);

  const project = await getProjectSummary(projectId);

  if (!project) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const issues = await getBacklogIssues(projectId, { sortIssuesBy: sortBy });

  return json<LoaderData>({ project, issues });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  const errorMessage = "The backlog page failed. Navigate to the board page";

  return (
    <div className="flex h-full items-center justify-center">
      <Error500 message={errorMessage} href="board" />
    </div>
  );
}

export default function BacklogRoute() {
  const { project, issues } = useLoaderData() as LoaderData;
  return <BacklogView project={project} issues={issues} />;
}
