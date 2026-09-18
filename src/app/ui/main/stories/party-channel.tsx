import { useEffect } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useTranslation } from "@app/store/locale.store";
import { GroupChatWindow } from "../companions/group-chat";
import { useChatRoomStore } from "../companions/chat-room.store";
import { useStoryStore } from "./story.store";

// The party's internal channel: a real ChatRoom with zero NPC members, so
// the existing turn-scheduler never schedules anyone to speak here — it's a
// purely human-to-human channel, distinct from any scene's NPC dialogue or
// group chat. Room creation is a side effect, so it runs in useEffect
// rather than during render (same pattern as SceneGroupChat's lazy room).
export const PartyChannel = ({
  onBack,
}: {
  onBack: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { party, registerPartyChannel } = useStoryStore();
  const { rooms, createRoom } = useChatRoomStore();

  const existingRoom = party?.channelRoomId
    ? rooms.find((r) => r.id === party.channelRoomId)
    : undefined;

  useEffect(() => {
    if (!party || existingRoom) return;
    const newRoom = createRoom({
      name: party.name,
      characterIds: [],
      turnMode: "manual",
      lorebookIds: [],
    });
    registerPartyChannel(newRoom.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party?.id, existingRoom]);

  if (!party) return <></>;

  const partyMembersById = Object.fromEntries(
    party.members.map((m) => [
      m.id,
      { name: m.name, emoji: m.emoji, color: m.color },
    ])
  );

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="border-b border-border px-6 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-font-subtlest hover:text-font-brand"
        >
          <RiArrowLeftLine size={14} />
          {t("stories.party.backToScene")}
        </button>
      </div>
      {existingRoom ? (
        <GroupChatWindow
          room={existingRoom}
          onDeleteRoom={() => {}}
          onViewCharacter={() => {}}
          partyMembersById={partyMembersById}
          activeSenderProfileId={party.activeMemberId}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-font-subtlest">
          {t("stories.party.channelLoading")}
        </div>
      )}
    </div>
  );
};
