import { useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoCloseOutline } from "react-icons/io5";

// Represents a file attached to an issue
interface AttachedFile {
  id: string;
  name: string;
  sizeLabel: string; // Pre-calculated size label (e.g., "1.8 MB") for display
  sizeBytes?: number; // File size in bytes; if missing, sizeLabel is used
}

// Component for managing issue attachments: uploading, displaying, and removing files
export const IssueAttachments = (): JSX.Element => {
  // Mock files for demonstration; in production, this would fetch from the server
  const [files, setFiles] = useState<AttachedFile[]>([
    { id: "1", name: "mockup-v2.png", sizeLabel: "1.8 MB", sizeBytes: 1843200 },
    {
      id: "2",
      name: "requirements.pdf",
      sizeLabel: "420 KB",
      sizeBytes: 430080,
    },
  ]);

  // Reference to hidden file input for programmatic triggering when drop zone is clicked
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Remove a file from the list by ID
  const removeFile = (fileId: string): void => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  // Trigger file input when the drop zone is clicked
  const handleDropZoneClick = (): void => {
    fileInputRef.current?.click();
  };

  // Handle files selected via input, converting them to AttachedFile objects and appending to the list
  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFiles = event.currentTarget.files;
    if (selectedFiles) {
      const newFiles: AttachedFile[] = Array.from(selectedFiles).map(
        (file, index) => ({
          // Generate a unique ID using timestamp and index to avoid collisions
          id: `${Date.now()}-${index}`,
          name: file.name,
          sizeBytes: file.size,
          sizeLabel: "", // Will be calculated by formatFileSize
        })
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Format file size for display, using pre-calculated label if available, otherwise compute from sizeBytes
  const formatFileSize = (file: AttachedFile): string => {
    // Use pre-calculated label if available (e.g., mock data)
    if (file.sizeLabel) return file.sizeLabel;
    // No size information available
    if (!file.sizeBytes) return "";
    // Convert bytes to human-readable format (KB, MB, GB, etc.)
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(file.sizeBytes) / Math.log(k));
    const value = parseFloat((file.sizeBytes / Math.pow(k, i)).toFixed(1));
    return `${value} ${sizes[i]}`;
  };

  return (
    <div className="mb-6">
      <p className="font-primary-black text-font">Attachments</p>

      {/* Drop zone for uploading files and list of attached files */}
      <div className="mt-1">
        {/* Drop zone: clickable area to trigger file input or drag-and-drop files */}
        <div
          onClick={handleDropZoneClick}
          className="border-border-subtle mt-4 flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed bg-elevation-surface p-6 transition-colors hover:border-border-bold hover:bg-elevation-surface-raised"
        >
          <GrAttachment
            size={24}
            className="mb-2 text-icon-subtle"
            aria-hidden="true"
          />
          <p className="text-center text-sm text-font">
            Drop files here or click to upload
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            aria-label="Upload files"
          />
        </div>

        {/* List of attached files with remove buttons */}
        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between rounded bg-elevation-surface-sunken p-3 transition-colors hover:bg-elevation-surface"
              >
                {/* Each attachment with file info and remove button */}
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex-1 overflow-hidden">
                    {/* File name with truncation for long names */}
                    <p className="truncate font-primary text-font">
                      {file.name}
                    </p>
                    {/* File size in human-readable format */}
                    <p className="text-xs text-font-subtle">
                      {formatFileSize(file)}
                    </p>
                  </div>
                </div>
                {/* Remove button with hover state for delete action */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="hover:bg-background-danger-subtlest ml-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded transition-colors"
                  aria-label={`Remove ${file.name}`}
                  type="button"
                >
                  <IoCloseOutline
                    size={16}
                    className="text-icon-subtle transition-colors hover:text-icon-danger"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
