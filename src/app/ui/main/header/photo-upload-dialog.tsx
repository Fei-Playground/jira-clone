import { useState, useRef, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import { MdOutlineAddAPhoto } from "react-icons/md";
import cx from "classix";
import { Button } from "@app/components/button";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string | null) => void;
  currentPhotoDataUrl: string | null;
}

export const PhotoUploadDialog = ({
  isOpen,
  onClose,
  onSave,
  currentPhotoDataUrl,
}: Props): JSX.Element => {
  const { user } = useUserStore();
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, GIF, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPreviewDataUrl(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSave = () => {
    onSave(previewDataUrl ?? currentPhotoDataUrl);
    onClose();
  };

  const handleRemove = () => {
    onSave(null);
    onClose();
  };

  const hasPhoto = Boolean(currentPhotoDataUrl || user.image);
  const displaySrc = previewDataUrl ?? currentPhotoDataUrl ?? undefined;
  const canSave = Boolean(previewDataUrl);

  const resetState = () => {
    setPreviewDataUrl(null);
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cx(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
            "radix-state-open:animate-fade-in"
          )}
        >
          <Dialog.Content
            className={cx(
              "relative z-50 w-full max-w-[420px] rounded-lg bg-elevation-surface p-6 text-font shadow-xl",
              "radix-state-open:animate-slide-up"
            )}
            onEscapeKeyDown={handleClose}
            onPointerDownOutside={handleClose}
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold text-font">
                Change profile photo
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  onClick={handleClose}
                  className="rounded p-1 text-font-subtle hover:bg-background-neutral hover:text-font"
                  aria-label="Close dialog"
                >
                  <FaTimes size={16} />
                </button>
              </Dialog.Close>
            </div>

            {/* Avatar preview */}
            <div className="mb-5 flex justify-center">
              <UserAvatar {...user} size={120} imageSrc={displaySrc} />
            </div>

            {/* Upload zone */}
            <div
              className={cx(
                "mb-4 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors",
                isDragging
                  ? "border-border-brand bg-background-brand-subtlest"
                  : error
                    ? "border-border-danger bg-background-danger"
                    : "border-border hover:border-border-brand hover:bg-background-brand-subtlest"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload photo"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <MdOutlineAddAPhoto
                size={28}
                className={cx(error ? "text-font-danger" : "text-font-subtle")}
              />
              <span className={cx("text-sm", error ? "text-font-danger" : "text-font-subtle")}>
                {isDragging ? "Drop your image here" : "Click to upload or drag & drop"}
              </span>
              <span className="text-xs text-font-subtlest">JPG, PNG, GIF, WebP · up to 5MB</span>
            </div>

            {/* Error message */}
            {error && (
              <p className="-mt-2 mb-3 text-sm text-font-danger">{error}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Preview confirmation label */}
            {previewDataUrl && !error && (
              <p className="-mt-2 mb-3 text-sm text-font-success">
                ✓ Photo ready — click Save to apply
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div>
                {hasPhoto && (
                  <Button
                    color="danger"
                    variant="text"
                    onClick={handleRemove}
                    className="flex items-center gap-2"
                  >
                    <FaTrash size={12} />
                    Remove photo
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button color="neutral" variant="subtlest" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="flex items-center gap-2"
                >
                  <FaUpload size={12} />
                  Save
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
