import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("action/logout", "routes/action/logout.tsx"),
  route("action/set-theme", "routes/action/set-theme.tsx"),

  layout("routes/__main.tsx", [
    route("projects", "routes/__main/projects.tsx", [
      route("new", "routes/__main/projects/new.tsx"),
    ]),
    route("projects/:projectId", "routes/__main/projects.$projectId.tsx", [
      route("analytics", "routes/__main/projects.$projectId/analytics.tsx"),
      route("board", "routes/__main/projects.$projectId/board.tsx", [
        route("issue/new", "routes/__main/projects.$projectId/board/issue/new.tsx"),
        route("issue/:issueId", "routes/__main/projects.$projectId/board/issue/$issueId.tsx"),
      ]),
      route("server-error", "routes/__main/projects.$projectId/server-error.tsx"),
      route("*", "routes/__main/projects.$projectId/$.tsx"),
    ]),
  ]),

  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
