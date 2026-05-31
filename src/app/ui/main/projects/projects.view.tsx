import { Link, Outlet } from "react-router";
import { AiOutlinePlus } from "react-icons/ai";
import { RxValueNone } from "react-icons/rx";
import { ProjectSummary } from "@domain/project";
import { Button } from "@app/components/button";
import { ProjectCard } from "./project-card";

export const ProjectsView = ({
  projectsSummary,
}: ProjectsViewProps): JSX.Element => {
  return (
    <div className="p-6">
      <h1 className="font-primary-black text-2xl">PROJECTS</h1>
      <div className="mt-8">
        <Link to="new" className="flex w-fit">
          <Button color="neutral" variant="subtlest" className="py-3 pl-3 pr-4">
            <span>
              <AiOutlinePlus size={22} />
            </span>
            <span className="leading-4">Add Project</span>
          </Button>
        </Link>
      </div>
      {projectsSummary.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-border-brand border-opacity-50 py-16 text-font-subtlest">
          <RxValueNone size={48} className="opacity-60" />
          <p className="mt-4 font-primary-light text-sm uppercase">
            No projects yet
          </p>
          <p className="mt-2 font-primary-light text-xs text-opacity-60">
            Create one using the button above
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,_400px)] gap-8">
          {projectsSummary.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
};

interface ProjectsViewProps {
  projectsSummary: ProjectSummary[];
}
