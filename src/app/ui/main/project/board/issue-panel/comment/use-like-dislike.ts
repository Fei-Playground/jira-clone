import { useState, useEffect } from "react";
import { CommentId } from "@domain/comment";

type ReactionState = "liked" | "disliked" | null;

interface UseCommentReactionResult {
  likeCount: number;
  dislikeCount: number;
  userReaction: ReactionState;
  toggleLike: () => void;
  toggleDislike: () => void;
}

// Persist user's reaction choice (like/dislike) to sessionStorage to survive page reloads
// Uses sessionStorage instead of localStorage so reactions are cleared when the session ends
const getStorageKey = (commentId: CommentId): string => `comment-reaction-${commentId}`;

const readReactionFromStorage = (commentId: CommentId): ReactionState => {
  try {
    const stored = sessionStorage.getItem(getStorageKey(commentId));
    return stored ? JSON.parse(stored) : null;
  } catch {
    // Fail silently if sessionStorage is unavailable (e.g., private browsing)
    return null;
  }
};

const writeReactionToStorage = (commentId: CommentId, reaction: ReactionState): void => {
  try {
    sessionStorage.setItem(getStorageKey(commentId), JSON.stringify(reaction));
  } catch {
    // Silently fail if sessionStorage is unavailable — reactions still work, just won't persist
  }
};

// Manages like/dislike reaction state for a comment, persisting user's choice to sessionStorage
// Supports mutually exclusive reactions: users can like OR dislike, but not both simultaneously
export const useLikeDislike = (
  commentId: CommentId,
  initialLikeCount = 0,
  initialDislikeCount = 0
): UseCommentReactionResult => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [userReaction, setUserReaction] = useState<ReactionState>(() =>
    readReactionFromStorage(commentId)
  );

  // Sync count state when parent prop values change (e.g., when server updates are received)
  useEffect(() => {
    setLikeCount(initialLikeCount);
    setDislikeCount(initialDislikeCount);
  }, [initialLikeCount, initialDislikeCount]);

  // Toggle like with three-state logic: null → liked → null, or disliked → liked
  const toggleLike = (): void => {
    if (userReaction === "liked") {
      // User is already liking: clicking again removes their like (toggle off)
      setLikeCount((prev) => prev - 1);
      setUserReaction(null);
      writeReactionToStorage(commentId, null);
    } else if (userReaction === "disliked") {
      // User was disliking: switch to like (mutually exclusive reactions)
      setDislikeCount((prev) => prev - 1);
      setLikeCount((prev) => prev + 1);
      setUserReaction("liked");
      writeReactionToStorage(commentId, "liked");
    } else {
      // User has no reaction: add a like
      setLikeCount((prev) => prev + 1);
      setUserReaction("liked");
      writeReactionToStorage(commentId, "liked");
    }
  };

  // Toggle dislike with three-state logic: null → disliked → null, or liked → disliked
  const toggleDislike = (): void => {
    if (userReaction === "disliked") {
      // User is already disliking: clicking again removes their dislike (toggle off)
      setDislikeCount((prev) => prev - 1);
      setUserReaction(null);
      writeReactionToStorage(commentId, null);
    } else if (userReaction === "liked") {
      // User was liking: switch to dislike (mutually exclusive reactions)
      setLikeCount((prev) => prev - 1);
      setDislikeCount((prev) => prev + 1);
      setUserReaction("disliked");
      writeReactionToStorage(commentId, "disliked");
    } else {
      // User has no reaction: add a dislike
      setDislikeCount((prev) => prev + 1);
      setUserReaction("disliked");
      writeReactionToStorage(commentId, "disliked");
    }
  };

  return {
    likeCount,
    dislikeCount,
    userReaction,
    toggleLike,
    toggleDislike,
  };
};
