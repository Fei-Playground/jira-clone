import { useState, useRef } from "react";
import cx from "classix";
import { AiOutlineDelete, AiOutlinePaperClip } from "react-icons/ai";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import type { Attachment } from "@domain/comment";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
  defaultAttachments = [],
}: EditBoxProps): JSX.Element => {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Attachment[]>(defaultAttachments);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      }));
      setAttachments([...attachments, ...newAttachments]);
      // Reset input so the same file can be selected again
      event.currentTarget.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
    setAttachments(defaultAttachments);
  };

  const onSave = () => {
    if (messageIsValid()) {
      save(message, attachments);
      resetValues();
    } else {
      setInitError(true);
    }
  };

  const onCancel = () => {
    if (cancel) cancel();
    resetValues();
  };
  const onFocus = () => setIsEditing(true);

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment...";

  return (
    <div className="w-full">
      <TextareaAutosize
        name="comment"
        value={message}
        setValue={setMessage}
        placeholder={placeholder}
        onFocus={onFocus}
        autofocus={autofocus}
        textareaClassName={cx(
          "min-h-[80px] leading-6 font-primary-light outline outline-2 outline-border-input focus:outline-border-brand bg-background-input",
          isError &&
            "placeholder:text-font-danger placeholder:text-opacity-70 !outline-border-danger !outline-2"
        )}
      />
      {isEditing && (
        <div className="mt-3 space-y-3">
          {attachments.length > 0 && (
            <div className="rounded border border-border-brand bg-background-brand-subtlest p-2">
              <p className="mb-2 text-xs font-primary-bold text-font">
                Attachments ({attachments.length})
              </p>
              <ul className="space-y-1">
                {attachments.map((attachment) => (
                  <li
                    key={attachment.id}
                    className="flex items-center justify-between rounded bg-background-brand-subtlest-hovered p-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <AiOutlinePaperClip size={14} className="flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-primary-light text-font">
                          {attachment.fileName}
                        </p>
                        <p className="text-2xs font-primary-light text-font-subtlest">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="ml-2 flex-shrink-0 text-icon-accent-red hover:text-icon-accent-red-hovered"
                      aria-label={`Remove attachment ${attachment.fileName}`}
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Attach files to comment"
            />
            <Button
              type="button"
              color="neutral"
              variant="text"
              className="px-4 py-2.5 flex items-center gap-1"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Add attachments"
            >
              <AiOutlinePaperClip size={16} />
              Attach
            </Button>
          </div>
        </div>
      )}
      <div
        className={cx(
          "mt-2 flex gap-2 text-sm",
          isEditing ? "visible" : "hidden"
        )}
      >
        <Button
          type="button"
          className="px-4 py-2.5"
          onClick={onSave}
          aria-label="Save comment"
        >
          Save
        </Button>
        <Button
          color="neutral"
          variant="text"
          className="px-4 py-2.5"
          onClick={onCancel}
          aria-label="Cancel comment"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

interface EditBoxProps {
  defaultMessage: string;
  autofocus?: boolean;
  save: (commentText: string, attachments: Attachment[]) => void;
  cancel?: () => void;
  defaultAttachments?: Attachment[];
}
