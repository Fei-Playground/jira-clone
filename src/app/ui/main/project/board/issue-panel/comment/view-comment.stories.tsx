import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRoutesStub } from "react-router";
import { userMock1, usersMock } from "@domain/user";
import { commentMock1, commentMock4 } from "@domain/comment";
import { UserContextProvider } from "@app/store/user.store";
import { ViewComment } from "./view-comment";

const meta: Meta<typeof ViewComment> = {
  title: "IssuePanel/ViewComment",
  component: ViewComment,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      const RemixStub = createRoutesStub([
        {
          path: "/",
          Component: () => (
            <UserContextProvider user={userMock1}>
              <div style={{ maxWidth: 560, margin: "0 auto", padding: 16 }}>
                <Story />
              </div>
            </UserContextProvider>
          ),
          action: async () => ({ status: 200 }),
        },
      ]);
      return <RemixStub />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ViewComment>;

/** Comment authored by the current user (Daniel Serrano) — Edit/Delete controls visible. */
export const OwnComment: Story = {
  args: {
    comment: commentMock4,
    removeComment: () => {},
  },
};

/** Comment authored by another user — Edit/Delete controls hidden. */
export const OtherUserComment: Story = {
  args: {
    comment: { ...commentMock1, user: usersMock[3] },
    removeComment: () => {},
  },
};
