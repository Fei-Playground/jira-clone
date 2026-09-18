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
import { Condition, evaluateCondition } from "@domain/condition";
import {
  Character,
  CharacterId,
  charactersMock,
  getCharacterText,
} from "@domain/character";
import {
  ChatSession,
  ChatSessionId,
  createCharacterMessage,
} from "@domain/chat-message";
import { ChatRoomId } from "@domain/chat-room";
import { PlayerProgress } from "@domain/player-progress";
import {
  Party,
  PlayerProfile,
  PlayerProfileId,
  MIN_PARTY_MEMBERS,
  MAX_PARTY_MEMBERS,
  buildPartyActivityEntries,
  nextPartyEmoji,
  nextPartyColor,
} from "@domain/party";
import {
  applyProgressEvent,
  ProgressEvent,
  ProgressEffect,
} from "@domain/player-progress";
import { DEFAULT_ENVIRONMENT } from "@domain/environment";
import {
  NarrativeBlock,
  composeBlocksForEvent,
  composeDialogueBlock,
  appendToManuscript,
  deriveToneHint,
} from "@domain/narrative";
import {
  ManuscriptOptions,
  DEFAULT_MANUSCRIPT_OPTIONS,
} from "@app/ui/main/stories/manuscript";
import { useTranslation } from "@app/store/locale.store";

const AUTOSAVE_STORAGE_KEY = "jira-clone.stories.autosave.v1";
// v2 adds partiesByStoryId (multiplayer). v1 saves are read as single-player
// (partiesByStoryId defaults to {}) — NOT rejected, so upgrading never
// silently discards a player's existing progress.
const AUTOSAVE_VERSION = 2;
const MIN_READABLE_VERSION = 1;

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
  // Added in v2 — absent on a v1 save, which reads as {} (no parties, pure
  // single-player behavior, exactly as before v2 existed).
  partiesByStoryId?: Record<StoryId, Party>;
}

const readAutosave = (): StorySaveFile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StorySaveFile;
    // Any version from MIN_READABLE_VERSION up to the current one is
    // readable — a v1 save simply has no partiesByStoryId, which every
    // reader below already treats as "no party" via `?? {}`.
    if (
      parsed.version < MIN_READABLE_VERSION ||
      parsed.version > AUTOSAVE_VERSION
    ) {
      return null;
    }
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
  makeDialogueChoice: (setFlags: string[]) => void;
  // The live manuscript for the active story — real narrative source
  // material, rendered by the manuscript view. Empty array when there's no
  // active story/progress yet.
  manuscript: NarrativeBlock[];
  manuscriptOptions: ManuscriptOptions;
  setManuscriptOptions: (options: ManuscriptOptions) => void;
  editManuscriptBlock: (blockId: string, text: string) => void;
  toggleManuscriptBlockHidden: (blockId: string) => void;
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

  // Multiplayer party: hot-seat, same-device sharing of one story's
  // progress across several PlayerProfiles. undefined when the active
  // story has no party — every consumer must treat that as "single
  // player, behave exactly as before".
  party: Party | undefined;
  createParty: (name: string, memberNames: string[]) => Party | undefined;
  addPartyMember: (memberName: string) => void;
  removePartyMember: (memberId: PlayerProfileId) => void;
  disbandParty: () => void;
  switchActiveMember: (memberId: PlayerProfileId) => void;
  registerPartyChannel: (roomId: ChatRoomId) => void;
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
  const [partiesByStoryId, setPartiesByStoryId] = useState<
    Record<StoryId, Party>
  >(() => readAutosave()?.partiesByStoryId ?? {});
  const [lastEffects, setLastEffects] = useState<ProgressEffect[]>([]);
  const [sessionsBySceneNpc, setSessionsBySceneNpc] = useState<
    Record<string, ChatSession>
  >({});
  const [roomIdBySceneId, setRoomIdBySceneId] = useState<
    Record<SceneId, ChatRoomId>
  >({});
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [manuscriptOptions, setManuscriptOptions] = useState<ManuscriptOptions>(
    DEFAULT_MANUSCRIPT_OPTIONS
  );
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

  // Localized character list for the manuscript composer (quest-giver /
  // relationship-shift beat text needs a real display name) — mirrors the
  // exact localization rule getOrCreateSceneSession already applies
  // per-character: custom (creator-authored) characters have no i18n entry
  // and keep whatever the creator typed.
  const localizedCharacters: Character[] = useMemo(
    () =>
      charactersMock.map((character) => {
        if (character.isCustom) return character;
        const text = getCharacterText(character.id, locale);
        return text
          ? { ...character, name: text.name, greeting: text.greeting }
          : character;
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
      partiesByStoryId,
    });
  }, [progressByStoryId, activeStoryId, partiesByStoryId]);
  // Displayed "autosaves to this browser" note only needs to know whether
  // there IS progress to save — not the exact timestamp — so it's derived
  // instead of tracked as separate state that would need syncing.
  const lastSavedAt = progress ? progress.updatedAt : null;

  const runEvent = useCallback(
    (event: ProgressEvent) => {
      if (!activeStory || !progress) return;
      // Read the progress to apply against from the LATEST state rather than
      // this render's closure — two events dispatched back-to-back in the
      // same handler (e.g. a dialogue choice's flags followed immediately by
      // the talkToNpc it triggers) would otherwise both start from the same
      // stale snapshot, and the second would overwrite the first.
      let latestEffects: ProgressEffect[] = [];
      setProgressByStoryId((prev) => {
        const current = prev[activeStory.id] ?? progress;
        const result = applyProgressEvent({
          progress: current,
          story: activeStory,
          scenes: localizedScenes,
          quests: localizedQuests,
          storyEvents: localizedStoryEvents,
          event,
        });
        latestEffects = result.effects;
        // When this story has a party, attribute the effects to whoever is
        // currently at the controls and append them to the shared activity
        // log — attribution happens here at the store layer, so
        // applyProgressEvent stays a pure progress calculator with no notion
        // of parties at all.
        const party = partiesByStoryId[activeStory.id];
        let nextProgress = result.progress;
        let activeMember: PlayerProfile | undefined;
        if (party) {
          activeMember = party.members.find(
            (m) => m.id === party.activeMemberId
          );
          if (activeMember) {
            const newEntries = buildPartyActivityEntries({
              effects: result.effects,
              activeMember,
              quests: localizedQuests,
              scenes: localizedScenes,
              items: localizedItems,
            });
            if (newEntries.length > 0) {
              nextProgress = {
                ...nextProgress,
                activityLog: [
                  ...(nextProgress.activityLog ?? []),
                  ...newEntries,
                ],
              };
            }
          }
        }

        // The manuscript: every real thing this event just caused becomes
        // narrative source material in the SAME pass, from the exact same
        // `result` the reducer already computed — no replay, no separate
        // pass, nothing invented.
        const newManuscriptBlocks = composeBlocksForEvent({
          event,
          effects: result.effects,
          progressBefore: current,
          progressAfter: nextProgress,
          scenes: localizedScenes,
          quests: localizedQuests,
          items: localizedItems,
          characters: localizedCharacters,
          activeMember,
          locale,
        });
        if (newManuscriptBlocks.length > 0) {
          nextProgress = {
            ...nextProgress,
            manuscript: appendToManuscript(
              nextProgress.manuscript,
              newManuscriptBlocks,
              locale
            ),
          };
        }

        return { ...prev, [activeStory.id]: nextProgress };
      });
      setLastEffects(() => latestEffects);
    },
    [
      activeStory,
      progress,
      localizedScenes,
      localizedQuests,
      localizedStoryEvents,
      localizedItems,
      localizedCharacters,
      partiesByStoryId,
      locale,
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
        // Chapter 1: the manuscript starts the moment the player steps into
        // the start scene, not only on a LATER scene change — this is the
        // same composer runEvent uses, so the opening chapter is written by
        // exactly the same rule as every chapter after it.
        const openingBlocks = composeBlocksForEvent({
          event: { type: "enterScene", sceneId: story.startSceneId },
          effects: result.effects,
          progressBefore: initial,
          progressAfter: result.progress,
          scenes: localizedScenes,
          quests: localizedQuests,
          items: localizedItems,
          characters: localizedCharacters,
          activeMember: undefined,
          locale,
        });
        const nextProgress =
          openingBlocks.length > 0
            ? {
                ...result.progress,
                manuscript: appendToManuscript(
                  result.progress.manuscript,
                  openingBlocks,
                  locale
                ),
              }
            : result.progress;
        return { ...prev, [storyId]: nextProgress };
      });
    },
    [
      localizedStories,
      localizedScenes,
      localizedQuests,
      localizedStoryEvents,
      localizedItems,
      localizedCharacters,
      locale,
    ]
  );

  const exitStory = useCallback(() => setActiveStoryId(null), []);

  const party = activeStoryId ? partiesByStoryId[activeStoryId] : undefined;

  const createParty = useCallback(
    (name: string, memberNames: string[]): Party | undefined => {
      if (!activeStory || !progress) return undefined;
      if (
        memberNames.length < MIN_PARTY_MEMBERS ||
        memberNames.length > MAX_PARTY_MEMBERS
      ) {
        return undefined;
      }
      const members: PlayerProfile[] = memberNames.map((memberName, i) => ({
        id: uuid(),
        name: memberName,
        emoji: nextPartyEmoji(i),
        color: nextPartyColor(i),
        // Every member starts where the current single-player run already
        // stands — forming a party mid-playthrough doesn't relocate anyone.
        currentSceneId: progress.currentSceneId,
        joinedAt: Date.now(),
      }));
      const newParty: Party = {
        id: uuid(),
        storyId: activeStory.id,
        name,
        members,
        activeMemberId: members[0].id,
        createdAt: Date.now(),
      };
      setPartiesByStoryId((prev) => ({ ...prev, [activeStory.id]: newParty }));
      setProgressByStoryId((prev) => ({
        ...prev,
        [activeStory.id]: { ...prev[activeStory.id], partyId: newParty.id },
      }));
      return newParty;
    },
    [activeStory, progress]
  );

  const addPartyMember = useCallback(
    (memberName: string) => {
      if (!activeStory || !party || !progress) return;
      if (party.members.length >= MAX_PARTY_MEMBERS) return;
      const newMember: PlayerProfile = {
        id: uuid(),
        name: memberName,
        emoji: nextPartyEmoji(party.members.length),
        color: nextPartyColor(party.members.length),
        currentSceneId: progress.currentSceneId,
        joinedAt: Date.now(),
      };
      setPartiesByStoryId((prev) => ({
        ...prev,
        [activeStory.id]: { ...party, members: [...party.members, newMember] },
      }));
    },
    [activeStory, party, progress]
  );

  const removePartyMember = useCallback(
    (memberId: PlayerProfileId) => {
      if (!activeStory || !party) return;
      const remaining = party.members.filter((m) => m.id !== memberId);
      // Historical activityLog entries keep their memberName snapshot, so
      // removing a member never blanks out what they already did.
      const nextActiveMemberId =
        party.activeMemberId === memberId
          ? (remaining[0]?.id ?? party.activeMemberId)
          : party.activeMemberId;
      setPartiesByStoryId((prev) => ({
        ...prev,
        [activeStory.id]: {
          ...party,
          members: remaining,
          activeMemberId: nextActiveMemberId,
        },
      }));
    },
    [activeStory, party]
  );

  const disbandParty = useCallback(() => {
    if (!activeStory) return;
    setPartiesByStoryId((prev) => {
      const next = { ...prev };
      delete next[activeStory.id];
      return next;
    });
    setProgressByStoryId((prev) => ({
      ...prev,
      [activeStory.id]: { ...prev[activeStory.id], partyId: undefined },
    }));
  }, [activeStory]);

  // The single most important piece of the multiplayer design: switching
  // whose turn it is. Step 1 writes the OLD active member's position back
  // from the shared progress.currentSceneId (that's where they really are
  // right now); step 2 flips whose turn it is; step 3 overwrites
  // progress.currentSceneId with the NEW member's saved position —
  // deliberately NOT via an enterScene event, since this is a perspective
  // switch, not a move, and must not re-trigger visitScene objectives or
  // scene-entry story events. Step 4 guards against a scene that became
  // locked since that member was last there (story progressed under them).
  const switchActiveMember = useCallback(
    (memberId: PlayerProfileId) => {
      if (!activeStory || !party || !progress) return;
      const oldMember = party.members.find(
        (m) => m.id === party.activeMemberId
      );
      const newMember = party.members.find((m) => m.id === memberId);
      if (!newMember || newMember.id === party.activeMemberId) return;

      const updatedMembers = party.members.map((m) => {
        if (oldMember && m.id === oldMember.id) {
          return { ...m, currentSceneId: progress.currentSceneId };
        }
        return m;
      });

      let targetSceneId = newMember.currentSceneId;
      const targetScene = localizedScenes.find((s) => s.id === targetSceneId);
      const stillUnlocked =
        targetScene && evaluateCondition(targetScene.unlock, progress);
      if (!targetScene || !stillUnlocked) {
        // The story progressed and this member's last scene is no longer
        // reachable — fall back to the story's start scene rather than
        // stranding the player on a scene evaluateCondition now rejects.
        targetSceneId = activeStory.startSceneId;
      }

      setPartiesByStoryId((prev) => ({
        ...prev,
        [activeStory.id]: {
          ...party,
          members: updatedMembers.map((m) =>
            m.id === newMember.id ? { ...m, currentSceneId: targetSceneId } : m
          ),
          activeMemberId: newMember.id,
        },
      }));
      setProgressByStoryId((prev) => ({
        ...prev,
        [activeStory.id]: {
          ...prev[activeStory.id],
          currentSceneId: targetSceneId,
        },
      }));
    },
    [activeStory, party, progress, localizedScenes]
  );

  // Called once, lazily, the first time the party channel is opened —
  // records which ChatRoom (created via the companions module's own
  // chat-room store, zero NPC members) belongs to this party.
  const registerPartyChannel = useCallback(
    (roomId: ChatRoomId) => {
      if (!activeStory || !party) return;
      setPartiesByStoryId((prev) => ({
        ...prev,
        [activeStory.id]: { ...party, channelRoomId: roomId },
      }));
    },
    [activeStory, party]
  );

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

  // Applies a dialogue choice's flags directly (see DialogueChoice on
  // SceneNpc) — no quest involved. This is the real branching mechanism:
  // whichever flag ends up set is read by other NPCs' reply logic and by
  // quest available/excludedBy conditions elsewhere.
  const makeDialogueChoice = useCallback(
    (setFlags: string[]) => runEvent({ type: "makeDialogueChoice", setFlags }),
    [runEvent]
  );

  // Creator control over the manuscript: a rewritten line overrides the
  // rendered text (the source block is kept, never lost); hiding removes a
  // block from the rendered/exported manuscript while keeping it in the
  // record so un-hiding restores it exactly.
  const editManuscriptBlock = useCallback(
    (blockId: string, text: string) => {
      if (!activeStory) return;
      setProgressByStoryId((prev) => {
        const current = prev[activeStory.id];
        if (!current?.manuscript) return prev;
        return {
          ...prev,
          [activeStory.id]: {
            ...current,
            manuscript: current.manuscript.map((b) =>
              b.id === blockId ? { ...b, editedText: text } : b
            ),
          },
        };
      });
    },
    [activeStory]
  );

  const toggleManuscriptBlockHidden = useCallback(
    (blockId: string) => {
      if (!activeStory) return;
      setProgressByStoryId((prev) => {
        const current = prev[activeStory.id];
        if (!current?.manuscript) return prev;
        return {
          ...prev,
          [activeStory.id]: {
            ...current,
            manuscript: current.manuscript.map((b) =>
              b.id === blockId ? { ...b, hidden: !b.hidden } : b
            ),
          },
        };
      });
    },
    [activeStory]
  );

  const getOrCreateSceneSession = useCallback(
    (sceneId: SceneId, characterId: CharacterId): ChatSession => {
      const key = `${sceneId}:${characterId}`;
      const existing = sessionsBySceneNpc[key];
      if (existing) return existing;

      const character = charactersMock.find((c) => c.id === characterId);
      // Custom (creator-authored) characters have no i18n entry and keep
      // whatever the creator typed, same rule used everywhere else in this
      // domain (character personas, scene text, quest text).
      const localizedText =
        character && !character.isCustom
          ? getCharacterText(character.id, locale)
          : undefined;
      const name = localizedText?.name ?? character?.name;
      const greeting = localizedText?.greeting ?? character?.greeting;
      const newSession: ChatSession = {
        id: uuid(),
        characterId,
        title: name ?? "Scene conversation",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: greeting ? [createCharacterMessage(greeting)] : [],
        sceneId,
      };
      setSessionsBySceneNpc((prev) => ({ ...prev, [key]: newSession }));
      return newSession;
    },
    [sessionsBySceneNpc, locale]
  );

  const appendSceneSessionMessage = useCallback(
    (sessionId: ChatSessionId, text: string, sender: "user" | "character") => {
      let session: ChatSession | undefined;
      setSessionsBySceneNpc((prev) => {
        const key = Object.keys(prev).find((k) => prev[k].id === sessionId);
        if (!key) return prev;
        session = prev[key];
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

      // Every real line said in a scene conversation — player or NPC — is
      // manuscript source material, appended here in the same call rather
      // than replayed later. The NPC's tone is read from its REAL current
      // relationship values, never invented.
      if (activeStory) {
        const character = charactersMock.find(
          (c) => c.id === session?.characterId
        );
        const speakerName =
          sender === "user"
            ? undefined
            : (localizedCharacters.find((c) => c.id === character?.id)?.name ??
              character?.name);
        const dialogueBlock = composeDialogueBlock({
          text,
          speakerId: sender === "character" ? character?.id : undefined,
          speakerName,
          sceneId: session?.sceneId,
          sceneName: currentScene?.name,
          environment: progress?.environment,
          toneHint:
            sender === "character"
              ? deriveToneHint(
                  progress?.npcRelationships?.[character?.id ?? ""]
                )
              : undefined,
        });
        setProgressByStoryId((prev) => {
          const current = prev[activeStory.id];
          if (!current) return prev;
          return {
            ...prev,
            [activeStory.id]: {
              ...current,
              manuscript: appendToManuscript(
                current.manuscript,
                [dialogueBlock],
                locale
              ),
            },
          };
        });
      }
    },
    [activeStory, currentScene, progress, localizedCharacters, locale]
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
    makeDialogueChoice,
    manuscript: progress?.manuscript ?? [],
    manuscriptOptions,
    setManuscriptOptions,
    editManuscriptBlock,
    toggleManuscriptBlockHidden,
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
    party,
    createParty,
    addPartyMember,
    removePartyMember,
    disbandParty,
    switchActiveMember,
    registerPartyChannel,
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
