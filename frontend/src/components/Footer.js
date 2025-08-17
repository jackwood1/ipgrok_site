import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { APP_VERSION } from '../config/version';
export function Footer() {
    return (_jsx("footer", { className: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16", children: _jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "text-center space-y-2", children: [_jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " ipgrok.com \u2014 All rights reserved."] }), _jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-400", children: [_jsx("span", { children: "Version" }), _jsx("span", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md font-mono font-medium text-gray-600 dark:text-gray-300", children: APP_VERSION })] })] }) }) }));
}
