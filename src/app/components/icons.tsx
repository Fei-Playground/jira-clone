import { FaStar } from "react-icons/fa";
import cx from "classix";

export const TaskIcon = ({
  size = 24,
  className = "",
}: IconProps): JSX.Element => (
  <FaStar fill="#1d9aaa" className={cx("relative", className)} size={size} />
);

interface IconProps {
  size?: number;
  className?: string;
}
