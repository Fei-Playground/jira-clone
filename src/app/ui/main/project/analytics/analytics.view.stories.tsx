import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { AnalyticsView } from "./analytics.view";
import { ProjectContextProvider } from "@app/ui/main/project/project.store";
import { projectMock1 } from "@domain/project";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof AnalyticsView> = {
  title: "Pages/Main/Project/AnalyticsView",
  component: AnalyticsView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <ProjectContextProvider project={projectMock1}>
          {withRemixStub(withMainContext(Story))}
        </ProjectContextProvider>
      );
    },
  ],
};

export default meta;
type StoryType = StoryObj<typeof AnalyticsView>;

export const Default: StoryType = {};
