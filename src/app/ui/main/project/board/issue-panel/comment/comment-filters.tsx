import { useState } from "react";

import cx from "classix";

import * as Select from "@app/components/select";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import { Comment } from "@domain/comment";
import { UserId } from "@domain/user";

export const CommentFilters = ({
  comments,
  onFilterChange,
}: Props): JSX.Element => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<UserId | "all">(
    "all"
  );

  const uniqueAuthors = Array.from(
    new Map(comments.map((c) => [c.user.id, c.user])).values()
  );

  const hasActiveFilters = searchText !== "" || selectedAuthorId !== "all";

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onFilterChange(text, selectedAuthorId);
  };

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthorId(authorId as UserId | "all");
    onFilterChange(searchText, authorId as UserId | "all");
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedAuthorId("all");
    onFilterChange("", "all");
  };

  // Count visible comments based on current filters
  const visibleCount = comments.filter((comment) => {
    const matchesSearch = comment.message
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesAuthor =
      selectedAuthorId === "all" || comment.user.id === selectedAuthorId;
    return matchesSearch && matchesAuthor;
  }).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search comments..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={cx(
            "rounded border border-border-subtle px-3 py-2",
            "bg-background-neutral text-font placeholder:text-font-subtle",
            "font-primary text-sm",
            "focus:outline-none focus:border-border-brand focus:ring-1 focus:ring-border-brand"
          )}
        />

        {/* Author filter dropdown */}
        {uniqueAuthors.length > 0 && (
          <Select.Root
            name="comment-author-filter"
            defaultValue="all"
            value={selectedAuthorId}
            onValueChange={handleAuthorChange}
          >
            <Select.Trigger aria-label="Filter comments by author">
              <Select.Value placeholder="All authors" />
              <Select.TriggerIcon />
            </Select.Trigger>
            <Select.Content>
              <Select.ScrollUpButton />
              <Select.Viewport>
                <Select.Item value="all">
                  <Select.ItemIndicator />
                  <Select.ItemText>All authors</Select.ItemText>
                </Select.Item>
                <Select.Separator />
                {uniqueAuthors.map((author) => (
                  <Select.Item key={author.id} value={author.id}>
                    <Select.ItemIndicator />
                    <UserAvatar {...author} size={24} />
                    <Select.ItemText>{author.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton />
            </Select.Content>
          </Select.Root>
        )}
      </div>

      {/* Results count and clear button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-font-subtlest">
          {visibleCount} of {comments.length} comments
        </p>
        {hasActiveFilters && (
          <Button
            variant="text"
            color="neutral"
            size="md"
            onClick={handleClearFilters}
            className="p-1 text-sm"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

interface Props {
  comments: Comment[];
  onFilterChange: (searchText: string, authorId: UserId | "all") => void;
}
