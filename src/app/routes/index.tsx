import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

// Currently there is no landing. Just redirecting to /projects
export const loader: LoaderFunction = async () => {
  return redirect("/projects");
};
