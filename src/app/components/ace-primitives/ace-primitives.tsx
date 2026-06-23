import { useState, useRef, useEffect } from "react";
import cx from "classix";
import { AceIcons } from "@app/components/ace-icons";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: 'passing' | 'failing' | 'running' | 'queued' | 'ready' | 'draft' | 'archived' | 'passed' | 'failed' | 'partial' | 'error' | 'canceled';
  size?: 'sm' | 'md';
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'danger' | 'warning' | 'purple' | 'teal' | 'indigo' | 'orange' | 'neutral';
  pill?: boolean;
}

interface BtnProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined' | 'tertiary' | 'danger' | 'dangerGhost';
  size?: 'xs' | 'sm' | 'md';
  onClick?: () => void;
  icon?: React.ReactNode;
  iconR?: React.ReactNode;
  disabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
}

interface IconBtnProps {
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
  danger?: boolean;
}

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
}

interface ScoreRingProps {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  showVal?: boolean;
}

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  track?: string;
}

interface DimMeterProps {
  dim: { key: string; label: string; short: string; ck: string };
  score: number;
  prev?: number | null;
}

interface SparklineProps {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  showDots?: boolean;
}

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number;
}

interface SegmentedOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedProps {
  options: (string | SegmentedOption)[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}

interface FilterChipProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

interface MenuItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  divider?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  trigger: React.ReactNode;
  align?: 'left' | 'right';
}

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  pad?: number;
  onClick?: () => void;
  hover?: boolean;
}

interface EyebrowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// ─── Status Badge ────────────────────────────────────────────────────────────

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps): JSX.Element => {
  const statusMap = {
    passing: { className: 'bg-background-accent-green text-font-accent-green', label: 'Passing' },
    failing: { className: 'bg-background-accent-red text-font-danger', label: 'Failing' },
    running: { className: 'bg-background-brand-subtlest text-link', label: 'Running' },
    queued: { className: 'bg-background-warning text-font-warning', label: 'Queued' },
    ready: { className: 'bg-background-subtlest text-font-subtle', label: 'Ready' },
    draft: { className: 'bg-background-subtlest text-font-subtle', label: 'Draft' },
    archived: { className: 'bg-background-subtlest text-font-subtlest', label: 'Archived' },
    passed: { className: 'bg-background-accent-green text-font-accent-green', label: 'Passed' },
    failed: { className: 'bg-background-accent-red text-font-danger', label: 'Failed' },
    partial: { className: 'bg-background-warning text-font-warning', label: 'Partial' },
    error: { className: 'bg-background-accent-red text-font-danger', label: 'Error' },
    canceled: { className: 'bg-background-subtlest text-font-subtlest', label: 'Canceled' },
  };

  const s = statusMap[status] || statusMap.draft;
  const pulse = status === 'running';

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full font-primary-bold',
        size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs',
        s.className
      )}
    >
      <span
        className={cx(
          'inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current',
          pulse && 'animate-pulse'
        )}
      />
      {s.label}
    </span>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────

export const Badge = ({ children, variant = 'neutral', pill = true }: BadgeProps): JSX.Element => {
  const variantMap = {
    brand: 'bg-background-brand-subtlest text-link',
    success: 'bg-background-accent-green text-font-accent-green',
    danger: 'bg-background-accent-red text-font-danger',
    warning: 'bg-background-warning text-font-warning',
    purple: 'bg-[rgba(110,86,207,0.12)] text-[#6E56CF]',
    teal: 'bg-[rgba(14,124,134,0.12)] text-[#0E7C86]',
    indigo: 'bg-[rgba(58,91,217,0.12)] text-[#3A5BD9]',
    orange: 'bg-[rgba(249,152,0,0.12)] text-[#F99800]',
    neutral: 'bg-background-subtlest text-font-subtle',
  };

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 px-2 py-0.5 text-2xs font-primary-bold leading-normal',
        pill ? 'rounded-full' : 'rounded',
        variantMap[variant]
      )}
    >
      {children}
    </span>
  );
};

// ─── Button ──────────────────────────────────────────────────────────────────

export const Btn = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  icon,
  iconR,
  disabled,
  title,
  style: ex,
}: BtnProps): JSX.Element => {
  const [hov, setHov] = useState(false);

  const variantClasses = {
    primary: 'bg-background-brand-bold text-font-inverse border-0 hover:bg-background-brand-bold-hovered',
    secondary: 'bg-elevation-surface text-font border border-border hover:bg-background-subtlest',
    outlined: 'bg-transparent text-link border border-link hover:bg-background-brand-subtlest',
    tertiary: 'bg-transparent text-font-subtle border-0 hover:bg-background-subtlest',
    danger: 'bg-background-danger text-font-inverse border-0 hover:bg-background-danger-hovered',
    dangerGhost: 'bg-transparent text-font-danger border border-border hover:bg-background-accent-red',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={cx(
        'inline-flex items-center gap-1.5 font-primary-bold whitespace-nowrap rounded transition-colors duration-150',
        disabled ? 'cursor-not-allowed bg-background-subtlest text-font-subtlest' : variantClasses[variant],
        sizeClasses[size]
      )}
      style={ex}
    >
      {icon && <span className="flex">{icon}</span>}
      {children}
      {iconR && <span className="flex">{iconR}</span>}
    </button>
  );
};

// ─── Icon Button ─────────────────────────────────────────────────────────────

export const IconBtn = ({ icon, onClick, active, title, danger }: IconBtnProps): JSX.Element => {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={cx(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded border-0 transition-colors duration-150',
        active
          ? 'bg-background-brand-subtlest text-link'
          : hov
            ? 'bg-background-subtlest text-font-subtle'
            : 'bg-transparent text-font-subtle',
        danger && 'text-font-danger'
      )}
    >
      {icon}
    </button>
  );
};

// ─── Avatar ──────────────────────────────────────────────────────────────────

export const Avatar = ({ name, size = 26, color }: AvatarProps): JSX.Element => {
  const init = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const palette = ['#004EC5', '#6E56CF', '#0E7C86', '#D07700', '#3A5BD9', '#1A9B5C'];
  const bg = color || palette[(name.charCodeAt(0) + name.length) % palette.length];

  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-primary-bold tracking-wide text-white"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.4,
      }}
    >
      {init}
    </span>
  );
};

// ─── Score Ring ──────────────────────────────────────────────────────────────

export const ScoreRing = ({
  score,
  size = 54,
  stroke = 5,
  label,
  showVal = true,
}: ScoreRingProps): JSX.Element => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const col = score >= 85 ? '#1A9B5C' : score >= 65 ? '#D07700' : '#D93A3F';

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--Neutral300)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (score / 100) * c}
          className="transition-all duration-600"
        />
      </svg>
      {showVal && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-primary-black text-font leading-none"
            style={{ fontSize: size * 0.3 }}
          >
            {score}
          </span>
          {label && (
            <span className="text-font-subtle" style={{ fontSize: size * 0.14, marginTop: 1 }}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Progress Bar ────────────────────────────────────────────────────────────

export const ProgressBar = ({ value, color, height = 6, track }: ProgressBarProps): JSX.Element => {
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height, background: track || 'var(--Neutral300)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: color || 'var(--Blue700)',
        }}
      />
    </div>
  );
};

// ─── Dimension Meter ─────────────────────────────────────────────────────────

export const DimMeter = ({ dim, score, prev }: DimMeterProps): JSX.Element => {
  const colorMap: Record<string, string> = {
    brand: 'var(--Blue700)',
    purple: '#6E56CF',
    teal: '#0E7C86',
    orange: '#F99800',
    indigo: '#3A5BD9',
  };
  const col = colorMap[dim.ck] || 'var(--Blue700)';
  const delta = prev != null ? score - prev : null;

  return (
    <div className="flex items-center gap-2.5">
      <span className="w-24 shrink-0 text-xs text-font-subtle">{dim.label}</span>
      <div className="flex-1">
        <ProgressBar value={score} color={col} />
      </div>
      <span className="w-9 shrink-0 text-right font-primary-black text-xs text-font">
        {score}
      </span>
      {delta != null && (
        <span
          className={cx(
            'w-10 shrink-0 text-right font-primary-bold text-2xs',
            delta > 0 ? 'text-font-accent-green' : delta < 0 ? 'text-font-danger' : 'text-font-subtlest'
          )}
        >
          {delta > 0 ? '+' : ''}
          {delta}
        </span>
      )}
    </div>
  );
};

// ─── Sparkline ───────────────────────────────────────────────────────────────

export const Sparkline = ({
  data,
  w = 96,
  h = 28,
  color,
  showDots,
}: SparklineProps): JSX.Element => {
  const col = color || 'var(--Blue700)';
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ]);
  const dpath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${dpath} L${w} ${h} L0 ${h} Z`;
  const gid = 'sg' + Math.round(data.reduce((a, b) => a + b, 0)) + w;

  return (
    <svg width={w} height={h} className="block overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.18" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={dpath} fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {showDots && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={col} />}
    </svg>
  );
};

// ─── Checkbox ────────────────────────────────────────────────────────────────

export const Checkbox = ({ checked, indeterminate, onChange }: CheckboxProps): JSX.Element => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onChange && onChange(!checked);
      }}
      className={cx(
        'inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-all duration-100',
        checked || indeterminate
          ? 'border-background-brand-bold bg-background-brand-bold'
          : 'border-border-input bg-elevation-surface'
      )}
    >
      {checked && <AceIcons.check size={11} strokeWidth={3} className="text-white" />}
      {indeterminate && !checked && <span className="h-0.5 w-2 rounded bg-white" />}
    </span>
  );
};

// ─── Search Input ────────────────────────────────────────────────────────────

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  width = 280,
}: SearchInputProps): JSX.Element => {
  const [foc, setFoc] = useState(false);

  return (
    <div
      className={cx(
        'flex h-8 items-center gap-2 rounded-md border bg-elevation-surface px-2.5 transition-all duration-150',
        foc ? 'border-link shadow-[0_0_0_3px_rgba(0,78,197,0.1)]' : 'border-border'
      )}
      style={{ width }}
    >
      <span className="flex text-font-subtlest">
        <AceIcons.search size={15} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFoc(true)}
        onBlur={() => setFoc(false)}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent font-primary text-sm text-font outline-none placeholder:text-font-subtlest"
      />
      {value && (
        <span onClick={() => onChange('')} className="flex cursor-pointer text-font-subtlest">
          <AceIcons.x size={13} />
        </span>
      )}
    </div>
  );
};

// ─── Segmented Control ───────────────────────────────────────────────────────

export const Segmented = ({ options, value, onChange, size = 'md' }: SegmentedProps): JSX.Element => {
  return (
    <div className="inline-flex rounded-md border border-border bg-background-subtlest p-0.5">
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const lab = typeof o === 'string' ? o : o.label;
        const ic = typeof o === 'object' ? o.icon : null;
        const on = value === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={cx(
              'inline-flex items-center gap-1.5 rounded border-0 font-primary-bold transition-all duration-150',
              size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs',
              on
                ? 'bg-elevation-surface text-link shadow-sm'
                : 'bg-transparent text-font-subtle'
            )}
          >
            {ic && <span className="flex">{ic}</span>}
            {lab}
          </button>
        );
      })}
    </div>
  );
};

// ─── Filter Chip ─────────────────────────────────────────────────────────────

export const FilterChip = ({ label, value, options, onChange, icon }: FilterChipProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const active = value && value !== 'All';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cx(
          'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 font-primary text-xs transition-colors',
          active
            ? 'border-link bg-background-brand-subtlest text-link font-primary-bold'
            : 'border-border bg-elevation-surface text-font-subtle font-primary'
        )}
      >
        {icon && <span className="flex opacity-80">{icon}</span>}
        {label}
        {active ? `: ${value}` : ''}
        <span className="flex opacity-70">
          <AceIcons.chevDown size={12} />
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-9 z-50 min-w-[170px] overflow-hidden rounded-lg border border-border bg-elevation-surface p-1 shadow-lg">
          {options.map((o) => (
            <div
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className="flex cursor-pointer items-center justify-between rounded px-2.5 py-2 text-sm text-font hover:bg-background-subtlest"
            >
              {o}
              {value === o && (
                <span className="flex text-link">
                  <AceIcons.check size={14} />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Menu ────────────────────────────────────────────────────────────────────

export const Menu = ({ items, trigger, align = 'right' }: MenuProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <span
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {trigger}
      </span>
      {open && (
        <div
          className={cx(
            'absolute top-8 z-50 min-w-[168px] overflow-hidden rounded-lg border border-border bg-elevation-surface p-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((it, i) =>
            it.divider ? (
              <div key={i} className="my-1 h-px bg-border" />
            ) : (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  it.onClick && it.onClick();
                }}
                className={cx(
                  'flex cursor-pointer items-center gap-2 whitespace-nowrap rounded px-2.5 py-2 text-sm',
                  it.danger
                    ? 'text-font-danger hover:bg-background-accent-red'
                    : 'text-font hover:bg-background-subtlest'
                )}
              >
                {it.icon && <span className="flex opacity-85">{it.icon}</span>}
                {it.label}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────

export const Card = ({ children, style, pad = 16, onClick, hover }: CardProps): JSX.Element => {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={cx(
        'rounded-lg border border-border bg-elevation-surface transition-all duration-150',
        hover && hov && 'border-border-input shadow-sm',
        onClick && 'cursor-pointer'
      )}
      style={{ padding: pad, ...style }}
    >
      {children}
    </div>
  );
};

// ─── Eyebrow ─────────────────────────────────────────────────────────────────

export const Eyebrow = ({ children, style }: EyebrowProps): JSX.Element => {
  return (
    <div
      className="font-primary-bold text-2xs uppercase tracking-wider text-font-subtle"
      style={style}
    >
      {children}
    </div>
  );
};
