import { useState } from "react";
import { GoPaperclip } from "react-icons/go";
import { AiOutlineFile } from "react-icons/ai";
import cx from "classix";

// Represents an uploaded file with formatted size for display
interface AttachmentFile {
  id: string;
  name: string;
  size: string; // Human-readable format (e.g., "1.8 MB")
}

// Mock attachments for demonstration - replace with actual API integration
const MOCK_ATTACHMENTS: AttachmentFile[] = [
  { id: "1", name: "mockup-v2.png", size: "1.8 MB" },
  { id: "2", name: "requirements.pdf", size: "420 KB" },
];

export const Attachments = (): JSX.Element => {
  const [files, setFiles] = useState<AttachmentFile[]>(MOCK_ATTACHMENTS);
  // isDragging controls visual feedback when hovering with files
  const [isDragging, setIsDragging] = useState(false);

  // Drag-and-drop handlers for file upload
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFilesToState(droppedFiles);
    }
  };

  // Handle file selection from the hidden file input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFilesToState(selectedFiles);
    }
  };

  // Convert File objects to AttachmentFile records with human-readable sizes
  const addFilesToState = (fileList: FileList) => {
    const newFiles: AttachmentFile[] = Array.from(fileList).map(
      (file: File, index: number) => ({
        id: Date.now().toString() + index,
        name: file.name,
        // Format file size as MB or KB depending on magnitude
        size:
          file.size >= 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
            : (file.size / 1024).toFixed(0) + " KB",
      })
    );
    setFiles([...files, ...newFiles]);
  };

  // Remove a file from the attachments list
  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div>
      <p className="font-primary-black text-font">Attachments</p>
      {/* Upload section with drag-and-drop support */}
      {/* File upload area - supports both drag-and-drop and click to browse */}
      <div
        className={cx(
          "mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-border-input p-6 transition-colors",
          isDragging && "bg-background-input"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
        role="button"
        tabIndex={0}
      >
        <GoPaperclip size={24} className="text-font-subtlest" />
        <p className="text-center text-font-subtlest">
          Drop files here or click to upload
        </p>
        {/* Hidden file input triggered by click or drop handlers */}
        <input
          id="file-input"
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload files"
        />
      </div>
      {/* Attachment list with remove buttons */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-3 rounded px-2 py-1.5 hover:bg-background-neutral"
            >
              <div className="flex items-center gap-2">
                <AiOutlineFile size={18} className="text-font-subtlest" />
                <span className="text-font">{file.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-font-subtlest">{file.size}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-sm leading-none text-font-subtlest hover:text-font-danger"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
