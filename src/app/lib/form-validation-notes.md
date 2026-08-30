# Form Validation Notes

This document describes how form input should be validated in this project.
It is grounded in the patterns already used across the codebase and should be
followed when adding or modifying any form.

---

## Core Approach

Validation is handled **server-side inside React Router action functions**.
There is no third-party form or validation library (no Zod, Yup,
react-hook-form, or Formik). All checks are written as plain JavaScript
conditionals inside the `action` exported from a route file.

Native HTML5 validation attributes (`required`, `minLength`, `pattern`,
`noValidate`) are intentionally omitted; all feedback comes from the
server response.

---

## Step-by-Step Pattern

### 1. Define an `ActionData` type in the route file

Export a type that maps each validated field name to an optional error string.

```ts
// src/app/routes/.../my-route.tsx
export type ActionData = {
  errors: {
    name?: string;
    // add one key per validated field
  };
};
```

### 2. Validate inside the `action` function

Read fields from `formData`, run your checks, and return early with a 400
response if anything fails.

```ts
import { json } from "react-router";
import { textAreOnlySpaces } from "~/utils/text-are-only-spaces";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string | null;

  const errors: ActionData["errors"] = {};

  if (!name || textAreOnlySpaces(name)) {
    errors.name = "Name is required";
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  // proceed with valid data …
}
```

### 3. Read the errors in the view via `useActionData`

```ts
const actionData = useActionData<ActionData>();
```

Pass the relevant error string down to the input component as a prop:

```tsx
<Title
  initTitle={issue?.name ?? ""}
  error={actionData?.errors?.name}
/>
```

---

## The `textAreOnlySpaces` Utility

All "non-empty" checks **must** also guard against whitespace-only input.
Use the shared helper:

```ts
import { textAreOnlySpaces } from "~/utils/text-are-only-spaces";

// true  → string is blank/spaces only → treat as empty
// false → string contains real content → OK
```

Source: `src/utils/text-are-only-spaces.ts`

---

## Displaying Errors

### Inline field errors — `<Title>` component

The `<Title>` component (`src/app/components/title/title.tsx`) accepts an
`error?: string` prop. When the prop is present **and** the current value is
empty or spaces-only, it:

- Applies a red danger outline to the textarea
- Renders a red message below the field: `<span className="text-font-danger">{error}</span>`
- Auto-dismisses as soon as the user types valid content (no re-submit needed)

Use `<Title>` for any required text/title input that goes through a server
action.

### Client-only errors — `EditBox` pattern

For purely client-side interactions (e.g. saving a comment without a full
page reload), maintain a local `isError: boolean` state:

```ts
const [isError, setIsError] = useState(false);

function handleSave() {
  if (!messageIsValid()) {
    setIsError(true);
    return;
  }
  // proceed …
}
```

When `isError` is `true`:
- Add `!outline-2 !outline-border-danger` to the textarea class
- Change the placeholder to a descriptive error message and colour it with
  `placeholder:text-font-danger`

Clear the error state as soon as the user edits the field.

See: `src/app/ui/main/project/board/issue-panel/comment/edit-box.tsx`

### Toast notifications

`react-toastify` (`<Toast>` component) is reserved for **transient,
non-field feedback** only — successful saves, network errors, and 404/500
boundaries. Do **not** use toasts to report individual field validation
errors.

---

## Colour Tokens for Error States

| Purpose | Tailwind token |
|---|---|
| Border / outline | `border-border-danger` / `outline-border-danger` |
| Error text | `text-font-danger` |
| Placeholder error text | `placeholder:text-font-danger` |

---

## Quick Reference

| Scenario | Approach |
|---|---|
| Required text field (server form) | Check `!value \|\| textAreOnlySpaces(value)` in action; return `errors` with status 400 |
| Required count / selection (server form) | Check `items.length === 0` in action; return matching error key |
| Client-only field (no server round-trip) | Local `isError` state; validate with `textAreOnlySpaces` before save |
| Success feedback | `toast.success(…)` after a successful action |
| Page-level errors (404 / 500) | `toast.warning(…)` / `toast.error(…)` in the `CatchBoundary` |
