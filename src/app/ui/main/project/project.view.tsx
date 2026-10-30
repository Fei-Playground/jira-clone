import { Outlet, Link, useLocation } from "react-router";
import { Sidebar } from "@app/ui/main/project/sidebar";

const sectionTitles: Record<string, string> = {
  board: "Board",
  analytics: "Analytics",
  backlog: "Backlog",
};
const defaultSection = "board";

export const ProjectView = ({
  name,
  description,
  image,
  issuesCount,
}: Props): JSX.Element => {
  const location = useLocation();
  const lastPathSegment = location.pathname.split("/").slice(-1)[0];
  const section = sectionTitles[lastPathSegment]
    ? lastPathSegment
    : defaultSection;

  const sectionTitle = sectionTitles[section];
  // The board is the only section that lists issues, so it is the only one
  // showing how many of them there are.
  const showsIssuesCount = section === "board";

  return (
    <div className="relative flex h-full flex-grow">
      <Sidebar
        projectName={name}
        projectDescription={description || "Description undefined"}
        projectImage={image || "/images/default-project.png"}
      />
      <div className="z-10 flex h-full w-full flex-grow flex-col px-5 py-6">
        <section>
          <Link to="/projects" className="underline underline-offset-[3px]">
            Projects
          </Link>
          <span className="mx-2">/</span>
          <span>{name}</span>
          <h1 className="mb-5 mt-4 font-primary-black text-2xl">
            {sectionTitle}
            {showsIssuesCount && issuesCount !== undefined && (
              <span className="ml-2 font-primary-light text-2xs uppercase text-font-subtlest">
                ( {issuesCount} )
              </span>
            )}
          </h1>
        </section>
        <Outlet />
      </div>
    </div>
  );
};

interface Props {
  name: string;
  description?: string;
  image: string;
  issuesCount?: number;
}
