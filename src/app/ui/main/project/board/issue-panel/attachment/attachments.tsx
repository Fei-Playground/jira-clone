import { v4 as uuid } from "uuid";
import { Attachment, AttachmentId } from "@domain/attachment";
import { ImAttachment } from "react-icons/im";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "@app/components/button";
import { useUserStore } from "@app/store/user.store";
import cx from "classix";

export const Attachments = ({
  attachments,
  addAttachment,
  removeAttachment,
  readOnly,
}: AttachmentsProps): JSX.Element => {
  const { user } = useUserStore();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = `temp-${uuid()}`;
      const fileType = file.name.split(".").pop() || "unknown";

      addAttachment({
        id: tempId,
        name: file.name,
        size: file.size,
        type: fileType,
        uploadedAt: Date.now(),
        uploadedBy: user,
      });
    }

    // Reset input
    e.currentTarget.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + " " + sizes[i];
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        {!readOnly && (
          <label htmlFor="attachment-input">
            <input
              id="attachment-input"
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              aria-label="Add attachments"
            />
            <Button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "attachment-input"
                ) as HTMLInputElement;
                input?.click();
              }}
              variant="neutral"
              size="sm"
              className="gap-2"
              aria-label="Add attachment"
            >
              <ImAttachment size={16} />
              Add attachment
            </Button>
          </label>
        )}
      </div>

      {attachments.length === 0 ? (
        <p className="font-primary-light text-sm text-font-subtlest">
          No attachments yet
        </p>
      ) : (
        <ul className="space-y-3">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between rounded-md bg-background-neutral-subtlest px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <ImAttachment size={16} className="flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-primary truncate text-sm">
                    {attachment.name}
                  </p>
                  <p className="font-primary-light text-xs text-font-subtlest">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
              {!readOnly && (
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className={cx(
                    "ml-4 flex-shrink-0 rounded p-1 hover:bg-background-neutral",
                    "text-icon hover:text-icon-danger",
                    "transition-colors"
                  )}
                  aria-label={`Remove ${attachment.name}`}
                >
                  <IoCloseOutline size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface AttachmentsProps {
  attachments: Attachment[];
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (attachmentId: AttachmentId) => void;
  readOnly: boolean;
}
