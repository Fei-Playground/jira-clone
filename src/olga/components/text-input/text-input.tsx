import cx from "classix";

export const OlgaTextInput = ({
  label,
  placeholder,
  value,
  onChange,
  maxLength,
  error,
  ...rest
}: OlgaTextInputProps): JSX.Element => {
  const charCount = value.length;
  const isNearLimit = maxLength !== undefined && charCount / maxLength >= 0.8;
  const isAtLimit = maxLength !== undefined && charCount >= maxLength;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-xs text-olga-slate">{label}</label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cx(
          "h-12 w-full rounded-lg border bg-white px-3 text-sm text-olga-ink outline-none transition-colors duration-[var(--olga-duration-fast)]",
          hasError
            ? "border-olga-declined focus:border-olga-declined"
            : "border-olga-rule focus:border-olga-navy",
          "placeholder:text-olga-slate-lt"
        )}
        aria-invalid={hasError}
        aria-describedby={
          error
            ? `${rest.id}-error`
            : maxLength
              ? `${rest.id}-counter`
              : undefined
        }
        {...rest}
      />
      <div className="mt-1 flex justify-between">
        {error ? (
          <p id={`${rest.id}-error`} className="text-xs text-olga-declined">
            {error}
          </p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p
            id={`${rest.id}-counter`}
            className={cx(
              "text-right text-xs",
              isAtLimit
                ? "font-medium text-olga-declined"
                : isNearLimit
                  ? "text-olga-expiring"
                  : "text-olga-slate-lt"
            )}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

interface OlgaTextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  error?: string;
}
