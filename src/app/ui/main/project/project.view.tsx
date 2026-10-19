import { Outlet, Link, useLocation } from "react-router";
import { Sidebar } from "@app/ui/main/project/sidebar";
import { formatDate } from "@utils/formatDateTime";

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
  lastUpdatedAt,
}: Props): JSX.Element => {
  const location = useLocation();
  const section = location.pathname.split("/").slice(-1)[0];

  const sectionTitle = sectionTitles[section] || sectionTitles[defaultSection];

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
          <h1 className="mt-4 font-primary-black text-2xl">{sectionTitle}</h1>
          {lastUpdatedAt !== undefined && (
            <p className="mb-5 mt-1 font-primary-light text-2xs text-font-subtlest">
              Last updated {formatDate(lastUpdatedAt)}
            </p>
          )}
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
  lastUpdatedAt?: number;
}
