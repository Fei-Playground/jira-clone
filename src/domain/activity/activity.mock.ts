import { Activity } from "./activity";
import { usersMock } from "@domain/user";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Mock activities are generated relative to a fixed reference so the mock is
 * deterministic within a session while still reading as "2 hours ago".
 */
const now = new Date("2024-01-18T15:30:00").valueOf();

const hoursAgo = (hours: number): number => now - hours * HOUR;
const daysAgo = (days: number, hour = 0): number => now - days * DAY - hour * HOUR;

const [
  danielSerrano,
  woody,
  buzzLightyear,
  jessie,
  emperorZurg,
  mrPotato,
  msPotato,
  littleGreenMen,
  tRex,
  andyDavis,
] = usersMock;

export const activityUsersMock = usersMock;

export const activitiesMock: Activity[] = [
  {
    id: "act-1",
    user: woody,
    createdAt: hoursAgo(2),
    description: "Fixed authentication bug in login component",
    detail: {
      type: "commit",
      commit: {
        message: "Fixed authentication bug in login component",
        hash: "a1b2c3d",
        branch: "feature/auth-fix",
        filesChanged: 5,
        additions: 125,
        deletions: 43,
        files: [
          { path: "src/app/ui/login/login.view.tsx", additions: 48, deletions: 12 },
          { path: "src/app/session-storage/user-storage.server.ts", additions: 31, deletions: 9 },
          { path: "src/domain/user/user.ts", additions: 18, deletions: 4 },
          { path: "src/app/routes/login.tsx", additions: 22, deletions: 14 },
          { path: "src/app/routes/login.spec.ts", additions: 6, deletions: 4 },
        ],
        diff: `--- a/src/app/ui/login/login.view.tsx
+++ b/src/app/ui/login/login.view.tsx
@@ -42,9 +42,13 @@ export const LoginView = () => {
-  const session = getSession(request);
-  if (!session) return null;
+  const session = await getSession(request);
+  if (!session?.userId) {
+    return redirect("/login");
+  }
+
+  return session;`,
      },
    },
  },
  {
    id: "act-2",
    user: jessie,
    createdAt: hoursAgo(3),
    description: "Commented on Login.tsx",
    detail: {
      type: "comment",
      comment: {
        fileName: "Login.tsx",
        line: 45,
        message:
          "I think we should extract this validation into a shared helper — we already do almost exactly the same thing in the signup flow, and keeping two copies means the error copy will drift apart the first time somebody tweaks one of them.",
        replies: [
          {
            user: woody,
            message: "Agreed. I'll pull it into useCredentialsValidation in the next commit.",
            createdAt: hoursAgo(2.5),
          },
          {
            user: buzzLightyear,
            message: "Nice — please add a test for the empty-password case while you're in there.",
            createdAt: hoursAgo(2.2),
          },
        ],
      },
    },
  },
  {
    id: "act-3",
    user: buzzLightyear,
    createdAt: hoursAgo(5),
    description: "Completed Update authentication documentation",
    detail: {
      type: "task",
      task: {
        action: "completed",
        title: "Update authentication documentation",
        taskId: "TASK-123",
        status: "completed",
        priority: "medium",
        asignee: buzzLightyear,
        dueDate: hoursAgo(5),
        description:
          "Document the new session cookie flow, including the refresh behaviour and the error states the login form can surface.",
      },
    },
  },
  {
    id: "act-4",
    user: msPotato,
    createdAt: daysAgo(1, 2),
    description: "Feature Flag: dark-mode changed from Disabled to Enabled",
    detail: {
      type: "settings",
      settings: {
        settingName: "Feature Flag: dark-mode",
        before: "Disabled",
        after: "Enabled",
        scope: "Shared-UI",
      },
    },
  },
  {
    id: "act-5",
    user: tRex,
    createdAt: daysAgo(1, 5),
    description: "T-Rex joined the project",
    detail: {
      type: "user",
      userEvent: { action: "joined the project" },
    },
  },
  {
    id: "act-6",
    user: jessie,
    createdAt: daysAgo(2, 1),
    description: "Created Dashboard.tsx",
    detail: {
      type: "file",
      file: {
        operation: "created",
        path: "src/pages/Dashboard/",
        fileName: "Dashboard.tsx",
        size: "2.5 KB",
      },
    },
  },
  {
    id: "act-7",
    user: woody,
    createdAt: daysAgo(2, 3),
    description: "Implement dark mode toggle component",
    detail: {
      type: "commit",
      commit: {
        message: "Implement dark mode toggle component",
        hash: "d4e5f6g",
        branch: "feature/dark-mode",
        filesChanged: 8,
        additions: 234,
        deletions: 12,
        files: [
          { path: "src/app/ui/main/header/select-theme.tsx", additions: 96, deletions: 4 },
          { path: "src/app/store/theme.store.tsx", additions: 42, deletions: 3 },
          { path: "src/app/styles/app.css", additions: 58, deletions: 0 },
          { path: "tailwind.config.js", additions: 12, deletions: 1 },
          { path: "src/app/routes/action/set-theme.tsx", additions: 14, deletions: 2 },
          { path: "src/app/components/icons.tsx", additions: 6, deletions: 0 },
          { path: "src/app/root.tsx", additions: 4, deletions: 2 },
          { path: "src/app/ui/main/header/header.tsx", additions: 2, deletions: 0 },
        ],
        diff: `--- a/src/app/store/theme.store.tsx
+++ b/src/app/store/theme.store.tsx
@@ -18,6 +18,10 @@ export const ThemeProvider = ({ children }) => {
-  const [theme, setTheme] = useState(Theme.LIGHT);
+  const [theme, setTheme] = useState(specifiedTheme ?? Theme.LIGHT);
+
+  useEffect(() => {
+    document.documentElement.className = theme;
+  }, [theme]);`,
      },
    },
  },
  {
    id: "act-8",
    user: buzzLightyear,
    createdAt: daysAgo(3, 1),
    description: "Created branch feature/new-dashboard",
    detail: {
      type: "branch",
      branch: {
        action: "Created branch",
        branch: "feature/new-dashboard",
        baseBranch: "main",
      },
    },
  },
  {
    id: "act-9",
    user: msPotato,
    createdAt: daysAgo(4, 2),
    description: "Merged PR #284 Add user authentication",
    detail: {
      type: "pr",
      pullRequest: {
        action: "Merged PR",
        number: 284,
        title: "Add user authentication",
        status: "merged",
        reviewers: [woody, jessie],
        branch: "feature/auth",
      },
    },
  },
  {
    id: "act-10",
    user: tRex,
    createdAt: daysAgo(5, 1),
    description: "Created Fix navigation bug on mobile",
    detail: {
      type: "task",
      task: {
        action: "created",
        title: "Fix navigation bug on mobile",
        taskId: "TASK-124",
        status: "created",
        priority: "high",
        asignee: woody,
        dueDate: new Date("2024-01-20T17:00:00").valueOf(),
        description:
          "The sidebar overlays the board on viewports under 480px and cannot be dismissed. Reproduce on iOS Safari.",
      },
    },
  },
  {
    id: "act-11",
    user: woody,
    createdAt: hoursAgo(4),
    description: "Add password strength meter to signup",
    detail: {
      type: "commit",
      commit: {
        message: "Add password strength meter to signup",
        hash: "b7c8d9e",
        branch: "feature/auth-fix",
        filesChanged: 3,
        additions: 78,
        deletions: 5,
        files: [
          { path: "src/app/ui/login/password-strength.tsx", additions: 62, deletions: 0 },
          { path: "src/app/ui/login/login.view.tsx", additions: 12, deletions: 3 },
          { path: "src/app/styles/app.css", additions: 4, deletions: 2 },
        ],
      },
    },
  },
  {
    id: "act-12",
    user: woody,
    createdAt: hoursAgo(6),
    description: "Handle expired session redirect",
    detail: {
      type: "commit",
      commit: {
        message: "Handle expired session redirect",
        hash: "c3d4e5f",
        branch: "feature/auth-fix",
        filesChanged: 2,
        additions: 34,
        deletions: 18,
        files: [
          { path: "src/app/session-storage/shared.ts", additions: 22, deletions: 11 },
          { path: "src/app/routes/__main.tsx", additions: 12, deletions: 7 },
        ],
      },
    },
  },
  {
    id: "act-13",
    user: woody,
    createdAt: hoursAgo(7),
    description: "Remove unused auth helper",
    detail: {
      type: "commit",
      commit: {
        message: "Remove unused auth helper",
        hash: "e5f6a7b",
        branch: "feature/auth-fix",
        filesChanged: 1,
        additions: 0,
        deletions: 46,
        files: [{ path: "src/utils/legacy-auth.ts", additions: 0, deletions: 46 }],
      },
    },
  },
  {
    id: "act-14",
    user: woody,
    createdAt: hoursAgo(8),
    description: "Rename login form fields for clarity",
    detail: {
      type: "commit",
      commit: {
        message: "Rename login form fields for clarity",
        hash: "f6a7b8c",
        branch: "feature/auth-fix",
        filesChanged: 4,
        additions: 41,
        deletions: 39,
        files: [
          { path: "src/app/ui/login/login.view.tsx", additions: 20, deletions: 20 },
          { path: "src/app/routes/login.tsx", additions: 12, deletions: 11 },
          { path: "src/app/routes/login.spec.ts", additions: 6, deletions: 5 },
          { path: "src/domain/user/user.ts", additions: 3, deletions: 3 },
        ],
      },
    },
  },
  {
    id: "act-15",
    user: jessie,
    createdAt: hoursAgo(3.5),
    description: "Commented on Login.tsx",
    detail: {
      type: "comment",
      comment: {
        fileName: "Login.tsx",
        line: 88,
        message:
          "This error message is user-facing but reads like a stack trace. Can we soften it to something a person would understand?",
        replies: [
          {
            user: woody,
            message:
              "Good catch, rewording to 'We couldn't sign you in. Check your details and try again.'",
            createdAt: hoursAgo(3.1),
          },
        ],
      },
    },
  },
  {
    id: "act-16",
    user: emperorZurg,
    createdAt: hoursAgo(9),
    description: "Commented on Login.tsx",
    detail: {
      type: "comment",
      comment: {
        fileName: "Login.tsx",
        line: 12,
        message: "Do we still need this import? It looks orphaned after the refactor.",
        replies: [],
      },
    },
  },
  {
    id: "act-17",
    user: mrPotato,
    createdAt: hoursAgo(10),
    description: "Commented on board.view.tsx",
    detail: {
      type: "comment",
      comment: {
        fileName: "board.view.tsx",
        line: 57,
        message:
          "The drag preview flickers when the column re-renders. I suspect the memo boundary is too low — happy to pair on it.",
        replies: [
          {
            user: buzzLightyear,
            message: "Let's move the memo up to CategoryColumn and measure again.",
            createdAt: hoursAgo(9.5),
          },
        ],
      },
    },
  },
  {
    id: "act-18",
    user: buzzLightyear,
    createdAt: hoursAgo(11),
    description: "Updated Improve board drag performance",
    detail: {
      type: "task",
      task: {
        action: "updated",
        title: "Improve board drag performance",
        taskId: "TASK-118",
        status: "in-progress",
        priority: "high",
        asignee: buzzLightyear,
        dueDate: new Date("2024-01-22T17:00:00").valueOf(),
        description: "Reduce re-renders while dragging issue cards between categories.",
      },
    },
  },
  {
    id: "act-19",
    user: andyDavis,
    createdAt: hoursAgo(12),
    description: "Created Add empty state to projects list",
    detail: {
      type: "task",
      task: {
        action: "created",
        title: "Add empty state to projects list",
        taskId: "TASK-131",
        status: "created",
        priority: "low",
        asignee: jessie,
        dueDate: new Date("2024-01-26T17:00:00").valueOf(),
      },
    },
  },
  {
    id: "act-20",
    user: littleGreenMen,
    createdAt: daysAgo(1, 1),
    description: "Deleted legacy-auth.ts",
    detail: {
      type: "file",
      file: {
        operation: "deleted",
        path: "src/utils/",
        fileName: "legacy-auth.ts",
      },
    },
  },
  {
    id: "act-21",
    user: jessie,
    createdAt: daysAgo(1, 3),
    description: "Renamed Panel.tsx to IssuePanel.tsx",
    detail: {
      type: "file",
      file: {
        operation: "renamed",
        path: "src/app/ui/main/project/board/issue-panel/",
        fileName: "IssuePanel.tsx",
        previousName: "Panel.tsx",
      },
    },
  },
  {
    id: "act-22",
    user: emperorZurg,
    createdAt: daysAgo(1, 6),
    description: "Notification digest changed from Daily to Weekly",
    detail: {
      type: "settings",
      settings: {
        settingName: "Notification digest",
        before: "Daily",
        after: "Weekly",
        scope: "Project members",
      },
    },
  },
  {
    id: "act-23",
    user: msPotato,
    createdAt: daysAgo(1, 8),
    description: "Default issue priority changed from Low to Medium",
    detail: {
      type: "settings",
      settings: {
        settingName: "Default issue priority",
        before: "Low",
        after: "Medium",
        scope: "JIRA Clone board",
      },
    },
  },
  {
    id: "act-24",
    user: andyDavis,
    createdAt: daysAgo(2, 4),
    description: "Andy Davis was assigned as reviewer",
    detail: {
      type: "user",
      userEvent: { action: "assigned as reviewer", targetUser: andyDavis },
    },
  },
  {
    id: "act-25",
    user: littleGreenMen,
    createdAt: daysAgo(2, 6),
    description: "Little Green Men joined the project",
    detail: {
      type: "user",
      userEvent: { action: "joined the project" },
    },
  },
  {
    id: "act-26",
    user: buzzLightyear,
    createdAt: daysAgo(2, 8),
    description: "Opened PR #291 Board drag performance",
    detail: {
      type: "pr",
      pullRequest: {
        action: "Opened PR",
        number: 291,
        title: "Board drag performance",
        status: "open",
        reviewers: [woody, mrPotato],
        branch: "perf/board-drag",
      },
    },
  },
  {
    id: "act-27",
    user: jessie,
    createdAt: daysAgo(3, 3),
    description: "Add skeleton loaders to project cards",
    detail: {
      type: "commit",
      commit: {
        message: "Add skeleton loaders to project cards",
        hash: "1a2b3c4",
        branch: "feature/new-dashboard",
        filesChanged: 3,
        additions: 88,
        deletions: 6,
        files: [
          {
            path: "src/app/ui/main/projects/project-card/skeleton.tsx",
            additions: 64,
            deletions: 0,
          },
          { path: "src/app/ui/main/projects/projects.view.tsx", additions: 18, deletions: 4 },
          { path: "src/app/ui/main/projects/index.ts", additions: 6, deletions: 2 },
        ],
      },
    },
  },
  {
    id: "act-28",
    user: jessie,
    createdAt: daysAgo(3, 5),
    description: "Extract project card into its own folder",
    detail: {
      type: "commit",
      commit: {
        message: "Extract project card into its own folder",
        hash: "2b3c4d5",
        branch: "feature/new-dashboard",
        filesChanged: 6,
        additions: 142,
        deletions: 118,
        files: [
          {
            path: "src/app/ui/main/projects/project-card/project-card.tsx",
            additions: 92,
            deletions: 0,
          },
          { path: "src/app/ui/main/projects/project-card/index.ts", additions: 2, deletions: 0 },
          { path: "src/app/ui/main/projects/projects.view.tsx", additions: 18, deletions: 96 },
          { path: "src/app/ui/main/projects/index.ts", additions: 4, deletions: 2 },
          {
            path: "src/app/ui/main/projects/project-card/project-card.stories.tsx",
            additions: 22,
            deletions: 0,
          },
          { path: "src/app/ui/main/index.ts", additions: 4, deletions: 20 },
        ],
      },
    },
  },
  {
    id: "act-29",
    user: buzzLightyear,
    createdAt: daysAgo(3, 7),
    description: "Completed Add keyboard shortcut hints",
    detail: {
      type: "task",
      task: {
        action: "completed",
        title: "Add keyboard shortcut hints",
        taskId: "TASK-109",
        status: "completed",
        priority: "low",
        asignee: buzzLightyear,
        dueDate: daysAgo(3, 7),
      },
    },
  },
  {
    id: "act-30",
    user: buzzLightyear,
    createdAt: daysAgo(3, 8),
    description: "Completed Document the SSE event names",
    detail: {
      type: "task",
      task: {
        action: "completed",
        title: "Document the SSE event names",
        taskId: "TASK-110",
        status: "completed",
        priority: "medium",
        asignee: buzzLightyear,
        dueDate: daysAgo(3, 8),
      },
    },
  },
  {
    id: "act-31",
    user: buzzLightyear,
    createdAt: daysAgo(3, 9),
    description: "Completed Fix avatar fallback contrast",
    detail: {
      type: "task",
      task: {
        action: "completed",
        title: "Fix avatar fallback contrast",
        taskId: "TASK-111",
        status: "completed",
        priority: "medium",
        asignee: buzzLightyear,
        dueDate: daysAgo(3, 9),
      },
    },
  },
  {
    id: "act-32",
    user: buzzLightyear,
    createdAt: daysAgo(3, 10),
    description: "Completed Tidy up the toast copy",
    detail: {
      type: "task",
      task: {
        action: "completed",
        title: "Tidy up the toast copy",
        taskId: "TASK-112",
        status: "completed",
        priority: "low",
        asignee: buzzLightyear,
        dueDate: daysAgo(3, 10),
      },
    },
  },
  {
    id: "act-33",
    user: mrPotato,
    createdAt: daysAgo(4, 4),
    description: "Commented on Dashboard.tsx",
    detail: {
      type: "comment",
      comment: {
        fileName: "Dashboard.tsx",
        line: 21,
        message:
          "Can we use the shared Card primitive here instead of a bespoke wrapper? It already handles the raised surface and the hover state we want.",
        replies: [
          {
            user: jessie,
            message: "Yes — swapping it in now.",
            createdAt: daysAgo(4, 3),
          },
        ],
      },
    },
  },
  {
    id: "act-34",
    user: emperorZurg,
    createdAt: daysAgo(4, 6),
    description: "Created api-client.ts",
    detail: {
      type: "file",
      file: {
        operation: "created",
        path: "src/infrastructure/http/",
        fileName: "api-client.ts",
        size: "4.1 KB",
      },
    },
  },
  {
    id: "act-35",
    user: tRex,
    createdAt: daysAgo(5, 3),
    description: "Created branch fix/mobile-nav",
    detail: {
      type: "branch",
      branch: {
        action: "Created branch",
        branch: "fix/mobile-nav",
        baseBranch: "main",
      },
    },
  },
  {
    id: "act-36",
    user: tRex,
    createdAt: daysAgo(5, 5),
    description: "Clamp sidebar width on small viewports",
    detail: {
      type: "commit",
      commit: {
        message: "Clamp sidebar width on small viewports",
        hash: "3c4d5e6",
        branch: "fix/mobile-nav",
        filesChanged: 2,
        additions: 36,
        deletions: 14,
        files: [
          { path: "src/app/ui/main/project/sidebar/sidebar.tsx", additions: 28, deletions: 11 },
          { path: "src/app/styles/app.css", additions: 8, deletions: 3 },
        ],
      },
    },
  },
  {
    id: "act-37",
    user: msPotato,
    createdAt: daysAgo(6, 2),
    description: "Theme default changed from Light to System",
    detail: {
      type: "settings",
      settings: {
        settingName: "Theme default",
        before: "Light",
        after: "System",
        scope: "Workspace",
      },
    },
  },
  {
    id: "act-38",
    user: woody,
    createdAt: daysAgo(6, 5),
    description: "Merged PR #279 Login form validation",
    detail: {
      type: "pr",
      pullRequest: {
        action: "Merged PR",
        number: 279,
        title: "Login form validation",
        status: "merged",
        reviewers: [jessie, msPotato],
        branch: "feature/login-validation",
      },
    },
  },
  {
    id: "act-39",
    user: jessie,
    createdAt: daysAgo(7, 3),
    description: "Add hover elevation to issue cards",
    detail: {
      type: "commit",
      commit: {
        message: "Add hover elevation to issue cards",
        hash: "4d5e6f7",
        branch: "feature/new-dashboard",
        filesChanged: 1,
        additions: 14,
        deletions: 6,
        files: [
          {
            path: "src/app/ui/main/project/board/category-column/issue-card/issue-card.tsx",
            additions: 14,
            deletions: 6,
          },
        ],
      },
    },
  },
  {
    id: "act-40",
    user: andyDavis,
    createdAt: daysAgo(7, 6),
    description: "Created Audit colour contrast across themes",
    detail: {
      type: "task",
      task: {
        action: "created",
        title: "Audit colour contrast across themes",
        taskId: "TASK-098",
        status: "created",
        priority: "high",
        asignee: andyDavis,
        dueDate: new Date("2024-01-24T17:00:00").valueOf(),
      },
    },
  },
  {
    id: "act-41",
    user: littleGreenMen,
    createdAt: daysAgo(8, 2),
    description: "Commented on sidebar.tsx",
    detail: {
      type: "comment",
      comment: {
        fileName: "sidebar.tsx",
        line: 64,
        message: "The collapse button loses its focus ring in the dark theme.",
        replies: [],
      },
    },
  },
  {
    id: "act-42",
    user: mrPotato,
    createdAt: daysAgo(8, 5),
    description: "Deleted old-board.tsx",
    detail: {
      type: "file",
      file: {
        operation: "deleted",
        path: "src/app/ui/main/project/board/",
        fileName: "old-board.tsx",
      },
    },
  },
  {
    id: "act-43",
    user: emperorZurg,
    createdAt: daysAgo(9, 3),
    description: "Wire SSE reconnect backoff",
    detail: {
      type: "commit",
      commit: {
        message: "Wire SSE reconnect backoff",
        hash: "5e6f7a8",
        branch: "main",
        filesChanged: 3,
        additions: 96,
        deletions: 22,
        files: [
          { path: "src/app/events/emitter.server.ts", additions: 44, deletions: 8 },
          { path: "src/app/events/events.ts", additions: 12, deletions: 2 },
          { path: "src/app/ui/main/project/board/board.view.tsx", additions: 40, deletions: 12 },
        ],
      },
    },
  },
  {
    id: "act-44",
    user: woody,
    createdAt: daysAgo(10, 4),
    description: "Created branch feature/activity-timeline",
    detail: {
      type: "branch",
      branch: {
        action: "Created branch",
        branch: "feature/activity-timeline",
        baseBranch: "main",
      },
    },
  },
  {
    id: "act-45",
    user: msPotato,
    createdAt: daysAgo(11, 2),
    description: "Feature Flag: activity-feed changed from Disabled to Enabled",
    detail: {
      type: "settings",
      settings: {
        settingName: "Feature Flag: activity-feed",
        before: "Disabled",
        after: "Enabled",
        scope: "Shared-UI",
      },
    },
  },
  {
    id: "act-46",
    user: jessie,
    createdAt: daysAgo(12, 6),
    description: "Created ActivityItem.tsx",
    detail: {
      type: "file",
      file: {
        operation: "created",
        path: "src/app/ui/main/project/activity/components/",
        fileName: "ActivityItem.tsx",
        size: "6.8 KB",
      },
    },
  },
  {
    id: "act-47",
    user: buzzLightyear,
    createdAt: daysAgo(13, 5),
    description: "Updated Reduce bundle size of the board route",
    detail: {
      type: "task",
      task: {
        action: "updated",
        title: "Reduce bundle size of the board route",
        taskId: "TASK-087",
        status: "in-progress",
        priority: "medium",
        asignee: emperorZurg,
        dueDate: new Date("2024-01-19T17:00:00").valueOf(),
      },
    },
  },
  {
    id: "act-48",
    user: andyDavis,
    createdAt: daysAgo(14, 3),
    description: "Merged PR #263 Theme switcher",
    detail: {
      type: "pr",
      pullRequest: {
        action: "Merged PR",
        number: 263,
        title: "Theme switcher",
        status: "merged",
        reviewers: [woody, buzzLightyear, jessie],
        branch: "feature/theme-switcher",
      },
    },
  },
  {
    id: "act-49",
    user: mrPotato,
    createdAt: daysAgo(15, 4),
    description: "Mr Potato joined the project",
    detail: {
      type: "user",
      userEvent: { action: "joined the project" },
    },
  },
  {
    id: "act-50",
    user: emperorZurg,
    createdAt: daysAgo(16, 2),
    description: "Split db access per entity",
    detail: {
      type: "commit",
      commit: {
        message: "Split db access per entity",
        hash: "6f7a8b9",
        branch: "main",
        filesChanged: 7,
        additions: 312,
        deletions: 268,
        files: [
          { path: "src/infrastructure/db/project.ts", additions: 96, deletions: 74 },
          { path: "src/infrastructure/db/issue.ts", additions: 88, deletions: 66 },
          { path: "src/infrastructure/db/user.ts", additions: 42, deletions: 38 },
          { path: "src/infrastructure/db/comment.ts", additions: 38, deletions: 30 },
          { path: "src/infrastructure/db/db.server.ts", additions: 22, deletions: 44 },
          { path: "src/infrastructure/db/seed.ts", additions: 18, deletions: 12 },
          { path: "src/infrastructure/db/index.ts", additions: 8, deletions: 4 },
        ],
      },
    },
  },
  {
    id: "act-51",
    user: jessie,
    createdAt: daysAgo(18, 3),
    description: "Commented on project-card.tsx",
    detail: {
      type: "comment",
      comment: {
        fileName: "project-card.tsx",
        line: 33,
        message: "Long project names overflow the card — we need a line clamp here.",
        replies: [
          {
            user: andyDavis,
            message: "line-clamp-2 matches the sidebar treatment, let's use that.",
            createdAt: daysAgo(18, 2),
          },
        ],
      },
    },
  },
  {
    id: "act-52",
    user: littleGreenMen,
    createdAt: daysAgo(20, 5),
    description: "Renamed styles.css to app.css",
    detail: {
      type: "file",
      file: {
        operation: "renamed",
        path: "src/app/styles/",
        fileName: "app.css",
        previousName: "styles.css",
      },
    },
  },
  {
    id: "act-53",
    user: woody,
    createdAt: daysAgo(22, 4),
    description: "Seed the database with Toy Story users",
    detail: {
      type: "commit",
      commit: {
        message: "Seed the database with Toy Story users",
        hash: "7a8b9c0",
        branch: "main",
        filesChanged: 2,
        additions: 148,
        deletions: 8,
        files: [
          { path: "src/infrastructure/db/seed.ts", additions: 122, deletions: 6 },
          { path: "src/domain/user/user.mock.ts", additions: 26, deletions: 2 },
        ],
      },
    },
  },
  {
    id: "act-54",
    user: msPotato,
    createdAt: daysAgo(25, 3),
    description: "Board columns changed from 3 to 4",
    detail: {
      type: "settings",
      settings: {
        settingName: "Board columns",
        before: "3",
        after: "4",
        scope: "JIRA Clone board",
      },
    },
  },
  {
    id: "act-55",
    user: danielSerrano,
    createdAt: daysAgo(27, 6),
    description: "Opened PR #201 Initial project scaffold",
    detail: {
      type: "pr",
      pullRequest: {
        action: "Opened PR",
        number: 201,
        title: "Initial project scaffold",
        status: "closed",
        reviewers: [woody],
        branch: "chore/scaffold",
      },
    },
  },
  {
    id: "act-56",
    user: danielSerrano,
    createdAt: daysAgo(29, 2),
    description: "Daniel Serrano created the project",
    detail: {
      type: "user",
      userEvent: { action: "created the project" },
    },
  },
  {
    id: "act-57",
    user: woody,
    createdAt: daysAgo(29, 5),
    description: "Woody joined the project",
    detail: {
      type: "user",
      userEvent: { action: "joined the project" },
    },
  },
];
