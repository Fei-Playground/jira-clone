import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import cx from "classix";

export const TagInput = ({
  tags,
  onChange,
  placeholder,
  ariaLabel,
  removeTagAriaLabel,
  className,
}: TagInputProps): JSX.Element => {
  const [draft, setDraft] = useState("");

  const commitDraft = () => {
    const value = draft.trim();
    if (!value || tags.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...tags, value]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div
      className={cx(
        "flex flex-wrap items-center gap-1.5 rounded-md border-none bg-background-input p-2 outline outline-2 outline-border-input focus-within:outline-border-brand hover:bg-background-input-hovered",
        className
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded bg-background-neutral px-2 py-0.5 text-xs text-font"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={removeTagAriaLabel(tag)}
            className="flex items-center justify-center text-font-subtlest hover:text-font-danger"
          >
            <RiCloseLine size={14} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={tags.length === 0 ? placeholder : ""}
        aria-label={ariaLabel}
        className="min-w-[80px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-font-subtlest"
      />
    </div>
  );
};

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  ariaLabel: string;
  removeTagAriaLabel: (tag: string) => string;
  className?: string;
}
