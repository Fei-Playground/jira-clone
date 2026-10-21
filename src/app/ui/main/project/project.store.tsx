import {
  createContext,
  useContext,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { Project, getPrioritiesInUse } from "@domain/project";
import { Priority } from "@domain/priority";
import { ALL_PRIORITIES, PriorityFilter } from "@domain/filter";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  prioritiesInUse: Priority[];
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
    useState<PriorityFilter>(ALL_PRIORITIES);
  const prioritiesInUse = useMemo(() => getPrioritiesInUse(project), [project]);
  const priorityFilterIsInUse =
    priorityFilter === ALL_PRIORITIES ||
    prioritiesInUse.some((priority) => priority.id === priorityFilter);

  // Show every issue again when the filtered priority is no longer used by any issue
  if (!priorityFilterIsInUse) {
    setPriorityFilter(ALL_PRIORITIES);
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        search,
        setSearch,
        prioritiesInUse,
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
