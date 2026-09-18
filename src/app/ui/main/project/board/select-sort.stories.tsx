import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRemixStub } from "@app/stories/utils";
import { projectMock1 } from "@domain/project";
import { ProjectContextProvider } from "@app/ui/main/project";
import { LocaleProvider } from "@app/store/locale.store";
import { DEFAULT_LOCALE } from "@app/locales";
import { SelectSort } from "./select-sort";

const meta: Meta<typeof SelectSort> = {
  title: "Pages/Main/Project/Board/SelectSort",
  component: SelectSort,
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
type Story = StoryObj<typeof SelectSort>;

export const Default: Story = {};
