import { useState } from "react";
import cx from "classix";
import { MdLockOutline } from "react-icons/md";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Tooltip } from "@app/components/tooltip";

export const Description = ({
  initDescription = "",
  readOnly,
  onValueChange,
  readOnlyReason = "You cannot edit this field",
}: DescriptionProps): JSX.Element => {
  const [description, setDescription] = useState<string>(initDescription);

  const updateDescription = (newDescription: string) => {
    if (readOnly) return;
    setDescription(newDescription);
    onValueChange?.(newDescription);
  };

  const field = (
    <div className="mt-1 [&_p]:font-primary-light [&_p]:leading-6 [&_textarea]:font-primary-light [&_textarea]:leading-6">
      <TextareaAutosize
        name="description"
        value={description}
        setValue={updateDescription}
        placeholder="Add a description"
        readOnly={readOnly}
        textareaClassName={cx(
          readOnly &&
            "cursor-not-allowed bg-background-neutral text-font-subtlest hover:bg-background-neutral"
        )}
      />
      {readOnly && (
        <span className="ml-3 mt-1 inline-flex items-center gap-1 font-primary-light text-2xs text-font-subtlest">
          <MdLockOutline size={14} aria-hidden />
          Read only
        </span>
      )}
    </div>
  );

  if (readOnly) {
    return (
      <Tooltip title={readOnlyReason} show>
        {field}
      </Tooltip>
    );
  }

  return field;
};

interface DescriptionProps {
  initDescription?: string;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
  readOnlyReason?: string;
}
