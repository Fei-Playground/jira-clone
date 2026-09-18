import { Outlet, Link, useLocation } from "react-router";
import { Sidebar } from "@app/ui/main/project/sidebar";
import { useTranslation } from "@app/store/locale.store";

const defaultSection = "board";

export const ProjectView = ({
  name,
  description,
  image,
}: Props): JSX.Element => {
  const location = useLocation();
  const section = location.pathname.split("/").slice(-1)[0];
  const { t } = useTranslation();

  const sectionTitles: Record<string, string> = {
    board: t("sidebar.board"),
    analytics: t("sidebar.analytics"),
    backlog: t("sidebar.backlog"),
  };
  const sectionTitle = sectionTitles[section] || sectionTitles[defaultSection];

  return (
    <div className="relative flex h-full flex-grow">
      <Sidebar
        projectName={name}
        projectDescription={description || t("sidebar.descriptionUndefined")}
        projectImage={image || "/images/default-project.png"}
      />
      <div className="z-10 flex h-full w-full flex-grow flex-col px-5 py-6">
        <section>
          <Link to="/projects" className="underline underline-offset-[3px]">
            {t("projects.breadcrumb")}
          </Link>
          <span className="mx-2">/</span>
          <span>{name}</span>
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
