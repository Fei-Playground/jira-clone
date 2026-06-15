import { Link } from "react-router";
import cx from "classix";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { AiFillGithub } from "react-icons/ai";
import { Tooltip } from "@app/components/tooltip";
import { SelctTheme } from "./select-theme";
import { UserProfile } from "./user-profile";

export const Header = (): JSX.Element => {
  const iconBaseClass =
    "w-[24px] h-[24px] text-icon rounded-full flex items-center justify-center hover:bg-background-brand-subtlest hover:text-icon-brand";

  return (
    <header className="relative z-10 flex w-full items-center justify-between bg-elevation-surface-raised px-5 py-2 shadow-[0_1px_5px_-1px_rgba(0,0,0,0.3)]">
      <section>
        <Link
          to="/"
          className="flex cursor-pointer items-center rounded px-3 py-2 text-font hover:bg-background-brand-subtlest hover:text-font-brand"
        >
          <span className="text-2xl">✨</span>
          <span className="ml-2 font-primary-bold">Izzy's Independence Board</span>
        </Link>
      </section>
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
