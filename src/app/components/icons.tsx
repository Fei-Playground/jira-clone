import { FaCheckSquare } from "react-icons/fa";
import {
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiCheckCircle,
} from "react-icons/hi2";
import cx from "classix";

export const TaskIcon = ({
  size = 24,
  className = "",
}: IconProps): JSX.Element => (
  <span className="relative flex items-center before:absolute before:inset-1/2 before:h-3/4 before:w-3/4 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white">
    <FaCheckSquare
      fill="#4BADE8"
      className={cx("relative", className)}
      size={size}
    />
  </span>
);

export const DocumentIcon = ({
  size = 24,
  className = "",
}: IconProps): JSX.Element => (
  <HiOutlineDocumentText size={size} className={cx(className)} />
);

export const CheckCircleIcon = ({
  size = 24,
  className = "",
}: IconProps): JSX.Element => (
  <HiCheckCircle size={size} className={cx(className)} />
);

export const ClockIcon = ({
  size = 24,
  className = "",
}: IconProps): JSX.Element => (
  <HiOutlineClock size={size} className={cx(className)} />
);

export const ExclamationIcon = ({
  size = 24,
  className = "",
}: IconProps): JSX.Element => (
  <HiOutlineExclamationTriangle size={size} className={cx(className)} />
);

interface IconProps {
  size?: number;
  className?: string;
}
