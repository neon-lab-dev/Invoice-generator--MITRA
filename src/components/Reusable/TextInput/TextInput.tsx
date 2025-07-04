/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface TextInputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  isDisabled?: boolean;
  isRequired?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, name, placeholder = "", type = "text", error, defaultValue, isDisabled = false, isRequired = true, onKeyDown, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2 font-Inter w-full">
        <label htmlFor={name} className="block text-gray-700 font-medium">
          {label}
          {
            isRequired &&
            <span className="text-red-600"> *</span>
          }
        </label>
        <input
          required={isRequired}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onKeyDown={onKeyDown}
          ref={ref}
          disabled={isDisabled}
          className={`flex h-11 w-full rounded-md border border-primary-10/30 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-transform focus:scale-[1.02] focus:ring-2 focus:ring-primary-10 focus:outline-none ${error ? "border-red-500" : "border-neutral-75"}`}
          {...rest}
        />
        {error?.message && (
          <span className="text-red-500 text-sm">{String(error.message)}</span>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
