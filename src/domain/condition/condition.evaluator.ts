import { CharacterId } from "@domain/character";
import { SceneId } from "@domain/scene";
import { QuestId } from "@domain/quest";
import { PlayerProgress } from "@domain/player-progress";
import { Condition, ItemId } from "./condition";

const MAX_DEPTH = 8;

// The single source of truth for leaf-condition judgment. Both
// evaluateCondition and explainCondition call this — never duplicate leaf
// logic, or "shown as unmet but actually enterable" bugs creep in.
const evaluateLeaf = (
  condition: Exclude<Condition, { type: "allOf" | "anyOf" | "not" }>,
  progress: PlayerProgress
): boolean => {
  switch (condition.type) {
    case "always":
      return true;
    case "questCompleted":
      return progress.questStates[condition.questId]?.status === "completed";
    case "questActive":
      return progress.questStates[condition.questId]?.status === "active";
    case "sceneVisited":
      return progress.visitedSceneIds.includes(condition.sceneId);
    case "hasItem":
      return (progress.inventory[condition.itemId] ?? 0) >= (condition.count ?? 1);
    case "flagSet":
      return progress.flags.includes(condition.flag);
    case "talkedToNpc":
      return (progress.npcTalkCounts[condition.characterId] ?? 0) >= (condition.times ?? 1);
    case "timeOfDayIs":
      return progress.environment.timeOfDay === condition.timeOfDay;
    case "weatherIs":
      return progress.environment.weather === condition.weather;
    case "ambienceAtLeast":
      return progress.environment.ambienceIntensity >= condition.value;
    default:
      return false;
  }
};

export const evaluateCondition = (
  condition: Condition,
  progress: PlayerProgress,
  depth = 0
): boolean => {
  if (depth > MAX_DEPTH) return false;

  switch (condition.type) {
    case "allOf":
      return condition.conditions.every((c) => evaluateCondition(c, progress, depth + 1));
    case "anyOf":
      return condition.conditions.some((c) => evaluateCondition(c, progress, depth + 1));
    case "not":
      return !evaluateCondition(condition.condition, progress, depth + 1);
    default:
      return evaluateLeaf(condition, progress);
  }
};

export interface ConditionRequirement {
  satisfied: boolean;
  kind: Condition["type"];
  labelKey: string;
  labelParams: Record<string, string | number>;
}

export interface ConditionExplanation {
  satisfied: boolean;
  requirements: ConditionRequirement[];
  mode: "all" | "any";
}

export interface ConditionLabelContext {
  characterNames: Record<CharacterId, string>;
  sceneNames: Record<SceneId, string>;
  questTitles: Record<QuestId, string>;
  itemNames: Record<ItemId, string>;
}

const leafRequirement = (
  condition: Exclude<Condition, { type: "allOf" | "anyOf" | "not" }>,
  progress: PlayerProgress,
  labels: ConditionLabelContext
): ConditionRequirement => {
  const satisfied = evaluateLeaf(condition, progress);

  switch (condition.type) {
    case "always":
      return { satisfied, kind: "always", labelKey: "condition.always", labelParams: {} };
    case "questCompleted":
      return {
        satisfied,
        kind: condition.type,
        labelKey: "condition.questCompleted",
        labelParams: { name: labels.questTitles[condition.questId] ?? condition.questId },
      };
    case "questActive":
      return {
        satisfied,
        kind: condition.type,
        labelKey: "condition.questActive",
        labelParams: { name: labels.questTitles[condition.questId] ?? condition.questId },
      };
    case "sceneVisited":
      return {
        satisfied,
        kind: condition.type,
        labelKey: "condition.sceneVisited",
        labelParams: { name: labels.sceneNames[condition.sceneId] ?? condition.sceneId },
      };
    case "hasItem":
      return {
        satisfied,
        kind: condition.type,
        labelKey: "condition.hasItem",
        labelParams: {
          name: labels.itemNames[condition.itemId] ?? condition.itemId,
          count: condition.count ?? 1,
        },
      };
    case "flagSet":
      return {
        satisfied,
        kind: condition.type,
        labelKey: "condition.flagSet",
        labelParams: { flag: condition.flag },
      };
    case "talkedToNpc":
      return {
        satisfied,
        kind: condition.type,
        labelKey: "condition.talkedToNpc",
        labelParams: {
          name: labels.characterNames[condition.characterId] ?? condition.characterId,
          count: condition.times ?? 1,
          current: progress.npcTalkCounts[condition.characterId] ?? 0,
        },
      };
    case "timeOfDayIs":
      return {
        satisfied,
        kind: condition.type,
        labelKey: `condition.timeOfDay.${condition.timeOfDay}`,
        labelParams: {},
      };
    case "weatherIs":
      return {
        satisfied,
        kind: condition.type,
        labelKey: `condition.weather.${condition.weather}`,
        labelParams: {},
      };
    case "ambienceAtLeast":
      return {
        satisfied,
        kind: condition.type,
        labelKey: "condition.ambienceAtLeast",
        labelParams: {
          value: condition.value,
          current: progress.environment.ambienceIntensity,
        },
      };
    default:
      return { satisfied, kind: "always", labelKey: "condition.always", labelParams: {} };
  }
};

// Flattens a condition tree into a flat requirements list for UI display —
// every leaf reachable from the tree, each with its own satisfied/unsatisfied
// state (computed via the same evaluateLeaf used by evaluateCondition).
const collectRequirements = (
  condition: Condition,
  progress: PlayerProgress,
  labels: ConditionLabelContext,
  depth: number
): ConditionRequirement[] => {
  if (depth > MAX_DEPTH) return [];

  switch (condition.type) {
    case "allOf":
    case "anyOf":
      return condition.conditions.flatMap((c) =>
        collectRequirements(c, progress, labels, depth + 1)
      );
    case "not":
      // "not" leaves are shown as a single synthetic requirement — listing
      // the negated subtree's internals would read backwards to a player.
      return [
        {
          satisfied: evaluateCondition(condition, progress, depth),
          kind: "not",
          labelKey: "condition.not",
          labelParams: {},
        },
      ];
    default:
      return [leafRequirement(condition, progress, labels)];
  }
};

export const explainCondition = (
  condition: Condition,
  progress: PlayerProgress,
  labels: ConditionLabelContext
): ConditionExplanation => {
  const mode: "all" | "any" = condition.type === "anyOf" ? "any" : "all";
  return {
    satisfied: evaluateCondition(condition, progress),
    requirements: collectRequirements(condition, progress, labels, 0),
    mode,
  };
};
