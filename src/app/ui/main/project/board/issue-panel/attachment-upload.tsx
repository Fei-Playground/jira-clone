import { useRef, useState } from "react";
import cx from "classix";
import { Attachment } from "@domain/comment";
import { Button } from "@app/components/button";

export const AttachmentUpload = ({
  attachments = [],
  onAddAttachments,
  onRemoveAttachment,
}: AttachmentUploadProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    onAddAttachments(newAttachments);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        className={cx(
          "rounded-md border-2 border-dashed p-4 transition-colors",
          isHovering
            ? "border-border-brand bg-background-brand-subtlest"
            : "border-border-input bg-background-input"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload attachments"
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-primary text-font">
              Attachments ({attachments.length})
            </p>
            <p className="text-xs text-font-subtle">
              Drag files here or click to select
            </p>
          </div>
          <Button
            type="button"
            variant="text"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Add attachments"
          >
            Add Files
          </Button>
        </div>
      </div>

      {attachments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between rounded bg-background-neutral px-3 py-2"
            >
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <span className="text-lg">📎</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-primary text-font">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-font-subtle">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="text"
                color="neutral"
                size="sm"
                onClick={() => onRemoveAttachment(attachment.id)}
                aria-label={`Remove ${attachment.name}`}
                className="ml-2"
              >
                ✕
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface AttachmentUploadProps {
  attachments?: Attachment[];
  onAddAttachments: (attachments: Attachment[]) => void;
  onRemoveAttachment: (id: string) => void;
}
