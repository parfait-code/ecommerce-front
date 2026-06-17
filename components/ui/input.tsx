import { cn } from "../../lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-(--text-secondary)">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-9 rounded-lg border border-(--border) bg-(--bg-card)",
              "text-sm text-(--text-primary) placeholder:text-(--text-muted)",
              "px-3 transition-colors duration-150",
              "focus:outline-none focus:border-(--accent) focus:ring-1 focus:ring(--accent)",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-9",
              error && "border-(--danger) focus:border-(--danger) focus:ring-(--danger)",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-(--danger)">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";