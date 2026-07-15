import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Project } from "@domain/project";
import { EventTypeId } from "@domain/event-type";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  eventTypeFilter: EventTypeId[];
  setEventTypeFilter: Dispatch<SetStateAction<EventTypeId[]>>;
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
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeId[]>([]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        search,
        setSearch,
        eventTypeFilter,
        setEventTypeFilter,
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
