import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = "", type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-xs font-bold text-gray-700">{label}</label>}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#1a7a4a] focus:ring-1 focus:ring-[#1a7a4a] transition-all disabled:opacity-50 ${
              icon ? "pl-10" : ""
            } ${rightElement ? "pr-11" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-semibold text-red-600 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
