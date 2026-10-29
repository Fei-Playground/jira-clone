import { useState } from "react";
import { Link, Outlet } from "react-router";
import { AiOutlinePlus } from "react-icons/ai";
import { RxValueNone } from "react-icons/rx";
import { ProjectSummary } from "@domain/project";
import { Button } from "@app/components/button";
import { SearchInput } from "@app/components/search-input";
import { ProjectCard } from "./project-card";

export const ProjectsView = ({
  projectsSummary,
}: ProjectsViewProps): JSX.Element => {
  const [search, setSearch] = useState<string>("");
  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;
  const filteredProjects = isSearching
    ? projectsSummary.filter((project) =>
        project.name.toLowerCase().includes(query)
      )
    : projectsSummary;

  return (
    <div className="p-6">
      <h1 className="font-primary-black text-2xl">PROJECTS</h1>
      <div className="mt-8 flex items-center justify-between">
        <Link to="new" className="flex w-fit">
          <Button color="neutral" variant="subtlest" className="py-3 pl-3 pr-4">
            <span>
              <AiOutlinePlus size={22} />
            </span>
            <span className="leading-4">Add Project</span>
          </Button>
        </Link>
        {projectsSummary.length > 0 && (
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Filter projects"
            className="w-[240px] focus:w-[240px]"
          />
        )}
      </div>
      {isSearching && filteredProjects.length === 0 ? (
        <EmptySearch query={search.trim()} />
      ) : (
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,_400px)] gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
};

const EmptySearch = ({ query }: EmptySearchProps): JSX.Element => (
  <div className="mt-4 flex flex-col items-center text-font-subtlest">
    <RxValueNone size={36} />
    <p className="mt-4 font-primary-light text-xs uppercase">
      No projects match “{query}”
    </p>
  </div>
);

interface ProjectsViewProps {
  projectsSummary: ProjectSummary[];
}

interface EmptySearchProps {
  query: string;
}
