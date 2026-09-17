// buildQuickActions: a pure function that assembles the contextual "say
// this" chips shown under a chat window, from four real sources — never
// randomized, never a decorative canned list. See quick-action.ts for the
// output shape.

import { CharacterId } from "@domain/character";
import { Quest, QuestObjective } from "@domain/quest";
import { PlayerProgress } from "@domain/player-progress";
import { Lorebook } from "@domain/lorebook";
import { Locale } from "@app/locales";
import { QuickAction, QuickPhrase } from "./quick-action";

const DEFAULT_MAX_ACTIONS = 8;

// i18n-free templates, keyed by locale — kept here (not in en.ts/zh.ts)
// because they're plugged with a keyword and must be asserted to still
// contain it; a translation-layer lookup miss would silently drop that
// guarantee. Mirrors the pattern already used for scripted reply pools.
const QUEST_KEYWORD_TEMPLATE: Record<Locale, (keyword: string) => string> = {
  [Locale.EN]: (keyword) => `What do you know about ${keyword}?`,
  [Locale.ZH]: (keyword) => `关于${keyword}，你知道些什么？`,
};

const LORE_KEYWORD_TEMPLATE: Record<Locale, (keyword: string) => string> = {
  [Locale.EN]: (keyword) => `Tell me about ${keyword}.`,
  [Locale.ZH]: (keyword) => `跟我说说${keyword}吧。`,
};

const GENERIC_TEMPLATES: Record<
  Locale,
  { greet: string; askMore: string; askQuest: (name: string) => string; farewell: string }
> = {
  [Locale.EN]: {
    greet: "Hey there.",
    askMore: "Anything else?",
    askQuest: (name) => `Is there anything I can help you with, ${name}?`,
    farewell: "I should get going.",
  },
  [Locale.ZH]: {
    greet: "你好呀。",
    askMore: "还有别的事吗？",
    askQuest: (name) => `${name}，有什么我能帮上忙的吗？`,
    farewell: "我该走了。",
  },
};

const isObjectiveIncomplete = (
  progress: PlayerProgress,
  questId: string,
  objectiveId: string
): boolean => {
  const state = progress.questStates[questId];
  if (!state || state.status !== "active") return false;
  return (state.objectiveProgress[objectiveId] ?? 0) < 1;
};

// Builds the questKeyword chips: one per active quest's incomplete
// sayKeyword objective, scoped to the NPC currently being talked to when
// the objective names one. Guarantees `text` contains `keyword` — this is
// the single most important correctness property of the whole feature: a
// chip whose sentence doesn't actually contain the keyword advances
// nothing when clicked.
const buildQuestKeywordActions = (args: {
  quests: Quest[];
  progress: PlayerProgress;
  npcCharacterId: CharacterId | undefined;
  locale: Locale;
}): QuickAction[] => {
  const { quests, progress, npcCharacterId, locale } = args;
  const template = QUEST_KEYWORD_TEMPLATE[locale] ?? QUEST_KEYWORD_TEMPLATE[Locale.EN];
  const actions: QuickAction[] = [];

  quests.forEach((quest) => {
    quest.objectives.forEach((objective: QuestObjective) => {
      if (objective.kind !== "sayKeyword") return;
      if (objective.characterId && objective.characterId !== npcCharacterId) return;
      if (!isObjectiveIncomplete(progress, quest.id, objective.id)) return;

      const keyword = objective.keywords[0];
      if (!keyword) return;
      let text = template(keyword);
      // Self-check: the generated sentence must actually contain the
      // keyword. If a future locale's template loses it, fall back to a
      // bare reference rather than shipping a broken chip.
      if (!text.toLowerCase().includes(keyword.toLowerCase())) {
        text = keyword;
      }

      actions.push({
        id: `quest:${quest.id}:${objective.id}`,
        label: objective.label,
        text,
        source: "questKeyword",
        questId: quest.id,
        objectiveId: objective.id,
        keyword,
      });
    });
  });

  return actions;
};

// Builds the "authored" chips: creator-configured phrases on the scene or
// on the specific NPC, filtered by their optional condition.
const buildAuthoredActions = (args: {
  scenePhrases: QuickPhrase[] | undefined;
  npcPhrases: QuickPhrase[] | undefined;
  evaluate: (phrase: QuickPhrase) => boolean;
}): QuickAction[] => {
  const { scenePhrases, npcPhrases, evaluate } = args;
  const all = [...(npcPhrases ?? []), ...(scenePhrases ?? [])];
  return all
    .filter((phrase) => (phrase.condition ? evaluate(phrase) : true))
    .map((phrase) => ({
      id: `authored:${phrase.id}`,
      label: phrase.label,
      text: phrase.text,
      source: "authored" as const,
    }));
};

// Builds the loreKeyword chips: one per enabled, non-constant lorebook
// entry bound to this scene/world, taking each entry's first keyword,
// ranked by priority, capped at 3, excluding keywords already covered by a
// questKeyword chip (avoids showing the same word twice with two purposes).
const buildLoreKeywordActions = (args: {
  lorebooks: Lorebook[];
  excludeKeywords: Set<string>;
  locale: Locale;
  maxLoreActions?: number;
}): QuickAction[] => {
  const { lorebooks, excludeKeywords, locale, maxLoreActions = 3 } = args;
  const template = LORE_KEYWORD_TEMPLATE[locale] ?? LORE_KEYWORD_TEMPLATE[Locale.EN];

  const entries = lorebooks
    .flatMap((lb) => lb.entries)
    .filter((entry) => entry.enabled && !entry.constant && entry.keywords.length > 0)
    .sort((a, b) => b.priority - a.priority);

  const seen = new Set<string>();
  const actions: QuickAction[] = [];

  for (const entry of entries) {
    const keyword = entry.keywords[0];
    if (!keyword) continue;
    const normalized = keyword.toLowerCase();
    if (excludeKeywords.has(normalized) || seen.has(normalized)) continue;
    seen.add(normalized);

    let text = template(keyword);
    if (!text.toLowerCase().includes(normalized)) text = keyword;

    actions.push({
      id: `lore:${entry.id}`,
      label: entry.name,
      text,
      source: "loreKeyword",
      keyword,
    });
    if (actions.length >= maxLoreActions) break;
  }

  return actions;
};

// Builds the four generic conversational chips — always available,
// weakest visual priority, fills remaining slots.
const buildGenericActions = (args: {
  npcName: string | undefined;
  locale: Locale;
}): QuickAction[] => {
  const { npcName, locale } = args;
  const t = GENERIC_TEMPLATES[locale] ?? GENERIC_TEMPLATES[Locale.EN];
  const actions: QuickAction[] = [
    { id: "generic:greet", label: t.greet, text: t.greet, source: "generic" as const },
    { id: "generic:ask-more", label: t.askMore, text: t.askMore, source: "generic" as const },
  ];
  // askQuest names the NPC directly ("Nova, is there anything..."), which
  // only makes sense with a single conversation partner. Group chat has no
  // one npcName, so omit it rather than render a malformed sentence with a
  // leading comma / empty name.
  if (npcName) {
    actions.push({
      id: "generic:ask-quest",
      label: t.askQuest(npcName),
      text: t.askQuest(npcName),
      source: "generic" as const,
    });
  }
  actions.push({
    id: "generic:farewell",
    label: t.farewell,
    text: t.farewell,
    source: "generic" as const,
  });
  return actions;
};

export const buildQuickActions = (args: {
  npcCharacterId?: CharacterId;
  npcName?: string;
  scenePhrases?: QuickPhrase[];
  npcPhrases?: QuickPhrase[];
  evaluatePhraseCondition?: (phrase: QuickPhrase) => boolean;
  quests: Quest[];
  progress: PlayerProgress;
  lorebooks: Lorebook[];
  locale: Locale;
  maxActions?: number;
}): QuickAction[] => {
  const {
    npcCharacterId,
    npcName,
    scenePhrases,
    npcPhrases,
    evaluatePhraseCondition,
    quests,
    progress,
    lorebooks,
    locale,
    maxActions = DEFAULT_MAX_ACTIONS,
  } = args;

  const questActions = buildQuestKeywordActions({
    quests,
    progress,
    npcCharacterId,
    locale,
  });

  const authoredActions = evaluatePhraseCondition
    ? buildAuthoredActions({
        scenePhrases,
        npcPhrases,
        evaluate: evaluatePhraseCondition,
      })
    : [];

  const excludeKeywords = new Set(
    questActions.map((a) => a.keyword?.toLowerCase()).filter((k): k is string => Boolean(k))
  );
  const loreActions = buildLoreKeywordActions({
    lorebooks,
    excludeKeywords,
    locale,
  });

  const genericActions = buildGenericActions({ npcName, locale });

  // Priority order: quest → authored → lore → generic, filled to maxActions.
  const ordered = [...questActions, ...authoredActions, ...loreActions, ...genericActions];
  return ordered.slice(0, maxActions);
};
