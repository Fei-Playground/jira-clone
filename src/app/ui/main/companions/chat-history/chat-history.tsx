import cx from "classix";
import { RiAddLine } from "react-icons/ri";
import * as Dialog from "@app/components/dialog";
import { Button } from "@app/components/button";
import { ScrollArea } from "@app/components/scroll-area";
import { Character } from "@domain/character";
import { ChatSession } from "@domain/chat-message";
import { formatDateTime } from "@utils/formatDateTime";
import { useTranslation } from "@app/store/locale.store";

export const ChatHistory = ({
  isOpen,
  character,
  sessions,
  activeSessionId,
  onClose,
  onSelectSession,
  onNewSession,
}: ChatHistoryProps): JSX.Element => {
  const { t, locale } = useTranslation();
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[520px]">
            <div className="mb-1 flex items-center justify-between">
              <Dialog.Title className="!mb-0">
                {t("companions.history.conversationsWith", {
                  name: character.name,
                })}
              </Dialog.Title>
            </div>
            <p className="mb-4 text-xs text-font-subtlest">
              {t("companions.history.description")}
            </p>

            <Button
              variant="subtlest"
              color="neutral"
              className="mb-4 w-full justify-start gap-2"
              onClick={() => {
                onNewSession();
                onClose();
              }}
              aria-label={t("companions.history.startNewConversation")}
            >
              <RiAddLine size={18} />
              {t("companions.history.startNewConversation")}
            </Button>

            <div className="max-h-[360px]">
              <ScrollArea>
                <ul className="space-y-2 pr-2">
                  {sorted.map((session) => (
                    <li key={session.id}>
                      <button
                        onClick={() => {
                          onSelectSession(session.id);
                          onClose();
                        }}
                        aria-label={t("companions.history.openConversation", {
                          title: session.title,
                        })}
                        className={cx(
                          "w-full rounded-md p-3 text-left",
                          session.id === activeSessionId
                            ? "bg-background-selected"
                            : "bg-elevation-surface-raised hover:bg-elevation-surface-raised-hovered"
                        )}
                      >
                        <p className="line-clamp-1 font-primary-bold text-sm text-font">
                          {session.title}
                        </p>
                        <p className="line-clamp-1 text-xs text-font-subtlest">
                          {session.messages[session.messages.length - 1]?.text}
                        </p>
                        <p className="mt-1 text-2xs text-font-subtlest">
                          {formatDateTime(session.updatedAt, locale)} ·{" "}
                          {t("companions.history.messageCount", {
                            count: session.messages.length,
                          })}
                        </p>
                      </button>
                    </li>
                  ))}
                  {sorted.length === 0 && (
                    <li className="p-3 text-sm text-font-subtlest">
                      {t("companions.history.emptyState")}
                    </li>
                  )}
                </ul>
              </ScrollArea>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface ChatHistoryProps {
  isOpen: boolean;
  character: Character;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}
