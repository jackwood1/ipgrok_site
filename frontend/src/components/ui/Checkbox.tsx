import { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
  label?: string;
}

export function Checkbox({ children, label, className = "", ...props }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={`
          h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded
          bg-white dark:bg-gray-700
          ${className}
        `}
        {...props}
      />
      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </label>
    </div>
  );
} 