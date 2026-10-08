import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import { Project } from "@domain/project";
import {
  ALL_ASSIGNEES,
  AssigneeFilter,
  BoardFilters,
  DEFAULT_BOARD_FILTERS,
  isValidAssigneeFilter,
  isValidPriorityFilter,
  PriorityFilter,
} from "@domain/filter";

interface ProjectStore {
  project: Project;
  search: string;
  setSearch: (search: string) => void;
  assignee: AssigneeFilter;
  setAssignee: (assignee: AssigneeFilter) => void;
  priority: PriorityFilter;
  setPriority: (priority: PriorityFilter) => void;
}

const SEARCH_PARAM = "search";
const ASSIGNEE_PARAM = "assignee";
const PRIORITY_PARAM = "priority";

// Typing into the search box would otherwise rewrite the URL on every keystroke,
// so the URL is only written once the typing pauses.
const TYPING_SYNC_DELAY = 250;

const parseFilters = (searchParams: URLSearchParams): BoardFilters => {
  const search = searchParams.get(SEARCH_PARAM);
  const assignee = searchParams.get(ASSIGNEE_PARAM);
  const priority = searchParams.get(PRIORITY_PARAM);

  return {
    search: search ?? DEFAULT_BOARD_FILTERS.search,
    assignee: isValidAssigneeFilter(assignee)
      ? assignee
      : DEFAULT_BOARD_FILTERS.assignee,
    priority: isValidPriorityFilter(priority)
      ? priority
      : DEFAULT_BOARD_FILTERS.priority,
  };
};

// A filter sitting at its default is dropped from the URL instead of written
// out, so a shared link only carries the filters that are actually applied.
const setParam = (
  searchParams: URLSearchParams,
  name: string,
  value: string,
  defaultValue: string
): void => {
  if (value === defaultValue) {
    searchParams.delete(name);
  } else {
    searchParams.set(name, value);
  }
};

const toSearchParams = (
  searchParams: URLSearchParams,
  filters: BoardFilters
): URLSearchParams => {
  const next = new URLSearchParams(searchParams);

  setParam(next, SEARCH_PARAM, filters.search, DEFAULT_BOARD_FILTERS.search);
  setParam(
    next,
    ASSIGNEE_PARAM,
    filters.assignee,
    DEFAULT_BOARD_FILTERS.assignee
  );
  setParam(
    next,
    PRIORITY_PARAM,
    filters.priority,
    DEFAULT_BOARD_FILTERS.priority
  );

  return next;
};

const ProjectContext = createContext<ProjectStore | undefined>(undefined);

export const ProjectContextProvider = ({
  project,
  children,
}: ProjectContextProviderProps): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from the URL once, so a shared link opens the board already filtered.
  // The filters are kept in state afterwards: an input bound straight to the URL
  // drops characters while the router catches up with the typing.
  const [filters, setFilters] = useState<BoardFilters>(() =>
    parseFilters(searchParams)
  );
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A pending URL write is dropped when the board goes away
  useEffect(() => {
    return () => {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
    };
  }, []);

  const syncToUrl = useCallback(
    (next: BoardFilters, delay: number): void => {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);

      const commit = (): void => {
        syncTimeout.current = null;
        // Replaced rather than pushed, so narrowing the board does not leave a
        // step per keystroke in the back button
        setSearchParams((prev) => toSearchParams(prev, next), {
          replace: true,
        });
      };

      if (delay === 0) {
        commit();
      } else {
        syncTimeout.current = setTimeout(commit, delay);
      }
    },
    [setSearchParams]
  );

  const updateFilters = useCallback(
    (update: Partial<BoardFilters>, delay: number): void => {
      const next = { ...filters, ...update };
      setFilters(next);
      syncToUrl(next, delay);
    },
    [filters, syncToUrl]
  );

  const setSearch = useCallback(
    (search: string) => updateFilters({ search }, TYPING_SYNC_DELAY),
    [updateFilters]
  );

  const setAssignee = useCallback(
    (assignee: AssigneeFilter) => updateFilters({ assignee }, 0),
    [updateFilters]
  );

  const setPriority = useCallback(
    (priority: PriorityFilter) => updateFilters({ priority }, 0),
    [updateFilters]
  );

  // A shared link may name an assignee who is not on this project, and
  // filtering by them would hide every issue.
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
        priority: filters.priority,
        setPriority,
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
