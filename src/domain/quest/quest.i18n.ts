import { Locale } from "@app/locales";
import { QuestId } from "./quest";
import {
  QUEST_ASK_AROUND_ID,
  QUEST_BRASS_KEY_ID,
  QUEST_DELIVER_LETTER_ID,
  QUEST_REPORT_SMUGGLING_ID,
  QUEST_FENCE_THE_GOODS_ID,
} from "../story/blacktide-story.ids";
import { starshipQuestTextByLocale } from "./starship-quest.i18n";

// objectiveLabels is matched positionally to quest.mock.ts's objectives
// array (order must stay in sync).
export interface QuestText {
  title: string;
  description: string;
  objectiveLabels: string[];
}

export const questTextByLocale: Record<Locale, Record<QuestId, QuestText>> = {
  [Locale.EN]: {
    [QUEST_ASK_AROUND_ID]: {
      title: "Ask Around the Docks",
      description:
        "The captain won't say much, but somebody at the tavern will talk if you buy them a drink.",
      objectiveLabels: ["Talk to Sable at the tavern"],
    },
    [QUEST_BRASS_KEY_ID]: {
      title: "The Brass Key",
      description:
        "Sable says the warehouse door only opens for whoever's holding the harbor master's brass key. Find it.",
      objectiveLabels: ["Get the brass key from Sable"],
    },
    [QUEST_DELIVER_LETTER_ID]: {
      title: "Deliver the Sealed Letter",
      description:
        "The stowaway in the warehouse begs you to get a sealed letter to the lighthouse keeper — no questions asked.",
      objectiveLabels: ["Reach the lighthouse top", "Hand the letter to Unit 7"],
    },
    [QUEST_REPORT_SMUGGLING_ID]: {
      title: "Report the Smuggling Ring",
      description:
        "That brass key opens a door that shouldn't exist. The harbor guard at the docks would pay well to know about it.",
      objectiveLabels: ["Tell Captain Marlow about the warehouse door"],
    },
    [QUEST_FENCE_THE_GOODS_ID]: {
      title: "Help Fence the Goods",
      description:
        "Sable knows exactly what's behind that door, and exactly who'd pay to make it disappear quietly. Help her move it.",
      objectiveLabels: ["Tell Sable you're in"],
    },
  },
  [Locale.ZH]: {
    [QUEST_ASK_AROUND_ID]: {
      title: "在码头上打听消息",
      description: "船长不肯多说，但酒馆里有人只要你请一杯酒，就愿意开口。",
      objectiveLabels: ["去酒馆找墨鸦谈谈"],
    },
    [QUEST_BRASS_KEY_ID]: {
      title: "铜钥匙",
      description: "墨鸦说货仓的门只对持有港务长铜钥匙的人开放。去找到它。",
      objectiveLabels: ["从墨鸦那里拿到铜钥匙"],
    },
    [QUEST_DELIVER_LETTER_ID]: {
      title: "送出封蜡信件",
      description: "货仓里的偷渡者求你把一封封蜡信件送到灯塔看守人手上——别多问。",
      objectiveLabels: ["抵达灯塔顶", "把信交给7号单元"],
    },
    [QUEST_REPORT_SMUGGLING_ID]: {
      title: "举报走私网络",
      description:
        "那把铜钥匙能打开的那道门本不应该存在。码头的港务卫队会为这个消息付一笔不小的钱。",
      objectiveLabels: ["把货仓那道门的事告诉马洛船长"],
    },
    [QUEST_FENCE_THE_GOODS_ID]: {
      title: "帮忙销赃",
      description: "墨鸦清楚那道门后面藏的是什么，以及谁会出钱让它静静消失。帮她把这些货运出去。",
      objectiveLabels: ["告诉墨鸦你愿意接这个活"],
    },
  },
};

export const getQuestText = (questId: QuestId, locale: Locale): QuestText | undefined =>
  questTextByLocale[locale]?.[questId] ?? starshipQuestTextByLocale[locale]?.[questId];
