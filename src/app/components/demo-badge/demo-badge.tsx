import { useTranslation } from "@app/store/locale.store";
import cx from "classix";

// A single, consistent "Demo mode" badge for any surface that doesn't call a
// real service (API test connection, TTS playback, image generation). Keeps
// the wording and styling identical everywhere so the disclosure reads as a
// deliberate, honest signal rather than an inconsistent afterthought.
export const DemoBadge = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <span
      className={cx(
        "rounded bg-background-neutral px-1.5 py-0.5 text-2xs text-font-subtlest",
        className
      )}
    >
      {t("companions.demo.badge")}
    </span>
  );
};
