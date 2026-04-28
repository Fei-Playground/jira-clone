import { useState } from "react";
import { cx } from "classix";
import { Label } from "@domain/issue";
import { UserAvatar } from "@app/components/user-avatar";

const availableLabels: Label[] = [
  { id: "bug", name: "Bug", color: "#ef4444" },
  { id: "feature", name: "Feature", color: "#3b82f6" },
  { id: "enhancement", name: "Enhancement", color: "#8b5cf6" },
  { id: "documentation", name: "Documentation", color: "#06b6d4" },
  { id: "testing", name: "Testing", color: "#f59e0b" },
  { id: "performance", name: "Performance", color: "#10b981" },
  { id: "security", name: "Security", color: "#ec4899" },
  { id: "urgent", name: "Urgent", color: "#dc2626" },
];

export const SelectLabels = ({ initLabels = [] }: Props): JSX.Element => {
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(initLabels);

  const toggleLabel = (label: Label) => {
    const isSelected = selectedLabels.some((l) => l.id === label.id);
    if (isSelected) {
      setSelectedLabels(selectedLabels.filter((l) => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const removeLabel = (labelId: string) => {
    setSelectedLabels(selectedLabels.filter((l) => l.id !== labelId));
  };

  return (
    <div className="space-y-3">
      {/* Selected labels display */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLabels.map((label) => (
            <div
              key={label.id}
              className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-primary text-white"
              style={{ backgroundColor: label.color }}
            >
              <span>{label.name}</span>
              <button
                onClick={() => removeLabel(label.id)}
                className="ml-1 text-opacity-70 hover:text-opacity-100"
                aria-label={`Remove label: ${label.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Label selector grid */}
      <div className="grid grid-cols-2 gap-2">
        {availableLabels.map((label) => {
          const isSelected = selectedLabels.some((l) => l.id === label.id);
          return (
            <button
              key={label.id}
              onClick={() => toggleLabel(label)}
              className={cx(
                "rounded-md border-2 px-3 py-2 text-left transition-all",
                "font-primary text-sm",
                isSelected
                  ? "bg-background-brand-subtlest text-font"
                  : "bg-background-neutral text-font hover:bg-background-neutral-hovered"
              )}
              style={{ borderColor: label.color }}
            >
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              {label.name}
            </button>
          );
        })}
      </div>

      {/* Hidden input to submit with form */}
      <input
        type="hidden"
        name="labels"
        value={JSON.stringify(selectedLabels)}
      />
    </div>
  );
};

interface Props {
  initLabels?: Label[];
}
