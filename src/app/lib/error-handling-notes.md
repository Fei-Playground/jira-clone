# Error Handling Notes

This document describes how errors should be surfaced to users in this project.

---

## Quick Reference

| Scenario | What to do |
|---|---|
| Loader: resource not found | `throw new Response("Not Found", { status: 404 })` |
| Loader: unexpected / server error | `throw new Error("...")` or use `invariant(...)` |
| Action: form validation failure | Return `json({ errors: { field: "message" } }, { status: 400 })` |
| Action: runtime error | Return `json({ error: message }, { status: 500 })` and consume it in the UI |
| Mutation success | `toast.success("...")` |
| Non-fatal / advisory notice | `toast.warning("...")` or `toast.info("...")` |
| Fatal in-page error | `toast.error("...")` (typically paired with an error boundary) |

---

## 1. Toasts — transient feedback

**Library:** `react-toastify`  
**Global container:** mounted in `src/app/root.tsx` → available on every page.

Use the `toast` helper directly anywhere in client-side code:

```ts
import { toast } from "react-toastify";

toast.success("Issue created successfully");
toast.warning("Try to go back to the previous page.");
toast.error("Try reloading the page.");
toast.info("This section is not available yet.");
```

Guidelines:
- Auto-closes after **5 seconds** (configured in `<Toast />`).
- Appears top-right; keep messages short and actionable.
- Only fire a toast when it adds information the user couldn't see from the UI alone.
- When an `ErrorBoundary` or `CatchBoundary` already fills the screen, a toast is optional
  but useful for surfacing a suggested next action (see `server-error.tsx`, `$.tsx`).

---

## 2. Error Boundaries — page-level errors

React Router's exported `ErrorBoundary` / `CatchBoundary` functions are the structural
safety net. Place one in every route file that loads data.

**`ErrorBoundary`** — catches thrown `Error` instances (loader panics, `invariant` failures):

```tsx
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <Error500 href="/projects" message="Something went wrong." />;
}
```

**`CatchBoundary`** — catches thrown `Response` objects (explicit HTTP errors):

```tsx
export function CatchBoundary() {
  return <Error404 href="/projects" message="Project not found." />;
}
```

Shared error page components live in `src/app/components/`:
- `<Error404>` — wraps `<ErrorBase variant="404" />`
- `<Error500>` — wraps `<ErrorBase variant="500" />`

For errors inside a modal/dialog keep the boundary output inside `<Dialog.Root>` so the
overlay doesn't disappear (see `board/issue/$issueId.tsx`).

---

## 3. Loader errors — throw, don't return

When a loader cannot satisfy a request, **throw**; never return an error silently.

```ts
// Missing resource → CatchBoundary
throw new Response("Not Found", { status: 404 });

// Bad param → ErrorBoundary via invariant
import invariant from "tiny-invariant";
invariant(params.projectId, "projectId is required");
```

---

## 4. Action errors — return and consume

**Validation failures** — return structured errors so the form can show inline messages:

```ts
// server (action)
return json<ActionData>({ errors: { name: "Name is required" } }, { status: 400 });

// client (view)
const actionData = useActionData() as ActionData;
<Title error={actionData?.errors?.name} />
```

**Runtime / server failures** — return a top-level `error` key and read it in the UI:

```ts
// server (action)
try {
  await db.update(...);
} catch (e) {
  return json({ error: "Could not save changes." }, { status: 500 });
}

// client (view) — don't silently ignore fetcher.data.error
if (fetcher.data?.error) toast.error(fetcher.data.error);
```

> **Known gap:** `board.tsx` returns `json({ error })` from the `updateIssueCategory`
> action but the client currently does not read it. When fixing this, follow the pattern
> above.

---

## 5. What to avoid

- **Silent failures** — don't swallow errors with an empty `catch` or log-only `console.error`
  when the user is waiting on an outcome.
- **Raw alert/confirm** — use toasts or inline messages instead.
- **Exposing raw error messages** to users — catch technical details server-side; show a
  human-friendly string in the toast or boundary.
- **Toasts for every event** — reserve them for events the user might otherwise miss;
  inline UI feedback (field errors, disabled states) is preferred for form interactions.
