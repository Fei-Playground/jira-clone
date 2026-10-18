import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project/project.mock";
import { todoIssuesMock1 } from "@domain/issue/issue.mock";
import {
  commentMock1,
  commentMock4,
  commentMock5,
} from "@domain/comment/comment.mock";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import { IssuePanel } from "./issue-panel.view";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof IssuePanel> = {
  title: "Pages/Main/Project/Board/IssuePanel/IssuePanelView",
  component: IssuePanel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ProjectContextProvider project={projectMock1}>
        {withRemixStub(withMainContext(Story))}
      </ProjectContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IssuePanel>;

// Base issue is todoIssuesMock1[0] from the "To do" column, extended (not
// rewritten) with a comment thread. The story user is userMock1 (Daniel
// Serrano), so commentMock4 shows the Edit/Delete affordances of an
// own comment, while commentMock5 (Ms Potato) and commentMock1 (Jessie)
// show read-only comments authored by other users.
const issueWithComments = {
  ...todoIssuesMock1[0],
  comments: [commentMock4, commentMock5, commentMock1],
};

const issueWithoutComments = {
  ...todoIssuesMock1[0],
  comments: [],
};

// The theme decorator in .storybook/preview.ts applies its class to <html> and
// reads the theme from the `themes.themeOverride` parameter, which is how a
// story pins itself to a theme without the toolbar. "dark" is the class the app
// itself puts on <html> for its dark theme, and it has to stay in step with the
// `themes` map in .storybook/preview.ts.
const darkTheme = { themes: { themeOverride: "dark" } };

export const WithComments: Story = {
  args: {
    issue: issueWithComments,
  },
};

export const DarkWithComments: Story = {
  parameters: darkTheme,
  args: {
    issue: issueWithComments,
  },
};

export const NoComments: Story = {
  args: {
    issue: issueWithoutComments,
  },
};

export const DarkNoComments: Story = {
  parameters: darkTheme,
  args: {
    issue: issueWithoutComments,
  },
};

export const CreateNewIssue: Story = {
  args: {
    issue: undefined,
  },
};

export const DarkCreateNewIssue: Story = {
  parameters: darkTheme,
  args: {
    issue: undefined,
  },
};
