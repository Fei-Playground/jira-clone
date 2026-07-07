import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { withMainContext, withRemixStub } from "@app/stories/utils";
import { UserProfile } from "./user-profile";
import { PhotoUploadDialog } from "./photo-upload-dialog";
import { UserContextProvider } from "@app/store/user.store";
import { userMock2 } from "@domain/user";

/**
 * Local component so hooks (useState) run inside the decorator's providers/router.
 * Wrapped in its own UserContextProvider with userMock2 (Woody has an avatar image)
 * so the dialog's "Remove photo" button is shown.
 */
const PhotoDialogStory = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <UserContextProvider user={userMock2}>
      <div className="relative flex h-[520px] w-[500px] items-center justify-center">
        <PhotoUploadDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={() => {}}
          currentPhotoDataUrl={null}
        />
      </div>
    </UserContextProvider>
  );
};

const meta: Meta<typeof UserProfile> = {
  title: "Pages/Main/Header/UserProfile",
  component: UserProfile,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center p-6">
        {withRemixStub(withMainContext(Story))}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserProfile>;

/** Default dropdown — click the avatar to see the dropdown with "Change photo" */
export const Default: Story = {};

/**
 * Shows the photo upload dialog pre-opened for easy inspection.
 * The meta decorator already wraps this in withRemixStub(withMainContext(...)),
 * so the render just returns the dialog directly.
 */
export const WithPhotoDialog: Story = {
  render: () => <PhotoDialogStory />,
};
