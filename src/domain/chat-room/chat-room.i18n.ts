import { Locale } from "@app/locales";
import { ChatRoomId } from "./chat-room";
import { STAR_CREW_ROOM_ID } from "./chat-room.mock";

export interface RoomText {
  name: string;
  messages: string[];
}

export const roomTextByLocale: Record<Locale, Record<ChatRoomId, RoomText>> = {
  [Locale.EN]: {
    [STAR_CREW_ROOM_ID]: {
      name: "Star Crew Meeting",
      messages: [
        "Alright, everyone's here. Systems check before we hit the next system?",
        "Nova has a point, though— all sensor arrays report nominal. I have also been quietly composing a haiku about the ion drive.",
        "Unit 7 has a point, though— haikus won't stop a kraken, but I'll allow it. Standing orders hold: no hostile first contact.",
        "Let's set course for the next system, then.",
        "Course locked in! Ion drive spinning up. 🛰️",
      ],
    },
  },
  [Locale.ZH]: {
    [STAR_CREW_ROOM_ID]: {
      name: "星舟号船员会议",
      messages: [
        "好了，大家都到齐了。出发去下一个星系前，先做个系统检查？",
        "星芒说得对，不过——所有传感器阵列都显示正常。我还悄悄给离子引擎写了首俳句。",
        "7号单元说得对，不过——俳句挡不住海怪，不过我准了。常驻守则依旧：禁止主动敌意接触。",
        "那就设定航向，前往下一个星系吧。",
        "航向已锁定！离子引擎正在启动。🛰️",
      ],
    },
  },
};

export const getRoomText = (roomId: ChatRoomId, locale: Locale): RoomText | undefined =>
  roomTextByLocale[locale]?.[roomId];

// Transition phrases a non-first speaker in a group turn prepends to their
// reply, so consecutive replies read as members talking to each other.
export const groupTransitionByLocale: Record<Locale, string[]> = {
  [Locale.EN]: [
    "{{name}} has a point, though—",
    "Building on what {{name}} said—",
    "Can't argue with {{name}} there, but—",
  ],
  [Locale.ZH]: [
    "{{name}} 说得有道理，不过——",
    "接着 {{name}} 的话说——",
    "{{name}} 这话没错，但是——",
  ],
};
