import { useState } from "react";
import {
  RiGroupLine,
  RiAddLine,
  RiDeleteBinLine,
  RiChat3Line,
  RiTimeLine,
} from "react-icons/ri";
import cx from "classix";
import { PlayerProfileId } from "@domain/party";
import { Tooltip } from "@app/components/tooltip";
import { Button } from "@app/components/button";
import * as Dialog from "@app/components/dialog";
import { useTranslation } from "@app/store/locale.store";
import { useStoryStore } from "./story.store";
import { PartyActivityPanel } from "./party-activity-panel";

// Shown at the top of the scene shell only when the active story has a
// party — single-player runs never render this at all. Clicking a member
// avatar switches whose turn it is (perspective switch, not movement).
export const PartyBar = ({
  onOpenChannel,
}: {
  onOpenChannel: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { party, switchActiveMember } = useStoryStore();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  if (!party) {
    return (
      <>
        <Tooltip title={t("stories.party.create")}>
          <button
            onClick={() => setIsCreatorOpen(true)}
            aria-label={t("stories.party.create")}
            className="flex h-8 w-8 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
          >
            <RiGroupLine size={18} />
          </button>
        </Tooltip>
        <PartyCreatorDialog
          isOpen={isCreatorOpen}
          onClose={() => setIsCreatorOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="mb-3 flex items-center gap-2 rounded-md border border-border bg-elevation-surface-raised px-2 py-1.5">
      <span className="truncate font-primary-bold text-xs text-font-subtlest">
        {party.name}
      </span>
      <div className="flex flex-1 items-center gap-1">
        {party.members.map((member) => (
          <Tooltip
            key={member.id}
            title={
              member.id === party.activeMemberId
                ? t("stories.party.currentlyActingAs", { name: member.name })
                : t("stories.party.switchTo", { name: member.name })
            }
          >
            <button
              onClick={() => switchActiveMember(member.id)}
              aria-label={
                member.id === party.activeMemberId
                  ? t("stories.party.currentlyActingAs", { name: member.name })
                  : t("stories.party.switchTo", { name: member.name })
              }
              aria-pressed={member.id === party.activeMemberId}
              className={cx(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm transition",
                member.id === party.activeMemberId
                  ? "ring-2 ring-border-brand ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              )}
              style={{ background: member.color }}
            >
              {member.emoji}
            </button>
          </Tooltip>
        ))}
      </div>
      <Tooltip title={t("stories.party.openChannel")}>
        <button
          onClick={onOpenChannel}
          aria-label={t("stories.party.openChannel")}
          className="flex h-6 w-6 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
        >
          <RiChat3Line size={14} />
        </button>
      </Tooltip>
      <Tooltip title={t("stories.party.openActivity")}>
        <button
          onClick={() => setIsActivityOpen(true)}
          aria-label={t("stories.party.openActivity")}
          className="flex h-6 w-6 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
        >
          <RiTimeLine size={14} />
        </button>
      </Tooltip>
      <Tooltip title={t("stories.party.settings")}>
        <button
          onClick={() => setIsSettingsOpen(true)}
          aria-label={t("stories.party.settings")}
          className="flex h-6 w-6 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
        >
          <RiGroupLine size={14} />
        </button>
      </Tooltip>
      <PartyActivityPanel
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />
      <PartySettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

const PartyCreatorDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { createParty } = useStoryStore();
  const [name, setName] = useState("");
  const [memberNames, setMemberNames] = useState(["", ""]);

  const canCreate =
    name.trim().length > 0 &&
    memberNames.filter((n) => n.trim().length > 0).length >= 2;

  const handleCreate = () => {
    const cleaned = memberNames.map((n) => n.trim()).filter(Boolean);
    if (!canCreate) return;
    createParty(name.trim(), cleaned);
    setName("");
    setMemberNames(["", ""]);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[480px]">
            <Dialog.Title>{t("stories.party.createTitle")}</Dialog.Title>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-font-subtlest">
                  {t("stories.party.nameLabel")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("stories.party.namePlaceholder")}
                  className="w-full rounded border border-border bg-background-input px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-font-subtlest">
                  {t("stories.party.membersLabel")}
                </label>
                <div className="flex flex-col gap-1.5">
                  {memberNames.map((memberName, i) => (
                    <input
                      key={i}
                      value={memberName}
                      onChange={(e) => {
                        const next = [...memberNames];
                        next[i] = e.target.value;
                        setMemberNames(next);
                      }}
                      placeholder={t("stories.party.memberPlaceholder", {
                        index: i + 1,
                      })}
                      className="w-full rounded border border-border bg-background-input px-2 py-1.5 text-sm"
                    />
                  ))}
                </div>
                {memberNames.length < 6 && (
                  <button
                    onClick={() => setMemberNames([...memberNames, ""])}
                    className="mt-1.5 flex items-center gap-1 text-xs text-font-brand hover:underline"
                  >
                    <RiAddLine size={14} />
                    {t("stories.party.addMemberField")}
                  </button>
                )}
              </div>
              <p className="rounded-md bg-background-neutral p-2 text-2xs text-font-subtlest">
                {t("stories.party.capabilityNote")}
              </p>
              <div className="flex justify-end gap-2">
                <Button color="neutral" onClick={onClose}>
                  {t("common.cancel")}
                </Button>
                <Button
                  color="primary"
                  onClick={handleCreate}
                  disabled={!canCreate}
                >
                  {t("stories.party.create")}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const PartySettingsDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const { party, addPartyMember, removePartyMember, disbandParty } =
    useStoryStore();
  const [newMemberName, setNewMemberName] = useState("");

  if (!party) return <></>;

  const handleAdd = () => {
    if (!newMemberName.trim() || party.members.length >= 6) return;
    addPartyMember(newMemberName.trim());
    setNewMemberName("");
  };

  const removeMember = (id: PlayerProfileId) => {
    if (party.members.length <= 2) return;
    removePartyMember(id);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[480px]">
            <Dialog.Title>{t("stories.party.settingsTitle")}</Dialog.Title>
            <div className="flex flex-col gap-3">
              <ul className="flex flex-col gap-1.5">
                {party.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-2 rounded-md border border-border bg-elevation-surface-raised p-2"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                      style={{ background: member.color }}
                    >
                      {member.emoji}
                    </span>
                    <span className="flex-1 text-sm text-font">
                      {member.name}
                    </span>
                    {party.members.length > 2 && (
                      <button
                        onClick={() => removeMember(member.id)}
                        aria-label={t("common.delete")}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-icon hover:bg-background-danger-hovered hover:text-font-danger"
                      >
                        <RiDeleteBinLine size={14} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {party.members.length < 6 && (
                <div className="flex gap-2">
                  <input
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder={t("stories.party.memberPlaceholder", {
                      index: party.members.length + 1,
                    })}
                    className="flex-1 rounded border border-border bg-background-input px-2 py-1.5 text-sm"
                  />
                  <Button color="neutral" onClick={handleAdd}>
                    {t("stories.party.addMemberField")}
                  </Button>
                </div>
              )}
              <p className="rounded-md bg-background-neutral p-2 text-2xs text-font-subtlest">
                {t("stories.party.capabilityNote")}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    disbandParty();
                    onClose();
                  }}
                  className="text-xs text-font-danger hover:underline"
                >
                  {t("stories.party.disband")}
                </button>
                <Button color="neutral" onClick={onClose}>
                  {t("common.done")}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
