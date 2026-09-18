import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { LocaleProvider } from "@app/store/locale.store";
import { DEFAULT_LOCALE } from "@app/locales";
import { Search } from "./search";

const meta: Meta<typeof Search> = {
  title: "Pages/Main/Project/Board/Search",
  component: Search,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) =>
      withRemixStub(
        <LocaleProvider specifiedLocale={DEFAULT_LOCALE}>
          <ProjectContextProvider project={projectMock1}>
            <div className="p-4">
              <Story />
            </div>
          </ProjectContextProvider>
        </LocaleProvider>
      ),
  ],
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};
