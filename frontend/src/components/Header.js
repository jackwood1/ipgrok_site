import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./ui";
export function Header({ darkMode, onToggleDarkMode }) {
    return (_jsx("header", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10", children: _jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: "/logo.png", alt: "Logo", className: "h-8 w-8" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "ipgrok" })] }), _jsx(Button, { onClick: onToggleDarkMode, variant: "secondary", size: "sm", children: darkMode ? "☀️ Light" : "🌙 Dark" })] }) }) }));
}
