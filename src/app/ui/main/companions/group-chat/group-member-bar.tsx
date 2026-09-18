import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import cx from "classix";
import { Character, CharacterId } from "@domain/character";
import { ChatRoomMember } from "@domain/chat-room";
import { useTranslation } from "@app/store/locale.store";

export const GroupMemberBar = ({
  members,
  charactersById,
  onToggleMute,
  onCallOn,
  onViewCard,
}: {
  members: ChatRoomMember[];
  charactersById: Record<CharacterId, Character>;
  onToggleMute: (characterId: CharacterId) => void;
  onCallOn: (characterId: CharacterId) => void;
  onViewCard: (characterId: CharacterId) => void;
}): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 border-b border-border px-6 py-2">
      {members.map((member) => {
        const character = charactersById[member.characterId];
        if (!character) return null;

        return (
          <DropdownMenu.Root key={member.characterId}>
            <DropdownMenu.Trigger
              aria-label={character.name}
              className={cx(
                "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm",
                member.muted && "opacity-40 grayscale"
              )}
              style={{
                background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
              }}
            >
              {character.avatarEmoji}
              {member.muted && (
                <span className="absolute inset-0 rounded-full border border-font-inverse" />
              )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={4}
                className="z-50 min-w-[160px] rounded bg-elevation-surface-overlay py-1 shadow-md radix-side-bottom:animate-slide-down"
              >
                <DropdownMenu.Item className="cursor-default select-none px-3 py-1.5 text-xs font-bold text-font">
                  {character.name}
                  {member.muted && (
                    <span className="ml-2 rounded bg-background-neutral px-1 py-0.5 text-2xs text-font-subtlest">
                      {t("companions.group.mutedBadge")}
                    </span>
                  )}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => onToggleMute(member.characterId)}
                  className="cursor-pointer select-none p-2 text-sm text-font outline-none hover:bg-background-neutral"
                >
                  {member.muted
                    ? t("companions.group.unmute")
                    : t("companions.group.mute")}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => onCallOn(member.characterId)}
                  className="cursor-pointer select-none p-2 text-sm text-font outline-none hover:bg-background-neutral"
                >
                  {t("companions.group.callOn", { name: character.name })}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => onViewCard(member.characterId)}
                  className="cursor-pointer select-none p-2 text-sm text-font outline-none hover:bg-background-neutral"
                >
                  {t("companions.group.viewCard")}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        );
      })}
    </div>
  );
};
