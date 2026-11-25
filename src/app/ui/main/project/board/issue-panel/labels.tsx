import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { normalizeLabel } from "@domain/issue";

export const Labels = ({ initLabels }: Props): JSX.Element => {
  const [labels, setLabels] = useState<string[]>(initLabels);
  const [labelInput, setLabelInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLabelInput(e.currentTarget.value);
  };

  const addLabel = (): void => {
    // An empty or spaces-only label is not a label: adding it does nothing.
    const label = normalizeLabel(labelInput);
    if (!label || labels.includes(label)) return;

    setLabels([...labels, label]);
    setLabelInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== "Enter") return;

    // Enter would submit the issue panel form instead of adding the label
    e.preventDefault();
    addLabel();
  };

  const removeLabel = (label: string): void => {
    setLabels(labels.filter((currentLabel) => currentLabel !== label));
  };

  return (
    <>
      {labels.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {labels.map((label) => (
            <li key={label}>
              <LabelChip label={label} removeLabel={removeLabel} />
            </li>
          ))}
        </ul>
      )}
      <input
        type="text"
        value={labelInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a label and press Enter"
        aria-label="Add a label"
        className="w-full rounded border-none bg-background-input px-2 py-1.5 font-primary-light text-sm text-font outline outline-2 outline-border-input placeholder:text-font-subtlest focus:outline-border-brand"
      />
      <input type="hidden" name="labels" value={JSON.stringify(labels)} />
    </>
  );
};

const LabelChip = ({ label, removeLabel }: LabelChipProps): JSX.Element => {
  const handleRemove = (): void => {
    removeLabel(label);
  };

  return (
    <span className="flex items-center gap-1 rounded bg-background-neutral py-1 pl-2 pr-1 font-primary-light text-2xs text-font-subtle">
      {label}
      <button
        type="button"
        onClick={handleRemove}
        aria-label={`Remove ${label} label`}
        className="flex cursor-pointer items-center rounded border-none text-icon hover:text-font-danger"
      >
        <IoCloseOutline size={14} />
      </button>
    </span>
  );
};

interface Props {
  initLabels: string[];
}

interface LabelChipProps {
  label: string;
  removeLabel: (label: string) => void;
}
