import cx from "classix";
import { RiAddLine } from "react-icons/ri";
import * as Dialog from "@app/components/dialog";
import { Button } from "@app/components/button";
import { ScrollArea } from "@app/components/scroll-area";
import { Character } from "@domain/character";
import { ChatSession } from "@domain/chat-message";
import { formatDateTime } from "@utils/formatDateTime";

export const ChatHistory = ({
  isOpen,
  character,
  sessions,
  activeSessionId,
  onClose,
  onSelectSession,
  onNewSession,
}: ChatHistoryProps): JSX.Element => {
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content className="max-w-[520px]">
            <div className="mb-1 flex items-center justify-between">
              <Dialog.Title className="!mb-0">
                Conversations with {character.name}
              </Dialog.Title>
            </div>
            <p className="mb-4 text-xs text-font-subtlest">
              Every conversation is saved separately, so you can pick up an old
              thread or start something new.
            </p>

            <Button
              variant="subtlest"
              color="neutral"
              className="mb-4 w-full justify-start gap-2"
              onClick={() => {
                onNewSession();
                onClose();
              }}
              aria-label="Start a new conversation"
            >
              <RiAddLine size={18} />
              Start a new conversation
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
                        aria-label={`Open conversation: ${session.title}`}
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
                          {formatDateTime(session.updatedAt)} ·{" "}
                          {session.messages.length} messages
                        </p>
                      </button>
                    </li>
                  ))}
                  {sorted.length === 0 && (
                    <li className="p-3 text-sm text-font-subtlest">
                      No conversations yet — start one above.
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
