import { Label } from "@domain/label";
import cx from "classix";

export const IssueLabels = ({ labels }: Props): JSX.Element => {
  if (!labels || labels.length === 0) {
    return (
      <div className="text-2xs text-font-subtle">
        No labels
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <div
          key={label.id}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-2xs font-primary-light text-white"
          style={{ backgroundColor: label.color }}
          title={label.description}
        >
          <span className="w-2 h-2 rounded-full bg-white opacity-75"></span>
          {label.name}
        </div>
      ))}
    </div>
  );
};

interface Props {
  labels?: Label[];
}
