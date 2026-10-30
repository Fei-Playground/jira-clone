import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";
import { UserId } from "@domain/user";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  selectedUserIds: UserId[];
  setSelectedUserIds: Dispatch<SetStateAction<UserId[]>>;
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
  const [selectedUserIds, setSelectedUserIds] = useState<UserId[]>([]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        search,
        setSearch,
        selectedUserIds,
        setSelectedUserIds,
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
