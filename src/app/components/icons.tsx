import { FaCheckSquare } from "react-icons/fa";
import cx from "classix";

export const TaskIcon = ({
  size = 24,
  className = "",
}: IconProps): JSX.Element => (
  <span 
    className="relative flex items-center before:absolute before:inset-1/2 before:h-3/4 before:w-3/4 before:-translate-x-1/2 before:-translate-y-1/2"
    style={{ 
      '--color-icon-bg': 'var(--color-font-inverse)',
      '--color-icon-fg': 'var(--color-background-info-bold)'
    } as React.CSSProperties}
  >
    <style>{`.task-icon::before { background-color: var(--color-font-inverse); }`}</style>
    <FaCheckSquare
      style={{ fill: 'var(--color-background-info-bold)' }}
      className={cx("relative", className)}
      size={size}
    />
  </span>
);

interface IconProps {
  size?: number;
  className?: string;
}
