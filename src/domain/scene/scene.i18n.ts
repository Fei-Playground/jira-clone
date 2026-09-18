import { Locale } from "@app/locales";
import { SceneId } from "./scene";
import {
  SCENE_DOCKS_ID,
  SCENE_TAVERN_ID,
  SCENE_WAREHOUSE_ID,
  SCENE_LIGHTHOUSE_ID,
  SCENE_LAST_SHIP_ID,
} from "../story/blacktide-story.ids";
import { starshipSceneTextByLocale } from "./starship-scene.i18n";

// The translatable slice of a Scene. npcRoles/exitLabels/itemLabels are
// matched positionally to scene.mock.ts's npcs/exits/items arrays (order
// must stay in sync).
export interface SceneText {
  name: string;
  description: string;
  ambience: string;
  npcRoles: string[];
  exitLabels: string[];
  itemLabels: string[];
}

export const sceneTextByLocale: Record<Locale, Record<SceneId, SceneText>> = {
  [Locale.EN]: {
    [SCENE_DOCKS_ID]: {
      name: "The Docks",
      description:
        "Rain hammers the boards. Ships creak against their moorings, and lantern light smears across the wet planks.",
      ambience: "Salt air, distant foghorn, the slap of water on pilings.",
      npcRoles: ["Harbor Captain"],
      exitLabels: ["Duck into the tavern out of the rain"],
      itemLabels: [],
    },
    [SCENE_TAVERN_ID]: {
      name: "The Rainy Night Tavern",
      description:
        "A low-ceilinged room thick with pipe smoke. Sable holds court at the end of the bar, nursing something dark.",
      ambience: "Creaking floorboards, a card game gone quiet in the corner.",
      npcRoles: ["Ledger of Secrets"],
      exitLabels: ["Back out to the docks", "Slip through the back door"],
      itemLabels: [],
    },
    [SCENE_WAREHOUSE_ID]: {
      name: "Warehouse Back Alley",
      description:
        "Crates stacked higher than a person, most gone soft with damp. Something — someone — shifts behind the nearest stack.",
      ambience: "Rats in the rafters, the tang of tar and old rope.",
      npcRoles: ["Stowaway", "Harbor Informant"],
      exitLabels: [
        "Back through the tavern's rear door",
        "Climb the service ladder toward the lighthouse",
      ],
      itemLabels: ["A sealed letter tucked behind a crate"],
    },
    [SCENE_LIGHTHOUSE_ID]: {
      name: "Lighthouse Top",
      description:
        "Wind screams around the gallery. Unit 7 stands motionless at the lamp, its single optical sensor tracking the horizon.",
      ambience: "Wind, the mechanical click of the lamp's rotating gears.",
      npcRoles: ["Lighthouse Keeper"],
      exitLabels: [
        "Back down the ladder",
        "Signal the last ship out",
        "Slip down the storm-lashed cliff path under cover of dark",
      ],
      itemLabels: [
        "A talisman wedged into a crack in the railing, only visible once the storm is really howling",
      ],
    },
    [SCENE_LAST_SHIP_ID]: {
      name: "The Last Ship Out",
      description:
        "The gangplank is still down. Marlow and Sable stand at the rail, waiting to see if you'd actually make it.",
      ambience: "Creaking rope, the low groan of a ship ready to leave port.",
      npcRoles: ["Captain", "Fellow Passenger"],
      exitLabels: [],
      itemLabels: [],
    },
  },
  [Locale.ZH]: {
    [SCENE_DOCKS_ID]: {
      name: "码头",
      description: "雨点砸在木板上。船只在缆绳间吱呀作响，灯笼的光晕在湿滑的木板上晕开。",
      ambience: "咸湿的空气，远处的雾角声，水拍打在桩柱上的声响。",
      npcRoles: ["港务船长"],
      exitLabels: ["躲进酒馆避雨"],
      itemLabels: [],
    },
    [SCENE_TAVERN_ID]: {
      name: "雨夜酒馆",
      description: "低矮的屋顶下烟斗烟雾缭绕。墨鸦坐在吧台尽头，慢慢喝着什么深色的东西。",
      ambience: "吱呀作响的地板，角落里安静下来的一局牌。",
      npcRoles: ["秘密的账本"],
      exitLabels: ["回到码头", "从后门溜出去"],
      itemLabels: [],
    },
    [SCENE_WAREHOUSE_ID]: {
      name: "货仓后巷",
      description: "箱子堆得比人还高，大多已经受潮变软。最近的一堆后面，有什么——有个人——动了一下。",
      ambience: "房梁上的老鼠，焦油和旧绳索的气味。",
      npcRoles: ["偷渡者", "港口线人"],
      exitLabels: ["从酒馆后门回去", "爬上通向灯塔的检修梯"],
      itemLabels: ["一封塞在箱子后面的封蜡信件"],
    },
    [SCENE_LIGHTHOUSE_ID]: {
      name: "灯塔顶",
      description: "风在回廊间呼啸。7号单元一动不动地站在灯前，唯一的光学传感器追踪着地平线。",
      ambience: "风声，灯具旋转齿轮的机械咔哒声。",
      npcRoles: ["灯塔看守人"],
      exitLabels: ["爬下梯子", "向最后一班船发出信号", "趁夜色或风暴，沿着悬崖上的雨中小路溜下去"],
      itemLabels: ["卡在栏杆缝隙里的一枚护身符，只有风暴真正咆哮起来才会露出来"],
    },
    [SCENE_LAST_SHIP_ID]: {
      name: "最后一班船",
      description: "跳板还没收起。马洛和墨鸦站在船舷边，等着看你到底能不能赶上。",
      ambience: "绳索的吱呀声，船只准备离港时低沉的呻吟声。",
      npcRoles: ["船长", "同行的乘客"],
      exitLabels: [],
      itemLabels: [],
    },
  },
};

export const getSceneText = (sceneId: SceneId, locale: Locale): SceneText | undefined =>
  sceneTextByLocale[locale]?.[sceneId] ?? starshipSceneTextByLocale[locale]?.[sceneId];
