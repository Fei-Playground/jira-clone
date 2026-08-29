import { useLayoutEffect, useState, useRef, forwardRef } from "react";
import cx from "classix";

// Textarea with auto-sizing height based on content
// forwardRef allows parent to access and control the textarea element
export const TextareaAutosize = forwardRef<HTMLTextAreaElement, TitleProps>(
  (props: TitleProps, ref) => {
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
    // Mirror paragraph to calculate scroll height for auto-sizing
    const textareaRef = useRef<HTMLParagraphElement>(null);

    // Place cursor at end of text on focus for better UX (especially during replies)
    const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const target = e.currentTarget;
      const length = target.value.length;
      // Place cursor at the end of the current text
      target.setSelectionRange(length, length);
      if (onFocus) onFocus();
    };

    // Forward change events to parent state
    const handleTitleChange = (
      e: React.FormEvent<HTMLTextAreaElement>
    ): void => {
      const value = e.currentTarget.value;
      setValue(value);
    };

    // Check if value contains actual content (not just whitespace)
    // This prevents the mirror paragraph from showing only spaces
    const valueIsNotOnlySpaces = (): boolean => {
      return !/^( )\1*$/.test(value);
    };

    // Update textarea height when content changes by measuring the mirror element
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
