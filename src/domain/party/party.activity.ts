// Pure mapping from ProgressEffect[] (already computed by
// applyProgressEvent) to PartyActivityEntry[] — attribution (who did it)
// happens here at the store layer, so progress.reducer.ts stays a pure
// progress calculator with no notion of parties at all.

import { v4 as uuid } from "uuid";
import { ProgressEffect } from "@domain/player-progress";
import { Quest, QuestId } from "@domain/quest";
import { Scene, SceneId } from "@domain/scene";
import { Item, ItemId } from "@domain/item";
import { PartyActivityEntry, PlayerProfile } from "./party";

export const buildPartyActivityEntries = (args: {
  effects: ProgressEffect[];
  activeMember: PlayerProfile;
  quests: Quest[];
  scenes: Scene[];
  items: Item[];
}): PartyActivityEntry[] => {
  const { effects, activeMember, quests, scenes, items } = args;
  const questTitle = (id: QuestId): string => quests.find((q) => q.id === id)?.title ?? id;
  const sceneName = (id: SceneId): string => scenes.find((s) => s.id === id)?.name ?? id;
  const itemName = (id: ItemId): string => items.find((i) => i.id === id)?.name ?? id;

  const entries: PartyActivityEntry[] = [];
  const base = {
    memberId: activeMember.id,
    memberName: activeMember.name,
    at: Date.now(),
  };

  effects.forEach((effect) => {
    switch (effect.type) {
      case "questCompleted":
        entries.push({
          id: uuid(),
          ...base,
          kind: "questCompleted",
          params: { quest: questTitle(effect.questId) },
        });
        break;
      case "questReadyToTurnIn":
        entries.push({
          id: uuid(),
          ...base,
          kind: "questReadyToTurnIn",
          params: { quest: questTitle(effect.questId) },
        });
        break;
      case "questAvailable":
        entries.push({
          id: uuid(),
          ...base,
          kind: "questAccepted",
          params: { quest: questTitle(effect.questId) },
        });
        break;
      case "sceneUnlocked":
        entries.push({
          id: uuid(),
          ...base,
          kind: "sceneUnlocked",
          params: { scene: sceneName(effect.sceneId) },
        });
        break;
      case "itemObtained":
        entries.push({
          id: uuid(),
          ...base,
          kind: "itemObtained",
          params: { item: itemName(effect.itemId), count: effect.count },
        });
        break;
      case "storyEventFired":
        entries.push({
          id: uuid(),
          ...base,
          kind: "storyEventFired",
          params: { narration: effect.narration },
        });
        break;
      default:
        break;
    }
  });

  return entries;
};
