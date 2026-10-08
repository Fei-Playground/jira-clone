import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
import { Project, ProjectId } from "@domain/project";
import {
  ALL_ASSIGNEES,
  AssigneeFilter,
  DEFAULT_ASSIGNEE_FILTER,
  isValidAssigneeFilter,
} from "@domain/filter";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: (search: string) => void;
  assignee: AssigneeFilter;
  setAssignee: (assignee: AssigneeFilter) => void;
}

interface BoardFilters {
  search: string;
  assignee: AssigneeFilter;
}

const BOARD_FILTERS_STORAGE_KEY = "board-filters";

const DEFAULT_BOARD_FILTERS: BoardFilters = {
  search: "",
  assignee: DEFAULT_ASSIGNEE_FILTER,
};

const SERIALIZED_DEFAULT_FILTERS = JSON.stringify(DEFAULT_BOARD_FILTERS);

// Filters are remembered per project, so a search typed on one board does not
// silently hide the issues of another one.
const getStorageKey = (projectId: ProjectId): string =>
  `${BOARD_FILTERS_STORAGE_KEY}:${projectId}`;

const parseFilters = (serialized: string): BoardFilters => {
  try {
    const parsed = JSON.parse(serialized) as Partial<BoardFilters>;

    return {
      search:
        typeof parsed.search === "string"
          ? parsed.search
          : DEFAULT_BOARD_FILTERS.search,
      assignee: isValidAssigneeFilter(parsed.assignee)
        ? parsed.assignee
        : DEFAULT_BOARD_FILTERS.assignee,
    };
  } catch {
    return DEFAULT_BOARD_FILTERS;
  }
};

// The stored filters are read as a string: useSyncExternalStore compares
// snapshots by identity, and a freshly parsed object never compares equal.
const getFiltersSnapshot = (projectId: ProjectId): string => {
  if (typeof window === "undefined") {
    return SERIALIZED_DEFAULT_FILTERS;
  }

  try {
    return (
      window.localStorage.getItem(getStorageKey(projectId)) ??
      SERIALIZED_DEFAULT_FILTERS
    );
  } catch {
    return SERIALIZED_DEFAULT_FILTERS;
  }
};

const readStoredFilters = (projectId: ProjectId): BoardFilters =>
  parseFilters(getFiltersSnapshot(projectId));

const filtersListeners = new Set<() => void>();

const subscribeToFilters = (onStoreChange: () => void): (() => void) => {
  filtersListeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    filtersListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

const storeFilters = (projectId: ProjectId, filters: BoardFilters): void => {
  try {
    window.localStorage.setItem(
      getStorageKey(projectId),
      JSON.stringify(filters)
    );
  } catch {
    // Remembering the filters is a nicety, a full or blocked storage must not break the board
  }

  filtersListeners.forEach((listener) => listener());
};

const ProjectContext = createContext<ProjectStore | undefined>(undefined);

export const ProjectContextProvider = ({
  project,
  children,
}: ProjectContextProviderProps): JSX.Element => {
  const serializedFilters = useSyncExternalStore(
    subscribeToFilters,
    () => getFiltersSnapshot(project.id),
    () => SERIALIZED_DEFAULT_FILTERS
  );
  const filters = parseFilters(serializedFilters);

  const updateFilters = useCallback(
    (update: Partial<BoardFilters>) => {
      // Merged over what is stored rather than over the rendered filters, so a
      // filter changed before the board re-rendered is never dropped.
      storeFilters(project.id, {
        ...readStoredFilters(project.id),
        ...update,
      });
    },
    [project.id]
  );

  const setSearch = useCallback(
    (search: string) => updateFilters({ search }),
    [updateFilters]
  );

  const setAssignee = useCallback(
    (assignee: AssigneeFilter) => updateFilters({ assignee }),
    [updateFilters]
  );

  // An assignee remembered from a previous visit may no longer be on the
  // project, and filtering by them would hide every issue.
  const validAssignee = project.users.some(
    (user) => user.id === filters.assignee
  )
    ? filters.assignee
    : ALL_ASSIGNEES;

  return (
    <ProjectContext.Provider
      value={{
        project,
        search: filters.search,
        setSearch,
        assignee: validAssignee,
        setAssignee,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

interface ProjectContextProviderProps {
  project: Project;
  children: JSX.Element;
}

export const useProjectStore = (): ProjectStore => {
  const projectStore = useContext(ProjectContext);
  if (!projectStore) {
    throw new Error("Project context not found");
  }
  return projectStore;
};
