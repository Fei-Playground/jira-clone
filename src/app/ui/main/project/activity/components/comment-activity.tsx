import { useState } from "react";
import { BiComment } from "react-icons/bi";
import { CommentDetail } from "@domain/activity";
import { COMMENT_PREVIEW_LENGTH } from "../activity-timeline.const";
import { MetaRow, ViewDetailButton } from "./activity-parts";

export const CommentActivity = ({
  comment,
  onViewDetail,
}: CommentActivityProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isLong = comment.message.length > COMMENT_PREVIEW_LENGTH;
  const preview = isLong
    ? `${comment.message.slice(0, COMMENT_PREVIEW_LENGTH)}…`
    : comment.message;

  return (
    <div className="flex flex-col gap-2">
      <p className="font-primary-bold text-sm text-font">
        Commented on {comment.fileName}
      </p>

      <blockquote className="rounded border-l-[3px] border-l-border-brand bg-elevation-surface-sunken px-3 py-2 font-primary-light text-sm text-font-subtle">
        {isExpanded ? comment.message : preview}
        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="ml-1 cursor-pointer border-none bg-transparent text-xs text-font-brand hover:underline"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </blockquote>

      <MetaRow>
        <span className="font-primary-bold text-font-subtle">
          {comment.fileName}:{comment.line}
        </span>
        <span className="flex items-center gap-1">
          <BiComment size={13} />
          {comment.replies.length}{" "}
          {comment.replies.length === 1 ? "reply" : "replies"}
        </span>
      </MetaRow>

      <ViewDetailButton label="View Full Comment" onClick={onViewDetail} />
    </div>
  );
};

interface CommentActivityProps {
  comment: CommentDetail;
  onViewDetail: () => void;
}
