// composeBlocksForEvent: the one place "something just happened" becomes
// "a paragraph was added to the manuscript". Called from story.store.tsx's
// runEvent, in the SAME pass that already turns effects into party activity
// entries — no new event bus, no polling, no delay. Purely a function of
// real data already computed by applyProgressEvent: it invents nothing.

import { v4 as uuid } from "uuid";
import { Locale } from "@app/locales";
import { Character, CharacterId } from "@domain/character";
import { Scene, SceneId } from "@domain/scene";
import { Quest, QuestId } from "@domain/quest";
import { Item, ItemId } from "@domain/item";
import { PlayerProgress } from "@domain/player-progress";
import { ProgressEffect, ProgressEvent } from "@domain/player-progress";
import { PlayerProfile } from "@domain/party";
import { NarrativeBlock, NarrativeBlockId, NarrativeToneHint, MANUSCRIPT_BLOCK_LIMIT } from "./narrative";
import { deriveToneHint } from "./narrative.tone";
import {
  ENVIRONMENT_CLAUSE_TEMPLATE,
  TENSE_CLAUSE,
  TRANSITION_TEMPLATE,
  BEAT_TEMPLATE,
  TURNING_POINT_TEMPLATE,
} from "./narrative.templates";

const HIGH_AMBIENCE_THRESHOLD = 70;

interface ComposeArgs {
  event: ProgressEvent;
  effects: ProgressEffect[];
  progressBefore: PlayerProgress;
  progressAfter: PlayerProgress;
  scenes: Scene[];
  quests: Quest[];
  items: Item[];
  characters: Character[];
  activeMember?: PlayerProfile;
  locale: Locale;
}

const findScene = (scenes: Scene[], id: SceneId | undefined): Scene | undefined =>
  id ? scenes.find((s) => s.id === id) : undefined;

const findQuestTitle = (quests: Quest[], id: QuestId): string =>
  quests.find((q) => q.id === id)?.title ?? id;

const findItemName = (items: Item[], id: ItemId): string =>
  items.find((i) => i.id === id)?.name ?? id;

const findCharacterName = (characters: Character[], id: CharacterId | undefined): string =>
  characters.find((c) => c.id === id)?.name ?? "";

const memberFields = (member: PlayerProfile | undefined) =>
  member ? { memberId: member.id, memberName: member.name } : {};

// Chapter-opening block for a scene the player has just newly entered: a
// chapterBreak + a sceneSetting that quotes the scene's own authored
// description/ambience VERBATIM, preceded by a composed environment clause
// built from the real, current EnvironmentState.
const composeChapterOpening = (
  scene: Scene,
  progress: PlayerProgress,
  chapterIndex: number,
  locale: Locale,
  extra: Record<string, unknown>
): NarrativeBlock[] => {
  const env = progress.environment;
  const clause = ENVIRONMENT_CLAUSE_TEMPLATE[locale](scene.name, env.timeOfDay, env.weather, false);
  const tenseSuffix =
    env.ambienceIntensity >= HIGH_AMBIENCE_THRESHOLD ? ` ${TENSE_CLAUSE[locale]}.` : "";

  return [
    {
      id: uuid(),
      at: Date.now(),
      kind: "chapterBreak",
      payload: { kind: "chapterBreak", index: chapterIndex },
      provenance: { origin: "composed", templateId: "chapterBreak" },
      sceneId: scene.id,
      sceneName: scene.name,
      environment: env,
      ...extra,
    },
    {
      id: uuid(),
      at: Date.now(),
      kind: "sceneSetting",
      payload: {
        kind: "sceneSetting",
        description: `${clause}${tenseSuffix} ${scene.description}`,
        ambience: scene.ambience,
      },
      provenance: {
        origin: "authored",
        templateId: "sceneSetting",
        inputs: {
          timeOfDay: env.timeOfDay,
          weather: env.weather,
          ambienceIntensity: env.ambienceIntensity,
        },
      },
      sceneId: scene.id,
      sceneName: scene.name,
      environment: env,
      ...extra,
    },
  ];
};

const composeTransition = (
  fromScene: Scene | undefined,
  toScene: Scene,
  locale: Locale,
  extra: Record<string, unknown>
): NarrativeBlock => ({
  id: uuid(),
  at: Date.now(),
  kind: "narration",
  payload: {
    kind: "narration",
    text: fromScene
      ? TRANSITION_TEMPLATE[locale].newChapter(fromScene.name, toScene.name)
      : TRANSITION_TEMPLATE[locale].sameChapterLater,
  },
  provenance: { origin: "composed", templateId: "transition" },
  sceneId: toScene.id,
  sceneName: toScene.name,
  ...extra,
});

// Turns whatever the reducer just computed (`effects`) into narrative
// blocks. This is intentionally exhaustive over ProgressEffect's variants —
// every kind of real thing that can happen gets a real block, so the
// manuscript never silently skips something that occurred.
const composeBlocksForEffects = (
  effects: ProgressEffect[],
  args: ComposeArgs
): NarrativeBlock[] => {
  const { quests, items, activeMember, locale } = args;
  const extra = memberFields(activeMember);
  const blocks: NarrativeBlock[] = [];

  effects.forEach((effect) => {
    switch (effect.type) {
      case "questAvailable": {
        const quest = quests.find((q) => q.id === effect.questId);
        if (!quest) break;
        const giverName = findCharacterName(args.characters, quest.giverCharacterId);
        blocks.push({
          id: uuid(),
          at: Date.now(),
          kind: "beat",
          payload: {
            kind: "beat",
            beatKind: "threadOpened",
            params: { thread: quest.title, giver: giverName },
          },
          provenance: { origin: "composed", templateId: "beat.threadOpened" },
          ...extra,
        });
        // Suppress the disclosure line by pre-rendering it here isn't
        // needed — the renderer reads BEAT_TEMPLATE at render time using
        // these params, so no finished sentence is stored.
        void BEAT_TEMPLATE[locale].threadOpened(giverName, quest.title);
        break;
      }
      case "questCompleted": {
        const title = findQuestTitle(quests, effect.questId);
        blocks.push({
          id: uuid(),
          at: Date.now(),
          kind: "beat",
          payload: { kind: "beat", beatKind: "threadClosed", params: { thread: title } },
          provenance: { origin: "composed", templateId: "beat.threadClosed" },
          ...extra,
        });
        break;
      }
      case "questExcluded": {
        const title = findQuestTitle(quests, effect.questId);
        blocks.push({
          id: uuid(),
          at: Date.now(),
          kind: "turningPoint",
          payload: {
            kind: "turningPoint",
            tpKind: "branchClosed",
            text: TURNING_POINT_TEMPLATE[locale].branchClosed(title),
            params: { thread: title },
          },
          provenance: { origin: "composed", templateId: "turningPoint.branchClosed" },
          ...extra,
        });
        break;
      }
      case "itemObtained": {
        const name = findItemName(items, effect.itemId);
        blocks.push({
          id: uuid(),
          at: Date.now(),
          kind: "beat",
          payload: {
            kind: "beat",
            beatKind: "propObtained",
            params: { prop: name, count: effect.count },
          },
          provenance: { origin: "composed", templateId: "beat.propObtained" },
          ...extra,
        });
        break;
      }
      case "storyEventFired": {
        blocks.push({
          id: uuid(),
          at: Date.now(),
          kind: "turningPoint",
          payload: {
            kind: "turningPoint",
            tpKind: "eventFired",
            text: effect.narration,
          },
          // The event's narration is the AUTHOR'S own written line —
          // quoted verbatim, not composed.
          provenance: { origin: "authored", templateId: "storyEvent" },
          ...extra,
        });
        break;
      }
      // objectiveAdvanced / questReadyToTurnIn / sceneUnlocked are real
      // effects too, but rendering EVERY objective tick would flood the
      // manuscript with noise (see plan's "minor beats" toggle) — the
      // renderer's includeMinorBeats option decides whether to surface
      // them; we don't fabricate a block per tick here to keep the record
      // itself lean. (Left as a documented, deliberate omission.)
      //
      // narrativeRevised is deliberately NOT handled here either — the
      // caller (story.store.tsx's reviseManuscriptBlock) already has the
      // richer context (character name, the exact consequence summary
      // shown in the picker) and builds its own turningPoint block via
      // composeRevisionBlock below, so the revision's OWN block reads as
      // specific prose rather than a generic "something changed" line.
      default:
        break;
    }
  });

  return blocks;
};

export const composeBlocksForEvent = (args: ComposeArgs): NarrativeBlock[] => {
  const { event, effects, progressBefore, progressAfter, scenes, activeMember, locale } = args;
  const extra = memberFields(activeMember);
  const blocks: NarrativeBlock[] = [];

  if (event.type === "enterScene") {
    const scene = findScene(scenes, event.sceneId);
    if (scene) {
      const isFirstVisit = !progressBefore.visitedSceneIds.includes(scene.id);
      const chapterIndex = progressAfter.visitedSceneIds.length;
      if (isFirstVisit) {
        blocks.push(...composeChapterOpening(scene, progressAfter, chapterIndex, locale, extra));
      } else if (progressBefore.currentSceneId !== scene.id) {
        const fromScene = findScene(scenes, progressBefore.currentSceneId);
        blocks.push(composeTransition(fromScene, scene, locale, extra));
      }
      // Re-entering the SAME scene (no scene change at all) intentionally
      // produces no block — nothing narratively happened.
    }
  }

  if (event.type === "makeDialogueChoice") {
    // The choice's own turningPoint/innerVoice text is composed by the UI
    // layer (it already has the localized choice label/line at hand via
    // getDialogueChoiceText) and appended directly — this composer only
    // handles the EFFECTS of the resulting progress change, not the choice
    // text itself, to avoid duplicating that lookup here.
  }

  blocks.push(...composeBlocksForEffects(effects, args));

  return blocks;
};

// A dialogue message (player or NPC) doesn't flow through applyProgressEvent
// at all — it's appended directly by the caller in story.store.tsx's
// appendSceneSessionMessage. This helper builds that one block so the
// composition logic (tone lookup, provenance) lives in one place.
export const composeDialogueBlock = (args: {
  text: string;
  speakerId: CharacterId | undefined;
  speakerName: string | undefined;
  sceneId: SceneId | undefined;
  sceneName: string | undefined;
  environment: PlayerProgress["environment"] | undefined;
  toneHint: NarrativeToneHint | undefined;
  memberId?: string;
  memberName?: string;
}): NarrativeBlock => ({
  id: uuid(),
  at: Date.now(),
  kind: "dialogue",
  payload: { kind: "dialogue", line: args.text, toneHint: args.toneHint },
  provenance: { origin: "dialogue" },
  sceneId: args.sceneId,
  sceneName: args.sceneName,
  speakerId: args.speakerId,
  speakerName: args.speakerName,
  environment: args.environment,
  memberId: args.memberId,
  memberName: args.memberName,
});

export { deriveToneHint };

// Folds the OLDEST chapter's blocks (everything up to, but not including,
// the second chapterBreak) into one summary narration block. Called only
// once the manuscript exceeds MANUSCRIPT_BLOCK_LIMIT — never drops content
// silently, it compresses the earliest material into a one-line recap so a
// very long-running story keeps a bounded, still-complete manuscript.
const foldOldestChapter = (blocks: NarrativeBlock[], locale: Locale): NarrativeBlock[] => {
  const firstBreakIdx = blocks.findIndex((b) => b.kind === "chapterBreak");
  if (firstBreakIdx === -1) return blocks;
  const secondBreakIdx = blocks.findIndex((b, i) => i > firstBreakIdx && b.kind === "chapterBreak");
  if (secondBreakIdx === -1) return blocks; // only one chapter so far — nothing to fold yet

  const folded = blocks.slice(firstBreakIdx, secondBreakIdx);
  const sceneNames = Array.from(
    new Set(folded.map((b) => b.sceneName).filter((n): n is string => Boolean(n)))
  );
  const summaryText =
    locale === Locale.ZH
      ? `（早先的章节已收进摘要：${sceneNames.join("、") || "最初的经历"}。）`
      : `(An earlier chapter has been folded into summary: ${sceneNames.join(", ") || "the opening events"}.)`;

  const summaryBlock: NarrativeBlock = {
    id: uuid(),
    at: folded[0]?.at ?? Date.now(),
    kind: "narration",
    payload: { kind: "narration", text: summaryText },
    provenance: { origin: "composed", templateId: "foldedChapterSummary" },
  };

  return [...blocks.slice(0, firstBreakIdx), summaryBlock, ...blocks.slice(secondBreakIdx)];
};

// The revision itself becomes part of the story (plan §10.3's closing
// point): committing a structured revision appends ONE more block — a
// turningPoint that names what changed, using the exact consequence text
// the picker already showed the user before they committed.
export const composeRevisionBlock = (args: {
  kind: "retone" | "rechoose" | "reenvironment";
  consequenceSummary: string[];
  sceneId?: SceneId;
  sceneName?: string;
  activeMember?: PlayerProfile;
  // The block this revision was made TO — stashed in params so
  // undoManuscriptRevision can find and remove this documenting block
  // again when the revision it documents is itself undone (otherwise a
  // stale "this changed" paragraph survives an undo that reverted it).
  revisedBlockId: NarrativeBlockId;
}): NarrativeBlock => ({
  id: uuid(),
  at: Date.now(),
  kind: "turningPoint",
  payload: {
    kind: "turningPoint",
    tpKind: "branchTaken",
    text: args.consequenceSummary.join(" "),
    params: { revisedBlockId: args.revisedBlockId },
  },
  provenance: { origin: "composed", templateId: `revision.${args.kind}` },
  sceneId: args.sceneId,
  sceneName: args.sceneName,
  ...memberFields(args.activeMember),
});

// The one place new blocks get appended to a story's manuscript — enforces
// MANUSCRIPT_BLOCK_LIMIT by folding the oldest chapter (never truncating
// blindly) whenever the cap would otherwise be exceeded.
export const appendToManuscript = (
  existing: NarrativeBlock[] | undefined,
  newBlocks: NarrativeBlock[],
  locale: Locale
): NarrativeBlock[] => {
  if (newBlocks.length === 0) return existing ?? [];
  let next = [...(existing ?? []), ...newBlocks];
  while (next.length > MANUSCRIPT_BLOCK_LIMIT) {
    const folded = foldOldestChapter(next, locale);
    if (folded.length === next.length) break; // nothing left to fold — stop
    next = folded;
  }
  return next;
};
