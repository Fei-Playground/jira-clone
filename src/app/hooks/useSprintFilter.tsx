import { useSearchParams } from "react-router";

export const useSprintFilter = (): string | null => {
  const [searchParams] = useSearchParams();
  const sprintFilter = searchParams.get("sprint");

  return sprintFilter;
};
