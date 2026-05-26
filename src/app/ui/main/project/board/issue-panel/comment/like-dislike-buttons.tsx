import cx from "classix";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiSolidDownvote, BiDownvote } from "react-icons/bi";
import { CommentId } from "@domain/comment";
import { useLikeDislike } from "./use-like-dislike";

// Like/Dislike reaction button pair for comments
// Displays filled icons when user has reacted, empty icons otherwise
// Supports mutually exclusive reactions (like or dislike, not both)
export const LikeDislikeButtons = ({
  commentId,
  initialLikeCount = 0,
  initialDislikeCount = 0,
  onCountsChange,
}: LikeDislikeButtonsProps): JSX.Element => {
  const { likeCount, dislikeCount, userReaction, toggleLike, toggleDislike } =
    useLikeDislike(commentId, initialLikeCount, initialDislikeCount);

  // Calculate the like count after toggle action
  const calculateNewLikeCount = (): number => {
    if (userReaction === "liked") return likeCount - 1; // Unlike
    if (userReaction === "disliked") return likeCount + 1; // Switch from dislike to like
    return likeCount + 1; // New like
  };

  // Calculate the dislike count after toggle action
  const calculateNewDislikeCount = (): number => {
    if (userReaction === "disliked") return dislikeCount - 1; // Un-dislike
    if (userReaction === "liked") return dislikeCount + 1; // Switch from like to dislike
    return dislikeCount + 1; // New dislike
  };

  const handleLike = (): void => {
    toggleLike();
    onCountsChange?.({
      like_count: calculateNewLikeCount(),
      dislike_count:
        userReaction === "disliked" ? dislikeCount - 1 : dislikeCount,
    });
  };

  const handleDislike = (): void => {
    toggleDislike();
    onCountsChange?.({
      like_count: userReaction === "liked" ? likeCount - 1 : likeCount,
      dislike_count: calculateNewDislikeCount(),
    });
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleLike}
        className={cx(
          "flex items-center gap-1 font-primary-light text-xs",
          userReaction === "liked"
            ? "text-font-brand"
            : "text-font-subtlest hover:underline"
        )}
        aria-label={`Like (${likeCount})`}
      >
        {userReaction === "liked" ? (
          <AiFillHeart className="text-sm" />
        ) : (
          <AiOutlineHeart className="text-sm" />
        )}
        {likeCount > 0 && <span>{likeCount}</span>}
      </button>

      <button
        onClick={handleDislike}
        className={cx(
          "flex items-center gap-1 font-primary-light text-xs",
          userReaction === "disliked"
            ? "text-font-danger"
            : "text-font-subtlest hover:underline"
        )}
        aria-label={`Dislike (${dislikeCount})`}
      >
        {userReaction === "disliked" ? (
          <BiSolidDownvote className="text-sm" />
        ) : (
          <BiDownvote className="text-sm" />
        )}
        {dislikeCount > 0 && <span>{dislikeCount}</span>}
      </button>
    </div>
  );
};

interface LikeDislikeButtonsProps {
  commentId: CommentId;
  initialLikeCount?: number;
  initialDislikeCount?: number;
  onCountsChange?: (counts: {
    like_count: number;
    dislike_count: number;
  }) => void;
}
