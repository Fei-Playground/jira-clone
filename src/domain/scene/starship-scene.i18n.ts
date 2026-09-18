import { Locale } from "@app/locales";
import { SceneId } from "./scene";
import { SceneText } from "./scene.i18n";
import {
  SCENE_BRIDGE_ID,
  SCENE_ENGINE_ROOM_ID,
  SCENE_MED_BAY_ID,
  SCENE_OBSERVATION_DECK_ID,
} from "../story/starship-story.ids";

export const starshipSceneTextByLocale: Record<Locale, Record<SceneId, SceneText>> = {
  [Locale.EN]: {
    [SCENE_BRIDGE_ID]: {
      name: "The Bridge",
      description:
        "Soft blue light from the nav console washes over the empty command chairs. Nova's projection flickers near the main viewport, watching a blip that shouldn't be there.",
      ambience: "The low hum of the ion drive, a console chime every few seconds.",
      npcRoles: ["Onboard AI"],
      exitLabels: [
        "Head down to the engine room",
        "Take the side corridor to the observation deck",
      ],
      itemLabels: [],
    },
    [SCENE_ENGINE_ROOM_ID]: {
      name: "Engine Room",
      description:
        "Captain Marlow is elbow-deep in an access panel, muttering about superstitions and coolant pressure in the same breath.",
      ambience: "The rhythmic thud of the ion drive, a faint hiss of escaping gas.",
      npcRoles: ["Chief Engineer"],
      exitLabels: ["Back up to the bridge", "Cut through to the med bay"],
      itemLabels: ["A spare coolant canister, wedged behind a conduit"],
    },
    [SCENE_MED_BAY_ID]: {
      name: "Med Bay",
      description:
        "Unit 7 stands vigil beside a diagnostic bed nobody's using, quietly cataloguing dust motes in the recycled air.",
      ambience: "The faint beep of an idle monitor, sterile and still.",
      npcRoles: ["Medical Assistant Unit", "Galley Trader"],
      exitLabels: [
        "Back to the engine room",
        "Up to the observation deck",
        "Slip up during the night shift, when the deck is quiet enough to watch the signal alone",
      ],
      itemLabels: ["A signal log Unit 7 has been quietly compiling"],
    },
    [SCENE_OBSERVATION_DECK_ID]: {
      name: "Observation Deck",
      description:
        "The whole crew has gathered at the viewport. Whatever that signal is, it's close now — close enough to see with the naked eye.",
      ambience: "Hushed voices, the vast quiet of open space pressing against the glass.",
      npcRoles: ["Onboard AI", "Chief Engineer", "Medical Assistant Unit"],
      exitLabels: [],
      itemLabels: [],
    },
  },
  [Locale.ZH]: {
    [SCENE_BRIDGE_ID]: {
      name: "舰桥",
      description:
        "导航台的柔蓝灯光洒在空荡的指挥椅上。星芒的投影在主观测窗附近闪烁，盯着一个不该出现的光点。",
      ambience: "离子引擎的低鸣，控制台每隔几秒响一次提示音。",
      npcRoles: ["船载AI"],
      exitLabels: ["下到引擎室", "沿侧廊前往观景台"],
      itemLabels: [],
    },
    [SCENE_ENGINE_ROOM_ID]: {
      name: "引擎室",
      description: "马洛船长的手臂整个探进检修面板里，一边嘟囔着迷信说法，一边念叨着冷却剂压力。",
      ambience: "离子引擎有节奏的闷响，隐约的漏气嘶声。",
      npcRoles: ["首席工程师"],
      exitLabels: ["回到舰桥", "抄近路去医疗舱"],
      itemLabels: ["卡在管道后面的一罐备用冷却剂"],
    },
    [SCENE_MED_BAY_ID]: {
      name: "医疗舱",
      description: "7号单元静静守在一张没人用的诊断床边，安静地记录着回收空气中的尘埃。",
      ambience: "闲置监视器的微弱哔哔声，无菌而静止。",
      npcRoles: ["医疗辅助单元", "厨房交易商"],
      exitLabels: [
        "回到引擎室",
        "上到观景台",
        "趁夜班时段溜上去，那时观景台够安静，可以独自看看那个信号",
      ],
      itemLabels: ["7号单元一直在悄悄整理的信号日志"],
    },
    [SCENE_OBSERVATION_DECK_ID]: {
      name: "观景台",
      description: "全体船员都聚在观测窗前。不管那个信号是什么，现在已经近到肉眼可见了。",
      ambience: "压低的说话声，太空的浩瀚寂静紧贴着玻璃。",
      npcRoles: ["船载AI", "首席工程师", "医疗辅助单元"],
      exitLabels: [],
      itemLabels: [],
    },
  },
};
