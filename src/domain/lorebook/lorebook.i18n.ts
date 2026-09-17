import { Locale } from "@app/locales";
import { LorebookId } from "./lorebook";
import { STARSHIP_LOREBOOK_ID, BLACKTIDE_LOREBOOK_ID } from "./lorebook.mock";

// The translatable slice of a Lorebook: its name/description and each
// entry's name/content, matched positionally to lorebooksMock's entries
// array (order must stay in sync with lorebook.mock.ts).
export interface LorebookText {
  name: string;
  description: string;
  entryTexts: { name: string; content: string }[];
}

export const lorebookTextByLocale: Record<Locale, Record<LorebookId, LorebookText>> = {
  [Locale.EN]: {
    [STARSHIP_LOREBOOK_ID]: {
      name: "The Wayfinder (starship)",
      description:
        "World facts about the research vessel Nova calls home — its crew, its quirks, its history.",
      entryTexts: [
        {
          name: "The Wayfinder",
          content:
            "The Wayfinder is a third-generation deep-space research vessel, six years into a survey mission with no scheduled return date. It has a small crew and an unusually chatty onboard AI.",
        },
        {
          name: "Ion Drive",
          content:
            "The ship's ion drive hums audibly through the hull at full burn — crew have learned to tell its moods from the pitch of the sound.",
        },
        {
          name: "Standing orders",
          content:
            "Standing orders aboard the Wayfinder: no hostile first contact, log every anomaly, and Nova has full authority to override manual control in an emergency.",
        },
      ],
    },
    [BLACKTIDE_LOREBOOK_ID]: {
      name: "Blacktide Harbor (noir city)",
      description:
        "The rain-soaked city where Sable works — its districts, its underworld, its unspoken rules.",
      entryTexts: [
        {
          name: "Blacktide Harbor",
          content:
            "Blacktide Harbor is a port city that hasn't seen a dry week in a decade. Money moves through the docks faster than the law can follow it.",
        },
        {
          name: "The Ledger Club",
          content:
            "The Ledger Club is a members-only bar where half the city's real business gets done over watered-down whiskey.",
        },
      ],
    },
  },
  [Locale.ZH]: {
    [STARSHIP_LOREBOOK_ID]: {
      name: "星舟号（飞船）",
      description: "关于星芒所在的科研飞船的世界设定——它的船员、怪癖和历史。",
      entryTexts: [
        {
          name: "星舟号",
          content:
            "星舟号是第三代深空科研飞船，已执行了六年勘测任务，没有既定归期。船员不多，但船载 AI 出了名地话多。",
        },
        {
          name: "离子引擎",
          content:
            "飞船的离子引擎全速运转时能透过船体听见嗡鸣声——船员已经能从声音的音调分辨引擎的“心情”。",
        },
        {
          name: "常驻守则",
          content:
            "星舟号的常驻守则：禁止主动敌意接触，任何异常都必须记录在案，紧急情况下星芒拥有完全的手动override权限。",
        },
      ],
    },
    [BLACKTIDE_LOREBOOK_ID]: {
      name: "黑潮港（黑色都市）",
      description: "墨鸦所在的雨城设定——它的街区、地下势力和不成文的规矩。",
      entryTexts: [
        {
          name: "黑潮港",
          content:
            "黑潮港是一座十年没见过干燥周的港口城市。钱在码头上流动的速度，比法律追得上的还快。",
        },
        {
          name: "账本俱乐部",
          content: "账本俱乐部是一家会员制酒吧，这座城市一半真正的生意都在这里就着掺水威士忌谈成。",
        },
      ],
    },
  },
};

export const getLorebookText = (lorebookId: LorebookId, locale: Locale): LorebookText | undefined =>
  lorebookTextByLocale[locale]?.[lorebookId];
