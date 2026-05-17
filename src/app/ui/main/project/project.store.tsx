import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";

type ViewMode = "kanban" | "gantt";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const ProjectContext = createContext<ProjectStore | undefined>(undefined);

export const ProjectContextProvider = ({
  project,
  children,
  initialViewMode = "kanban",
}: {
  project: Project;
  children: JSX.Element;
  initialViewMode?: ViewMode;
}): JSX.Element => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  return (
    <ProjectContext.Provider value={{ project, search, setSearch, viewMode, setViewMode }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectStore = (): ProjectStore => {
  const projectStore = useContext(ProjectContext);
  if (!projectStore) {
    throw new Error("Project context not found");
  }
  return projectStore;
};
