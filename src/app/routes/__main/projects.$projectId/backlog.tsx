import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "react-router";
import { data as json } from "react-router";
import { useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { ProjectId } from "@domain/project";
import { Issue, IssueId } from "@domain/issue";
import {
  SprintId,
  SprintWithIssues,
  toSprintEnd,
  toSprintStart,
} from "@domain/sprint";
import {
  createSprint,
  deleteSprint,
  getBacklog,
} from "@infrastructure/db/sprint";
import { updateIssueSprint } from "@infrastructure/db/issue";
import { Error500 } from "@app/components/error-500";
import { BacklogView } from "@app/ui/main/project/backlog";
import { EVENTS } from "@app/events";
import { emitter } from "@app/events/emitter.server";
import { fromDateInputValue } from "@utils/date";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { formatTags, formatProperties } from "@utils/meta";

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) return [];
  const title = "Jira clone - Backlog";
  const description =
    "Plan the next sprint. Create a sprint with its dates and move issues from the backlog into it.";
  const image = "https://jira-clone.fly.dev/static/images/readme/project.png";
  const url = `https://jira-clone.fly.dev/projects/${params.projectId}/backlog`;

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
  sprints: SprintWithIssues[];
  backlogIssues: Issue[];
};

export type ActionData = {
  errors: {
    name?: string;
    startDate?: string;
    endDate?: string;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.projectId as ProjectId;

  invariant(params.projectId, `params.projectId is required`);

  const backlog = await getBacklog(projectId);

  if (!backlog) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json<LoaderData>(backlog);
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === "createSprint") {
    const projectId = params.projectId as ProjectId;
    const name = formData.get("name") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const errors: ActionData["errors"] = {};

    if (!name || textAreOnlySpaces(name)) {
      errors.name = "Name is required";
    }

    if (!startDate) {
      errors.startDate = "Start date is required";
    }

    if (!endDate) {
      errors.endDate = "End date is required";
    }

    if (!errors.startDate && !errors.endDate && endDate < startDate) {
      errors.endDate = "End date must be on or after the start date";
    }

    if (Object.keys(errors).length > 0) {
      return json<ActionData>({ errors }, { status: 400 });
    }

    try {
      await createSprint({
        projectId,
        name: name.trim(),
        startDate: toSprintStart(fromDateInputValue(startDate)),
        endDate: toSprintEnd(fromDateInputValue(endDate)),
      });
      return json(null, { status: 201 });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Could not create the sprint";
      return json({ error: errorMsg }, { status: 500 });
    }
  }

  if (_action === "updateIssueSprint") {
    const issueId = formData.get("issueId") as IssueId;
    const sprintId = (formData.get("sprintId") as string) || null;

    try {
      await updateIssueSprint({ issueId, sprintId });
      emitter.emit(EVENTS.ISSUE_CHANGED, Date.now());
      return json(null, { status: 201 });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Could not move the issue";
      return json({ error: errorMsg }, { status: 500 });
    }
  }

  if (_action === "deleteSprint") {
    const sprintId = formData.get("sprintId") as SprintId;

    try {
      await deleteSprint(sprintId);
      return json(null, { status: 201 });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Could not delete the sprint";
      return json({ error: errorMsg }, { status: 500 });
    }
  }

  console.error("Unknown action", _action);
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
  const { sprints, backlogIssues } = useLoaderData() as LoaderData;
  return <BacklogView sprints={sprints} backlogIssues={backlogIssues} />;
}
