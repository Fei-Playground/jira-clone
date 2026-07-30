import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";
import { PriorityId } from "@domain/priority";

export type PriorityFilter = PriorityId | "all";

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
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

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
