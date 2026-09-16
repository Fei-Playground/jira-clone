import { Link } from "react-router";
import cx from "classix";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { AiFillGithub } from "react-icons/ai";
import { RiChatSmile2Line } from "react-icons/ri";
import { Tooltip } from "@app/components/tooltip";
import { useTranslation } from "@app/store/locale.store";
import { SelctTheme } from "./select-theme";
import { SelectLocale } from "./select-locale";
import { UserProfile } from "./user-profile";

export const Header = (): JSX.Element => {
  const { t } = useTranslation();
  const iconBaseClass =
    "w-[24px] h-[24px] text-icon rounded-full flex items-center justify-center hover:bg-background-brand-subtlest hover:text-icon-brand";

  return (
    <header className="relative z-10 flex w-full items-center justify-between bg-elevation-surface-raised px-5 py-2 shadow-[0_1px_5px_-1px_rgba(0,0,0,0.3)]">
      <section>
        <Link
          to="/"
          className="flex cursor-pointer items-center rounded px-3 py-2 text-font hover:bg-background-brand-subtlest hover:text-font-brand"
        >
          <img src="/images/logo.png" width={24} height={24} alt="Logo" />
          <span className="ml-2">{t("header.logoTitle")}</span>
        </Link>
      </section>
      <section className="flex items-center gap-4">
        <Tooltip title={t("header.companions")}>
          <Link
            to="/companions"
            aria-label={t("header.goToCompanions")}
            className={iconBaseClass}
          >
            <RiChatSmile2Line size={22} />
          </Link>
        </Tooltip>
        <Tooltip title={t("header.about")}>
          <button
            aria-label={t("header.aboutThisWebsite")}
            disabled
            className={cx(iconBaseClass, "cursor-not-allowed")}
          >
            <HiQuestionMarkCircle size={24} />
          </button>
        </Tooltip>
        <Tooltip title={t("header.github")}>
          <a
            href="https://github.com/daniserrano7/jira-clone"
            className={iconBaseClass}
            aria-label={t("header.goToGithub")}
          >
            <AiFillGithub size={24} />
          </a>
        </Tooltip>
        <SelectLocale />
        <SelctTheme />
        <UserProfile />
      </section>
    </header>
  );
};
