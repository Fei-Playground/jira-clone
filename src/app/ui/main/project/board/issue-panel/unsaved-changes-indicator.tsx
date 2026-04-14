import { MdWarning } from "react-icons/md";
import cx from "classix";

export const UnsavedChangesIndicator = ({
  show,
}: Props): JSX.Element | null => {
  if (!show) {
    return null;
  }

  return (
    <div
      className={cx(
        "flex items-center gap-2 rounded bg-background-warning-subtler px-3 py-2",
        "text-warning text-xs"
      )}
      role="alert"
      aria-label="Unsaved changes"
    >
      <MdWarning size={16} className="flex-shrink-0" />
      <span>Unsaved changes — press Shift + S to save</span>
    </div>
  );
};

interface Props {
  show?: boolean;
}
