import { useState, useMemo } from "react";
import cx from "classix";
import { SCENARIOS, SUITES, OWNERS } from "@domain/ace-bench";
import {
  Card,
  StatusBadge,
  ScoreRing,
  SearchInput,
  FilterChip,
  Segmented,
  Btn,
  Checkbox,
  Eyebrow,
  Badge,
  Sparkline,
  Avatar,
  Menu,
  IconBtn,
} from "@app/components/ace-primitives";
import { AceIcons } from "@app/components/ace-icons";

// ─── Stat Tile ───────────────────────────────────────────────────────────────
// Displays a statistic with an icon, label, main value, and optional subtitle

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

const StatTile = ({
  icon,
  label,
  value,
  sub,
  accent,
}: StatTileProps): JSX.Element => {
  return (
    <Card pad={14} style={{ flex: 1, minWidth: 0 }}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cx(
            "flex",
            accent ? `text-[${accent}]` : "text-font-subtle"
          )}
        >
          {icon}
        </span>
        <span className="font-primary-bold text-xs text-font-subtle">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-primary-black text-2xl leading-none tracking-tight text-font">
          {value}
        </span>
        {sub && <span className="text-xs text-font-subtle">{sub}</span>}
      </div>
    </Card>
  );
};

// ─── Head Cell Component ─────────────────────────────────────────────────────

const HeadCell = ({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}): JSX.Element => (
  <div
    className="font-primary-bold text-2xs uppercase tracking-wider text-font-subtle"
    style={{ textAlign: align || "left" }}
  >
    {children}
  </div>
);

// ─── Scenarios Library ───────────────────────────────────────────────────────

export const ScenarioLibrary = (): JSX.Element => {
  // Filter and view state
  const [query, setQuery] = useState("");
  const [fStatus, setFStatus] = useState("All");
  const [fSuite, setFSuite] = useState("All");
  const [fOwner, setFOwner] = useState("All");
  const [grouped, setGrouped] = useState(true);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [showArchived] = useState(false);

  // Summary stats (computed from SCENARIOS mock data)
  const TOTAL_SCENARIOS = 47;
  const TOTAL_SUITES = 5;
  const PASSING_COUNT = 31;
  const PASSING_PERCENTAGE = 66;
  const FAILING_COUNT = 4;
  const AVG_SCORE = 83;
  const SCORE_TREND = "+2";

  const suiteName = (id: string): string => {
    return SUITES.find((s) => s.id === id)?.name || id;
  };

  // Multi-criteria filtering: text search across name/ID/tags, status, suite, and owner
  const filtered = useMemo(() => {
    return SCENARIOS.filter((s) => {
      // Hide archived scenarios unless explicitly shown
      if (!showArchived && s.status === "archived") return false;

      // Text search across name, ID, and tags
      if (query) {
        const searchText =
          `${s.name} ${s.id} ${s.tags.join(" ")}`.toLowerCase();
        if (!searchText.includes(query.toLowerCase())) return false;
      }

      if (fStatus !== "All" && s.status !== fStatus.toLowerCase()) return false;
      if (fSuite !== "All" && suiteName(s.suite) !== fSuite) return false;
      if (fOwner !== "All" && s.owner !== fOwner) return false;

      return true;
    });
  }, [query, fStatus, fSuite, fOwner, showArchived]);

  // Group scenarios by suite (or show all flat) — empty groups are hidden
  const groups = useMemo(() => {
    if (!grouped) return [{ id: "_all", name: null, rows: filtered }];
    return SUITES.map((su) => ({
      id: su.id,
      name: su.name,
      rows: filtered.filter((r) => r.suite === su.id),
    })).filter((g) => g.rows.length > 0);
  }, [filtered, grouped]);

  const allIds = filtered.map((s) => s.id);
  const allSel = allIds.length > 0 && allIds.every((id) => sel.has(id));
  const toggleAll = () => setSel(allSel ? new Set() : new Set(allIds));
  const toggleOne = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  const clearSel = () => setSel(new Set());

  const starred = SCENARIOS.filter((s) => s.starred);

  const colTmpl = "36px 1fr 130px 96px 150px 92px 110px 40px";

  return (
    <div className="flex-1 overflow-y-auto bg-background-input">
      <div className="mx-auto max-w-[1320px] px-6 py-5 pb-12">
        {/* Stats */}
        <div className="mb-4 flex gap-3">
          <StatTile
            icon={<AceIcons.layers size={16} />}
            label="Scenarios"
            value={String(TOTAL_SCENARIOS)}
            sub={`across ${TOTAL_SUITES} suites`}
          />
          <StatTile
            icon={<AceIcons.checkCirc size={16} />}
            label="Passing"
            value={String(PASSING_COUNT)}
            sub={`${PASSING_PERCENTAGE}%`}
            accent="#1A9B5C"
          />
          <StatTile
            icon={<AceIcons.xCirc size={16} />}
            label="Failing"
            value={String(FAILING_COUNT)}
            sub="needs attention"
            accent="#D93A3F"
          />
          <StatTile
            icon={<AceIcons.pulse size={16} />}
            label="Avg score"
            value={String(AVG_SCORE)}
            sub={`↑ ${SCORE_TREND} vs last week`}
            accent="#004EC5"
          />
        </div>

        {/* Quick access */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5" style={{ marginBottom: 9 }}>
            <Eyebrow>
              <AceIcons.star size={12} /> Frequently used
            </Eyebrow>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {starred.map((s) => (
              <div
                key={s.id}
                className="flex min-w-[230px] cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-elevation-surface px-3 py-2 transition-all duration-150 hover:border-border-input hover:shadow-sm"
              >
                {s.score != null ? (
                  <ScoreRing score={s.score} size={36} stroke={3.5} />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-border text-font-subtlest">
                    <AceIcons.layers size={15} />
                  </span>
                )}
                <div className="min-w-0">
                  <div className="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap font-primary-bold text-xs text-font">
                    {s.name}
                  </div>
                  <div className="mt-0.5 text-2xs text-font-subtle">
                    {s.id} · {s.runs} runs
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search scenarios, tags, IDs…"
            width={300}
          />
          <FilterChip
            label="Status"
            value={fStatus}
            icon={<AceIcons.pulse size={13} />}
            options={["All", "Passing", "Failing", "Running", "Ready", "Draft"]}
            onChange={setFStatus}
          />
          <FilterChip
            label="Suite"
            value={fSuite}
            icon={<AceIcons.layers size={13} />}
            options={["All", ...SUITES.map((s) => s.name)]}
            onChange={setFSuite}
          />
          <FilterChip
            label="Owner"
            value={fOwner}
            icon={<AceIcons.user size={13} />}
            options={["All", ...OWNERS]}
            onChange={setFOwner}
          />
          <div className="flex-1" />
          <Segmented
            value={grouped ? "grouped" : "flat"}
            onChange={(v) => setGrouped(v === "grouped")}
            size="sm"
            options={[
              {
                value: "grouped",
                label: "By suite",
                icon: <AceIcons.layers size={13} />,
              },
              {
                value: "flat",
                label: "All",
                icon: <AceIcons.rows size={13} />,
              },
            ]}
          />
          <Btn variant="primary" icon={<AceIcons.plus size={15} />}>
            New scenario
          </Btn>
        </div>

        {/* Bulk action bar */}
        {sel.size > 0 && (
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-background-brand-bold px-3.5 py-2 text-white shadow-sm">
            <span className="font-primary-bold text-sm">
              {sel.size} selected
            </span>
            <div className="h-4 w-px bg-white/30" />
            <button className="flex items-center gap-1.5 border-0 bg-transparent font-primary text-sm text-white">
              <AceIcons.play size={14} /> Run selected
            </button>
            <button className="flex items-center gap-1.5 border-0 bg-transparent font-primary text-sm text-white">
              <AceIcons.copy size={14} /> Duplicate
            </button>
            <button className="flex items-center gap-1.5 border-0 bg-transparent font-primary text-sm text-white">
              <AceIcons.layers size={14} /> Add to suite
            </button>
            <button className="flex items-center gap-1.5 border-0 bg-transparent font-primary text-sm text-white">
              <AceIcons.archive size={14} /> Archive
            </button>
            <div className="flex-1" />
            <button
              onClick={clearSel}
              className="flex items-center gap-1.5 border-0 bg-transparent font-primary text-sm text-white opacity-85"
            >
              <AceIcons.x size={14} /> Clear
            </button>
          </div>
        )}

        {/* Table */}
        <Card pad={0} style={{ overflow: "visible" }}>
          {/* Header */}
          <div
            className="sticky top-0 z-10 grid items-center gap-3 rounded-t-lg border-b border-border bg-background-subtlest px-4 py-2.5"
            style={{ gridTemplateColumns: colTmpl }}
          >
            <Checkbox
              checked={allSel}
              indeterminate={sel.size > 0 && !allSel}
              onChange={toggleAll}
            />
            <HeadCell>Scenario</HeadCell>
            <HeadCell>Suite</HeadCell>
            <HeadCell>Status</HeadCell>
            <HeadCell>Owner</HeadCell>
            <HeadCell>Score</HeadCell>
            <HeadCell>Trend</HeadCell>
            <HeadCell> </HeadCell>
          </div>

          {/* Body */}
          {groups.map((group) => (
            <div key={group.id}>
              {group.name && (
                <div className="border-b border-border bg-background-input px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <Eyebrow>
                      <AceIcons.layers size={12} />
                      {group.name}
                    </Eyebrow>
                  </div>
                </div>
              )}
              {group.rows.map((row) => (
                <div
                  key={row.id}
                  className={cx(
                    "grid items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-background-input",
                    sel.has(row.id) && "bg-background-brand-subtlest"
                  )}
                  style={{ gridTemplateColumns: colTmpl }}
                >
                  <Checkbox
                    checked={sel.has(row.id)}
                    onChange={() => toggleOne(row.id)}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {row.starred && (
                        <AceIcons.star
                          size={13}
                          strokeWidth={1.8}
                          className="shrink-0 fill-[#F99800] text-[#F99800]"
                        />
                      )}
                      <span className="overflow-hidden text-ellipsis font-primary-bold text-sm text-font">
                        {row.name}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="font-primary text-xs text-font-subtlest">
                        {row.id}
                      </span>
                      <div className="flex gap-1">
                        {row.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="neutral" pill={false}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-sm text-font-subtle">
                    {suiteName(row.suite)}
                  </span>

                  <StatusBadge status={row.status} size="sm" />

                  <Avatar name={row.owner} size={22} />

                  <div className="flex items-center gap-2">
                    {row.score != null ? (
                      <>
                        <ScoreRing
                          score={row.score}
                          size={32}
                          stroke={3}
                          showVal={true}
                        />
                        <span className="font-primary-black text-sm text-font">
                          {row.score}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-font-subtlest">—</span>
                    )}
                  </div>

                  <div>
                    {row.trend.length > 0 && (
                      <Sparkline data={row.trend} w={110} h={28} showDots />
                    )}
                  </div>

                  <Menu
                    trigger={<IconBtn icon={<AceIcons.moreH size={16} />} />}
                    items={[
                      {
                        label: "Open editor",
                        icon: <AceIcons.edit size={14} />,
                        onClick: () => {}, // No-op in Storybook; will open editor in full app
                      },
                      { label: "Run test", icon: <AceIcons.play size={14} /> },
                      {
                        label: "View history",
                        icon: <AceIcons.history size={14} />,
                      },
                      { label: "", divider: true },
                      { label: "Duplicate", icon: <AceIcons.copy size={14} /> },
                      {
                        label: "Archive",
                        icon: <AceIcons.archive size={14} />,
                        danger: true,
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
