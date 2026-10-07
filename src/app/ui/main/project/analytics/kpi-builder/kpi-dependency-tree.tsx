import { useState } from "react";
import cx from "classix";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiNodeTree,
} from "react-icons/ri";
import { SubKpi } from "./kpi-builder.types";

interface KpiDependencyTreeProps {
  /** Name of the root / final KPI */
  rootName: string;
  /** Top-level sub-KPIs (each may have nested subKpis) */
  subKpis: SubKpi[];
  /**
   * Called when the user clicks a node — passes the sub-KPI id.
   * Caller can use this to scroll to or highlight the matching card.
   */
  onNodeClick?: (id: string) => void;
  /** Id of the currently highlighted node */
  highlightedId?: string;
}

export const KpiDependencyTree = ({
  rootName,
  subKpis,
  onNodeClick,
  highlightedId,
}: KpiDependencyTreeProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background-neutral">
      {/* Panel header */}
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className={cx(
          "flex w-full items-center gap-2 px-3 py-2 text-left",
          "hover:bg-background-neutral-hovered transition-colors duration-150",
          isExpanded && "border-b border-border"
        )}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse dependency tree" : "Expand dependency tree"}
      >
        <RiNodeTree size={15} className="flex-shrink-0 text-font-subtle" />
        <span className="flex-1 font-primary-bold text-sm text-font">
          Dependency tree
        </span>
        {isExpanded ? (
          <RiArrowDownSLine size={16} className="text-font-subtle" />
        ) : (
          <RiArrowRightSLine size={16} className="text-font-subtle" />
        )}
      </button>

      {/* Tree body */}
      {isExpanded && (
        <div className="overflow-x-auto px-3 py-2.5">
          <TreeNode
            label={rootName}
            isRoot
            subKpis={subKpis}
            onNodeClick={onNodeClick}
            highlightedId={highlightedId}
          />
        </div>
      )}
    </div>
  );
};

// ── Internal recursive tree node ─────────────────────────────────────────

interface TreeNodeProps {
  label: string;
  id?: string;
  isRoot?: boolean;
  subKpis: SubKpi[];
  onNodeClick?: (id: string) => void;
  highlightedId?: string;
  /** Prefix segments drawn by parent (each segment is '│  ' or '   ') */
  prefixParts?: string[];
  /** Whether this node is the last child in its parent's list */
  isLast?: boolean;
}

const BRANCH = "├── ";
const LAST_BRANCH = "└── ";
const VERTICAL = "│   ";
const EMPTY = "    ";

const TreeNode = ({
  label,
  id,
  isRoot = false,
  subKpis,
  onNodeClick,
  highlightedId,
  prefixParts = [],
  isLast = false,
}: TreeNodeProps): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasChildren = subKpis.length > 0;
  const isHighlighted = id !== undefined && id === highlightedId;

  // The connector drawn immediately before this node's label
  const connector = isRoot ? "" : isLast ? LAST_BRANCH : BRANCH;
  // The prefix drawn before children of this node
  const childPrefix = isRoot ? [] : [...prefixParts, isLast ? EMPTY : VERTICAL];

  const prefix = prefixParts.join("") + connector;

  return (
    <div className="font-mono text-xs leading-5">
      {/* Node row */}
      <div className="flex items-center">
        {/* Tree line characters */}
        {!isRoot && (
          <span className="select-none whitespace-pre text-font-subtlest">
            {prefix}
          </span>
        )}

        {/* Label + collapse toggle */}
        <div
          className={cx(
            "flex items-center gap-1 rounded px-1 py-0.5",
            "transition-colors duration-100",
            isHighlighted
              ? "bg-background-brand-subtlest font-medium text-font-brand"
              : "text-font",
            id && "cursor-pointer hover:bg-background-neutral-hovered",
            isRoot && "font-primary-bold text-sm text-font"
          )}
          onClick={() => id && onNodeClick?.(id)}
          role={id ? "button" : undefined}
          tabIndex={id ? 0 : undefined}
          onKeyDown={(e) => {
            if (id && (e.key === "Enter" || e.key === " ")) onNodeClick?.(id);
          }}
          aria-label={id ? `Jump to ${label}` : undefined}
        >
          {/* Collapse/expand toggle for nodes that have children */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed((v) => !v);
              }}
              className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-font-subtle hover:bg-background-neutral-hovered hover:text-font"
              aria-label={isCollapsed ? `Expand ${label}` : `Collapse ${label}`}
            >
              {isCollapsed ? (
                <RiArrowRightSLine size={12} />
              ) : (
                <RiArrowDownSLine size={12} />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-4 flex-shrink-0" />}

          <span className="truncate">{label}</span>

          {/* Child count pill when collapsed */}
          {hasChildren && isCollapsed && (
            <span className="ml-1 rounded-full bg-background-neutral-hovered px-1.5 text-2xs text-font-subtlest">
              +{countNodes(subKpis)}
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div>
          {subKpis.map((child, idx) => (
            <TreeNode
              key={child.id}
              label={child.name}
              id={child.id}
              subKpis={child.subKpis}
              onNodeClick={onNodeClick}
              highlightedId={highlightedId}
              prefixParts={childPrefix}
              isLast={idx === subKpis.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** Count all descendant nodes recursively */
function countNodes(nodes: SubKpi[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.subKpis), 0);
}
