import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { v4 as uuid } from "uuid";
import { Story, StoryId, storiesMock, getStoryText } from "@domain/story";
import { World, worldsMock, getWorldText } from "@domain/world";
import {
  Scene,
  SceneId,
  SceneExit,
  scenesMock,
  getSceneText,
} from "@domain/scene";
import { Quest, QuestId, questsMock, getQuestText } from "@domain/quest";
import { Item, itemsMock, getItemText } from "@domain/item";
import {
  StoryEvent,
  storyEventsMock,
  getStoryEventText,
} from "@domain/story-event";
import { EnvironmentState, TimeOfDay, Weather } from "@domain/environment";
import { Condition } from "@domain/condition";
import { CharacterId, charactersMock } from "@domain/character";
import {
  ChatSession,
  ChatSessionId,
  createCharacterMessage,
} from "@domain/chat-message";
import { ChatRoomId } from "@domain/chat-room";
import { PlayerProgress } from "@domain/player-progress";
import {
  applyProgressEvent,
  ProgressEvent,
  ProgressEffect,
} from "@domain/player-progress";
import { DEFAULT_ENVIRONMENT } from "@domain/environment";
import { useTranslation } from "@app/store/locale.store";

const AUTOSAVE_STORAGE_KEY = "jira-clone.stories.autosave.v1";
const AUTOSAVE_VERSION = 1;

const createInitialProgress = (story: Story): PlayerProgress => ({
  storyId: story.id,
  currentSceneId: story.startSceneId,
  visitedSceneIds: [],
  questStates: {},
  inventory: {},
  flags: [],
  npcTalkCounts: {},
  countedTalkSessionIds: [],
  sceneSessionIds: {},
  sceneRoomIds: {},
  takenSceneItemKeys: [],
  environment: story.initialEnvironment
    ? { ...DEFAULT_ENVIRONMENT, ...story.initialEnvironment }
    : { ...DEFAULT_ENVIRONMENT },
  firedEventIds: [],
  updatedAt: Date.now(),
});

// Shape written to / read from localStorage for autosave, and used for the
// manual export/import JSON file — same shape, so an exported save can be
// re-imported and an autosaved session round-trips identically.
interface StorySaveFile {
  version: number;
  savedAt: number;
  progressByStoryId: Record<StoryId, PlayerProgress>;
  activeStoryId: StoryId | null;
}

const readAutosave = (): StorySaveFile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StorySaveFile;
    if (parsed.version !== AUTOSAVE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeAutosave = (save: StorySaveFile): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Storage full/unavailable — autosave is best-effort, never blocking.
  }
};

interface StoryStore {
  stories: Story[];
  scenes: Scene[];
  quests: Quest[];
  items: Item[];
  worlds: World[];
  activeWorld: World | undefined;
  activeStoryId: StoryId | null;
  activeStory: Story | undefined;
  progress: PlayerProgress | undefined;
  lastEffects: ProgressEffect[];
  enterStory: (storyId: StoryId) => void;
  exitStory: () => void;
  currentScene: Scene | undefined;
  goToScene: (sceneId: SceneId) => void;
  acceptQuest: (questId: QuestId) => void;
  turnInQuest: (questId: QuestId) => void;
  takeItem: (itemId: string, count?: number) => void;
  takeSceneItem: (sceneId: SceneId, itemId: string, oneTime: boolean) => void;
  // 1v1 dialogue sessions keyed by scene+npc, created lazily the first time
  // the player talks to that NPC in that scene.
  sessionsBySceneNpc: Record<string, ChatSession>;
  getOrCreateSceneSession: (
    sceneId: SceneId,
    characterId: CharacterId
  ) => ChatSession;
  appendSceneSessionMessage: (
    sessionId: ChatSessionId,
    text: string,
    sender: "user" | "character"
  ) => void;
  // Group-conversation rooms keyed by scene, spawned when a scene has 2+
  // NPCs and the player starts a group conversation there. The room itself
  // lives in the companions module's chat-room store — this only tracks
  // which room id belongs to which scene.
  roomIdBySceneId: Record<SceneId, ChatRoomId>;
  registerSceneRoom: (sceneId: SceneId, roomId: ChatRoomId) => void;
  recordNpcTalk: (
    characterId: CharacterId,
    sceneId: SceneId,
    sessionKey: string
  ) => void;
  recordSentMessage: (
    characterId: CharacterId | undefined,
    text: string
  ) => void;
  // Manual save export/import — same shape autosave uses.
  exportSave: () => void;
  importSave: (file: File) => Promise<{ success: boolean; error?: string }>;
  lastSavedAt: number | null;

  // Creator mode: authoring new/edited scenes, exits and quests for the
  // active story. Scenes/quests created or edited this way are tagged
  // isCustom (via the story's isCustom flag inheritance) and are NOT
  // re-localized on language switch — they're the author's own content.
  isEditingStory: boolean;
  setIsEditingStory: (editing: boolean) => void;
  addScene: (scene: Omit<Scene, "id" | "storyId" | "order">) => Scene;
  updateScene: (sceneId: SceneId, patch: Partial<Scene>) => void;
  deleteScene: (sceneId: SceneId) => void;
  addExit: (sceneId: SceneId, exit: SceneExit) => void;
  removeExit: (sceneId: SceneId, toSceneId: SceneId) => void;
  updateExitCondition: (
    sceneId: SceneId,
    toSceneId: SceneId,
    condition: Condition | undefined
  ) => void;
  addQuest: (quest: Omit<Quest, "id" | "storyId" | "order">) => Quest;
  updateQuest: (questId: QuestId, patch: Partial<Quest>) => void;
  deleteQuest: (questId: QuestId) => void;

  // Event system: lightweight narrative beats that fire on their own when
  // their trigger condition is met while the player is in their scene —
  // no accept/turn-in step, unlike Quest.
  storyEvents: StoryEvent[];
  addStoryEvent: (
    event: Omit<StoryEvent, "id" | "storyId" | "order">
  ) => StoryEvent;
  updateStoryEvent: (eventId: string, patch: Partial<StoryEvent>) => void;
  deleteStoryEvent: (eventId: string) => void;

  // Environment system: a small set of world-state dials (time of day,
  // weather, ambience intensity) read by the condition system and shifted
  // by story events / quest rewards.
  environment: EnvironmentState | undefined;
  setEnvironment: (patch: { timeOfDay?: TimeOfDay; weather?: Weather }) => void;
  // Creator mode: the time-of-day/weather a fresh playthrough of the active
  // story starts with (distinct from setEnvironment, which shifts the LIVE
  // playthrough's current environment).
  updateStoryInitialEnvironment: (patch: {
    timeOfDay?: TimeOfDay;
    weather?: Weather;
  }) => void;
}

const StoryContext = createContext<StoryStore | undefined>(undefined);

export const StoryContextProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { locale } = useTranslation();
  const [activeStoryId, setActiveStoryId] = useState<StoryId | null>(
    () => readAutosave()?.activeStoryId ?? null
  );
  const [progressByStoryId, setProgressByStoryId] = useState<
    Record<StoryId, PlayerProgress>
  >(() => readAutosave()?.progressByStoryId ?? {});
  const [lastEffects, setLastEffects] = useState<ProgressEffect[]>([]);
  const [sessionsBySceneNpc, setSessionsBySceneNpc] = useState<
    Record<string, ChatSession>
  >({});
  const [roomIdBySceneId, setRoomIdBySceneId] = useState<
    Record<SceneId, ChatRoomId>
  >({});
  const [isEditingStory, setIsEditingStory] = useState(false);
  // Creator-mode content: brand-new scenes/quests the author added, plus
  // patches (edits, exit changes) applied on top of any scene/quest —
  // mock-seeded or custom. Kept as separate overlays rather than mutating
  // the mock arrays directly, so the demo content stays pristine.
  const [customScenes, setCustomScenes] = useState<Scene[]>([]);
  const [customQuests, setCustomQuests] = useState<Quest[]>([]);
  const [scenePatches, setScenePatches] = useState<
    Record<SceneId, Partial<Scene>>
  >({});
  const [questPatches, setQuestPatches] = useState<
    Record<QuestId, Partial<Quest>>
  >({});
  const [extraSceneIdsByStory, setExtraSceneIdsByStory] = useState<
    Record<StoryId, SceneId[]>
  >({});
  const [extraQuestIdsByStory, setExtraQuestIdsByStory] = useState<
    Record<StoryId, QuestId[]>
  >({});
  const [customStoryEvents, setCustomStoryEvents] = useState<StoryEvent[]>([]);
  const [storyEventPatches, setStoryEventPatches] = useState<
    Record<string, Partial<StoryEvent>>
  >({});
  // Creator-mode edits to story-level fields (currently just
  // initialEnvironment) that don't fit the scene/quest/event overlays above.
  const [storyPatches, setStoryPatches] = useState<
    Record<StoryId, Partial<Story>>
  >({});

  const localizedStories = useMemo(
    () =>
      storiesMock.map((story) => {
        const text = getStoryText(story.id, locale);
        const base = text
          ? {
              ...story,
              title: text.title,
              synopsis: text.synopsis,
              authorNote: story.authorNote
                ? { ...story.authorNote, text: text.authorNoteText }
                : story.authorNote,
            }
          : story;
        const extraSceneIds = extraSceneIdsByStory[story.id] ?? [];
        const extraQuestIds = extraQuestIdsByStory[story.id] ?? [];
        const patch = storyPatches[story.id];
        const withExtras =
          extraSceneIds.length === 0 && extraQuestIds.length === 0
            ? base
            : {
                ...base,
                sceneIds: [...base.sceneIds, ...extraSceneIds],
                questIds: [...base.questIds, ...extraQuestIds],
              };
        return patch ? { ...withExtras, ...patch } : withExtras;
      }),
    [locale, extraSceneIdsByStory, extraQuestIdsByStory, storyPatches]
  );

  const localizedScenes = useMemo(() => {
    const mockLocalized = scenesMock.map((scene) => {
      const text = getSceneText(scene.id, locale);
      const base = !text
        ? scene
        : {
            ...scene,
            name: text.name,
            description: text.description,
            ambience: text.ambience,
            npcs: scene.npcs.map((npc, i) => ({
              ...npc,
              roleInScene: text.npcRoles[i] ?? npc.roleInScene,
            })),
            exits: scene.exits.map((exit, i) => ({
              ...exit,
              label: text.exitLabels[i] ?? exit.label,
            })),
            items: scene.items.map((item, i) => ({
              ...item,
              label: text.itemLabels[i] ?? item.label,
            })),
          };
      const patch = scenePatches[scene.id];
      return patch ? { ...base, ...patch } : base;
    });
    const patchedCustom = customScenes.map((scene) => {
      const patch = scenePatches[scene.id];
      return patch ? { ...scene, ...patch } : scene;
    });
    return [...mockLocalized, ...patchedCustom];
  }, [locale, scenePatches, customScenes]);

  const localizedQuests = useMemo(() => {
    const mockLocalized = questsMock.map((quest) => {
      const text = getQuestText(quest.id, locale);
      const base = !text
        ? quest
        : {
            ...quest,
            title: text.title,
            description: text.description,
            objectives: quest.objectives.map((obj, i) => ({
              ...obj,
              label: text.objectiveLabels[i] ?? obj.label,
            })),
          };
      const patch = questPatches[quest.id];
      return patch ? { ...base, ...patch } : base;
    });
    const patchedCustom = customQuests.map((quest) => {
      const patch = questPatches[quest.id];
      return patch ? { ...quest, ...patch } : quest;
    });
    return [...mockLocalized, ...patchedCustom];
  }, [locale, questPatches, customQuests]);

  const localizedWorlds = useMemo(
    () =>
      worldsMock.map((world) => {
        const text = getWorldText(world.id, locale);
        if (!text) return world;
        return {
          ...world,
          name: text.name,
          description: text.description,
          tier: text.tier,
          toneTags: text.toneTags,
        };
      }),
    [locale]
  );

  const localizedItems = useMemo(
    () =>
      itemsMock.map((item) => {
        const text = getItemText(item.id, locale);
        if (!text) return item;
        return { ...item, name: text.name, description: text.description };
      }),
    [locale]
  );

  const localizedStoryEvents = useMemo(() => {
    const mockLocalized = storyEventsMock.map((event) => {
      const text = getStoryEventText(event.id, locale);
      if (!text) return event;
      return {
        ...event,
        title: text.title,
        effect: { ...event.effect, narration: text.narration },
      };
    });
    const patchedCustom = customStoryEvents.map((event) => {
      const patch = storyEventPatches[event.id];
      return patch ? { ...event, ...patch } : event;
    });
    const patchedMock = mockLocalized.map((event) => {
      const patch = storyEventPatches[event.id];
      return patch ? { ...event, ...patch } : event;
    });
    return [...patchedMock, ...patchedCustom];
  }, [locale, storyEventPatches, customStoryEvents]);

  const activeStory = localizedStories.find((s) => s.id === activeStoryId);
  const activeWorld = activeStory
    ? localizedWorlds.find((w) => w.id === activeStory.worldId)
    : undefined;
  const progress = activeStoryId ? progressByStoryId[activeStoryId] : undefined;

  // Autosave: any time progress or the active story changes, persist the
  // whole progress map to localStorage — a page refresh restores exactly
  // where the player left off. This is a real side effect (writing to an
  // external system), so it belongs in useEffect, not during render.
  useEffect(() => {
    writeAutosave({
      version: AUTOSAVE_VERSION,
      savedAt: Date.now(),
      progressByStoryId,
      activeStoryId,
    });
  }, [progressByStoryId, activeStoryId]);
  // Displayed "autosaves to this browser" note only needs to know whether
  // there IS progress to save — not the exact timestamp — so it's derived
  // instead of tracked as separate state that would need syncing.
  const lastSavedAt = progress ? progress.updatedAt : null;

  const runEvent = useCallback(
    (event: ProgressEvent) => {
      if (!activeStory || !progress) return;
      const result = applyProgressEvent({
        progress,
        story: activeStory,
        scenes: localizedScenes,
        quests: localizedQuests,
        storyEvents: localizedStoryEvents,
        event,
      });
      setProgressByStoryId((prev) => ({
        ...prev,
        [activeStory.id]: result.progress,
      }));
      setLastEffects(result.effects);
    },
    [
      activeStory,
      progress,
      localizedScenes,
      localizedQuests,
      localizedStoryEvents,
    ]
  );

  const enterStory = useCallback(
    (storyId: StoryId) => {
      setActiveStoryId(storyId);
      setProgressByStoryId((prev) => {
        if (prev[storyId]) return prev;
        const story = localizedStories.find((s) => s.id === storyId);
        if (!story) return prev;
        // Run one enterScene event against the fresh progress so quest
        // availability and scene-unlock state are derived immediately —
        // otherwise the start scene's quests stay invisible until the
        // player navigates away and back (refreshDerivedState only runs
        // inside applyProgressEvent).
        const initial = createInitialProgress(story);
        const result = applyProgressEvent({
          progress: initial,
          story,
          scenes: localizedScenes,
          quests: localizedQuests,
          storyEvents: localizedStoryEvents,
          event: { type: "enterScene", sceneId: story.startSceneId },
        });
        return { ...prev, [storyId]: result.progress };
      });
    },
    [localizedStories, localizedScenes, localizedQuests, localizedStoryEvents]
  );

  const exitStory = useCallback(() => setActiveStoryId(null), []);

  const currentScene = localizedScenes.find(
    (s) => s.id === progress?.currentSceneId
  );

  const addScene = useCallback(
    (scene: Omit<Scene, "id" | "storyId" | "order">): Scene => {
      if (!activeStoryId) throw new Error("No active story to add a scene to");
      const newScene: Scene = {
        ...scene,
        id: uuid(),
        storyId: activeStoryId,
        order: localizedScenes.length,
        isCustom: true,
      };
      setCustomScenes((prev) => [...prev, newScene]);
      setExtraSceneIdsByStory((prev) => ({
        ...prev,
        [activeStoryId]: [...(prev[activeStoryId] ?? []), newScene.id],
      }));
      return newScene;
    },
    [activeStoryId, localizedScenes.length]
  );

  const updateScene = useCallback((sceneId: SceneId, patch: Partial<Scene>) => {
    setScenePatches((prev) => ({
      ...prev,
      [sceneId]: { ...prev[sceneId], ...patch },
    }));
  }, []);

  const deleteScene = useCallback(
    (sceneId: SceneId) => {
      setCustomScenes((prev) => prev.filter((s) => s.id !== sceneId));
      setScenePatches((prev) => {
        const next = { ...prev };
        delete next[sceneId];
        return next;
      });
      if (activeStoryId) {
        setExtraSceneIdsByStory((prev) => ({
          ...prev,
          [activeStoryId]: (prev[activeStoryId] ?? []).filter(
            (id) => id !== sceneId
          ),
        }));
      }
      // Remove any exits pointing at the deleted scene so the story doesn't
      // end up with a dangling reference.
      localizedScenes.forEach((scene) => {
        if (scene.exits.some((e) => e.toSceneId === sceneId)) {
          setScenePatches((prev) => ({
            ...prev,
            [scene.id]: {
              ...prev[scene.id],
              exits: (prev[scene.id]?.exits ?? scene.exits).filter(
                (e) => e.toSceneId !== sceneId
              ),
            },
          }));
        }
      });
    },
    [activeStoryId, localizedScenes]
  );

  const addExit = useCallback(
    (sceneId: SceneId, exit: SceneExit) => {
      const scene = localizedScenes.find((s) => s.id === sceneId);
      if (!scene) return;
      setScenePatches((prev) => ({
        ...prev,
        [sceneId]: {
          ...prev[sceneId],
          exits: [...(prev[sceneId]?.exits ?? scene.exits), exit],
        },
      }));
    },
    [localizedScenes]
  );

  const removeExit = useCallback(
    (sceneId: SceneId, toSceneId: SceneId) => {
      const scene = localizedScenes.find((s) => s.id === sceneId);
      if (!scene) return;
      setScenePatches((prev) => ({
        ...prev,
        [sceneId]: {
          ...prev[sceneId],
          exits: (prev[sceneId]?.exits ?? scene.exits).filter(
            (e) => e.toSceneId !== toSceneId
          ),
        },
      }));
    },
    [localizedScenes]
  );

  const updateExitCondition = useCallback(
    (
      sceneId: SceneId,
      toSceneId: SceneId,
      condition: Condition | undefined
    ) => {
      const scene = localizedScenes.find((s) => s.id === sceneId);
      if (!scene) return;
      setScenePatches((prev) => ({
        ...prev,
        [sceneId]: {
          ...prev[sceneId],
          exits: (prev[sceneId]?.exits ?? scene.exits).map((e) =>
            e.toSceneId === toSceneId ? { ...e, condition } : e
          ),
        },
      }));
    },
    [localizedScenes]
  );

  const addQuest = useCallback(
    (quest: Omit<Quest, "id" | "storyId" | "order">): Quest => {
      if (!activeStoryId) throw new Error("No active story to add a quest to");
      const newQuest: Quest = {
        ...quest,
        id: uuid(),
        storyId: activeStoryId,
        order: localizedQuests.length,
        isCustom: true,
      };
      setCustomQuests((prev) => [...prev, newQuest]);
      setExtraQuestIdsByStory((prev) => ({
        ...prev,
        [activeStoryId]: [...(prev[activeStoryId] ?? []), newQuest.id],
      }));
      return newQuest;
    },
    [activeStoryId, localizedQuests.length]
  );

  const updateQuest = useCallback((questId: QuestId, patch: Partial<Quest>) => {
    setQuestPatches((prev) => ({
      ...prev,
      [questId]: { ...prev[questId], ...patch },
    }));
  }, []);

  const deleteQuest = useCallback(
    (questId: QuestId) => {
      setCustomQuests((prev) => prev.filter((q) => q.id !== questId));
      setQuestPatches((prev) => {
        const next = { ...prev };
        delete next[questId];
        return next;
      });
      if (activeStoryId) {
        setExtraQuestIdsByStory((prev) => ({
          ...prev,
          [activeStoryId]: (prev[activeStoryId] ?? []).filter(
            (id) => id !== questId
          ),
        }));
      }
    },
    [activeStoryId]
  );

  const addStoryEvent = useCallback(
    (event: Omit<StoryEvent, "id" | "storyId" | "order">): StoryEvent => {
      if (!activeStoryId) throw new Error("No active story to add an event to");
      const newEvent: StoryEvent = {
        ...event,
        id: uuid(),
        storyId: activeStoryId,
        order: localizedStoryEvents.length,
        isCustom: true,
      };
      setCustomStoryEvents((prev) => [...prev, newEvent]);
      return newEvent;
    },
    [activeStoryId, localizedStoryEvents.length]
  );

  const updateStoryEvent = useCallback(
    (eventId: string, patch: Partial<StoryEvent>) => {
      setStoryEventPatches((prev) => ({
        ...prev,
        [eventId]: { ...prev[eventId], ...patch },
      }));
    },
    []
  );

  const deleteStoryEvent = useCallback((eventId: string) => {
    setCustomStoryEvents((prev) => prev.filter((e) => e.id !== eventId));
    setStoryEventPatches((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  }, []);

  const updateStoryInitialEnvironment = useCallback(
    (patch: { timeOfDay?: TimeOfDay; weather?: Weather }) => {
      if (!activeStoryId) return;
      setStoryPatches((prev) => {
        const current =
          prev[activeStoryId]?.initialEnvironment ??
          localizedStories.find((s) => s.id === activeStoryId)
            ?.initialEnvironment ??
          DEFAULT_ENVIRONMENT;
        return {
          ...prev,
          [activeStoryId]: {
            ...prev[activeStoryId],
            initialEnvironment: { ...current, ...patch },
          },
        };
      });
    },
    [activeStoryId, localizedStories]
  );

  const setEnvironment = useCallback(
    (patch: { timeOfDay?: TimeOfDay; weather?: Weather }) =>
      runEvent({ type: "setEnvironment", ...patch }),
    [runEvent]
  );

  const goToScene = useCallback(
    (sceneId: SceneId) => runEvent({ type: "enterScene", sceneId }),
    [runEvent]
  );

  const acceptQuest = useCallback(
    (questId: QuestId) => runEvent({ type: "acceptQuest", questId }),
    [runEvent]
  );

  const turnInQuest = useCallback(
    (questId: QuestId) => runEvent({ type: "turnInQuest", questId }),
    [runEvent]
  );

  const takeItem = useCallback(
    (itemId: string, count = 1) =>
      runEvent({ type: "takeItem", itemId, count }),
    [runEvent]
  );

  const takeSceneItem = useCallback(
    (sceneId: SceneId, itemId: string, oneTime: boolean) =>
      runEvent({ type: "takeSceneItem", sceneId, itemId, oneTime }),
    [runEvent]
  );

  const recordNpcTalk = useCallback(
    (characterId: CharacterId, sceneId: SceneId, sessionKey: string) =>
      runEvent({ type: "talkToNpc", characterId, sceneId, sessionKey }),
    [runEvent]
  );

  const recordSentMessage = useCallback(
    (characterId: CharacterId | undefined, text: string) =>
      runEvent({ type: "sendMessage", characterId, text }),
    [runEvent]
  );

  const getOrCreateSceneSession = useCallback(
    (sceneId: SceneId, characterId: CharacterId): ChatSession => {
      const key = `${sceneId}:${characterId}`;
      const existing = sessionsBySceneNpc[key];
      if (existing) return existing;

      const character = charactersMock.find((c) => c.id === characterId);
      const newSession: ChatSession = {
        id: uuid(),
        characterId,
        title: character?.name ?? "Scene conversation",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: character ? [createCharacterMessage(character.greeting)] : [],
        sceneId,
      };
      setSessionsBySceneNpc((prev) => ({ ...prev, [key]: newSession }));
      return newSession;
    },
    [sessionsBySceneNpc]
  );

  const appendSceneSessionMessage = useCallback(
    (sessionId: ChatSessionId, text: string, sender: "user" | "character") => {
      setSessionsBySceneNpc((prev) => {
        const key = Object.keys(prev).find((k) => prev[k].id === sessionId);
        if (!key) return prev;
        const session = prev[key];
        const message =
          sender === "user"
            ? {
                id: uuid(),
                sender: "user" as const,
                text,
                createdAt: Date.now(),
              }
            : createCharacterMessage(text);
        return {
          ...prev,
          [key]: {
            ...session,
            messages: [...session.messages, message],
            updatedAt: Date.now(),
          },
        };
      });
    },
    []
  );

  const registerSceneRoom = useCallback(
    (sceneId: SceneId, roomId: ChatRoomId) => {
      setRoomIdBySceneId((prev) => ({ ...prev, [sceneId]: roomId }));
    },
    []
  );

  const exportSave = useCallback(() => {
    const save: StorySaveFile = {
      version: AUTOSAVE_VERSION,
      savedAt: Date.now(),
      progressByStoryId,
      activeStoryId,
    };
    const blob = new Blob([JSON.stringify(save, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `story-progress-${new Date(save.savedAt).toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [progressByStoryId, activeStoryId]);

  const importSave = useCallback(
    async (file: File): Promise<{ success: boolean; error?: string }> => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as StorySaveFile;
        if (parsed.version !== AUTOSAVE_VERSION || !parsed.progressByStoryId) {
          return { success: false, error: "invalid_format" };
        }
        // Drop progress for any story/scene/quest ids the current mock data
        // no longer has — the demo content may have changed since the save
        // was made, and stale ids would otherwise crash lookups downstream.
        const validStoryIds = new Set(localizedStories.map((s) => s.id));
        const cleanedProgress: Record<StoryId, PlayerProgress> = {};
        Object.entries(parsed.progressByStoryId).forEach(([storyId, p]) => {
          if (validStoryIds.has(storyId)) cleanedProgress[storyId] = p;
        });
        setProgressByStoryId(cleanedProgress);
        setActiveStoryId(
          parsed.activeStoryId && cleanedProgress[parsed.activeStoryId]
            ? parsed.activeStoryId
            : null
        );
        return { success: true };
      } catch {
        return { success: false, error: "invalid_json" };
      }
    },
    [localizedStories]
  );

  const value: StoryStore = {
    stories: localizedStories,
    scenes: localizedScenes,
    quests: localizedQuests,
    items: localizedItems,
    worlds: localizedWorlds,
    activeWorld,
    activeStoryId,
    activeStory,
    progress,
    lastEffects,
    enterStory,
    exitStory,
    currentScene,
    goToScene,
    acceptQuest,
    turnInQuest,
    takeItem,
    takeSceneItem,
    sessionsBySceneNpc,
    getOrCreateSceneSession,
    appendSceneSessionMessage,
    roomIdBySceneId,
    registerSceneRoom,
    recordNpcTalk,
    recordSentMessage,
    exportSave,
    importSave,
    lastSavedAt,
    isEditingStory,
    setIsEditingStory,
    addScene,
    updateScene,
    deleteScene,
    addExit,
    removeExit,
    updateExitCondition,
    addQuest,
    updateQuest,
    deleteQuest,
    storyEvents: localizedStoryEvents,
    addStoryEvent,
    updateStoryEvent,
    deleteStoryEvent,
    environment: progress?.environment,
    setEnvironment,
    updateStoryInitialEnvironment,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
};

export const useStoryStore = (): StoryStore => {
  const store = useContext(StoryContext);
  if (!store) {
    throw new Error("Story context not found");
  }
  return store;
};
