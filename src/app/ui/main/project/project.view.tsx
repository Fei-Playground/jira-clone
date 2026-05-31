import { Outlet, useLocation, useParams } from "react-router";
import { Sidebar } from "@app/ui/main/project/sidebar";
import { Breadcrumb, BreadcrumbItem } from "@app/components/breadcrumb";

// Map of URL section names to display titles
const SECTION_TITLES: Record<string, string> = {
  board: "Board",
  analytics: "Analytics",
  backlog: "Backlog",
};
const DEFAULT_SECTION = "board";

/**
 * Extract the last segment of the URL path to identify the current section
 */
const getSectionFromPath = (pathname: string): string => {
  return pathname.split("/").slice(-1)[0];
};

export const ProjectView = ({
  name,
  description,
  image,
}: Props): JSX.Element => {
  const location = useLocation();
  const section = getSectionFromPath(location.pathname);

  const sectionTitle =
    SECTION_TITLES[section] || SECTION_TITLES[DEFAULT_SECTION];

  return (
    <div className="relative flex h-full flex-grow">
      <Sidebar
        projectName={name}
        projectDescription={description || "Description undefined"}
        projectImage={image || "/images/default-project.png"}
      />
      <div className="z-10 flex h-full w-full flex-grow flex-col px-5 py-6">
        <section>
          {/* Breadcrumb navigation showing the current location in the project */}
          <BreadcrumbNav
            projectName={name}
            projectId={useParams().projectId as string}
          />
          {/* Section title derived from the current URL */}
          <h1 className="mb-5 mt-4 font-primary-black text-2xl">
            {sectionTitle}
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
}

/**
 * Breadcrumb navigation component for the project view
 * Displays: Projects > ProjectName > CurrentSection
 */
const BreadcrumbNav = ({
  projectName,
  projectId,
}: {
  projectName: string;
  projectId: string;
}): JSX.Element => {
  const location = useLocation();
  const section = getSectionFromPath(location.pathname);

  // Build breadcrumb items with proper capitalization for the section label
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Projects", href: "/projects" },
    { label: projectName, href: `/projects/${projectId}` },
    {
      label: section.charAt(0).toUpperCase() + section.slice(1),
      current: true,
    },
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};
