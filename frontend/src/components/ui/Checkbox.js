import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Checkbox({ children, label, className = "", ...props }) {
    return (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: `
          h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded
          bg-white dark:bg-gray-700
          ${className}
        `, ...props }), _jsx("label", { className: "ml-2 text-sm text-gray-700 dark:text-gray-300", children: children })] }));
}
