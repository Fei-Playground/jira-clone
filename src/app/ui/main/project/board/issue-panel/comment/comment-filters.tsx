import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { Comment } from "@domain/comment";
import { User, UserId } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export type CommentScope = "all" | "mine" | "edited";

export interface CommentFiltersValue {
  scope: CommentScope;
  search: string;
  authorId: UserId | null;
}

export const DEFAULT_COMMENT_FILTERS: CommentFiltersValue = {
  scope: "all",
  search: "",
  authorId: null,
};

const SCOPES: { id: CommentScope; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mine", label: "Mine" },
  { id: "edited", label: "Edited" },
];

export const CommentFilters = ({
  value,
  onChange,
  authors,
}: CommentFiltersProps): JSX.Element => {
  const setScope = (scope: CommentScope) => {
    onChange({ ...value, scope, authorId: null });
  };

  const setSearch = (search: string) => {
    onChange({ ...value, search });
  };

  const toggleAuthor = (authorId: UserId) => {
    onChange({
      ...value,
      scope: "all",
      authorId: value.authorId === authorId ? null : authorId,
    });
  };

  const clearSearch = () => setSearch("");

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap items-center gap-1"
          role="group"
          aria-label="Filter comments by type"
        >
          {SCOPES.map((scope) => {
            const isActive = value.scope === scope.id && !value.authorId;
            return (
              <button
                key={scope.id}
                type="button"
                onClick={() => setScope(scope.id)}
                aria-pressed={isActive}
                className={cx(
                  "rounded border-none px-2.5 py-1 text-xs duration-150",
                  isActive
                    ? "bg-background-selected font-primary-bold text-font-selected"
                    : "bg-transparent text-font-subtle hover:bg-background-neutral-hovered"
                )}
              >
                {scope.label}
              </button>
            );
          })}
        </div>
        <div className="relative min-w-[160px] max-w-[220px] flex-1">
          <input
            type="text"
            name="comment-filter"
            value={value.search}
            placeholder="Filter comments"
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Filter comments"
            className={cx(
              "box-border h-[32px] w-full rounded border-none bg-background-input py-1.5 pl-2 pr-8",
              "outline outline-2 outline-border-input duration-200 ease-in-out",
              "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
              "hover:bg-background-input-hovered focus:bg-background-input-pressed",
              "focus:shadow-blue focus:outline-border-brand"
            )}
          />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 px-2 text-icon">
            {value.search.length === 0 ? (
              <BiSearch size={14} aria-hidden />
            ) : (
              <button
                type="button"
                onMouseDown={clearSearch}
                className="flex cursor-pointer items-center justify-center rounded border-none hover:bg-background-neutral"
                aria-label="Clear comment filter"
              >
                <IoCloseOutline size={14} />
              </button>
            )}
          </span>
        </div>
      </div>
      {authors.length > 1 && (
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter comments by author"
        >
          <span className="mr-1 text-2xs text-font-subtlest">Authors</span>
          {authors.map((author) => {
            const isActive = value.authorId === author.id;
            return (
              <button
                key={author.id}
                type="button"
                onClick={() => toggleAuthor(author.id)}
                aria-pressed={isActive}
                aria-label={`Filter by ${author.name}`}
                className={cx(
                  "rounded-full border-2 p-0 duration-150",
                  isActive
                    ? "border-border-brand"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <UserAvatar {...author} size={28} tooltip />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const filterComments = (
  comments: Comment[],
  filters: CommentFiltersValue,
  currentUserId: UserId
): Comment[] => {
  const query = filters.search.trim().toLowerCase();

  return comments.filter((comment) => {
    if (filters.scope === "mine" && comment.user.id !== currentUserId) {
      return false;
    }

    if (filters.scope === "edited" && !isCommentEdited(comment)) {
      return false;
    }

    if (filters.authorId && comment.user.id !== filters.authorId) {
      return false;
    }

    if (query) {
      const inMessage = comment.message.toLowerCase().includes(query);
      const inAuthor = comment.user.name.toLowerCase().includes(query);
      if (!inMessage && !inAuthor) {
        return false;
      }
    }

    return true;
  });
};

export const getCommentAuthors = (comments: Comment[]): User[] => {
  const byId = new Map<UserId, User>();
  for (const comment of comments) {
    if (!byId.has(comment.user.id)) {
      byId.set(comment.user.id, comment.user);
    }
  }
  return Array.from(byId.values());
};

const isCommentEdited = (comment: Comment): boolean => {
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface CommentFiltersProps {
  value: CommentFiltersValue;
  onChange: (value: CommentFiltersValue) => void;
  authors: User[];
}
