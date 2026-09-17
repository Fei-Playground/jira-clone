import cx from "classix";
import { Character, CharacterId } from "@domain/character";
import { ChatRoom } from "@domain/chat-room";
import { useTranslation } from "@app/store/locale.store";

const TURN_MODE_LABEL_KEY: Record<string, string> = {
  "round-robin": "companions.group.turnModeRoundRobin",
  natural: "companions.group.turnModeNatural",
  manual: "companions.group.turnModeManual",
};

export const RoomList = ({
  rooms,
  activeRoomId,
  charactersById,
  onSelectRoom,
}: {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  charactersById: Record<CharacterId, Character>;
  onSelectRoom: (roomId: string) => void;
}): JSX.Element => {
  const { t } = useTranslation();

  if (rooms.length === 0) {
    return (
      <p className="px-2 py-1 text-xs text-font-subtlest">
        {t("companions.group.noRoomsYet")}
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {rooms.map((room) => (
        <li key={room.id}>
          <button
            onClick={() => onSelectRoom(room.id)}
            className={cx(
              "flex w-full items-center gap-2 rounded p-2 text-left",
              room.id === activeRoomId
                ? "bg-background-selected text-font-brand"
                : "text-font hover:bg-background-neutral"
            )}
          >
            <span className="flex -space-x-2">
              {room.members.slice(0, 3).map((member) => {
                const character = charactersById[member.characterId];
                if (!character) return null;
                return (
                  <span
                    key={member.characterId}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs ring-2 ring-elevation-surface-sunken"
                    style={{
                      background: `linear-gradient(145deg, ${character.avatarColor}, ${character.avatarColor}cc)`,
                    }}
                  >
                    {character.avatarEmoji}
                  </span>
                );
              })}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">
                {room.name}
              </span>
              <span className="block truncate text-2xs text-font-subtlest">
                {room.members.length} ·{" "}
                {t(TURN_MODE_LABEL_KEY[room.turnMode] as never)}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};
