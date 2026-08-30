# Issue List Sorting

This document explains how issue lists are sorted in this project.

## Sort Options

There are two user-selectable sort modes, defined as the `Sort` type in
`src/domain/filter/filter.ts`:

| Value | Label | Description |
|---|---|---|
| `"date"` | Date | Newest issues appear first (default) |
| `"priority"` | Priority | Highest-priority issues appear first |

## Default Sort

The default sort is **`"date"`** (`DEFAULT_SORT` in `src/domain/filter/filter.ts`).
It is applied whenever the `?sortBy=` URL param is absent or holds an invalid value.

## How Sort State is Stored

Sort is purely **URL-driven** — stored in the `?sortBy=` query parameter
(e.g. `?sortBy=priority`). There is no Redux/Zustand sort state; the
`useSortBy` hook (`src/app/hooks/useSortBy.tsx`) reads the param and returns
`null` if it is missing or invalid. Components fall back to `DEFAULT_SORT`
at that point.

## Database Sorting

Sorting is applied server-side in `src/infrastructure/db/project.ts` using a
**compound Prisma `orderBy`**. Both fields are always applied — only the
primary field changes:

| `?sortBy=` value | Primary | Secondary |
|---|---|---|
| `"date"` (default) | `createdAt DESC` | `priority.order DESC` |
| `"priority"` | `priority.order DESC` | `createdAt DESC` |

Priority is stored as a numeric `order` field on the `Priority` relation:

| Priority level | `order` value |
|---|---|
| Low | 0 |
| Medium | 1 |
| High | 2 |

Because the sort direction is always `DESC`, **High priority issues appear
before Medium, which appear before Low**.

There is **no client-side re-sorting**; `CategoryColumn` only filters issues
by the search text and preserves the order returned by the server.

## Adding a New Sort Option

1. Add the new value to the `sorts` tuple in `src/domain/filter/filter.ts`.
2. Add a label entry to `sortDict` (same file).
3. Update the `orderBy` ternary in `src/infrastructure/db/project.ts` to
   handle the new value.

## Other Sort Contexts (not user-controlled)

| Context | Sort |
|---|---|
| Issue comments | `createdAt ASC` (chronological) |
| Project member list | `name ASC` (alphabetical) |
| Projects overview list | `createdAt ASC` (oldest first) |
