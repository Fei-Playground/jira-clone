import { useState } from "react";
import { Form } from "react-router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaPowerOff, FaCamera } from "react-icons/fa";
import cx from "classix";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { Button } from "@app/components/button";
import { PhotoUploadDialog } from "./photo-upload-dialog";

export const UserProfile = (): JSX.Element => {
  const { user, photoDataUrl, updatePhoto } = useUserStore();
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOpenPhotoDialog = () => {
    setIsDropdownOpen(false);
    // Small delay to let the dropdown close its animation before dialog opens
    setTimeout(() => setIsPhotoDialogOpen(true), 150);
  };

  const handleSavePhoto = (dataUrl: string | null) => {
    updatePhoto(dataUrl);
  };

  return (
    <>
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger className="ml-1 rounded-full outline outline-2 outline-border-disabled hover:outline-border-brand">
          <UserAvatar {...user} imageSrc={photoDataUrl ?? undefined} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={5}
            className={cx(
              "z-50 rounded bg-elevation-surface-overlay shadow-md",
              "radix-side-bottom:animate-slide-down radix-side-top:animate-slide-up"
            )}
          >
            {/* Profile section: avatar with camera hover overlay + name */}
            <DropdownMenu.Item className="flex flex-col items-center p-3 !outline-none">
              <div
                className="group relative cursor-pointer"
                onClick={handleOpenPhotoDialog}
              >
                <UserAvatar {...user} size={80} imageSrc={photoDataUrl ?? undefined} />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/40">
                  <FaCamera
                    size={20}
                    className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
              </div>
              <span className="mt-2 text-lg text-font">{user.name}</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-border" />

            {/* Change photo item */}
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-font !outline-none hover:bg-background-neutral"
              onClick={handleOpenPhotoDialog}
            >
              <FaCamera size={14} className="text-font-subtle" />
              <span>Change photo</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-border" />

            {/* Log out item */}
            <DropdownMenu.Item className="select-none p-1 !outline-none">
              <Form action="action/logout" method="post">
                <Button
                  color="danger"
                  variant="subtlest"
                  type="submit"
                  onClick={(e) => e.stopPropagation()} // prevent dropdown from closing first
                  className="w-full"
                  aria-label="Log out"
                >
                  <FaPowerOff />
                  <span>Log out</span>
                </Button>
              </Form>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <PhotoUploadDialog
        isOpen={isPhotoDialogOpen}
        onClose={() => setIsPhotoDialogOpen(false)}
        onSave={handleSavePhoto}
        currentPhotoDataUrl={photoDataUrl}
      />
    </>
  );
};
