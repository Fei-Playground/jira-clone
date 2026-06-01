import { useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoCloseOutline } from "react-icons/io5";
import cx from "classix";

export interface Attachment {
  id: string;
  name: string;
  size: string;
}

export const Attachments = (): JSX.Element => {
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "1", name: "mockup-v2.png", size: "1.8 MB" },
    { id: "2", name: "requirements.pdf", size: "420 KB" },
  ]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    addAttachmentsFromFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      addAttachmentsFromFiles(files);
    }
    // Reset input so the same file can be selected again
    e.currentTarget.value = "";
  };

  const addAttachmentsFromFiles = (files: FileList) => {
    const newAttachments: Attachment[] = Array.from(files).map((file) => {
      const sizeInBytes = file.size;
      const sizeString = formatFileSize(sizeInBytes);
      return {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: sizeString,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  return (
    <div className="space-y-4">
      <p className="font-primary-black text-font">Attachments</p>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-8 py-8 transition-colors duration-200",
          isDragOver
            ? "border-border-brand bg-background-brand-subtlest"
            : "border-border bg-background-subtlest"
        )}
      >
        <GrAttachment className="mb-3 text-2xl text-font-subtlest" />
        <p className="font-primary text-sm text-font-subtlest">
          Drop files here or click to upload
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="sr-only"
          aria-label="Upload files"
        />
      </label>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between rounded-md border border-border bg-background-subtlest px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <GrAttachment className="text-lg text-font-subtlest" />
                <div className="flex items-center gap-2">
                  <p className="font-primary text-sm text-font">
                    {attachment.name}
                  </p>
                  <p className="font-primary-light text-xs text-font-subtlest">
                    {attachment.size}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="flex items-center justify-center text-font-subtlest transition-colors duration-150 hover:text-font-danger"
                aria-label={`Remove ${attachment.name}`}
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = Math.round((bytes / Math.pow(k, i)) * 10) / 10;
  return `${value} ${sizes[i]}`;
}
