import { useState, useRef } from "react";
import {
  HiPaperClip,
  HiOutlineDocumentText,
  HiXMark,
} from "react-icons/hi2";
import cx from "classix";
import { v4 as uuid } from "uuid";
import { formatFileSize } from "@utils/formatFileSize";

const INITIAL_ATTACHMENTS: Attachment[] = [
  { id: "1", name: "mockup-v2.png", size: "1.8 MB" },
  { id: "2", name: "requirements.pdf", size: "420 KB" },
];

export const AttachmentsSection = (): JSX.Element => {
  const [attachments, setAttachments] = useState<Attachment[]>(
    INITIAL_ATTACHMENTS
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);

    // Reset input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addFiles = (files: File[]) => {
    const newAttachments = files.map((file) => ({
      id: uuid(),
      name: file.name,
      size: formatFileSize(file.size),
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id: string): void => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <p className="mb-3 font-primary-black text-font">Attachments</p>

      {/* Drop Zone */}
      <div
        className={cx(
          "cursor-pointer rounded-lg border-2 border-dashed p-6",
          "text-center transition-colors",
          isDragOver
            ? "border-background-brand-bold bg-background-brand-subtlest"
            : "border-border"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleDropZoneClick();
          }
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <HiPaperClip size={20} className="text-font-subtle" />
          <span className="text-sm text-font-subtle">
            Drop files here or click to upload
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload attachments"
      />

      {/* Attached Files List */}
      {attachments.length > 0 && (
        <div className="mt-3 space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between rounded-md bg-elevation-surface-raised px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <HiOutlineDocumentText
                  size={16}
                  className="text-font-subtle"
                />
                <span className="text-sm text-font">{attachment.name}</span>
                <span className="text-xs text-font-subtle">
                  {attachment.size}
                </span>
              </div>
              <button
                type="button"
                aria-label="Remove attachment"
                onClick={() => removeAttachment(attachment.id)}
                className="rounded p-1 hover:bg-background-neutral"
              >
                <HiXMark
                  size={14}
                  className="text-font-subtle hover:text-font-danger"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Attachment {
  id: string;
  name: string;
  size: string;
}
