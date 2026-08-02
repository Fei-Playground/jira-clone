import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";
import { DateFilter, DEFAULT_DATE_FILTER } from "@domain/filter";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dateFilter: DateFilter;
  setDateFilter: Dispatch<SetStateAction<DateFilter>>;
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
  const [dateFilter, setDateFilter] =
    useState<DateFilter>(DEFAULT_DATE_FILTER);

  return (
    <ProjectContext.Provider
      value={{ project, search, setSearch, dateFilter, setDateFilter }}
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
