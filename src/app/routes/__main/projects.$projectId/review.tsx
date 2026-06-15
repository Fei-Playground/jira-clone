import type { LoaderFunction, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { data as json } from "react-router";
import invariant from "tiny-invariant";
import { Project, ProjectId } from "@domain/project";
import { getProject } from "@infrastructure/db/project";
import { DailyReviewView } from "@app/ui/main/project/daily-review";
import { Error500 } from "@app/components/error-500";
import { formatTags, formatProperties } from "@utils/meta";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  const { project } = data as unknown as LoaderData;
  const title = "Daily Review — Izzy's Independence Board";
  const description =
    "Review Izzy's missions for the day. Check off completed tasks and leave notes.";
  const image = "https://jira-clone.fly.dev/static/images/readme/project.png";
  const url = `https://jira-clone.fly.dev/projects/${project.id}/review`;

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

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.projectId as ProjectId;

  invariant(params.projectId, `params.projectId is required`);

  const project: Project | null = await getProject(projectId);

  if (!project) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json<LoaderData>({ project });
};

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  const errorMessage =
    "The daily review page failed. Navigate to the board page";

  return (
    <div className="flex h-full items-center justify-center">
      <Error500 message={errorMessage} href="board" />
    </div>
  );
}

export default function ReviewRoute() {
  const { project } = useLoaderData() as LoaderData;
  return <DailyReviewView project={project} />;
}
