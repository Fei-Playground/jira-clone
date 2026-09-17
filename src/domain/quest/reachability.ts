// Extends the scene reachability check (see @domain/scene/reachability.ts)
// to quests: can every quest in a story actually be reached — accepted and
// eventually completed — given the story's scene graph and the quests'
// own dependencies on each other?
//
// Same honesty rule as the scene check: this is a graph-reachability
// approximation, not a full game-state simulation. Two kinds of real edges
// are tracked:
//   1. Quest → quest, via questCompleted/questActive leaves in `available`
//      (a quest gated on another quest can't unlock until that one does).
//   2. Quest → scene, via a sceneVisited leaf in `available`, OR a
//      "visitScene" objective — a quest whose objective requires standing in
//      an unreachable scene can never be completed, which makes the quest
//      itself a dead end even if it can technically be "accepted".
// Every other condition kind (hasItem, flagSet, talkedToNpc, ambienceAtLeast,
// timeOfDayIs, weatherIs) is treated as eventually satisfiable, same as the
// scene check — those don't require having already reached a specific place
// or finished a specific quest.

import { Condition } from "@domain/condition";
import { SceneId } from "@domain/scene";
import { Quest, QuestId } from "./quest";

interface QuestDeps {
  questIds: QuestId[];
  sceneIds: SceneId[];
}

const collectDeps = (condition: Condition): QuestDeps => {
  switch (condition.type) {
    case "questCompleted":
    case "questActive":
      return { questIds: [condition.questId], sceneIds: [] };
    case "sceneVisited":
      return { questIds: [], sceneIds: [condition.sceneId] };
    case "allOf":
    case "anyOf": {
      const nested = condition.conditions.map(collectDeps);
      return {
        questIds: nested.flatMap((d) => d.questIds),
        sceneIds: nested.flatMap((d) => d.sceneIds),
      };
    }
    case "not":
      // A negated dependency doesn't require the thing to be reached — it
      // requires the opposite. Excluded, same reasoning as the scene check.
      return { questIds: [], sceneIds: [] };
    default:
      return { questIds: [], sceneIds: [] };
  }
};

// A quest's objectives can themselves require reaching a scene — a
// visitScene objective the player can never complete makes the quest a
// dead end even if `available` alone would let them accept it.
const objectiveSceneDeps = (quest: Quest): SceneId[] =>
  quest.objectives
    .filter((obj): obj is Extract<typeof obj, { kind: "visitScene" }> => obj.kind === "visitScene")
    .map((obj) => obj.sceneId);

export interface QuestReachabilityResult {
  reachableQuestIds: QuestId[];
  unreachableQuestIds: QuestId[];
  // For each unreachable quest, the quest/scene ids (as `quest:<id>` /
  // `scene:<id>`) it's still waiting on that are themselves unreachable.
  blockedOn: Record<QuestId, string[]>;
}

export const checkQuestReachability = (
  quests: Quest[],
  reachableSceneIds: SceneId[]
): QuestReachabilityResult => {
  const reachableScenes = new Set(reachableSceneIds);
  const reachableQuests = new Set<QuestId>();

  const questSatisfiable = (quest: Quest): boolean => {
    const deps = collectDeps(quest.available);
    const questDepsOk = deps.questIds.every((id) => reachableQuests.has(id));
    const availableSceneDepsOk = deps.sceneIds.every((id) => reachableScenes.has(id));
    const objectiveSceneDepsOk = objectiveSceneDeps(quest).every((id) => reachableScenes.has(id));
    return questDepsOk && availableSceneDepsOk && objectiveSceneDepsOk;
  };

  // Fixed-point iteration, same shape as the scene check: keep sweeping
  // until a full pass adds nothing new.
  let changed = true;
  while (changed) {
    changed = false;
    quests.forEach((quest) => {
      if (reachableQuests.has(quest.id)) return;
      if (questSatisfiable(quest)) {
        reachableQuests.add(quest.id);
        changed = true;
      }
    });
  }

  const unreachableQuestIds = quests.map((q) => q.id).filter((id) => !reachableQuests.has(id));

  const blockedOn: Record<QuestId, string[]> = {};
  unreachableQuestIds.forEach((questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;
    const waiting = new Set<string>();
    const deps = collectDeps(quest.available);
    deps.questIds.forEach((id) => {
      if (!reachableQuests.has(id)) waiting.add(`quest:${id}`);
    });
    deps.sceneIds.forEach((id) => {
      if (!reachableScenes.has(id)) waiting.add(`scene:${id}`);
    });
    objectiveSceneDeps(quest).forEach((id) => {
      if (!reachableScenes.has(id)) waiting.add(`scene:${id}`);
    });
    blockedOn[questId] = Array.from(waiting);
  });

  return {
    reachableQuestIds: Array.from(reachableQuests),
    unreachableQuestIds,
    blockedOn,
  };
};
