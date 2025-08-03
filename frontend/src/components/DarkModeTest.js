import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDarkMode } from "../hooks/useDarkMode";
export function DarkModeTest() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg", children: _jsxs("div", { className: "text-sm space-y-2", children: [_jsx("div", { children: _jsx("strong", { children: "Dark Mode Test:" }) }), _jsxs("div", { children: ["State: ", _jsx("span", { className: darkMode ? "text-green-600" : "text-red-600", children: darkMode ? "ON" : "OFF" })] }), _jsxs("div", { children: ["HTML Class: ", _jsx("code", { className: "text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded", children: document.documentElement.className || "none" })] }), _jsxs("div", { children: ["localStorage: ", _jsx("code", { className: "text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded", children: localStorage.getItem("darkMode") || "null" })] }), _jsxs("button", { onClick: () => {
                        console.log("Toggle clicked, current state:", darkMode);
                        toggleDarkMode();
                    }, className: "px-3 py-1 bg-blue-600 text-white rounded text-xs", children: ["Toggle (", darkMode ? "Light" : "Dark", ")"] })] }) }));
}
