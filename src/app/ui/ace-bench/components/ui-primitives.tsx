// ACE Bench UI Primitives
// Reusable components: buttons, badges, icons, charts, and layout helpers

import { useState, type ReactNode } from "react";
import cx from "classix";

// ─────────────────────────────────────────────────────────────────────
// Types and Constants
// ─────────────────────────────────────────────────────────────────────

export const DIMENSIONS = [
  { key: "accuracy", label: "Accuracy", short: "Acc", color: "blue" },
  {
    key: "tooluse",
    label: "Tool use",
    short: "Tool",
    color: "purple",
  },
  {
    key: "completeness",
    label: "Completeness",
    short: "Comp",
    color: "teal",
  },
  { key: "safety", label: "Safety", short: "Safe", color: "orange" },
  {
    key: "coherence",
    label: "Coherence",
    short: "Coh",
    color: "magenta",
  },
] as const;

export interface Dimensions {
  accuracy: number;
  tooluse: number;
  completeness: number;
  safety: number;
  coherence: number;
}

// ─────────────────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────────────────

type StatusType =
  | "passing"
  | "failing"
  | "running"
  | "queued"
  | "ready"
  | "draft"
  | "archived"
  | "passed"
  | "failed"
  | "partial"
  | "error"
  | "canceled";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
}

export const StatusBadge = ({
  status,
  size = "md",
}: StatusBadgeProps): JSX.Element => {
  const statusMap: Record<
    StatusType,
    { color: string; bg: string; label: string }
  > = {
    passing: {
      color: "text-font-success",
      bg: "bg-background-success",
      label: "Passing",
    },
    failing: {
      color: "text-font-danger",
      bg: "bg-background-danger",
      label: "Failing",
    },
    running: {
      color: "text-font-brand",
      bg: "bg-background-brand-subtlest",
      label: "Running",
    },
    queued: {
      color: "text-font-warning",
      bg: "bg-background-warning",
      label: "Queued",
    },
    ready: {
      color: "text-font-subtle",
      bg: "bg-background-neutral",
      label: "Ready",
    },
    draft: {
      color: "text-font-subtle",
      bg: "bg-background-neutral",
      label: "Draft",
    },
    archived: {
      color: "text-font-subtlest",
      bg: "bg-background-neutral",
      label: "Archived",
    },
    passed: {
      color: "text-font-success",
      bg: "bg-background-success",
      label: "Passed",
    },
    failed: {
      color: "text-font-danger",
      bg: "bg-background-danger",
      label: "Failed",
    },
    partial: {
      color: "text-font-warning",
      bg: "bg-background-warning",
      label: "Partial",
    },
    error: {
      color: "text-font-danger",
      bg: "bg-background-danger",
      label: "Error",
    },
    canceled: {
      color: "text-font-subtlest",
      bg: "bg-background-neutral",
      label: "Canceled",
    },
  };

  const s = statusMap[status] || statusMap.draft;
  const pulse = status === "running";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full font-primary-bold leading-tight",
        s.bg,
        s.color,
        size === "sm" ? "px-2 py-0.5 text-2xs" : "px-2.5 py-0.5 text-xs"
      )}
    >
      <span
        className={cx(
          "bg-current inline-block h-1.5 w-1.5 shrink-0 rounded-full",
          pulse && "animate-pulse"
        )}
      />
      {s.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────

type BadgeVariant =
  | "brand"
  | "success"
  | "danger"
  | "warning"
  | "purple"
  | "teal"
  | "orange"
  | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  pill?: boolean;
}

export const Badge = ({
  children,
  variant = "neutral",
  pill = true,
}: BadgeProps): JSX.Element => {
  const variantMap: Record<BadgeVariant, { bg: string; color: string }> = {
    brand: {
      bg: "bg-background-brand-subtlest",
      color: "text-font-brand",
    },
    success: {
      bg: "bg-background-success",
      color: "text-font-success",
    },
    danger: {
      bg: "bg-background-danger",
      color: "text-font-danger",
    },
    warning: {
      bg: "bg-background-warning",
      color: "text-font-warning",
    },
    purple: {
      bg: "bg-Magenta100",
      color: "text-Magenta700",
    },
    teal: {
      bg: "bg-Teal100",
      color: "text-Teal700",
    },
    orange: {
      bg: "bg-Orange100",
      color: "text-Orange700",
    },
    neutral: {
      bg: "bg-background-neutral",
      color: "text-font-subtle",
    },
  };

  const m = variantMap[variant];

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap px-2 py-0.5 font-primary-bold text-2xs leading-snug",
        m.bg,
        m.color,
        pill ? "rounded-full" : "rounded"
      )}
    >
      {children}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────────────

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outlined"
  | "tertiary"
  | "danger"
  | "dangerGhost";

type ButtonSize = "xs" | "sm" | "md";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  icon?: ReactNode;
  iconR?: ReactNode;
  disabled?: boolean;
  title?: string;
}

export const Btn = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  icon,
  iconR,
  disabled,
  title,
}: ButtonProps): JSX.Element => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-background-brand-bold text-font-inverse border-transparent hover:bg-background-brand-bold-hovered",
    secondary:
      "bg-elevation-surface text-font border-border hover:bg-elevation-surface-hovered",
    outlined:
      "bg-transparent text-link border-border-brand hover:bg-background-brand-subtlest",
    tertiary:
      "bg-transparent text-font border-transparent hover:bg-background-neutral",
    danger:
      "bg-background-danger-bold text-font-inverse border-transparent hover:bg-background-danger-bold-hovered",
    dangerGhost:
      "bg-transparent text-font-danger border-border hover:bg-background-danger",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    xs: "px-2.5 py-1 text-xs",
    sm: "px-3 py-1.5 text-xs",
    md: "px-3.5 py-1.5 text-sm",
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border font-primary-bold transition-colors",
        disabled
          ? "cursor-not-allowed bg-background-neutral text-font-disabled"
          : variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {icon && <span className="flex">{icon}</span>}
      {children}
      {iconR && <span className="flex">{iconR}</span>}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Icon Button
// ─────────────────────────────────────────────────────────────────────

interface IconBtnProps {
  icon: ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
  danger?: boolean;
}

export const IconBtn = ({
  icon,
  onClick,
  active,
  title,
  danger,
}: IconBtnProps): JSX.Element => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cx(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded border-none transition-colors",
        active && "bg-background-brand-subtlest text-link",
        !active && (hovered ? "bg-background-neutral" : "bg-transparent"),
        danger ? "text-icon-danger" : active ? "text-link" : "text-icon-subtle"
      )}
    >
      {icon}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
}

export const Avatar = ({
  name,
  size = 26,
  color,
}: AvatarProps): JSX.Element => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const palette = [
    "#0c66e4",
    "#8270db",
    "#1d7afc",
    "#e2b203",
    "#4bce97",
    "#ff7452",
  ];
  const bg =
    color || palette[(name.charCodeAt(0) + name.length) % palette.length];

  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-primary-bold text-font-inverse"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.4,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Score Ring
// ─────────────────────────────────────────────────────────────────────

interface ScoreRingProps {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  showValue?: boolean;
}

export const ScoreRing = ({
  score,
  size = 54,
  stroke = 5,
  label,
  showValue = true,
}: ScoreRingProps): JSX.Element => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color =
    score >= 85
      ? "stroke-border-success"
      : score >= 65
        ? "stroke-border-warning"
        : "stroke-border-danger";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--Neutral200)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cx(color, "transition-all duration-500")}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (score / 100) * circumference}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-secondary font-medium leading-none text-font"
            style={{ fontSize: size * 0.3 }}
          >
            {score}
          </span>
          {label && (
            <span
              className="mt-0.5 text-font-subtle"
              style={{ fontSize: size * 0.14 }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
}

export const ProgressBar = ({
  value,
  color,
  height = 6,
}: ProgressBarProps): JSX.Element => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className="w-full overflow-hidden rounded-full bg-background-neutral"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${clampedValue}%`,
          background: color || "var(--Blue700)",
        }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Dimension Meter (label + bar + score)
// ─────────────────────────────────────────────────────────────────────

interface DimMeterProps {
  dim: (typeof DIMENSIONS)[number];
  score: number;
  prev?: number;
}

export const DimMeter = ({ dim, score, prev }: DimMeterProps): JSX.Element => {
  const colorMap: Record<string, string> = {
    blue: "var(--Blue700)",
    purple: "var(--Magenta700)",
    teal: "var(--Teal700)",
    orange: "var(--Orange700)",
    magenta: "var(--Magenta700)",
  };

  const color = colorMap[dim.color] || "var(--Blue700)";
  const delta = prev != null ? score - prev : null;

  return (
    <div className="flex items-center gap-2.5">
      <span className="w-24 shrink-0 font-primary text-xs text-font-subtle">
        {dim.label}
      </span>
      <div className="flex-1">
        <ProgressBar value={score} color={color} />
      </div>
      <span className="font-secondary w-9 shrink-0 text-right text-xs font-bold text-font">
        {score}
      </span>
      {delta != null && delta !== 0 && (
        <span
          className={cx(
            "font-secondary w-8 shrink-0 text-right text-xs font-medium",
            delta > 0 ? "text-font-success" : "text-font-danger"
          )}
        >
          {delta > 0 ? "+" : ""}
          {delta}
        </span>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  pad?: number;
  className?: string;
}

export const Card = ({ children, pad, className }: CardProps): JSX.Element => (
  <div
    className={cx(
      "rounded-lg border border-border bg-elevation-surface",
      className
    )}
    style={pad ? { padding: pad } : undefined}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// Eyebrow (section label)
// ─────────────────────────────────────────────────────────────────────

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export const Eyebrow = ({ children, className }: EyebrowProps): JSX.Element => (
  <div
    className={cx(
      "font-primary-bold text-2xs uppercase tracking-wide text-font-subtle",
      className
    )}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// Radar Chart
// ─────────────────────────────────────────────────────────────────────

interface RadarProps {
  scores: Dimensions;
  prev?: Dimensions;
  size?: number;
}

export const Radar = ({
  scores,
  prev,
  size = 220,
}: RadarProps): JSX.Element => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;
  const n = DIMENSIONS.length;

  const point = (i: number, v: number): [number, number] => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const rr = (v / 100) * r;
    return [cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr];
  };

  const poly = (vals: number[]): string =>
    vals.map((v, i) => point(i, v).join(",")).join(" ");

  const grid = [25, 50, 75, 100];
  const current = DIMENSIONS.map((d) => scores[d.key]);
  const previous = prev ? DIMENSIONS.map((d) => prev[d.key]) : null;

  return (
    <svg width={size} height={size} className="block">
      {grid.map((g) => (
        <polygon
          key={g}
          points={poly(DIMENSIONS.map(() => g))}
          fill="none"
          stroke="var(--Neutral300)"
          strokeWidth="1"
        />
      ))}
      {DIMENSIONS.map((d, i) => {
        const [x, y] = point(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--Neutral300)"
            strokeWidth="1"
          />
        );
      })}
      {previous && (
        <polygon
          points={poly(previous)}
          fill="none"
          stroke="var(--Neutral500)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      )}
      <polygon
        points={poly(current)}
        fill="var(--Blue700)"
        fillOpacity="0.13"
        stroke="var(--Blue700)"
        strokeWidth="2"
      />
      {current.map((v, i) => {
        const [x, y] = point(i, v);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--Blue700)" />;
      })}
      {DIMENSIONS.map((d, i) => {
        const [x, y] = point(i, 122);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize="10.5"
            fontWeight="700"
            fill="var(--Neutral800)"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="CircularStdBold, sans-serif"
          >
            {d.short}
          </text>
        );
      })}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Heatmap (for scenario × dimension results)
// ─────────────────────────────────────────────────────────────────────

interface HeatmapResult {
  id: string;
  name: string;
  verdict: "passed" | "failed" | "partial";
  score: number;
  dims: Dimensions;
}

interface HeatmapProps {
  results: HeatmapResult[];
}

export const Heatmap = ({ results }: HeatmapProps): JSX.Element => {
  const cellStyle = (v: number): React.CSSProperties => {
    const color =
      v >= 85
        ? "var(--Green700)"
        : v >= 70
          ? "var(--Yellow700)"
          : "var(--Red700)";
    const opacity = 0.18 + (v / 100) * 0.55;
    return { background: color, opacity };
  };

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `minmax(200px, 1.4fr) repeat(${DIMENSIONS.length}, 1fr) 64px`,
          minWidth: 560,
        }}
      >
        <div />
        {DIMENSIONS.map((d) => (
          <div
            key={d.key}
            className="pb-1 text-center font-primary-bold text-2xs text-font-subtle"
          >
            {d.short}
          </div>
        ))}
        <div className="pb-1 text-center font-primary-bold text-2xs text-font-subtle">
          Comp
        </div>
        {results.map((r) => (
          <>
            <div
              key={r.id}
              className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap font-primary text-xs text-font"
            >
              <span
                className={cx(
                  "flex",
                  r.verdict === "passed"
                    ? "text-icon-accent-green"
                    : "text-icon-danger"
                )}
              >
                {r.verdict === "passed" ? "✓" : "✕"}
              </span>
              <span className="overflow-hidden text-ellipsis">{r.name}</span>
            </div>
            {DIMENSIONS.map((d) => (
              <div
                key={d.key}
                className="relative flex h-8 items-center justify-center rounded"
                style={cellStyle(r.dims[d.key])}
              >
                <span className="font-secondary relative text-2xs font-bold text-font mix-blend-multiply">
                  {r.dims[d.key]}
                </span>
              </div>
            ))}
            <div
              className={cx(
                "font-secondary flex h-8 items-center justify-center rounded bg-background-neutral text-xs font-bold",
                r.score >= 80 ? "text-font-success" : "text-font-danger"
              )}
            >
              {r.score}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
