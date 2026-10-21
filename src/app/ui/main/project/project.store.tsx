import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";
import { PRIORITY_FILTER_ALL, PriorityFilter } from "@domain/priority";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  priorityFilter: PriorityFilter;
  setPriorityFilter: Dispatch<SetStateAction<PriorityFilter>>;
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
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>(PRIORITY_FILTER_ALL);

  return (
    <ProjectContext.Provider
      value={{
        project,
        search,
        setSearch,
        priorityFilter,
        setPriorityFilter,
      }}
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
