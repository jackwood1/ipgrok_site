import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Select({ children, label, error, className = "", ...props }) {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: label })), _jsx("select", { className: `
          w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `, ...props, children: children }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error }))] }));
}
