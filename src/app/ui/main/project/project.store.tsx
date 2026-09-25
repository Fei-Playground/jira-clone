import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  myIssuesOnly: boolean;
  setMyIssuesOnly: Dispatch<SetStateAction<boolean>>;
  highPriorityOnly: boolean;
  setHighPriorityOnly: Dispatch<SetStateAction<boolean>>;
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
  const [myIssuesOnly, setMyIssuesOnly] = useState(false);
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);

  return (
    <ProjectContext.Provider
      value={{
        project,
        search,
        setSearch,
        myIssuesOnly,
        setMyIssuesOnly,
        highPriorityOnly,
        setHighPriorityOnly,
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
