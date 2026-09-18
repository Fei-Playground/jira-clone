// A lightweight, real (not fake) reachability check for creator mode: can
// every scene in a story actually be reached, starting from the start
// scene, by walking exits whose conditions could plausibly be satisfied?
//
// This is a graph-reachability approximation, not a full game-state
// simulation — it doesn't try to prove a quest is completable or an item
// obtainable. What it DOES catch reliably is the most common authoring
// mistake: a scene with no path in from anything reachable, or two scenes
// that each require having already visited the other (a hard deadlock).
//
// Design: conditions that reference ANOTHER SCENE (sceneVisited) are the
// only ones treated as a real graph edge requirement — the target scene
// must already be reachable. Every other leaf (hasItem, talkedToNpc,
// questCompleted, flagSet, timeOfDayIs, weatherIs) is treated as
// eventually satisfiable — the player can talk to NPCs, walk into weather
// changes, and complete quests, none of which requires having already
// stood in a specific OTHER scene. This keeps the check honest about what
// it can and can't prove, per the "real logic, not fake unlocked" rule
// the rest of the condition system follows.

import { Condition } from "@domain/condition";
import { Scene, SceneId } from "./scene";

// Recursively collects every sceneId referenced by a sceneVisited leaf
// inside a condition tree (through allOf/anyOf/not) — allOf/anyOf are both
// treated as "these scenes all need visiting" for reachability purposes;
// distinguishing all/any here would require evaluating partial trees, which
// is unnecessary for a conservative check (anyOf under-approximates that
// only one of them is truly required, but requiring all is safe — it only
// causes a false "unreachable", never a false "reachable").
const sceneVisitedDeps = (condition: Condition): SceneId[] => {
  switch (condition.type) {
    case "sceneVisited":
      return [condition.sceneId];
    case "allOf":
    case "anyOf":
      return condition.conditions.flatMap(sceneVisitedDeps);
    case "not":
      // A "not sceneVisited(X)" doesn't require X to be reachable — it
      // requires the opposite. Excluded from the dependency set.
      return [];
    default:
      return [];
  }
};

export interface ReachabilityResult {
  reachableSceneIds: SceneId[];
  unreachableSceneIds: SceneId[];
  // For each unreachable scene, the scene ids it's still waiting on (via a
  // sceneVisited condition somewhere on its own unlock or on every exit
  // that could lead to it) that are themselves unreachable — useful for
  // explaining WHY it's stuck, e.g. a same cycle between two scenes.
  blockedOn: Record<SceneId, SceneId[]>;
}

export const checkStoryReachability = (
  scenes: Scene[],
  startSceneId: SceneId
): ReachabilityResult => {
  const byId = new Map(scenes.map((s) => [s.id, s]));
  const reachable = new Set<SceneId>();
  if (byId.has(startSceneId)) reachable.add(startSceneId);

  // Fixed-point iteration: keep sweeping the scene list, marking a scene
  // reachable once (a) its own unlock's sceneVisited deps are all already
  // reachable, and (b) at least one exit from an already-reachable scene
  // points at it whose condition's sceneVisited deps are all reachable.
  let changed = true;
  while (changed) {
    changed = false;

    scenes.forEach((scene) => {
      if (reachable.has(scene.id)) return;

      const unlockDeps = sceneVisitedDeps(scene.unlock);
      const unlockSatisfiable = unlockDeps.every((id) => reachable.has(id));
      if (!unlockSatisfiable) return;

      const reachableViaExit = scenes.some((from) => {
        if (!reachable.has(from.id)) return false;
        return from.exits.some((exit) => {
          if (exit.toSceneId !== scene.id) return false;
          const exitDeps = exit.condition ? sceneVisitedDeps(exit.condition) : [];
          return exitDeps.every((id) => reachable.has(id));
        });
      });

      if (reachableViaExit) {
        reachable.add(scene.id);
        changed = true;
      }
    });
  }

  const unreachableSceneIds = scenes.map((s) => s.id).filter((id) => !reachable.has(id));

  const blockedOn: Record<SceneId, SceneId[]> = {};
  unreachableSceneIds.forEach((sceneId) => {
    const scene = byId.get(sceneId);
    if (!scene) return;
    const deps = new Set<SceneId>();
    sceneVisitedDeps(scene.unlock).forEach((id) => {
      if (!reachable.has(id)) deps.add(id);
    });
    scenes.forEach((from) => {
      from.exits.forEach((exit) => {
        if (exit.toSceneId !== sceneId) return;
        (exit.condition ? sceneVisitedDeps(exit.condition) : []).forEach((id) => {
          if (!reachable.has(id)) deps.add(id);
        });
      });
    });
    blockedOn[sceneId] = Array.from(deps);
  });

  return {
    reachableSceneIds: Array.from(reachable),
    unreachableSceneIds,
    blockedOn,
  };
};
