import { useState } from "react";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiRouteLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { Condition } from "@domain/condition";
import {
  Scene,
  SceneExit,
  checkStoryReachability,
  ReachabilityResult,
} from "@domain/scene";
import {
  Quest,
  QuestObjective,
  checkQuestReachability,
  QuestReachabilityResult,
} from "@domain/quest";
import {
  TIME_OF_DAY_VALUES,
  WEATHER_VALUES,
  TIME_OF_DAY_EMOJI,
  WEATHER_EMOJI,
  DEFAULT_ENVIRONMENT,
} from "@domain/environment";
import { useTranslation } from "@app/store/locale.store";
import { Button } from "@app/components/button";
import { ScrollArea } from "@app/components/scroll-area";
import * as Dialog from "@app/components/dialog";
import { useCompanionsStore } from "../companions/companions.store";
import { useStoryStore } from "./story.store";

// A simplified, real (not mocked) leaf-condition editor: one dropdown to
// pick the leaf kind, then the fields that leaf needs. allOf/anyOf are
// represented as a list of leaves plus a mode toggle — this covers every
// unlock/take condition the demo stories actually use without needing a
// full recursive tree UI.
type LeafKind = Exclude<Condition["type"], "allOf" | "anyOf" | "not">;

const LEAF_KINDS: LeafKind[] = [
  "always",
  "questCompleted",
  "questActive",
  "sceneVisited",
  "hasItem",
  "flagSet",
  "talkedToNpc",
  "timeOfDayIs",
  "weatherIs",
  "ambienceAtLeast",
  "npcAffinityAtLeast",
];

const emptyLeafForKind = (kind: LeafKind): Condition => {
  switch (kind) {
    case "always":
      return { type: "always" };
    case "questCompleted":
      return { type: "questCompleted", questId: "" };
    case "questActive":
      return { type: "questActive", questId: "" };
    case "sceneVisited":
      return { type: "sceneVisited", sceneId: "" };
    case "hasItem":
      return { type: "hasItem", itemId: "", count: 1 };
    case "flagSet":
      return { type: "flagSet", flag: "" };
    case "talkedToNpc":
      return { type: "talkedToNpc", characterId: "", times: 1 };
    case "timeOfDayIs":
      return { type: "timeOfDayIs", timeOfDay: TIME_OF_DAY_VALUES[0] };
    case "weatherIs":
      return { type: "weatherIs", weather: WEATHER_VALUES[0] };
    case "ambienceAtLeast":
      return { type: "ambienceAtLeast", value: 50 };
    case "npcAffinityAtLeast":
      return { type: "npcAffinityAtLeast", characterId: "", value: 50 };
  }
};

const leafsOf = (condition: Condition): Condition[] => {
  if (condition.type === "allOf" || condition.type === "anyOf") {
    return condition.conditions;
  }
  if (condition.type === "not") return [];
  return [condition];
};

const modeOf = (condition: Condition): "all" | "any" =>
  condition.type === "anyOf" ? "any" : "all";

const rebuild = (leaves: Condition[], mode: "all" | "any"): Condition => {
  if (leaves.length === 0) return { type: "always" };
  if (leaves.length === 1) return leaves[0];
  return mode === "any"
    ? { type: "anyOf", conditions: leaves }
    : { type: "allOf", conditions: leaves };
};

export const ConditionEditor = ({
  condition,
  onChange,
}: {
  condition: Condition;
  onChange: (next: Condition) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { quests, scenes, items } = useStoryStore();
  const { characters } = useCompanionsStore();
  const leaves = leafsOf(condition);
  const mode = modeOf(condition);

  const updateLeaf = (index: number, leaf: Condition) => {
    const nextLeaves = leaves.map((l, i) => (i === index ? leaf : l));
    onChange(rebuild(nextLeaves, mode));
  };

  const removeLeaf = (index: number) => {
    onChange(
      rebuild(
        leaves.filter((_, i) => i !== index),
        mode
      )
    );
  };

  const addLeaf = () => {
    onChange(rebuild([...leaves, { type: "always" }], mode));
  };

  return (
    <div className="space-y-2 rounded-md border border-border bg-elevation-surface-sunken p-3">
      {leaves.length > 1 && (
        <div className="flex items-center gap-2 text-xs text-font-subtlest">
          <span>{t("stories.editor.condition.combineMode")}</span>
          <select
            value={mode}
            onChange={(e) =>
              onChange(rebuild(leaves, e.target.value as "all" | "any"))
            }
            className="rounded border border-border bg-background-input px-1 py-0.5 text-xs"
          >
            <option value="all">{t("stories.editor.condition.allOf")}</option>
            <option value="any">{t("stories.editor.condition.anyOf")}</option>
          </select>
        </div>
      )}
      {leaves.map((leaf, i) => (
        <div key={i} className="flex items-center gap-2">
          <select
            value={leaf.type}
            onChange={(e) =>
              updateLeaf(i, emptyLeafForKind(e.target.value as LeafKind))
            }
            className="rounded border border-border bg-background-input px-1 py-1 text-xs"
          >
            {LEAF_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {t(`stories.editor.condition.kind.${kind}` as never)}
              </option>
            ))}
          </select>
          {leaf.type === "questCompleted" || leaf.type === "questActive" ? (
            <select
              value={leaf.questId}
              onChange={(e) =>
                updateLeaf(i, { ...leaf, questId: e.target.value })
              }
              className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
            >
              <option value="">
                {t("stories.editor.condition.selectQuest")}
              </option>
              {quests.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          ) : leaf.type === "sceneVisited" ? (
            <select
              value={leaf.sceneId}
              onChange={(e) =>
                updateLeaf(i, { ...leaf, sceneId: e.target.value })
              }
              className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
            >
              <option value="">
                {t("stories.editor.condition.selectScene")}
              </option>
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : leaf.type === "hasItem" ? (
            <>
              <select
                value={leaf.itemId}
                onChange={(e) =>
                  updateLeaf(i, { ...leaf, itemId: e.target.value })
                }
                className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
              >
                <option value="">
                  {t("stories.editor.condition.selectItem")}
                </option>
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={leaf.count ?? 1}
                onChange={(e) =>
                  updateLeaf(i, { ...leaf, count: Number(e.target.value) })
                }
                className="w-14 rounded border border-border bg-background-input px-1 py-1 text-xs"
              />
            </>
          ) : leaf.type === "flagSet" ? (
            <input
              value={leaf.flag}
              onChange={(e) => updateLeaf(i, { ...leaf, flag: e.target.value })}
              placeholder={t("stories.editor.condition.flagPlaceholder")}
              className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
            />
          ) : leaf.type === "talkedToNpc" ? (
            <>
              <select
                value={leaf.characterId}
                onChange={(e) =>
                  updateLeaf(i, { ...leaf, characterId: e.target.value })
                }
                className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
              >
                <option value="">
                  {t("stories.editor.condition.selectCharacter")}
                </option>
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={leaf.times ?? 1}
                onChange={(e) =>
                  updateLeaf(i, { ...leaf, times: Number(e.target.value) })
                }
                className="w-14 rounded border border-border bg-background-input px-1 py-1 text-xs"
              />
            </>
          ) : leaf.type === "timeOfDayIs" ? (
            <select
              value={leaf.timeOfDay}
              onChange={(e) =>
                updateLeaf(i, {
                  ...leaf,
                  timeOfDay: e.target.value as typeof leaf.timeOfDay,
                })
              }
              className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
            >
              {TIME_OF_DAY_VALUES.map((tod) => (
                <option key={tod} value={tod}>
                  {TIME_OF_DAY_EMOJI[tod]}{" "}
                  {t(`stories.editor.condition.timeOfDay.${tod}` as never)}
                </option>
              ))}
            </select>
          ) : leaf.type === "weatherIs" ? (
            <select
              value={leaf.weather}
              onChange={(e) =>
                updateLeaf(i, {
                  ...leaf,
                  weather: e.target.value as typeof leaf.weather,
                })
              }
              className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
            >
              {WEATHER_VALUES.map((w) => (
                <option key={w} value={w}>
                  {WEATHER_EMOJI[w]}{" "}
                  {t(`stories.editor.condition.weather.${w}` as never)}
                </option>
              ))}
            </select>
          ) : leaf.type === "ambienceAtLeast" ? (
            <div className="flex flex-1 items-center gap-2">
              <span className="text-2xs text-font-subtlest">
                {t("stories.editor.condition.ambienceAtLeastPrefix")}
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={leaf.value}
                onChange={(e) =>
                  updateLeaf(i, {
                    ...leaf,
                    value: Math.max(0, Math.min(100, Number(e.target.value))),
                  })
                }
                className="w-16 rounded border border-border bg-background-input px-1 py-1 text-xs"
              />
              <span className="text-2xs text-font-subtlest">
                {t("stories.editor.condition.ambienceAtLeastSuffix")}
              </span>
            </div>
          ) : leaf.type === "npcAffinityAtLeast" ? (
            <div className="flex flex-1 items-center gap-2">
              <select
                value={leaf.characterId}
                onChange={(e) =>
                  updateLeaf(i, { ...leaf, characterId: e.target.value })
                }
                className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
              >
                <option value="">
                  {t("stories.editor.condition.selectCharacter")}
                </option>
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="text-2xs text-font-subtlest">
                {t("stories.editor.condition.npcAffinityAtLeastPrefix")}
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={leaf.value}
                onChange={(e) =>
                  updateLeaf(i, {
                    ...leaf,
                    value: Math.max(0, Math.min(100, Number(e.target.value))),
                  })
                }
                className="w-16 rounded border border-border bg-background-input px-1 py-1 text-xs"
              />
              <span className="text-2xs text-font-subtlest">
                {t("stories.editor.condition.npcAffinityAtLeastSuffix")}
              </span>
            </div>
          ) : null}
          <button
            onClick={() => removeLeaf(i)}
            aria-label={t("common.delete")}
            className="text-icon hover:text-font-danger"
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={addLeaf}
        className="flex items-center gap-1 text-xs text-font-brand hover:underline"
      >
        <RiAddLine size={14} />
        {t("stories.editor.condition.addRequirement")}
      </button>
    </div>
  );
};

const emptyScene = (): Omit<Scene, "id" | "storyId" | "order"> => ({
  name: "",
  description: "",
  ambience: "",
  npcs: [],
  exits: [],
  items: [],
  lorebookIds: [],
  unlock: { type: "always" },
  coverEmoji: "🗺️",
  coverColor: "#44546f",
});

const emptyObjective = (): QuestObjective => ({
  id: `obj-${Date.now()}`,
  kind: "visitScene",
  sceneId: "",
  label: "",
});

const emptyQuest = (): Omit<Quest, "id" | "storyId" | "order"> => ({
  title: "",
  description: "",
  available: { type: "always" },
  objectives: [emptyObjective()],
  reward: {},
  isMainline: false,
});

export const StoryEditor = ({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    activeStory,
    scenes,
    quests,
    addScene,
    updateScene,
    deleteScene,
    addExit,
    removeExit,
    updateExitCondition,
    addQuest,
    updateQuest,
    deleteQuest,
    storyEvents,
    addStoryEvent,
    updateStoryEvent,
    deleteStoryEvent,
    updateStoryInitialEnvironment,
  } = useStoryStore();
  const [tab, setTab] = useState<"scenes" | "quests" | "events">("scenes");
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingExit, setEditingExit] = useState<{
    sceneId: string;
    toSceneId: string;
  } | null>(null);
  const [reachabilityResult, setReachabilityResult] =
    useState<ReachabilityResult | null>(null);
  const [questReachabilityResult, setQuestReachabilityResult] =
    useState<QuestReachabilityResult | null>(null);

  if (!activeStory) return <></>;

  const storyScenes = scenes.filter((s) => activeStory.sceneIds.includes(s.id));
  const storyQuests = quests.filter((q) => activeStory.questIds.includes(q.id));
  const storyEventsForStory = storyEvents.filter(
    (e) => e.storyId === activeStory.id
  );
  const initialTimeOfDay =
    activeStory.initialEnvironment?.timeOfDay ?? DEFAULT_ENVIRONMENT.timeOfDay;
  const initialWeather =
    activeStory.initialEnvironment?.weather ?? DEFAULT_ENVIRONMENT.weather;

  // Jumps straight from a reachability-check result to that scene's edit
  // form: switch to the 场景 tab, expand that scene, and dismiss the dialog
  // so the author lands directly on the form instead of hunting for it.
  const handleJumpToScene = (sceneId: string) => {
    setTab("scenes");
    setEditingSceneId(sceneId);
    setReachabilityResult(null);
    setQuestReachabilityResult(null);
  };

  // Same jump, but to a quest's edit form on the 任务 tab.
  const handleJumpToQuest = (questId: string) => {
    setTab("quests");
    setEditingQuestId(questId);
    setReachabilityResult(null);
    setQuestReachabilityResult(null);
  };

  const handleRunReachabilityCheck = () => {
    const sceneResult = checkStoryReachability(
      storyScenes,
      activeStory.startSceneId
    );
    setReachabilityResult(sceneResult);
    setQuestReachabilityResult(
      checkQuestReachability(storyQuests, sceneResult.reachableSceneIds)
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-elevation-surface">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="font-primary-black text-lg text-font">
            {t("stories.editor.title", { name: activeStory.title })}
          </p>
          <p className="text-xs text-font-subtlest">
            {t("stories.editor.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-font-subtlest">
            <span>{t("stories.editor.initialEnvironment.label")}</span>
            <select
              value={initialTimeOfDay}
              onChange={(e) =>
                updateStoryInitialEnvironment({
                  timeOfDay: e.target.value as typeof initialTimeOfDay,
                })
              }
              className="rounded border border-border bg-background-input px-1 py-1 text-xs"
            >
              {TIME_OF_DAY_VALUES.map((tod) => (
                <option key={tod} value={tod}>
                  {TIME_OF_DAY_EMOJI[tod]}{" "}
                  {t(`stories.editor.condition.timeOfDay.${tod}` as never)}
                </option>
              ))}
            </select>
            <select
              value={initialWeather}
              onChange={(e) =>
                updateStoryInitialEnvironment({
                  weather: e.target.value as typeof initialWeather,
                })
              }
              className="rounded border border-border bg-background-input px-1 py-1 text-xs"
            >
              {WEATHER_VALUES.map((w) => (
                <option key={w} value={w}>
                  {WEATHER_EMOJI[w]}{" "}
                  {t(`stories.editor.condition.weather.${w}` as never)}
                </option>
              ))}
            </select>
          </div>
          <Button
            color="neutral"
            variant="subtlest"
            onClick={handleRunReachabilityCheck}
          >
            <RiRouteLine size={16} />
            {t("stories.editor.reachability.check")}
          </Button>
          <Button color="neutral" variant="subtlest" onClick={onClose}>
            {t("stories.editor.exitEditing")}
          </Button>
        </div>
      </header>

      <div className="flex gap-1 border-b border-border px-6 pt-2">
        <button
          onClick={() => setTab("scenes")}
          className={
            tab === "scenes"
              ? "border-b-2 border-border-brand px-3 py-2 font-primary-bold text-sm text-font-brand"
              : "border-b-2 border-transparent px-3 py-2 text-sm text-font-subtlest hover:text-font"
          }
        >
          {t("stories.editor.tabScenes")}
        </button>
        <button
          onClick={() => setTab("quests")}
          className={
            tab === "quests"
              ? "border-b-2 border-border-brand px-3 py-2 font-primary-bold text-sm text-font-brand"
              : "border-b-2 border-transparent px-3 py-2 text-sm text-font-subtlest hover:text-font"
          }
        >
          {t("stories.editor.tabQuests")}
        </button>
        <button
          onClick={() => setTab("events")}
          className={
            tab === "events"
              ? "border-b-2 border-border-brand px-3 py-2 font-primary-bold text-sm text-font-brand"
              : "border-b-2 border-transparent px-3 py-2 text-sm text-font-subtlest hover:text-font"
          }
        >
          {t("stories.editor.tabEvents")}
        </button>
      </div>

      <div className="min-h-0 flex-1 p-6">
        <ScrollArea>
          {tab === "scenes" ? (
            <div className="max-w-3xl space-y-3">
              <Button
                onClick={() => {
                  const newScene = addScene(emptyScene());
                  setEditingSceneId(newScene.id);
                }}
                size="md"
              >
                <RiAddLine size={16} />
                {t("stories.editor.addScene")}
              </Button>
              {storyScenes.map((scene) => (
                <div
                  key={scene.id}
                  className="rounded-md border border-border bg-elevation-surface-raised p-4"
                >
                  {editingSceneId === scene.id ? (
                    <div className="space-y-3">
                      <input
                        value={scene.name}
                        onChange={(e) =>
                          updateScene(scene.id, { name: e.target.value })
                        }
                        placeholder={t("stories.editor.scene.namePlaceholder")}
                        className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                      />
                      <textarea
                        value={scene.description}
                        onChange={(e) =>
                          updateScene(scene.id, { description: e.target.value })
                        }
                        placeholder={t(
                          "stories.editor.scene.descriptionPlaceholder"
                        )}
                        rows={2}
                        className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                      />
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("stories.editor.scene.unlockCondition")}
                        </p>
                        <ConditionEditor
                          condition={scene.unlock}
                          onChange={(unlock) =>
                            updateScene(scene.id, { unlock })
                          }
                        />
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("stories.editor.scene.exits")}
                        </p>
                        <div className="space-y-1">
                          {scene.exits.map((exit, exitIndex) => {
                            const isEditingThisExit =
                              editingExit?.sceneId === scene.id &&
                              editingExit?.toSceneId === exit.toSceneId;
                            return (
                              <div
                                key={`${exit.toSceneId}-${exitIndex}`}
                                className="rounded bg-background-neutral px-2 py-1 text-xs"
                              >
                                <div className="flex items-center justify-between">
                                  <span>
                                    {exit.label} →{" "}
                                    {
                                      scenes.find(
                                        (s) => s.id === exit.toSceneId
                                      )?.name
                                    }
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        setEditingExit(
                                          isEditingThisExit
                                            ? null
                                            : {
                                                sceneId: scene.id,
                                                toSceneId: exit.toSceneId,
                                              }
                                        )
                                      }
                                      className="text-font-brand hover:underline"
                                    >
                                      {t("stories.editor.scene.exitCondition")}
                                    </button>
                                    <button
                                      onClick={() =>
                                        removeExit(scene.id, exit.toSceneId)
                                      }
                                      aria-label={t("common.delete")}
                                      className="text-icon hover:text-font-danger"
                                    >
                                      <RiDeleteBinLine size={14} />
                                    </button>
                                  </div>
                                </div>
                                {isEditingThisExit && (
                                  <div className="mt-2">
                                    <ConditionEditor
                                      condition={
                                        exit.condition ?? { type: "always" }
                                      }
                                      onChange={(condition) =>
                                        updateExitCondition(
                                          scene.id,
                                          exit.toSceneId,
                                          condition.type === "always"
                                            ? undefined
                                            : condition
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <NewExitForm
                          scenes={storyScenes.filter((s) => s.id !== scene.id)}
                          onAdd={(exit) => addExit(scene.id, exit)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          color="neutral"
                          variant="subtlest"
                          onClick={() => setEditingSceneId(null)}
                        >
                          {t("common.done")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-primary-bold text-sm text-font">
                          {scene.coverEmoji}{" "}
                          {scene.name || t("stories.editor.untitled")}
                        </p>
                        <p className="text-xs text-font-subtlest">
                          {scene.exits.length}{" "}
                          {t("stories.editor.scene.exitsCount")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          color="neutral"
                          variant="subtlest"
                          onClick={() => setEditingSceneId(scene.id)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          color="danger"
                          variant="subtlest"
                          onClick={() => deleteScene(scene.id)}
                        >
                          <RiDeleteBinLine size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : tab === "quests" ? (
            <div className="max-w-3xl space-y-3">
              <Button
                onClick={() => {
                  const newQuest = addQuest(emptyQuest());
                  setEditingQuestId(newQuest.id);
                }}
                size="md"
              >
                <RiAddLine size={16} />
                {t("stories.editor.addQuest")}
              </Button>
              {storyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="rounded-md border border-border bg-elevation-surface-raised p-4"
                >
                  {editingQuestId === quest.id ? (
                    <div className="space-y-3">
                      <input
                        value={quest.title}
                        onChange={(e) =>
                          updateQuest(quest.id, { title: e.target.value })
                        }
                        placeholder={t("stories.editor.quest.titlePlaceholder")}
                        className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                      />
                      <textarea
                        value={quest.description}
                        onChange={(e) =>
                          updateQuest(quest.id, { description: e.target.value })
                        }
                        placeholder={t(
                          "stories.editor.quest.descriptionPlaceholder"
                        )}
                        rows={2}
                        className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                      />
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("stories.editor.quest.availableCondition")}
                        </p>
                        <ConditionEditor
                          condition={quest.available}
                          onChange={(available) =>
                            updateQuest(quest.id, { available })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1 flex items-center gap-2 text-xs font-bold text-font-subtlest">
                          <input
                            type="checkbox"
                            checked={!!quest.excludedBy}
                            onChange={(e) =>
                              updateQuest(quest.id, {
                                excludedBy: e.target.checked
                                  ? { type: "flagSet", flag: "" }
                                  : undefined,
                              })
                            }
                          />
                          {t("stories.editor.quest.excludedByCondition")}
                        </label>
                        {quest.excludedBy && (
                          <ConditionEditor
                            condition={quest.excludedBy}
                            onChange={(excludedBy) =>
                              updateQuest(quest.id, { excludedBy })
                            }
                          />
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          color="neutral"
                          variant="subtlest"
                          onClick={() => setEditingQuestId(null)}
                        >
                          {t("common.done")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-primary-bold text-sm text-font">
                          {quest.title || t("stories.editor.untitled")}
                        </p>
                        <p className="text-xs text-font-subtlest">
                          {quest.objectives.length}{" "}
                          {t("stories.editor.quest.objectivesCount")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          color="neutral"
                          variant="subtlest"
                          onClick={() => setEditingQuestId(quest.id)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          color="danger"
                          variant="subtlest"
                          onClick={() => deleteQuest(quest.id)}
                        >
                          <RiDeleteBinLine size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl space-y-3">
              <Button
                onClick={() => {
                  const sceneId = storyScenes[0]?.id ?? "";
                  const newEvent = addStoryEvent({
                    sceneId,
                    title: "",
                    trigger: { type: "always" },
                    effect: { narration: "" },
                  });
                  setEditingEventId(newEvent.id);
                }}
                size="md"
                disabled={storyScenes.length === 0}
              >
                <RiAddLine size={16} />
                {t("stories.editor.events.addEvent")}
              </Button>
              {storyEventsForStory.length === 0 && (
                <p className="text-sm text-font-subtlest">
                  {t("stories.editor.events.empty")}
                </p>
              )}
              {storyEventsForStory.map((event) => (
                <div
                  key={event.id}
                  className="rounded-md border border-border bg-elevation-surface-raised p-4"
                >
                  {editingEventId === event.id ? (
                    <div className="space-y-3">
                      <input
                        value={event.title}
                        onChange={(e) =>
                          updateStoryEvent(event.id, { title: e.target.value })
                        }
                        placeholder={t(
                          "stories.editor.events.titlePlaceholder"
                        )}
                        className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                      />
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("stories.editor.events.sceneLabel")}
                        </p>
                        <select
                          value={event.sceneId}
                          onChange={(e) =>
                            updateStoryEvent(event.id, {
                              sceneId: e.target.value,
                            })
                          }
                          className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                        >
                          {storyScenes.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("stories.editor.events.trigger")}
                        </p>
                        <ConditionEditor
                          condition={event.trigger}
                          onChange={(trigger) =>
                            updateStoryEvent(event.id, { trigger })
                          }
                        />
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-bold text-font-subtlest">
                          {t("stories.editor.events.effectNarration")}
                        </p>
                        <textarea
                          value={event.effect.narration}
                          onChange={(e) =>
                            updateStoryEvent(event.id, {
                              effect: {
                                ...event.effect,
                                narration: e.target.value,
                              },
                            })
                          }
                          placeholder={t(
                            "stories.editor.events.narrationPlaceholder"
                          )}
                          rows={2}
                          className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="mb-1 text-xs font-bold text-font-subtlest">
                            {t("stories.editor.events.effectSetTimeOfDay")}
                          </p>
                          <select
                            value={event.effect.setTimeOfDay ?? ""}
                            onChange={(e) =>
                              updateStoryEvent(event.id, {
                                effect: {
                                  ...event.effect,
                                  setTimeOfDay: e.target.value
                                    ? (e.target
                                        .value as (typeof TIME_OF_DAY_VALUES)[number])
                                    : undefined,
                                },
                              })
                            }
                            className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                          >
                            <option value="">
                              {t("stories.editor.events.none")}
                            </option>
                            {TIME_OF_DAY_VALUES.map((tod) => (
                              <option key={tod} value={tod}>
                                {TIME_OF_DAY_EMOJI[tod]}{" "}
                                {t(
                                  `stories.editor.condition.timeOfDay.${tod}` as never
                                )}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <p className="mb-1 text-xs font-bold text-font-subtlest">
                            {t("stories.editor.events.effectSetWeather")}
                          </p>
                          <select
                            value={event.effect.setWeather ?? ""}
                            onChange={(e) =>
                              updateStoryEvent(event.id, {
                                effect: {
                                  ...event.effect,
                                  setWeather: e.target.value
                                    ? (e.target
                                        .value as (typeof WEATHER_VALUES)[number])
                                    : undefined,
                                },
                              })
                            }
                            className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                          >
                            <option value="">
                              {t("stories.editor.events.none")}
                            </option>
                            {WEATHER_VALUES.map((w) => (
                              <option key={w} value={w}>
                                {WEATHER_EMOJI[w]}{" "}
                                {t(
                                  `stories.editor.condition.weather.${w}` as never
                                )}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-28">
                          <p className="mb-1 text-xs font-bold text-font-subtlest">
                            {t("stories.editor.events.effectAmbienceDelta")}
                          </p>
                          <input
                            type="number"
                            value={event.effect.ambienceDelta ?? 0}
                            onChange={(e) =>
                              updateStoryEvent(event.id, {
                                effect: {
                                  ...event.effect,
                                  ambienceDelta: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full rounded border border-border bg-background-input px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          color="neutral"
                          variant="subtlest"
                          onClick={() => setEditingEventId(null)}
                        >
                          {t("common.done")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-primary-bold text-sm text-font">
                          {event.title || t("stories.editor.untitled")}
                        </p>
                        <p className="text-xs text-font-subtlest">
                          {scenes.find((s) => s.id === event.sceneId)?.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          color="neutral"
                          variant="subtlest"
                          onClick={() => setEditingEventId(event.id)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          color="danger"
                          variant="subtlest"
                          onClick={() => deleteStoryEvent(event.id)}
                        >
                          <RiDeleteBinLine size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <ReachabilityDialog
        result={reachabilityResult}
        questResult={questReachabilityResult}
        scenes={storyScenes}
        quests={storyQuests}
        onClose={() => {
          setReachabilityResult(null);
          setQuestReachabilityResult(null);
        }}
        onJumpToScene={handleJumpToScene}
        onJumpToQuest={handleJumpToQuest}
      />
    </div>
  );
};

const ReachabilityDialog = ({
  result,
  questResult,
  scenes,
  quests,
  onClose,
  onJumpToScene,
  onJumpToQuest,
}: {
  result: ReachabilityResult | null;
  questResult: QuestReachabilityResult | null;
  scenes: Scene[];
  quests: Quest[];
  onClose: () => void;
  onJumpToScene: (sceneId: string) => void;
  onJumpToQuest: (questId: string) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const sceneName = (id: string) => scenes.find((s) => s.id === id)?.name ?? id;
  const questName = (id: string) =>
    quests.find((q) => q.id === id)?.title ?? id;
  // A quest blocker is either `scene:<id>` or `quest:<id>` — resolve each to
  // its display name so “Waiting on” reads as real titles, not raw ids.
  const questBlockerName = (blocker: string) => {
    const [kind, id] = blocker.split(":");
    return kind === "scene" ? sceneName(id) : questName(id);
  };
  const allSceneReachable = !result || result.unreachableSceneIds.length === 0;
  const allQuestReachable =
    !questResult || questResult.unreachableQuestIds.length === 0;

  return (
    <Dialog.Root open={!!result} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[520px]">
            <Dialog.Title>
              {t("stories.editor.reachability.title")}
            </Dialog.Title>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto">
              <div>
                <p className="mb-2 text-xs font-bold text-font-subtlest">
                  {t("stories.editor.tabScenes")}
                </p>
                {allSceneReachable ? (
                  <p className="flex items-center gap-2 text-sm text-font-success">
                    <RiCheckLine size={16} />
                    {t("stories.editor.reachability.allReachable")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm text-font-danger">
                      <RiErrorWarningLine size={16} />
                      {t("stories.editor.reachability.someUnreachable", {
                        count: result?.unreachableSceneIds.length ?? 0,
                      })}
                    </p>
                    <ul className="space-y-1">
                      {result?.unreachableSceneIds.map((sceneId) => {
                        const blockers = result.blockedOn[sceneId] ?? [];
                        return (
                          <li
                            key={sceneId}
                            className="flex items-center justify-between gap-3 rounded-md border border-border bg-elevation-surface-raised px-3 py-2 text-sm"
                          >
                            <div>
                              <p className="font-primary-bold text-font">
                                {sceneName(sceneId)}
                              </p>
                              <p className="text-xs text-font-subtlest">
                                {blockers.length > 0
                                  ? t("stories.editor.reachability.blockedOn", {
                                      names: blockers.map(sceneName).join("、"),
                                    })
                                  : t("stories.editor.reachability.noPathIn")}
                              </p>
                            </div>
                            <Button
                              color="neutral"
                              variant="subtlest"
                              onClick={() => onJumpToScene(sceneId)}
                            >
                              {t("stories.editor.reachability.editScene")}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-font-subtlest">
                  {t("stories.editor.tabQuests")}
                </p>
                {allQuestReachable ? (
                  <p className="flex items-center gap-2 text-sm text-font-success">
                    <RiCheckLine size={16} />
                    {t("stories.editor.reachability.allQuestsReachable")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm text-font-danger">
                      <RiErrorWarningLine size={16} />
                      {t("stories.editor.reachability.someQuestsUnreachable", {
                        count: questResult?.unreachableQuestIds.length ?? 0,
                      })}
                    </p>
                    <ul className="space-y-1">
                      {questResult?.unreachableQuestIds.map((questId) => {
                        const blockers = questResult.blockedOn[questId] ?? [];
                        return (
                          <li
                            key={questId}
                            className="flex items-center justify-between gap-3 rounded-md border border-border bg-elevation-surface-raised px-3 py-2 text-sm"
                          >
                            <div>
                              <p className="font-primary-bold text-font">
                                {questName(questId)}
                              </p>
                              <p className="text-xs text-font-subtlest">
                                {blockers.length > 0
                                  ? t("stories.editor.reachability.blockedOn", {
                                      names: blockers
                                        .map(questBlockerName)
                                        .join("、"),
                                    })
                                  : t("stories.editor.reachability.noPathIn")}
                              </p>
                            </div>
                            <Button
                              color="neutral"
                              variant="subtlest"
                              onClick={() => onJumpToQuest(questId)}
                            >
                              {t("stories.editor.reachability.editQuest")}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button color="neutral" variant="subtlest" onClick={onClose}>
                {t("common.close")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const NewExitForm = ({
  scenes,
  onAdd,
}: {
  scenes: Scene[];
  onAdd: (exit: SceneExit) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const [toSceneId, setToSceneId] = useState("");
  const [label, setLabel] = useState("");

  const handleAdd = () => {
    if (!toSceneId || !label.trim()) return;
    onAdd({ toSceneId, label: label.trim() });
    setToSceneId("");
    setLabel("");
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <select
        value={toSceneId}
        onChange={(e) => setToSceneId(e.target.value)}
        className="rounded border border-border bg-background-input px-1 py-1 text-xs"
      >
        <option value="">{t("stories.editor.condition.selectScene")}</option>
        {scenes.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder={t("stories.editor.scene.exitLabelPlaceholder")}
        className="flex-1 rounded border border-border bg-background-input px-1 py-1 text-xs"
      />
      <button
        onClick={handleAdd}
        className="flex items-center gap-1 text-xs text-font-brand hover:underline"
      >
        <RiAddLine size={14} />
        {t("stories.editor.scene.addExit")}
      </button>
    </div>
  );
};
