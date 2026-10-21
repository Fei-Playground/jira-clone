import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";
import { ALL_PRIORITIES, PriorityFilter } from "@domain/filter";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  priority: PriorityFilter;
  setPriority: Dispatch<SetStateAction<PriorityFilter>>;
}

const ProjectContext = createContext<ProjectStore | undefined>(undefined);

export const ProjectContextProvider = ({
  project,
  children,
}: {
  project: Project;
  children: JSX.Element;
}): JSX.Element => {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<PriorityFilter>(ALL_PRIORITIES);

  return (
    <ProjectContext.Provider
      value={{ project, search, setSearch, priority, setPriority }}
    >
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
