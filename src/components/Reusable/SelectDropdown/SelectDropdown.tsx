/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface DropdownProps {
  label: string;
  options: string[];
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  isRequired?: boolean;
  selected?: boolean;
}

const SelectDropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, isRequired = true, selected, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2 font-Inter">
        <label className="block text-gray-700 font-medium">
          {label}
          {isRequired && <span className="text-red-600"> *</span>}
        </label>
        <select
          ref={ref}
          defaultChecked={selected}
          required={isRequired}
          className={`flex h-11 w-full rounded-md border border-primary-10/30 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-transform focus:scale-[1.02] focus:ring-2 focus:ring-primary-10 focus:outline-none ${
            error ? "border-red-500" : "border-neutral-75"
          }`}
          {...rest}
        >
          <option value="" disabled selected className="capitalize">
            Select {label}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option} className="capitalize">
              {option}
            </option>
          ))}
        </select>
        {error && typeof error.message === "string" && (
          <p className="text-xs text-red-500 mt-1">{error.message}</p>
        )}
      </div>
    );
  }
);

SelectDropdown.displayName = "SelectDropdown";

export default SelectDropdown;
