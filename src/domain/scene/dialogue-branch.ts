// Real content branching driven by a dialogue choice's flag \u2014 not a quest,
// not decoration. Once the player picks a DialogueChoice (see scene.ts) and
// its flag lands on progress.flags, an NPC's SUBSEQUENT reply can read that
// flag and say something genuinely different. This module is the one place
// that mapping lives for the Blacktide informant scenario: talking to
// Corvin (sell out Wisp / warn him) changes what BOTH Corvin and Wisp say
// afterward, for the rest of the run.

import { Locale } from "@app/locales";
import { CharacterId } from "@domain/character";
import { PlayerProgress } from "@domain/player-progress";
import { FLAG_SOLD_OUT_WISP, FLAG_PROTECTED_WISP } from "@domain/story";

// DialogueChoice label/line, localized by choice id — same shape as the
// other keyed i18n lookups in this domain (getSceneText, getQuestText).
const DIALOGUE_CHOICE_TEXT: Record<string, Record<Locale, { label: string; line: string }>> = {
  "choice-sell-out-wisp": {
    [Locale.EN]: {
      label: "Sell him Wisp's location",
      line: "There's a stowaway hiding in the crates behind the tavern. What's that worth to you?",
    },
    [Locale.ZH]: {
      label: "把微光的位置卖给他",
      line: "酒馆后面的箱子里藏了个偷渡者。这个消息对你来说值几个钱？",
    },
  },
  "choice-protect-wisp": {
    [Locale.EN]: {
      label: "Refuse, and warn Wisp about him",
      line: "Whatever you're paying for names, I'm not selling anyone out. And I'd steer clear of these crates if I were you.",
    },
    [Locale.ZH]: {
      label: "拒绝，并去警告微光",
      line: "你花多少钱买人名都与我无关，我不会卖任何人。换作我，我会离这些箱子远一点。",
    },
  },
};

export const getDialogueChoiceText = (
  choiceId: string,
  locale: Locale
): { label: string; line: string } | undefined => DIALOGUE_CHOICE_TEXT[choiceId]?.[locale];

export const getBranchedGreeting = (
  characterId: CharacterId,
  characterName: string,
  progress: PlayerProgress,
  locale: Locale
): string | undefined => {
  const soldOut = progress.flags.includes(FLAG_SOLD_OUT_WISP);
  const protected_ = progress.flags.includes(FLAG_PROTECTED_WISP);
  if (!soldOut && !protected_) return undefined;

  // Corvin, the informant \u2014 grateful if paid for the information, cold and
  // wary once he realizes the tip never paid off (the player warned Wisp
  // instead, so nobody came for him).
  if (characterName === "Corvin" || characterName === "\u79d1\u6587") {
    if (soldOut) {
      return locale === Locale.ZH
        ? "\u90a3\u4ef6\u4e8b\u4e4b\u540e\uff0c\u6211\u4eec\u7684\u4ea4\u6613\u5c31\u7ed3\u4e86\u3002\u4f60\u62ff\u4e86\u94b1\uff0c\u6211\u62ff\u4e86\u60c5\u62a5\u3002\u8fd8\u6709\u4ec0\u4e48\u9700\u8981\u2014\u2014\u63d0\u524d\u8bf4\uff0c\u8981\u4ed8\u94b1\u3002"
        : "Our business concluded the moment I got what I paid for. You've got your coin, I've got my tip. Anything else costs extra.";
    }
    return locale === Locale.ZH
      ? "\u2026\u2026\u4f60\u628a\u4e8b\u60c5\u6cc4\u51fa\u53bb\u4e86\u3002\u6211\u672c\u6765\u4ee5\u4e3a\u4f60\u4e0d\u4f1a\u3002\u73b0\u5728\u6ca1\u4eba\u4f1a\u518d\u76f8\u4fe1\u4f60\u624b\u4e0a\u7684\u60c5\u62a5\u4e86\u2014\u2014\u5305\u62ec\u6211\u3002"
      : "...You went and warned him. I thought you'd take the deal. Nobody trusts a tip from your hand now — myself included.";
  }

  // Wisp, the stowaway \u2014 fearful and guarded if betrayed, warmer and more
  // forthcoming if protected (real gratitude, not a cosmetic label change).
  if (characterName === "Wisp" || characterName === "\u5fae\u5149") {
    if (soldOut) {
      return locale === Locale.ZH
        ? "\uff08\u4f60\u8fd8\u6ca1\u5f00\u53e3\uff0c\u5fae\u5149\u5c31\u5df2\u7ecf\u9000\u5230\u4e86\u7bb1\u5b50\u6700\u6df1\u5904\uff09\u4f60\u8ddf\u90a3\u4e2a\u9ec4\u5c40\u81ea\u65b0\u90fd\u8bf4\u4e86\u4e9b\u4ec0\u4e48\u2026\u2026\u6211\u80fd\u611f\u5b50\u5230\u3002\u522b\u518d\u9760\u8fd1\u4e86\u3002"
        : "(Wisp is already backing into the deepest shadow of the crates before you speak.) You told him something. I can feel it in you. Don't come closer.";
    }
    return locale === Locale.ZH
      ? "\u4f60\u672c\u53ef\u4ee5\u5356\u4e86\u6211\u2014\u2014\u4f46\u4f60\u6ca1\u3002\u8fd9\u6bd4\u4efb\u4f55\u62a5\u916c\u90fd\u91cd\u3002\u4ee5\u540e\u6211\u77e5\u9053\u7684\u4e8b\uff0c\u4f60\u4f1a\u6bd4\u5176\u4ed6\u4eba\u65e9\u4e00\u6b65\u542c\u5230\u3002"
      : "You could have sold me out — and didn't. That's worth more than any payment. Whatever I learn from here, you'll hear it before anyone else does.";
  }

  return undefined;
};
