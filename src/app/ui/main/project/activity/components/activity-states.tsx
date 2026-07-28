import { BiSearch } from "react-icons/bi";
import { BsListNested } from "react-icons/bs";
import { Button } from "@app/components/button";

export const ActivitySkeleton = ({
  count = 3,
}: ActivitySkeletonProps): JSX.Element => (
  <ul aria-hidden className="flex flex-col">
    {Array.from({ length: count }).map((_, index) => (
      <li key={index} className="relative flex gap-4">
        <div className="relative flex w-6 flex-shrink-0 justify-center">
          <span className="absolute top-0 h-full w-[2px] bg-border" />
          <span className="relative mt-4 h-3.5 w-3.5 animate-pulse rounded-full bg-background-neutral-hovered" />
        </div>
        <div className="mb-3 flex-grow rounded bg-elevation-surface-raised p-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="h-[40px] w-[40px] animate-pulse rounded-full bg-background-neutral-hovered" />
            <span className="h-3 w-[140px] animate-pulse rounded bg-background-neutral-hovered" />
            <span className="h-3 w-[70px] animate-pulse rounded bg-background-neutral" />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <span className="block h-3 w-3/5 animate-pulse rounded bg-background-neutral-hovered" />
            <span className="block h-3 w-2/5 animate-pulse rounded bg-background-neutral" />
          </div>
        </div>
      </li>
    ))}
  </ul>
);

interface ActivitySkeletonProps {
  count?: number;
}

export const NoActivities = (): JSX.Element => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <span className="text-icon-subtle">
      <BsListNested size={56} />
    </span>
    <p className="font-primary-bold text-lg text-font">No activity yet</p>
    <p className="font-primary-light text-sm text-font-subtlest">
      Activities will appear here as your team works on the project
    </p>
  </div>
);

export const NoResults = ({ onClearFilters }: NoResultsProps): JSX.Element => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <span className="text-icon-subtle">
      <BiSearch size={52} />
    </span>
    <p className="font-primary-bold text-lg text-font">
      No activities match your filters
    </p>
    <p className="font-primary-light text-sm text-font-subtlest">
      Try adjusting your filters or search terms
    </p>
    <div className="mt-3">
      <Button color="primary" variant="subtlest" onClick={onClearFilters}>
        Clear All Filters
      </Button>
    </div>
  </div>
);

interface NoResultsProps {
  onClearFilters: () => void;
}
