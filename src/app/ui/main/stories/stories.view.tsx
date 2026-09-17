import { useEffect, useRef, useState } from "react";
import {
  RiArrowLeftLine,
  RiLockLine,
  RiCheckLine,
  RiHandbagLine,
  RiDownloadLine,
  RiUploadLine,
  RiGroupLine,
  RiEdit2Line,
  RiListCheck3,
  RiErrorWarningLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { CharacterId } from "@domain/character";
import { evaluateCondition, explainCondition } from "@domain/condition";
import {
  TIME_OF_DAY_EMOJI,
  WEATHER_EMOJI,
  DEFAULT_ENVIRONMENT,
} from "@domain/environment";
import { checkStoryReachability, deriveSceneBackground } from "@domain/scene";
import { deriveSceneMood } from "@domain/music";
import { useTranslation } from "@app/store/locale.store";
import * as Dialog from "@app/components/dialog";
import { Tooltip } from "@app/components/tooltip";
import {
  CompanionsContextProvider,
  useCompanionsStore,
} from "../companions/companions.store";
import { LorebookContextProvider } from "../companions/lorebook.store";
import { ChatWindow } from "../companions/chat-window";
import {
  ChatRoomContextProvider,
  useChatRoomStore,
} from "../companions/chat-room.store";
import { GroupChatWindow } from "../companions/group-chat";
import { StoryContextProvider, useStoryStore } from "./story.store";
import { StoryEditor } from "./story-editor";
import { useAmbientSoundtrack } from "./use-ambient-soundtrack";
import { SoundtrackBar } from "./soundtrack-bar";

export const StoriesView = (): JSX.Element => {
  return (
    <LorebookContextProvider>
      <CompanionsContextProvider>
        <ChatRoomContextProvider>
          <StoryContextProvider>
            <StoriesLayout />
          </StoryContextProvider>
        </ChatRoomContextProvider>
      </CompanionsContextProvider>
    </LorebookContextProvider>
  );
};

const StoriesLayout = (): JSX.Element => {
  const { activeStory } = useStoryStore();
  return activeStory ? <SceneShell /> : <StoryLibrary />;
};

const StoryLibrary = (): JSX.Element => {
  const { t } = useTranslation();
  const { stories, enterStory, importSave } = useStoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (file: File) => {
    const result = await importSave(file);
    if (result.success) {
      toast.success(t("stories.save.importSuccess"));
    } else {
      toast.error(t("stories.save.importError"));
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-primary-black text-2xl text-font">
            {t("stories.library.title")}
          </h1>
          <p className="mt-1 text-sm text-font-subtlest">
            {t("stories.library.subtitle")}
          </p>
        </div>
        <Tooltip title={t("stories.save.importSave")}>
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label={t("stories.save.importSave")}
            className="flex items-center gap-1.5 rounded-md p-2 text-xs text-font-subtlest hover:bg-background-neutral hover:text-font"
          >
            <RiUploadLine size={16} />
            {t("stories.save.importSave")}
          </button>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = "";
          }}
          aria-label={t("stories.save.importSave")}
        />
      </div>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,320px)] gap-6">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => enterStory(story.id)}
            className="flex flex-col rounded-md bg-elevation-surface-raised p-4 text-left shadow-xs outline outline-2 outline-transparent transition hover:-translate-y-0.5 hover:shadow-md hover:outline-border-brand"
          >
            <div
              className="mb-3 flex h-24 w-full items-center justify-center rounded text-4xl"
              style={{ background: story.coverColor }}
            >
              {story.coverEmoji}
            </div>
            <p className="font-primary-bold text-lg text-font">{story.title}</p>
            <p className="mt-1 line-clamp-3 text-sm text-font-subtlest">
              {story.synopsis}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

const SceneShell = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    activeStory,
    activeWorld,
    exitStory,
    currentScene,
    exportSave,
    lastSavedAt,
    isEditingStory,
    setIsEditingStory,
    lastEffects,
    environment,
  } = useStoryStore();
  const [openDialogueNpcId, setOpenDialogueNpcId] =
    useState<CharacterId | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isQuestPanelOpen, setIsQuestPanelOpen] = useState(false);
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);

  // The scene's ambient soundtrack mood is a real function of the story's
  // world (tone tags) and the CURRENT environment — a storm event firing
  // really shifts what's playing, same as it shifts the scene background.
  const sceneMood = deriveSceneMood(
    environment ?? DEFAULT_ENVIRONMENT,
    activeWorld
  );
  const soundtrack = useAmbientSoundtrack(sceneMood);

  // Story events fire silently in the data layer — this is where they
  // surface to the player as a toast whenever a batch of effects includes
  // one or more storyEventFired entries.
  useEffect(() => {
    const fired = lastEffects.filter(
      (e): e is Extract<typeof e, { type: "storyEventFired" }> =>
        e.type === "storyEventFired"
    );
    fired.forEach((effect) => toast(`📖 ${effect.narration}`));
  }, [lastEffects]);

  if (!activeStory || !currentScene) return <></>;

  if (isEditingStory) {
    return <StoryEditor onClose={() => setIsEditingStory(false)} />;
  }

  if (openDialogueNpcId) {
    return (
      <SceneDialogue
        characterId={openDialogueNpcId}
        onBack={() => setOpenDialogueNpcId(null)}
      />
    );
  }

  if (isGroupChatOpen) {
    return <SceneGroupChat onBack={() => setIsGroupChatOpen(false)} />;
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-elevation-surface">
      <aside className="flex w-[260px] min-w-[260px] flex-col border-r border-border bg-elevation-surface-sunken p-3">
        <button
          onClick={exitStory}
          className="mb-3 flex items-center gap-2 rounded p-2 text-sm text-font-subtlest hover:bg-background-neutral"
        >
          <RiArrowLeftLine size={16} />
          {t("stories.scene.backToLibrary")}
        </button>
        <div className="mb-3 flex items-center gap-1">
          <Tooltip title={t("stories.inventory.open")}>
            <button
              onClick={() => setIsInventoryOpen(true)}
              aria-label={t("stories.inventory.open")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiHandbagLine size={18} />
            </button>
          </Tooltip>
          <Tooltip title={t("stories.questPanel.open")}>
            <button
              onClick={() => setIsQuestPanelOpen(true)}
              aria-label={t("stories.questPanel.open")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiListCheck3 size={18} />
            </button>
          </Tooltip>
          <Tooltip title={t("stories.save.exportSave")}>
            <button
              onClick={exportSave}
              aria-label={t("stories.save.exportSave")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiDownloadLine size={18} />
            </button>
          </Tooltip>
          <Tooltip title={t("stories.editor.enterEditing")}>
            <button
              onClick={() => setIsEditingStory(true)}
              aria-label={t("stories.editor.enterEditing")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              <RiEdit2Line size={18} />
            </button>
          </Tooltip>
        </div>
        <SceneMap />
        {environment && (
          <div className="mt-3 flex items-center gap-3 rounded-md border border-border bg-elevation-surface-raised px-2 py-1.5 text-xs text-font-subtlest">
            <Tooltip title={t("stories.environment.timeOfDay")}>
              <span className="flex items-center gap-1">
                <span className="text-base">
                  {TIME_OF_DAY_EMOJI[environment.timeOfDay]}
                </span>
                <span>
                  {t(
                    `stories.editor.condition.timeOfDay.${environment.timeOfDay}` as never
                  )}
                </span>
              </span>
            </Tooltip>
            <Tooltip title={t("stories.environment.weather")}>
              <span className="flex items-center gap-1">
                <span className="text-base">
                  {WEATHER_EMOJI[environment.weather]}
                </span>
                <span>
                  {t(
                    `stories.editor.condition.weather.${environment.weather}` as never
                  )}
                </span>
              </span>
            </Tooltip>
          </div>
        )}
        <SoundtrackBar mood={sceneMood} controls={soundtrack} />
        {lastSavedAt && (
          <p className="mt-2 text-2xs text-font-subtlest">
            {t("stories.save.autosaveNote")}
          </p>
        )}
      </aside>
      <SceneView
        onOpenDialogue={setOpenDialogueNpcId}
        onOpenGroupChat={() => setIsGroupChatOpen(true)}
      />

      <InventoryDialog
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />
      <QuestPanelDialog
        isOpen={isQuestPanelOpen}
        onClose={() => setIsQuestPanelOpen(false)}
      />
    </div>
  );
};

const SceneMap = (): JSX.Element => {
  const { t } = useTranslation();
  const { activeStory, scenes, progress, goToScene } = useStoryStore();
  if (!activeStory || !progress) return <></>;

  const storyScenes = scenes.filter((s) => activeStory.sceneIds.includes(s.id));
  // Live, always-on unreachability check (no button needed) — the same
  // real graph-reachability logic the creator-mode check runs, so a scene
  // with no path in from the start scene is flagged right in the list.
  const reachability = checkStoryReachability(
    storyScenes,
    activeStory.startSceneId
  );

  return (
    <ul className="flex flex-col gap-1.5">
      {storyScenes.map((scene) => {
        const unlocked = evaluateCondition(scene.unlock, progress);
        const isCurrent = scene.id === progress.currentSceneId;
        const isUnreachable = reachability.unreachableSceneIds.includes(
          scene.id
        );
        return (
          <li key={scene.id}>
            <button
              disabled={!unlocked}
              onClick={() => goToScene(scene.id)}
              className={
                isCurrent
                  ? "flex w-full items-center gap-2 rounded bg-background-selected p-2 text-left text-sm text-font"
                  : isUnreachable
                    ? "flex w-full cursor-not-allowed items-center gap-2 rounded border border-dashed border-border-danger p-2 text-left text-sm text-font-danger opacity-80"
                    : unlocked
                      ? "flex w-full items-center gap-2 rounded p-2 text-left text-sm text-font hover:bg-background-neutral"
                      : "flex w-full cursor-not-allowed items-center gap-2 rounded p-2 text-left text-sm text-font-subtlest opacity-60"
              }
            >
              <span>{scene.coverEmoji}</span>
              <span className="flex-1">{scene.name}</span>
              {isUnreachable && (
                <Tooltip title={t("stories.scene.unreachableTooltip")}>
                  <span className="flex items-center">
                    <RiErrorWarningLine size={14} />
                  </span>
                </Tooltip>
              )}
              {!isUnreachable && !unlocked && <RiLockLine size={14} />}
              {progress.visitedSceneIds.includes(scene.id) && unlocked && (
                <RiCheckLine size={14} className="text-icon-success" />
              )}
            </button>
          </li>
        );
      })}
      <li className="mt-2 text-2xs text-font-subtlest">
        {t("stories.scene.progressNote")}
      </li>
    </ul>
  );
};

const InventoryDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { items, progress } = useStoryStore();
  const owned = items.filter((item) => (progress?.inventory[item.id] ?? 0) > 0);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[480px]">
            <Dialog.Title>{t("stories.inventory.title")}</Dialog.Title>
            {owned.length === 0 ? (
              <p className="text-sm text-font-subtlest">
                {t("stories.inventory.empty")}
              </p>
            ) : (
              <ul className="space-y-2">
                {owned.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-md border border-border bg-elevation-surface-raised p-3"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <p className="font-primary-bold text-sm text-font">
                        {item.name}
                        {(progress?.inventory[item.id] ?? 0) > 1 &&
                          ` ×${progress?.inventory[item.id]}`}
                      </p>
                      <p className="text-xs text-font-subtlest">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const QuestPanelDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { quests, progress, acceptQuest, turnInQuest } = useStoryStore();

  const withState = quests
    .map((quest) => ({ quest, state: progress?.questStates[quest.id] }))
    .filter(
      (
        entry
      ): entry is {
        quest: (typeof quests)[number];
        state: NonNullable<typeof entry.state>;
      } =>
        !!entry.state &&
        (entry.state.status === "available" ||
          entry.state.status === "active" ||
          entry.state.status === "readyToTurnIn" ||
          entry.state.status === "completed")
    );

  const active = withState.filter(
    (e) => e.state.status === "active" || e.state.status === "available"
  );
  const readyToTurnIn = withState.filter(
    (e) => e.state.status === "readyToTurnIn"
  );
  const completed = withState.filter((e) => e.state.status === "completed");

  const renderQuest = (
    entry: (typeof withState)[number],
    action?: JSX.Element
  ): JSX.Element => (
    <li
      key={entry.quest.id}
      className="rounded-md border border-border bg-elevation-surface-raised p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-primary-bold text-sm text-font">
            {entry.quest.title}
          </p>
          <p className="text-xs text-font-subtlest">
            {entry.quest.description}
          </p>
        </div>
        {action}
      </div>
      {entry.state.status === "active" && (
        <ul className="mt-2 flex flex-col gap-1">
          {entry.quest.objectives.map((obj) => {
            const target =
              obj.kind === "talkToNpc"
                ? obj.times
                : obj.kind === "obtainItem"
                  ? obj.count
                  : 1;
            const current = entry.state.objectiveProgress[obj.id] ?? 0;
            return (
              <li key={obj.id} className="text-2xs text-font-subtlest">
                {obj.label} ({Math.min(current, target)}/{target})
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[520px]">
            <Dialog.Title>{t("stories.questPanel.title")}</Dialog.Title>
            {withState.length === 0 ? (
              <p className="text-sm text-font-subtlest">
                {t("stories.questPanel.empty")}
              </p>
            ) : (
              <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
                {readyToTurnIn.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-bold text-font-subtlest">
                      {t("stories.questPanel.readyToTurnIn")}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {readyToTurnIn.map((e) =>
                        renderQuest(
                          e,
                          <button
                            onClick={() => turnInQuest(e.quest.id)}
                            className="shrink-0 rounded-md bg-background-brand-bold px-2 py-1 text-xs text-font-inverse hover:bg-background-brand-bold-hovered"
                          >
                            {t("stories.questPanel.turnIn")}
                          </button>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {active.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-bold text-font-subtlest">
                      {t("stories.questPanel.active")}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {active.map((e) =>
                        renderQuest(
                          e,
                          e.state.status === "available" ? (
                            <button
                              onClick={() => acceptQuest(e.quest.id)}
                              className="shrink-0 rounded-md bg-background-brand-subtlest px-2 py-1 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered"
                            >
                              {t("stories.questPanel.accept")}
                            </button>
                          ) : undefined
                        )
                      )}
                    </ul>
                  </div>
                )}
                {completed.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-bold text-font-subtlest">
                      {t("stories.questPanel.completed")}
                    </p>
                    <ul className="flex flex-col gap-2 opacity-70">
                      {completed.map((e) => renderQuest(e))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const SceneView = ({
  onOpenDialogue,
  onOpenGroupChat,
}: {
  onOpenDialogue: (characterId: CharacterId) => void;
  onOpenGroupChat: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { characters } = useCompanionsStore();
  const { currentScene, progress, quests, items, takeSceneItem, goToScene } =
    useStoryStore();
  if (!currentScene || !progress) return <></>;

  const npcCharacters = currentScene.npcs.map((npc) => ({
    npc,
    character: characters.find((c) => c.id === npc.characterId),
  }));

  const sceneQuests = quests.filter((q) => q.giverSceneId === currentScene.id);

  const sceneItems = currentScene.items.map((sceneItem) => {
    const item = items.find((i) => i.id === sceneItem.itemId);
    const key = `${currentScene.id}:${sceneItem.itemId}`;
    const alreadyTaken =
      sceneItem.oneTime && progress.takenSceneItemKeys.includes(key);
    const takeable = sceneItem.takeCondition
      ? evaluateCondition(sceneItem.takeCondition, progress)
      : true;
    return { sceneItem, item, alreadyTaken, takeable };
  });

  // Real, state-driven background: the scene's own base color blended with
  // the CURRENT environment (time of day / weather / ambience). Story
  // events that shift the environment (a storm breaking, ambience rising)
  // change this banner the moment they fire — it's a function of live
  // state, not a fixed picture per scene.
  const background = deriveSceneBackground(currentScene, progress.environment);

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className="flex flex-col justify-end px-6 py-8 transition-[background] duration-700 ease-in-out"
        style={{ background: background.gradient }}
      >
        <span
          className={
            background.darkness > 0.45
              ? "mb-1 text-4xl"
              : "mb-1 text-4xl drop-shadow"
          }
        >
          {currentScene.coverEmoji}
        </span>
        <h2
          className={
            background.darkness > 0.45
              ? "font-primary-black text-2xl text-white"
              : "font-primary-black text-2xl text-font"
          }
        >
          {currentScene.name}
        </h2>
        <p
          className={
            background.darkness > 0.45
              ? "mt-1 text-sm italic text-white/80"
              : "mt-1 text-sm italic text-font-subtlest"
          }
        >
          {currentScene.ambience}
        </p>
      </div>
      <div className="p-6">
        <p className="max-w-2xl text-sm text-font">
          {currentScene.description}
        </p>

        {sceneQuests.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {sceneQuests.map((quest) => {
              const state = progress.questStates[quest.id];
              if (!state) return null;
              return (
                <div
                  key={quest.id}
                  className="rounded-md border border-border bg-elevation-surface-raised p-3"
                >
                  <p className="font-primary-bold text-sm text-font">
                    {quest.title}
                  </p>
                  <p className="text-xs text-font-subtlest">
                    {quest.description}
                  </p>
                  <p className="mt-1 text-2xs text-font-subtlest">
                    {t("stories.quest.status")}:{" "}
                    {t(`stories.quest.${state.status}` as never)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {sceneItems.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-bold text-font-subtlest">
              {t("stories.scene.items")}
            </p>
            <div className="flex flex-col gap-2">
              {sceneItems.map(({ sceneItem, item, alreadyTaken, takeable }) => (
                <div
                  key={sceneItem.itemId}
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-elevation-surface-raised px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item?.emoji ?? "🎁"}</span>
                    <span className="text-sm text-font">{sceneItem.label}</span>
                  </div>
                  {alreadyTaken ? (
                    <span className="flex items-center gap-1 text-2xs text-font-subtlest">
                      <RiCheckLine size={12} className="text-icon-success" />
                      {t("stories.scene.itemTaken")}
                    </span>
                  ) : (
                    <button
                      disabled={!takeable}
                      onClick={() =>
                        takeSceneItem(
                          currentScene.id,
                          sceneItem.itemId,
                          sceneItem.oneTime
                        )
                      }
                      className={
                        takeable
                          ? "flex items-center gap-1 rounded-md bg-background-brand-subtlest px-2 py-1 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered"
                          : "flex cursor-not-allowed items-center gap-1 rounded-md bg-background-neutral px-2 py-1 text-xs text-font-subtlest opacity-70"
                      }
                    >
                      {t("stories.scene.takeItem")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-font-subtlest">
              {t("stories.scene.npcsHere")}
            </p>
            {npcCharacters.length > 1 && (
              <button
                onClick={onOpenGroupChat}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-font-brand hover:bg-background-brand-subtlest"
              >
                <RiGroupLine size={14} />
                {t("stories.scene.talkToEveryone")}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {npcCharacters.map(({ npc, character }) =>
              character ? (
                <button
                  key={npc.characterId}
                  onClick={() => onOpenDialogue(npc.characterId)}
                  className="flex items-center gap-2 rounded-md border border-border bg-elevation-surface-raised px-3 py-2 hover:bg-background-neutral"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
                    style={{ background: character.avatarColor }}
                  >
                    {character.avatarEmoji}
                  </span>
                  <span className="text-left">
                    <span className="block font-primary-bold text-sm text-font">
                      {character.name}
                    </span>
                    <span className="block text-2xs text-font-subtlest">
                      {npc.roleInScene}
                    </span>
                  </span>
                </button>
              ) : null
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-bold text-font-subtlest">
            {t("stories.scene.exits")}
          </p>
          <div className="flex flex-col gap-2">
            {currentScene.exits.map((exit, exitIndex) => {
              const unlocked = exit.condition
                ? evaluateCondition(exit.condition, progress)
                : true;
              const explanation = exit.condition
                ? explainCondition(exit.condition, progress, {
                    characterNames: {},
                    sceneNames: {},
                    questTitles: {},
                    itemNames: {},
                  })
                : null;
              return (
                <button
                  key={`${exit.toSceneId}-${exitIndex}`}
                  disabled={!unlocked}
                  onClick={() => goToScene(exit.toSceneId)}
                  className={
                    unlocked
                      ? "flex items-center justify-between rounded-md border border-border bg-elevation-surface-raised px-3 py-2 text-left text-sm text-font hover:bg-background-neutral"
                      : "flex cursor-not-allowed items-center justify-between rounded-md border border-border bg-elevation-surface-sunken px-3 py-2 text-left text-sm text-font-subtlest opacity-70"
                  }
                >
                  <span>{exit.label}</span>
                  {!unlocked && explanation && (
                    <span className="flex items-center gap-1 text-2xs">
                      <RiLockLine size={12} />
                      {t("stories.scene.locked")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const SceneDialogue = ({
  characterId,
  onBack,
}: {
  characterId: CharacterId;
  onBack: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { characters } = useCompanionsStore();
  const {
    currentScene,
    getOrCreateSceneSession,
    appendSceneSessionMessage,
    recordNpcTalk,
    recordSentMessage,
  } = useStoryStore();

  const character = characters.find((c) => c.id === characterId);
  if (!character || !currentScene) return <></>;

  const session = getOrCreateSceneSession(currentScene.id, characterId);

  const handleSend = (text: string) => {
    appendSceneSessionMessage(session.id, text, "user");
    recordNpcTalk(
      characterId,
      currentScene.id,
      `${currentScene.id}:${characterId}`
    );
    recordSentMessage(characterId, text);
    setTimeout(() => {
      appendSceneSessionMessage(session.id, character.greeting, "character");
    }, 800);
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="border-b border-border px-6 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-font-subtlest hover:text-font-brand"
        >
          <RiArrowLeftLine size={14} />
          {t("stories.dialogue.backToScene", { name: currentScene.name })}
        </button>
      </div>
      <ChatWindow
        character={character}
        session={session}
        onOpenHistory={() => {}}
        onEditCharacter={() => {}}
        onOpenPreview={() => {}}
        onSendOverride={handleSend}
      />
    </div>
  );
};

// A scene with 2+ NPCs can start a group conversation — lazily spawns a
// chat-room (via the companions module's own chat-room store, tagged with
// this scene's id) the first time it's opened, and reuses it afterward. Room
// creation is a side effect (it mutates the chat-room store), so it runs in
// useEffect rather than during render — calling createRoom while SceneShell
// is mid-render triggers React's "update a component while rendering a
// different component" warning.
const SceneGroupChat = ({ onBack }: { onBack: () => void }): JSX.Element => {
  const { t } = useTranslation();
  const { currentScene, roomIdBySceneId, registerSceneRoom } = useStoryStore();
  const { rooms, createRoom, deleteRoom } = useChatRoomStore();

  const existingRoomId = currentScene
    ? roomIdBySceneId[currentScene.id]
    : undefined;
  const room = rooms.find((r) => r.id === existingRoomId);

  useEffect(() => {
    if (!currentScene || room) return;
    const newRoom = createRoom({
      name: currentScene.name,
      characterIds: currentScene.npcs.map((npc) => npc.characterId),
      turnMode: "natural",
      lorebookIds: currentScene.lorebookIds,
      sceneId: currentScene.id,
    });
    registerSceneRoom(currentScene.id, newRoom.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene?.id, room]);

  if (!currentScene) return <></>;

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="border-b border-border px-6 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-font-subtlest hover:text-font-brand"
        >
          <RiArrowLeftLine size={14} />
          {t("stories.dialogue.backToScene", { name: currentScene.name })}
        </button>
      </div>
      {room ? (
        <GroupChatWindow
          room={room}
          onDeleteRoom={() => deleteRoom(room.id)}
          onViewCharacter={() => {}}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-font-subtlest">
          {t("stories.scene.talkToEveryone")}
        </div>
      )}
    </div>
  );
};
