import { forwardRef } from "react";
import cx from "classix";
import { FaCheckCircle } from "react-icons/fa";

export const PreferenceListItem = forwardRef<
  HTMLLIElement,
  PreferenceListItemProps
>(({ text, isSelected = true, className, ...rest }, ref) => {
  return (
    <li
      ref={ref}
      className={cx("flex items-start gap-3 py-3", className)}
      {...rest}
    >
      {/* Checkmark indicator */}
      <div className="flex-shrink-0 pt-0.5">
        <FaCheckCircle
          size={20}
          className={cx(
            "transition-colors duration-200",
            isSelected ? "text-font-brand" : "text-border-neutral"
          )}
        />
      </div>

      {/* Text content */}
      <div className="flex-1">
        <p className="font-primary text-sm text-font-danger leading-relaxed">
          {text}
        </p>
      </div>
    </li>
  );
});

PreferenceListItem.displayName = "PreferenceListItem";

export interface PreferenceListItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  text: string;
  isSelected?: boolean;
}
