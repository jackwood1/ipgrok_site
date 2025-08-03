import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ children, className = "", title, subtitle }) {
    return (_jsxs("div", { className: `bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`, children: [title && (_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }), subtitle && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: subtitle }))] })), children] }));
}
