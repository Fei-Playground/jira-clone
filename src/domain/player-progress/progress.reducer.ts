import { Story } from "@domain/story";
import { Scene, SceneId } from "@domain/scene";
import { Quest, QuestId, QuestObjectiveId, QuestStatus } from "@domain/quest";
import { ItemId } from "@domain/item";
import { CharacterId } from "@domain/character";
import { evaluateCondition } from "@domain/condition";
import { StoryEvent, StoryEventId } from "@domain/story-event";
import { TimeOfDay, Weather } from "@domain/environment";
import { PlayerProgress, NpcRelationship } from "./player-progress";

export const DEFAULT_RELATIONSHIP: NpcRelationship = {
  affinity: 0,
  mood: 50,
  lastInteractionAt: 0,
};

// Real, deterministic relationship movement — not decoration. Affinity only
// ever rises (it represents accumulated trust); mood rises and falls and is
// clamped to [0,100] on every touch so it can't drift out of range.
const bumpRelationship = (
  progress: PlayerProgress,
  characterId: CharacterId,
  affinityDelta: number,
  moodDelta: number
): PlayerProgress => {
  const current = progress.npcRelationships?.[characterId] ?? DEFAULT_RELATIONSHIP;
  const next: NpcRelationship = {
    affinity: Math.max(0, Math.min(100, current.affinity + Math.max(0, affinityDelta))),
    mood: Math.max(0, Math.min(100, current.mood + moodDelta)),
    lastInteractionAt: Date.now(),
  };
  return {
    ...progress,
    npcRelationships: { ...progress.npcRelationships, [characterId]: next },
  };
};

export type ProgressEvent =
  | { type: "enterScene"; sceneId: SceneId }
  | { type: "talkToNpc"; characterId: CharacterId; sceneId: SceneId; sessionKey: string }
  | { type: "sendMessage"; characterId?: CharacterId; text: string }
  | { type: "takeItem"; itemId: ItemId; count: number }
  | {
      type: "takeSceneItem";
      sceneId: SceneId;
      itemId: ItemId;
      oneTime: boolean;
    }
  | { type: "acceptQuest"; questId: QuestId }
  | { type: "turnInQuest"; questId: QuestId }
  | { type: "setEnvironment"; timeOfDay?: TimeOfDay; weather?: Weather };

export type ProgressEffect =
  | {
      type: "objectiveAdvanced";
      questId: QuestId;
      objectiveId: QuestObjectiveId;
      current: number;
      target: number;
    }
  | { type: "questReadyToTurnIn"; questId: QuestId }
  | { type: "questCompleted"; questId: QuestId }
  | { type: "questAvailable"; questId: QuestId }
  | { type: "sceneUnlocked"; sceneId: SceneId }
  | { type: "itemObtained"; itemId: ItemId; count: number }
  | { type: "storyEventFired"; eventId: StoryEventId; narration: string };

export interface ProgressResult {
  progress: PlayerProgress;
  effects: ProgressEffect[];
}

interface ApplyArgs {
  progress: PlayerProgress;
  story: Story;
  scenes: Scene[];
  quests: Quest[];
  storyEvents?: StoryEvent[];
  event: ProgressEvent;
}

const sceneUnlockFlag = (sceneId: SceneId): string => `scene_unlocked:${sceneId}`;

const containsKeyword = (text: string, keywords: string[]): boolean => {
  const textLower = text.toLowerCase();
  return keywords.some((k) => k.trim() && textLower.includes(k.toLowerCase()));
};

// Grants a quest's reward onto progress (items, scene-unlock flags, story
// flags, unlocked follow-up quests) — the single path both auto-completion
// and manual turn-in flow through.
const grantReward = (progress: PlayerProgress, quest: Quest): PlayerProgress => {
  const reward = quest.reward;
  const nextInventory = { ...progress.inventory };
  (reward.items ?? []).forEach(({ itemId, count }) => {
    nextInventory[itemId] = (nextInventory[itemId] ?? 0) + count;
  });

  const unlockFlags = (reward.unlockSceneIds ?? []).map(sceneUnlockFlag);
  const nextFlags = Array.from(
    new Set([...progress.flags, ...(reward.setFlags ?? []), ...unlockFlags])
  );

  return {
    ...progress,
    inventory: nextInventory,
    flags: nextFlags,
  };
};

const advanceObjective = (
  progress: PlayerProgress,
  quest: Quest,
  objectiveId: QuestObjectiveId,
  delta: number,
  target: number,
  effects: ProgressEffect[]
): PlayerProgress => {
  const state = progress.questStates[quest.id];
  if (!state || state.status !== "active") return progress;

  const current = Math.min((state.objectiveProgress[objectiveId] ?? 0) + delta, target);
  if (current === (state.objectiveProgress[objectiveId] ?? 0)) return progress;

  effects.push({ type: "objectiveAdvanced", questId: quest.id, objectiveId, current, target });

  const nextObjectiveProgress = { ...state.objectiveProgress, [objectiveId]: current };
  const allMet = quest.objectives.every((obj) => {
    const target = objectiveTarget(obj);
    return (nextObjectiveProgress[obj.id] ?? 0) >= target;
  });

  let nextStatus: QuestStatus = state.status;
  if (allMet) {
    if (quest.turnInCharacterId) {
      nextStatus = "readyToTurnIn";
      effects.push({ type: "questReadyToTurnIn", questId: quest.id });
    } else {
      nextStatus = "completed";
      effects.push({ type: "questCompleted", questId: quest.id });
    }
  }

  return {
    ...progress,
    questStates: {
      ...progress.questStates,
      [quest.id]: {
        ...state,
        objectiveProgress: nextObjectiveProgress,
        status: nextStatus,
        completedAt: nextStatus === "completed" ? Date.now() : state.completedAt,
      },
    },
  };
};

const objectiveTarget = (obj: Quest["objectives"][number]): number => {
  switch (obj.kind) {
    case "talkToNpc":
      return obj.times;
    case "obtainItem":
      return obj.count;
    case "visitScene":
    case "sayKeyword":
      return 1;
  }
};

// Recomputes quest availability + unlocks newly-reachable scenes given the
// current progress. Called after every event so effects/derived state stay
// consistent without components needing to re-derive anything themselves.
const refreshDerivedState = (
  progress: PlayerProgress,
  story: Story,
  scenes: Scene[],
  quests: Quest[],
  effects: ProgressEffect[]
): PlayerProgress => {
  let next = progress;

  quests.forEach((quest) => {
    const state = next.questStates[quest.id];
    if (state && state.status !== "locked") return;
    if (evaluateCondition(quest.available, next)) {
      next = {
        ...next,
        questStates: {
          ...next.questStates,
          [quest.id]: {
            status: "available",
            objectiveProgress: {},
          },
        },
      };
      effects.push({ type: "questAvailable", questId: quest.id });
    }
  });

  scenes.forEach((scene) => {
    const wasVisitable = evaluateCondition(scene.unlock, progress);
    const isVisitable = evaluateCondition(scene.unlock, next);
    if (!wasVisitable && isVisitable) {
      effects.push({ type: "sceneUnlocked", sceneId: scene.id });
    }
  });

  return next;
};

// Applies one gameplay event to progress, returning the new immutable
// progress plus a list of UI-facing effects (toasts, system markers). This
// is the ONLY path quest advancement and scene unlocking flow through.
export const applyProgressEvent = ({
  progress,
  story,
  scenes,
  quests,
  storyEvents,
  event,
}: ApplyArgs): ProgressResult => {
  const effects: ProgressEffect[] = [];
  let next = progress;

  switch (event.type) {
    case "enterScene": {
      if (!next.visitedSceneIds.includes(event.sceneId)) {
        next = {
          ...next,
          visitedSceneIds: [...next.visitedSceneIds, event.sceneId],
        };
      }
      next = { ...next, currentSceneId: event.sceneId };

      quests
        .filter((q) => next.questStates[q.id]?.status === "active")
        .forEach((quest) => {
          quest.objectives.forEach((obj) => {
            if (obj.kind === "visitScene" && obj.sceneId === event.sceneId) {
              next = advanceObjective(next, quest, obj.id, 1, objectiveTarget(obj), effects);
            }
          });
        });
      break;
    }

    case "talkToNpc": {
      if (next.countedTalkSessionIds.includes(event.sessionKey)) break;

      next = {
        ...next,
        countedTalkSessionIds: [...next.countedTalkSessionIds, event.sessionKey],
        npcTalkCounts: {
          ...next.npcTalkCounts,
          [event.characterId]: (next.npcTalkCounts[event.characterId] ?? 0) + 1,
        },
      };
      // Real relationship movement: opening a new conversation is a small,
      // genuine step toward the NPC trusting the player more.
      next = bumpRelationship(next, event.characterId, 2, 3);

      quests
        .filter((q) => next.questStates[q.id]?.status === "active")
        .forEach((quest) => {
          quest.objectives.forEach((obj) => {
            if (obj.kind === "talkToNpc" && obj.characterId === event.characterId) {
              next = advanceObjective(next, quest, obj.id, 1, objectiveTarget(obj), effects);
            }
          });
        });
      break;
    }

    case "sendMessage": {
      let advancedAQuestObjective = false;
      quests
        .filter((q) => next.questStates[q.id]?.status === "active")
        .forEach((quest) => {
          quest.objectives.forEach((obj) => {
            if (
              obj.kind === "sayKeyword" &&
              (!obj.characterId || obj.characterId === event.characterId) &&
              containsKeyword(event.text, obj.keywords)
            ) {
              next = advanceObjective(next, quest, obj.id, 1, objectiveTarget(obj), effects);
              advancedAQuestObjective = true;
            }
          });
        });
      // Real relationship movement: saying the right thing to advance a
      // quest genuinely builds trust; any message at all is at least a
      // small, real mood bump (the NPC is being talked to, not ignored).
      if (event.characterId) {
        next = advancedAQuestObjective
          ? bumpRelationship(next, event.characterId, 4, 6)
          : bumpRelationship(next, event.characterId, 0, 1);
      }
      break;
    }

    case "takeItem": {
      next = {
        ...next,
        inventory: {
          ...next.inventory,
          [event.itemId]: (next.inventory[event.itemId] ?? 0) + event.count,
        },
      };
      effects.push({ type: "itemObtained", itemId: event.itemId, count: event.count });

      quests
        .filter((q) => next.questStates[q.id]?.status === "active")
        .forEach((quest) => {
          quest.objectives.forEach((obj) => {
            if (obj.kind === "obtainItem" && obj.itemId === event.itemId) {
              const current = next.inventory[event.itemId] ?? 0;
              next = advanceObjective(
                next,
                quest,
                obj.id,
                current - (next.questStates[quest.id]?.objectiveProgress[obj.id] ?? 0),
                objectiveTarget(obj),
                effects
              );
            }
          });
        });
      break;
    }

    case "takeSceneItem": {
      const key = `${event.sceneId}:${event.itemId}`;
      if (event.oneTime && next.takenSceneItemKeys.includes(key)) break;

      next = {
        ...next,
        inventory: {
          ...next.inventory,
          [event.itemId]: (next.inventory[event.itemId] ?? 0) + 1,
        },
        takenSceneItemKeys: event.oneTime
          ? [...next.takenSceneItemKeys, key]
          : next.takenSceneItemKeys,
      };
      effects.push({ type: "itemObtained", itemId: event.itemId, count: 1 });

      quests
        .filter((q) => next.questStates[q.id]?.status === "active")
        .forEach((quest) => {
          quest.objectives.forEach((obj) => {
            if (obj.kind === "obtainItem" && obj.itemId === event.itemId) {
              const current = next.inventory[event.itemId] ?? 0;
              next = advanceObjective(
                next,
                quest,
                obj.id,
                current - (next.questStates[quest.id]?.objectiveProgress[obj.id] ?? 0),
                objectiveTarget(obj),
                effects
              );
            }
          });
        });
      break;
    }

    case "acceptQuest": {
      const state = next.questStates[event.questId];
      if (state?.status !== "available") break;
      next = {
        ...next,
        questStates: {
          ...next.questStates,
          [event.questId]: { status: "active", objectiveProgress: {}, startedAt: Date.now() },
        },
      };
      break;
    }

    case "turnInQuest": {
      const quest = quests.find((q) => q.id === event.questId);
      const state = next.questStates[event.questId];
      if (!quest || state?.status !== "readyToTurnIn") break;
      next = grantReward(next, quest);
      next = {
        ...next,
        questStates: {
          ...next.questStates,
          [event.questId]: { ...state, status: "completed", completedAt: Date.now() },
        },
      };
      effects.push({ type: "questCompleted", questId: event.questId });
      // Real relationship movement: turning in a quest is the single
      // strongest trust-building act in the game — give it the largest bump.
      const relationshipTarget = quest.turnInCharacterId ?? quest.giverCharacterId;
      if (relationshipTarget) {
        next = bumpRelationship(next, relationshipTarget, 10, 15);
      }
      break;
    }

    case "setEnvironment": {
      next = {
        ...next,
        environment: {
          ...next.environment,
          timeOfDay: event.timeOfDay ?? next.environment.timeOfDay,
          weather: event.weather ?? next.environment.weather,
        },
      };
      break;
    }
  }

  // Auto-completed quests (no turnInCharacterId) grant their reward here,
  // once, right after their status flips to completed above.
  quests.forEach((quest) => {
    const wasCompleted = progress.questStates[quest.id]?.status === "completed";
    const isCompleted = next.questStates[quest.id]?.status === "completed";
    if (!wasCompleted && isCompleted && !quest.turnInCharacterId) {
      next = grantReward(next, quest);
    }
  });

  next = refreshDerivedState(next, story, scenes, quests, effects);

  // Story events: check every event tied to the player's CURRENT scene that
  // hasn't fired yet. Runs after every progress-changing action (not just
  // enterScene) so an event whose trigger becomes true mid-conversation
  // (e.g. a quest completing while still in the scene) fires immediately
  // rather than only on the next scene change.
  (storyEvents ?? [])
    .filter((e) => e.sceneId === next.currentSceneId && !next.firedEventIds.includes(e.id))
    .forEach((storyEvent) => {
      if (!evaluateCondition(storyEvent.trigger, next)) return;

      const effect = storyEvent.effect;
      const nextInventory = { ...next.inventory };
      (effect.items ?? []).forEach(({ itemId, count }) => {
        nextInventory[itemId] = (nextInventory[itemId] ?? 0) + count;
      });

      next = {
        ...next,
        firedEventIds: [...next.firedEventIds, storyEvent.id],
        flags: Array.from(new Set([...next.flags, ...(effect.setFlags ?? [])])),
        inventory: nextInventory,
        environment: {
          ...next.environment,
          timeOfDay: effect.setTimeOfDay ?? next.environment.timeOfDay,
          weather: effect.setWeather ?? next.environment.weather,
          ambienceIntensity: Math.max(
            0,
            Math.min(100, next.environment.ambienceIntensity + (effect.ambienceDelta ?? 0))
          ),
        },
      };
      effects.push({
        type: "storyEventFired",
        eventId: storyEvent.id,
        narration: effect.narration,
      });
    });

  next = { ...next, updatedAt: Date.now() };

  return { progress: next, effects };
};
