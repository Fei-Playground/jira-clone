import { Locale } from "@app/locales";
import { QuestId } from "./quest";
import { QuestText } from "./quest.i18n";
import {
  QUEST_SENSOR_GHOST_ID,
  QUEST_COOLANT_LEAK_ID,
  QUEST_THE_SIGNAL_ID,
} from "../story/starship-story.ids";

export const starshipQuestTextByLocale: Record<Locale, Record<QuestId, QuestText>> = {
  [Locale.EN]: {
    [QUEST_SENSOR_GHOST_ID]: {
      title: "The Sensor Ghost",
      description:
        "Nova's sensors keep flagging a blip that vanishes every time anyone looks straight at it. She wants a second pair of eyes — Marlow's, specifically.",
      objectiveLabels: ["Ask Captain Marlow about the sensor readings"],
    },
    [QUEST_COOLANT_LEAK_ID]: {
      title: "Coolant Leak",
      description:
        "Turns out the blip was a red herring — but Marlow found a real problem while looking: a slow coolant leak. Find a spare canister before the drive overheats.",
      objectiveLabels: ["Find a spare coolant canister"],
    },
    [QUEST_THE_SIGNAL_ID]: {
      title: "The Signal",
      description:
        'Unit 7 has been quietly logging an anomalous signal for days. Bring the log to Nova and mention it directly — she\'ll want to hear the word "signal."',
      objectiveLabels: ["Tell Nova about the signal", "Reach the observation deck"],
    },
  },
  [Locale.ZH]: {
    [QUEST_SENSOR_GHOST_ID]: {
      title: "传感器幽灵",
      description:
        "星芒的传感器一直在报一个光点，可每次有人正眼去看它就消失了。她想找个人帮忙确认——具体来说，是马洛。",
      objectiveLabels: ["去问马洛船长关于传感器读数的事"],
    },
    [QUEST_COOLANT_LEAK_ID]: {
      title: "冷却剂泄漏",
      description:
        "那个光点原来是虚惊一场——但马洛在查看时发现了真正的问题：一处缓慢的冷却剂泄漏。得在引擎过热前找到一罐备用的。",
      objectiveLabels: ["找到一罐备用冷却剂"],
    },
    [QUEST_THE_SIGNAL_ID]: {
      title: "信号",
      description:
        "7号单元已经悄悄记录了好几天一个异常信号。把日志带给星芒，并直接跟她提一句——她想听到「信号」这两个字。",
      objectiveLabels: ["告诉星芒关于信号的事", "抵达观景台"],
    },
  },
};
