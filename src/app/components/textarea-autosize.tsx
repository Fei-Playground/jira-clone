import { useLayoutEffect, useState, useRef, forwardRef } from "react";
import cx from "classix";

export const TextareaAutosize = forwardRef<HTMLTextAreaElement, TitleProps>(
  (props, ref): JSX.Element => {
    const {
      name,
      value,
      setValue,
      placeholder,
      readOnly,
      autofocus,
      textareaClassName,
      onFocus,
      onBlur,
    } = props;

    const [textareaHeight, setTextareaHeight] = useState<number>(40);
    const textareaRef = useRef<HTMLParagraphElement>(null);

    // Place cursor at the end when focused to allow immediate typing
    const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const target = e.currentTarget;
      const length = target.value.length;
      target.setSelectionRange(length, length);
      if (onFocus) onFocus();
    };

    // Update parent state when textarea content changes
    const handleTitleChange = (
      e: React.FormEvent<HTMLTextAreaElement>
    ): void => {
      const value = e.currentTarget.value;
      setValue(value);
    };

    // Check if value contains meaningful content (not just spaces)
    const valueIsNotOnlySpaces = (): boolean => {
      return !/^( )\1*$/.test(value);
    };

    // Update textarea height based on scrollHeight of hidden mirror element
    useLayoutEffect(() => {
      if (!textareaRef.current) return;

      setTextareaHeight(textareaRef.current.scrollHeight);
    }, [value]);

    return (
      <div className="relative">
        <textarea
          ref={ref}
          name={name}
          className={cx(
            "box-border w-full resize-none overflow-y-hidden rounded-md border-none bg-background-input p-3 text-font outline-2 hover:bg-background-input-hovered focus-visible:bg-background-input-pressed",
            textareaClassName
          )}
          value={value}
          onChange={handleTitleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={handleOnFocus}
          onBlur={onBlur}
          style={{ height: `${textareaHeight}px` }}
          autoFocus={autofocus}
        />
        <p
          ref={textareaRef}
          className={cx(
            "absolute left-0 top-0 -z-10 box-border overflow-y-hidden p-3 opacity-0",
            textareaClassName
          )}
        >
          {(valueIsNotOnlySpaces() && value) || placeholder}
        </p>
      </div>
    );
  }
);

// Set display name for forwardRef component for better debugging in React DevTools
TextareaAutosize.displayName = "TextareaAutosize";

interface TitleProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  autofocus?: boolean;
  readOnly?: boolean;
  textareaClassName?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}
