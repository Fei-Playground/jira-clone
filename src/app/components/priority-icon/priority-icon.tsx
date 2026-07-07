import { HiFlag } from "react-icons/hi";
import { PriorityId } from "@domain/priority";
import { useColorPalette } from "@app/store/color-palette.store";

export const PriorityIcon = ({
  priority,
  size = 18,
}: PriorityIconProps): JSX.Element => {
  const { palette } = useColorPalette();

  const colorMap: Record<PriorityId, string> = {
    low: palette.priorityLow,
    medium: palette.priorityMedium,
    high: palette.priorityHigh,
  };

  return (
    <span className="flex" style={{ color: colorMap[priority] }}>
      <HiFlag size={size} />
    </span>
  );
};

interface PriorityIconProps {
  priority: PriorityId;
  size?: number;
}
