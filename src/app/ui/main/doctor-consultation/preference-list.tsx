import { forwardRef } from "react";
import cx from "classix";
import { PreferenceListItem } from "./preference-list-item";

export const PreferenceList = forwardRef<HTMLUListElement, PreferenceListProps>(
  ({ items = [], className, ...rest }, ref) => {
    return (
      <ul
        ref={ref}
        className={cx("flex flex-col gap-0", className)}
        {...rest}
      >
        {items.map((item, index) => (
          <PreferenceListItem
            key={index}
            text={item.text}
            isSelected={item.isSelected ?? true}
          />
        ))}
      </ul>
    );
  }
);

PreferenceList.displayName = "PreferenceList";

export interface PreferenceListProps
  extends React.UlHTMLAttributes<HTMLUListElement> {
  items?: PreferenceItem[];
}

export interface PreferenceItem {
  text: string;
  isSelected?: boolean;
}
