import { BiSearch } from "react-icons/bi";
import { BsListNested } from "react-icons/bs";
import { User } from "@domain/user";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";

export const GroupHeader = ({ label, count, user }: Props): JSX.Element => (
  <div className="sticky top-0 z-20 -mx-1 flex items-center gap-2 bg-elevation-surface px-1 py-2">
    {user && (
      <UserAvatar
        name={user.name}
        image={user.image}
        color={user.color}
        size={24}
      />
    )}
    <h3 className="font-primary-bold text-sm uppercase text-font-subtle">
      {label}
    </h3>
    <span className="rounded bg-background-neutral px-1.5 py-0.5 font-primary-bold text-2xs text-font-subtlest">
      {count}
    </span>
  </div>
);

interface Props {
  label: string;
  count: number;
  user?: User;
}

export const NoActivitiesState = (): JSX.Element => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <BsListNested size={56} className="text-icon-subtle" aria-hidden="true" />
    <p className="font-primary-bold text-lg text-font">No activity yet</p>
    <p className="font-primary-light text-sm text-font-subtlest">
      Activities will appear here as your team works on the project
    </p>
  </div>
);

export const NoResultsState = ({
  onClearFilters,
}: {
  onClearFilters: () => void;
}): JSX.Element => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <BiSearch size={56} className="text-icon-subtle" aria-hidden="true" />
    <p className="font-primary-bold text-lg text-font">
      No activities match your filters
    </p>
    <p className="font-primary-light text-sm text-font-subtlest">
      Try adjusting your filters or search terms
    </p>
    <Button
      color="primary"
      variant="subtlest"
      onClick={onClearFilters}
      className="mt-2"
      aria-label="Clear all activity filters"
    >
      Clear All Filters
    </Button>
  </div>
);
