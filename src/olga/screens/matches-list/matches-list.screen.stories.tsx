import type { Meta, StoryObj } from "@storybook/react-vite";
import { MatchesListScreen } from "./matches-list.screen";
import { mockMatches } from "@olga/domain/mock-data";

const meta: Meta<typeof MatchesListScreen> = {
  title: "OLGA/Screens/Matches List",
  component: MatchesListScreen,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MatchesListScreen>;

export const WithMatches: Story = {
  args: {
    matches: mockMatches,
    unreadMatchIds: ["match-01"],
  },
};

export const Empty: Story = {
  args: { matches: [] },
};

export const AllRead: Story = {
  args: {
    matches: mockMatches,
    unreadMatchIds: [],
  },
};
