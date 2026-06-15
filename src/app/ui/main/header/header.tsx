import { Link, NavLink, useParams } from "react-router";
import cx from "classix";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { Tooltip } from "@app/components/tooltip";
import { useSidebar } from "../sidebar.context";
import { SelctTheme } from "./select-theme";
import { UserProfile } from "./user-profile";

export const Header = (): JSX.Element => {
  const { projectId } = useParams();
  const { openMobile } = useSidebar();
  const iconBaseClass =
    "w-[24px] h-[24px] text-icon rounded-full flex items-center justify-center hover:bg-background-brand-subtlest hover:text-icon-brand";

  const navItems = [
    { label: "Daily Missions", emoji: "🎯", path: "board" },
    { label: "Progress & Points", emoji: "⭐", path: "analytics" },
    { label: "Rewards", emoji: "🎁", path: "rewards" },
    { label: "Daily Review", emoji: "📋", path: "review" },
  ];

  return (
    <header
      className="relative z-10 flex w-full items-center justify-between bg-elevation-surface-raised px-5 py-2 shadow-[0_1px_5px_-1px_rgba(0,0,0,0.3)]"
    >
      <section className="flex items-center gap-2">
        {projectId && (
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-font hover:bg-background-neutral md:hidden"
            onClick={openMobile}
            aria-label="Open navigation menu"
          >
            <span className="text-xl">☰</span>
          </button>
        )}
        <Link
          to="/"
          className="flex cursor-pointer items-center rounded px-3 py-2 text-font hover:bg-background-brand-subtlest hover:text-font-brand"
        >
          <span className="text-2xl">✨</span>
          <span className="ml-2 font-primary-bold">Izzy&apos;s Independence Board</span>
        </Link>
      </section>

      {projectId && (
        <section className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/projects/${projectId}/${item.path}`}
              end={false}
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-1.5 rounded-t px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "border-b-2 border-border-brand font-primary-bold text-font-brand"
                    : "text-font-subtlest hover:bg-background-neutral hover:text-font"
                )
              }
            >
              <span>{item.emoji}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </section>
      )}

      <section className="flex items-center gap-4">
        <Tooltip title="About">
          <button
            aria-label="About this website"
            disabled
            className={cx(iconBaseClass, "cursor-not-allowed")}
          >
            <HiQuestionMarkCircle size={24} />
          </button>
        </Tooltip>

        <SelctTheme />
        <UserProfile />
      </section>
    </header>
  );
};
