import { forwardRef } from "react";
import cx from "classix";

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    { label, error, helperText, className, containerClassName, ...rest },
    forwardedRef
  ) => {
    return (
      <div className={cx("relative", containerClassName)}>
        {label && (
          <label
            htmlFor={rest.id || rest.name}
            className="mb-1 block font-primary text-sm text-font"
          >
            {label}
          </label>
        )}
        <input
          ref={forwardedRef}
          className={cx(
            "box-border w-full rounded-md border-none bg-background-input p-3 text-font outline-2 hover:bg-background-input-hovered focus-visible:bg-background-input-pressed",
            error && "outline outline-2 outline-border-danger",
            className
          )}
          {...rest}
        />
        {error && (
          <p className="mt-1 font-primary-light text-sm text-font-danger">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 font-primary-light text-sm text-font-subtle">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}
