import { useState } from "react";
import cx from "classix";
import { MdLockOutline } from "react-icons/md";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Tooltip } from "@app/components/tooltip";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

const DEFAULT_MAX_LENGTH = 80;

export const Title = ({
  initTitle = "",
  readOnly,
  maxLength = DEFAULT_MAX_LENGTH,
  error,
  placeholder = "Write the title",
  onValueChange,
  onTouched,
  readOnlyReason = "You cannot edit this field",
}: TitleProps): JSX.Element => {
  const [title, setTitle] = useState<string>(initTitle);
  const [isFocus, setIsFocus] = useState<boolean>(!readOnly);
  const [touched, setTouched] = useState<boolean>(false);

  const isMaxLength = title.length >= maxLength;
  const isEmpty = title.length === 0 || textAreOnlySpaces(title);
  const requireError = Boolean(error) || (touched && isEmpty);

  const onFocus = () => {
    if (!readOnly) setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
    if (!readOnly) {
      setTouched(true);
      onTouched?.();
    }
  };

  const updateTitle = (newTitle: string) => {
    if (readOnly) return;
    if (newTitle.length > maxLength) return;

    setTitle(newTitle);
    onValueChange?.(newTitle);
  };

  const field = (
    <div className="relative">
      <TextareaAutosize
        name="title"
        value={title}
        setValue={updateTitle}
        placeholder={
          requireError && isEmpty ? "Title is required" : placeholder
        }
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}
        textareaClassName={cx(
          "font-primary-black text-2xl",
          requireError &&
            "outline outline-2 outline-border-danger focus-visible:outline-border-danger",
          readOnly &&
            "cursor-not-allowed bg-background-neutral text-font-subtlest hover:bg-background-neutral"
        )}
        autofocus={!readOnly}
      />
      {requireError && (
        <span
          className="ml-3 font-primary-light text-sm text-font-danger"
          role="alert"
        >
          {error || "Title is required"}
        </span>
      )}
      {readOnly && (
        <span className="ml-3 mt-1 inline-flex items-center gap-1 font-primary-light text-2xs text-font-subtlest">
          <MdLockOutline size={14} aria-hidden />
          Read only
        </span>
      )}
      {isFocus && !readOnly && (
        <span
          className={cx(
            "absolute right-0 top-full font-primary-light text-sm",
            isMaxLength ? "text-font-danger" : "text-font-subtlest"
          )}
        >
          {title.length} / {maxLength}
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

interface TitleProps {
  initTitle?: string;
  readOnly?: boolean;
  maxLength?: number;
  error?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onTouched?: () => void;
  readOnlyReason?: string;
}
