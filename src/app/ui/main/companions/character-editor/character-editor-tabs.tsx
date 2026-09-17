import cx from "classix";

export type CharacterEditorTab =
  | "basics"
  | "persona"
  | "relationship"
  | "images"
  | "lorebooks";

export const CharacterEditorTabs = ({
  activeTab,
  onChange,
  labels,
}: CharacterEditorTabsProps): JSX.Element => {
  const tabs: { key: CharacterEditorTab; label: string }[] = [
    { key: "basics", label: labels.basics },
    { key: "persona", label: labels.persona },
    { key: "relationship", label: labels.relationship },
    { key: "images", label: labels.images },
    { key: "lorebooks", label: labels.lorebooks },
  ];

  return (
    <div className="flex w-[140px] min-w-[140px] flex-col gap-1 border-r border-border pr-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cx(
            "rounded p-2 text-left text-sm",
            tab.key === activeTab
              ? "bg-background-selected text-font-brand"
              : "text-font-subtlest hover:bg-background-neutral"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface CharacterEditorTabsProps {
  activeTab: CharacterEditorTab;
  onChange: (tab: CharacterEditorTab) => void;
  labels: Record<CharacterEditorTab, string>;
}
