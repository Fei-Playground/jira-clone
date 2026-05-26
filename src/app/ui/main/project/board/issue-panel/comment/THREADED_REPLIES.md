# Threaded Replies Implementation

## UI Changes

**Before:** Each comment showed the message, and Edit/Delete buttons (only for comment author).

**After:** Each comment now shows a 'Reply' button for all users. Clicking it opens an inline reply editor. Saved replies appear nested below the parent with an indent and left border. Supports up to 2 levels deep.

### Visual Details

- **Reply Button**: Positioned alongside Edit/Delete controls, visible to all users
- **Nested Replies**: Indented with `ml-8` margin-left and a left border (`border-l-2 border-border`)
- **Padding**: Replies have left padding (`pl-4`) to separate content from the border
- **Spacing**: Reply section has top margin (`mt-4`) for breathing room
- **Styling**: Replies follow the same visual hierarchy as top-level comments with UserAvatar and timestamp

## Updated Comment Data Structure

```json
{
  "id": "uuid",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "image": "avatar-url"
  },
  "message": "Top-level comment",
  "createdAt": 1234567890,
  "updatedAt": 1234567890,
  "replies": [
    {
      "id": "uuid-reply",
      "user": {
        "id": "user-id",
        "name": "User Name",
        "image": "avatar-url"
      },
      "message": "Reply to the comment",
      "createdAt": 1234567890,
      "updatedAt": 1234567890,
      "replies": [
        {
          "id": "uuid-reply-2",
          "user": {
            "id": "user-id",
            "name": "User Name",
            "image": "avatar-url"
          },
          "message": "Reply to the reply",
          "createdAt": 1234567890,
          "updatedAt": 1234567890
        }
      ]
    }
  ]
}
```

## Interaction Flow

1. **User sees a comment and clicks the 'Reply' button**
   - The button is visible to all users (not gated on ownership)
   - Located below the comment message, near Edit/Delete buttons
   - Only appears if nesting depth is less than 2 (supports up to 2 levels)

2. **An inline text editor appears below the comment**
   - Uses the same `EditBox` component as comment creation
   - TextArea with "Add your comment..." placeholder
   - Save and Cancel buttons appear once focused

3. **User types their reply and clicks 'Save'**
   - The reply is created with a temporary ID (`temp-{uuid}`)
   - Assigned to the current user
   - Timestamped with current time

4. **The reply is added to the comment's `replies` array and rendered nested below**
   - Nested reply appears with visual indentation and left border
   - Uses recursive `ViewComment` rendering with `depth` tracking
   - Parent comment state is updated via `onReplyAdded` callback

5. **User can reply to a reply (up to 2 levels deep)**
   - Replies at depth 0 (top-level) can have replies (depth 1)
   - Replies at depth 1 can have replies (depth 2)
   - Replies at depth 2 or more cannot have replies (Reply button hidden)

6. **Each reply maintains all comment features**
   - Only the original poster can Edit/Delete their own reply
   - Edit and Delete buttons only visible to the reply author
   - Timestamps and "EDITED" indicators work the same as top-level comments

## TypeScript Types

```typescript
// src/domain/comment/comment.ts
export type CommentId = string;

export interface Comment {
  id: CommentId;
  user: User;
  message: string;
  createdAt: number;
  updatedAt: number;
  replies?: Comment[]; // Recursive nesting, optional
}
```

## Component Props

```typescript
// src/app/ui/main/project/board/issue-panel/comment/view-comment.tsx

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
  onReplyAdded?: (comment: Comment) => void; // Called when reply is added
  depth?: number; // Current nesting depth (default: 0)
}
```

## Implementation Details

### ViewComment Component

- **State Management**:
  - `isEditing`: Controls edit mode for the comment itself
  - `isReplying`: Controls reply box visibility
  - `replies`: Local state for nested replies

- **Depth Tracking**:
  - `depth` prop passed down recursively
  - Starts at 0 for top-level comments
  - Incremented for each nesting level
  - Reply button hidden when `depth >= maxDepth` (maxDepth = 2)

- **Callback Propagation**:
  - `onReplyAdded`: Notifies parent when reply is added
  - `handleReplyRemoved`: Removes reply and updates parent
  - `handleNestedReplyAdded`: Updates nested reply and notifies parent

### IssuePanel Component

- Passes `onCommentReplyAdded` callback to `ViewComment`
- Updates comments state when replies are added at any level
- Ensures that changes to nested replies trigger full re-render

## Mock Data

Sample mock data in `src/domain/comment/comment.mock.ts` includes:
- `commentMock2` with two replies
- `commentMock2Reply2` has a nested reply, demonstrating 2-level nesting
- Other mocks remain flat to show variety

## Usage in Storybook

The `WithComments` story in `issue-panel.view.stories.tsx` automatically includes:
- Mock comments with nested replies
- Full visual representation of threaded comments
- All interaction features available for testing
