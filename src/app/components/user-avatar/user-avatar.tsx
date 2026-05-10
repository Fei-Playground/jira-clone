import * as Avatar from "@radix-ui/react-avatar";
import { User, getRandomPastelColor } from "@domain/user";
import { Tooltip } from "@app/components/tooltip";

export const UserAvatar = ({
  name,
  image,
  color,
  size = 32,
  variant = "default",
  tooltip = false,
}: UserAvatarProps): JSX.Element => {
  const imageMinName = image?.replace(".webp", "-min.webp");
  const imageSrc = size > 80 ? `/avatars/${image}` : `/avatars/${imageMinName}`;
  const imageSize = {
    width: `${size}px`,
    minWidth: `${size}px`,
    height: `${size}px`,
  };

  // Extract initials from name, supporting up to 2 words
  const acronym = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  // Dark variant uses a border and light text for contrast on dark backgrounds
  const isDarkVariant = variant === "dark";
  const fallbackClassName = isDarkVariant
    ? "border border-border-bold text-[var(--Neutral0)]"
    : "text-[var(--Neutral1000)]";

  return (
    <Tooltip title={name} show={tooltip}>
      <Avatar.Root className="flex items-center rounded-full" style={imageSize}>
        <Avatar.Image
          className="rounded-full object-cover"
          src={image ? imageSrc : undefined}
          style={imageSize}
          alt={name}
        />
        <Avatar.Fallback
          delayMs={0}
          className={`flex items-center justify-center rounded-full ${fallbackClassName}`}
          style={{
            ...imageSize,
            backgroundColor: color || getRandomPastelColor(),
            fontSize: `${size / 2}px`,
          }}
        >
          {acronym}
        </Avatar.Fallback>
      </Avatar.Root>
    </Tooltip>
  );
};

interface UserAvatarProps extends Omit<User, "id"> {
  size?: number;
  variant?: "default" | "dark";
  tooltip?: boolean;
}
