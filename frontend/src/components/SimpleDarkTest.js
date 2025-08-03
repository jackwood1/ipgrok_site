import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function SimpleDarkTest() {
    const [isDark, setIsDark] = useState(false);
    const toggleDark = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark", !isDark);
    };
    return (_jsx("div", { className: "fixed top-4 left-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg", children: _jsxs("div", { className: "text-sm space-y-2", children: [_jsx("div", { children: _jsx("strong", { children: "Simple Test:" }) }), _jsxs("div", { children: ["State: ", _jsx("span", { className: isDark ? "text-green-600" : "text-red-600", children: isDark ? "ON" : "OFF" })] }), _jsxs("div", { children: ["HTML Class: ", _jsx("code", { className: "text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded", children: document.documentElement.className || "none" })] }), _jsxs("button", { onClick: toggleDark, className: "px-3 py-1 bg-blue-600 text-white rounded text-xs", children: ["Toggle (", isDark ? "Light" : "Dark", ")"] })] }) }));
}
