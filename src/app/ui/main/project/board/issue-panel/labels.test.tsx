import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { userMock1 } from "@domain/user";
import { projectMock1 } from "@domain/project";
import { Issue, todoIssuesMock1 } from "@domain/issue";
import { UserContextProvider } from "@app/store/user.store";
import { ProjectContextProvider } from "@app/ui/main/project";
import { Labels } from "./labels";
import { IssuePanel } from "./issue-panel.view";

/** The field the panel renders: the hidden input the form posts, with the chips beside it. */
const labelsField = (container: HTMLElement): HTMLElement => {
  const hiddenInput = container.querySelector<HTMLInputElement>(
    'input[name="labels"]'
  );
  if (!hiddenInput?.parentElement)
    throw new Error('No input[name="labels"] was rendered');
  return hiddenInput.parentElement;
};

/** The label names the form would post. */
const postedLabels = (container: HTMLElement): string => {
  const hiddenInput = labelsField(container).querySelector<HTMLInputElement>(
    'input[name="labels"]'
  );
  return hiddenInput?.value as string;
};

const labelNames = (container: HTMLElement): string[] =>
  Array.from(labelsField(container).querySelectorAll("li")).map(
    (chip) => chip.textContent
  );

const labelInput = (): HTMLInputElement =>
  screen.getByLabelText("Add a label") as HTMLInputElement;

const renderLabels = (initLabels: string[] = []) =>
  render(<Labels initLabels={initLabels} />);

const renderPanel = (
  issue: Issue | undefined,
  onAction?: (formData: FormData) => void
) => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => <IssuePanel issue={issue} />,
      action: async ({ request }) => {
        onAction?.(await request.formData());
        return null;
      },
    },
  ]);

  return render(
    <UserContextProvider user={userMock1}>
      <ProjectContextProvider project={projectMock1}>
        <Stub />
      </ProjectContextProvider>
    </UserContextProvider>
  );
};

const addLabel = async (label: string): Promise<void> => {
  const user = userEvent.setup();
  const input = labelInput();
  await user.clear(input);
  if (label.length > 0) await user.type(input, label);
  await user.keyboard("{Enter}");
};

describe("Labels", () => {
  it("adds a label trimmed of its surrounding spaces", async () => {
    const { container } = renderLabels();

    expect(labelInput().value).toBe("");

    await addLabel("  bug  ");

    expect(labelNames(container)).toEqual(["bug"]);
    expect(postedLabels(container)).toBe('["bug"]');
    expect(labelInput().value).toBe("");
  });

  it("adds nothing when the label is empty", async () => {
    const { container } = renderLabels();

    await addLabel("");

    expect(labelNames(container)).toEqual([]);
    expect(within(labelsField(container)).queryByRole("list")).toBeNull();
    expect(postedLabels(container)).toBe("[]");
  });

  it("adds nothing when the label is only spaces", async () => {
    const { container } = renderLabels();

    await addLabel("   ");

    expect(labelNames(container)).toEqual([]);
    expect(postedLabels(container)).toBe("[]");
  });

  it("ignores a label that is already on the issue, spaces included", async () => {
    const { container } = renderLabels(["bug"]);

    await addLabel("  bug  ");

    expect(labelNames(container)).toEqual(["bug"]);
    expect(postedLabels(container)).toBe('["bug"]');
  });

  it("removes a label through its remove control", async () => {
    const user = userEvent.setup();
    const { container } = renderLabels(["bug", "ui"]);

    await user.click(screen.getByLabelText("Remove bug label"));

    expect(labelNames(container)).toEqual(["ui"]);
    expect(postedLabels(container)).toBe('["ui"]');
  });
});

describe("IssuePanel labels field", () => {
  it("shows the labels of the issue and posts the added label with the issue", async () => {
    const user = userEvent.setup();
    const submitted: FormData[] = [];
    const issue = {
      ...todoIssuesMock1[0],
      labels: ["error-handling", "hint"],
    };
    const { container } = renderPanel(issue, (formData) => {
      submitted.push(formData);
    });

    expect(labelNames(container)).toEqual(["error-handling", "hint"]);

    await addLabel("  bug  ");

    // Enter adds the label instead of submitting the issue
    expect(submitted).toHaveLength(0);
    expect(labelNames(container)).toEqual(["error-handling", "hint", "bug"]);
    expect(postedLabels(container)).toBe('["error-handling","hint","bug"]');

    await user.click(screen.getByRole("button", { name: "Accept changes" }));

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(submitted[0].get("labels")).toBe('["error-handling","hint","bug"]');
    expect(submitted[0].get("_action")).toBe("update");
  });

  it("removes a label from the panel without submitting the issue", async () => {
    const user = userEvent.setup();
    const submitted: FormData[] = [];
    const issue = {
      ...todoIssuesMock1[0],
      labels: ["error-handling", "hint"],
    };
    const { container } = renderPanel(issue, (formData) => {
      submitted.push(formData);
    });

    await user.click(screen.getByLabelText("Remove hint label"));

    expect(labelNames(container)).toEqual(["error-handling"]);
    expect(postedLabels(container)).toBe('["error-handling"]');
    expect(submitted).toHaveLength(0);
  });

  it("posts the label added while creating a new issue", async () => {
    const user = userEvent.setup();
    const submitted: FormData[] = [];
    const { container } = renderPanel(undefined, (formData) => {
      submitted.push(formData);
    });

    await addLabel("  bug  ");

    expect(labelNames(container)).toEqual(["bug"]);
    expect(postedLabels(container)).toBe('["bug"]');

    await user.click(screen.getByRole("button", { name: "Accept changes" }));

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(submitted[0].get("labels")).toBe('["bug"]');
    expect(submitted[0].get("_action")).toBe("create");
  });
});
