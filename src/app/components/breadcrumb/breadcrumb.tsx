import { Link } from "react-router";
import { IoChevronForward } from "react-icons/io5";
import cx from "classix";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export const Breadcrumb = ({ items }: Props): JSX.Element => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* Show separator (chevron) before each item except the first */}
          {index > 0 && (
            <IoChevronForward
              size={16}
              className="text-font-subtlest text-opacity-50"
            />
          )}
          {/* Render navigable links for non-current items, static span for current item */}
          {item.href && !item.current ? (
            <Link
              to={item.href}
              className="text-font underline-offset-2 transition-colors hover:text-font hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cx("text-font", item.current && "text-font-subtlest")}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

interface Props {
  items: BreadcrumbItem[];
}
