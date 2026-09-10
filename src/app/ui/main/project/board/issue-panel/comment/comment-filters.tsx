import React from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { Comment } from "@domain/comment";
import { User } from "@domain/user";
import * as Select from "@app/components/select";

export type CommentSortOrder = "newest" | "oldest";

export interface CommentFiltersValue {
  search: string;
  authorId: string | null;
  sortOrder: CommentSortOrder;
}

export const defaultCommentFilters: CommentFiltersValue = {
  search: "",
  authorId: null,
  sortOrder: "oldest",
};

export const applyCommentFilters = (
  comments: Comment[],
  filters: CommentFiltersValue
): Comment[] => {
  const search = filters.search.trim().toLowerCase();

  const filtered = comments.filter((comment) => {
    const matchesSearch =
      search.length === 0 || comment.message.toLowerCase().includes(search);
    const matchesAuthor =
      filters.authorId === null || comment.user.id === filters.authorId;
    return matchesSearch && matchesAuthor;
  });

  return [...filtered].sort((a, b) =>
    filters.sortOrder === "newest"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt
  );
};

export const getCommentAuthors = (comments: Comment[]): User[] => {
  const authorsById = new Map<string, User>();
  comments.forEach((comment) => {
    authorsById.set(comment.user.id, comment.user);
  });
  return Array.from(authorsById.values());
};

export const CommentFilters = ({
  authors,
  value,
  onChange,
}: CommentFiltersProps): JSX.Element => {
  const setSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...value, search: e.target.value });
  };

  const clearSearch = (): void => {
    onChange({ ...value, search: "" });
  };

  const setAuthor = (authorId: string): void => {
    onChange({
      ...value,
      authorId: authorId === ALL_AUTHORS ? null : authorId,
    });
  };

  const setSortOrder = (sortOrder: string): void => {
    onChange({ ...value, sortOrder: sortOrder as CommentSortOrder });
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <div className="relative w-fit">
        <input
          type="text"
          name="comment-search"
          value={value.search}
          placeholder="Filter comments"
          onChange={setSearch}
          className={cx(
            "h-[36px] w-[140px] rounded border-none bg-background-input py-2 hover:bg-background-input-hovered",
            "border-1 box-border pl-2 pr-8 outline outline-2 outline-border-input duration-200 ease-in-out",
            "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
            "placeholder:duration-200 placeholder:ease-in-out focus:w-[190px]",
            "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
          )}
        />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 px-2">
          {value.search.length === 0 ? (
            <span className="font-icon z-10 flex items-center justify-center border-none">
              <BiSearch size={16} />
            </span>
          ) : (
            <button
              type="button"
              onMouseDown={clearSearch}
              className="font-icon z-10 flex cursor-pointer items-center justify-center rounded border-none hover:bg-background-neutral"
              aria-label="Clear comment search"
            >
              <IoCloseOutline size={16} />
            </button>
          )}
        </span>
      </div>
      <Select.Root
        value={value.authorId ?? ALL_AUTHORS}
        onValueChange={setAuthor}
      >
        <Select.Trigger aria-label="Filter comments by author">
          <Select.Value placeholder="All authors" />
          <Select.TriggerIcon />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport>
            <Select.Item value={ALL_AUTHORS}>
              <Select.ItemIndicator />
              <Select.ItemText>All authors</Select.ItemText>
            </Select.Item>
            {authors.map((author) => (
              <Select.Item key={author.id} value={author.id}>
                <Select.ItemIndicator />
                <Select.ItemText>{author.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
      <Select.Root value={value.sortOrder} onValueChange={setSortOrder}>
        <Select.Trigger aria-label="Sort comments">
          <Select.Value />
          <Select.TriggerIcon />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport>
            <Select.Item value="oldest">
              <Select.ItemIndicator />
              <Select.ItemText>Oldest first</Select.ItemText>
            </Select.Item>
            <Select.Item value="newest">
              <Select.ItemIndicator />
              <Select.ItemText>Newest first</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

const ALL_AUTHORS = "all";

interface CommentFiltersProps {
  authors: User[];
  value: CommentFiltersValue;
  onChange: (value: CommentFiltersValue) => void;
}
