/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label?: string;
  name: string;
  options: Option[];
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  defaultValue?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      label,
      name,
      options,
      error,
      defaultValue,
      isDisabled = false,
      isRequired = true,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 font-Inter w-full">
        <label htmlFor={name} className="block text-gray-700 font-medium">
          {label}
          {isRequired && <span className="text-red-600"> *</span>}
        </label>
        <select
          id={name}
          name={name}
          ref={ref}
          required={isRequired}
          defaultValue={defaultValue}
          disabled={isDisabled}
          className={`flex h-11 w-full rounded-md border border-primary-10/30 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-transform focus:scale-[1.02] focus:ring-2 focus:ring-primary-10 focus:outline-none ${error ? "border-red-500" : "border-neutral-75"}`}
          {...rest}
        >
          <option  className="max-w-fit" value="" disabled>
            -- Select an option --
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error?.message && (
          <span className="text-red-500 text-sm">{String(error.message)}</span>
        )}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
