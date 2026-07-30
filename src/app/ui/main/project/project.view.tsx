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
}: Props): JSX.Element => {
  const location = useLocation();
  const section = location.pathname.split("/").slice(-1)[0];

  const sectionTitle = sectionTitles[section] || sectionTitles[defaultSection];

  return (
    <div className="relative flex h-full min-h-0 flex-grow overflow-hidden">
      <Sidebar
        projectName={name}
        projectDescription={description || "Description undefined"}
        projectImage={image || "/images/default-project.png"}
      />
      <div className="z-10 flex h-full min-h-0 w-full flex-grow flex-col overflow-y-auto px-5 py-6">
        <section className="shrink-0">
          <Link to="/projects" className="underline underline-offset-[3px]">
            Projects
          </Link>
          <span className="mx-2">/</span>
          <span>{name}</span>
          <h1 className="mb-4 mt-3 font-primary-black text-2xl">
            {sectionTitle}
          </h1>
        </section>
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

interface Props {
  name: string;
  description?: string;
  image: string;
}
