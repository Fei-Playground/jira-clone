import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { SettingsDetail } from "@domain/activity";
import { MetaRow, ViewDetailButton } from "./activity-parts";

export const SettingsActivity = ({
  settings,
  onViewDetail,
}: SettingsActivityProps): JSX.Element => (
  <div className="flex flex-col gap-2">
    <p className="font-primary-bold text-sm text-font">
      {settings.settingName}
    </p>

    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-font-subtlest line-through">{settings.before}</span>
      <HiOutlineArrowNarrowRight size={16} className="text-icon-subtle" />
      <span className="font-primary-bold text-font">{settings.after}</span>
    </div>

    <MetaRow>
      <span>
        Scope:{" "}
        <span className="font-primary-bold text-font-subtle">
          {settings.scope}
        </span>
      </span>
    </MetaRow>

    <ViewDetailButton label="View Settings" onClick={onViewDetail} />
  </div>
);

interface SettingsActivityProps {
  settings: SettingsDetail;
  onViewDetail: () => void;
}
