import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";
import { IssueId } from "@domain/issue";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  selectedIssueIds: IssueId[];
  setSelectedIssueIds: Dispatch<SetStateAction<IssueId[]>>;
  isSelectMode: boolean;
  setIsSelectMode: Dispatch<SetStateAction<boolean>>;
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
  const [selectedIssueIds, setSelectedIssueIds] = useState<IssueId[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  return (
    <ProjectContext.Provider
      value={{
        project,
        search,
        setSearch,
        selectedIssueIds,
        setSelectedIssueIds,
        isSelectMode,
        setIsSelectMode,
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
