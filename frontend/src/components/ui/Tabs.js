import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function Tabs({ tabs, defaultTab }) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { className: "border-b border-gray-200 dark:border-gray-700", children: _jsx("nav", { className: "-mb-px flex space-x-8", "aria-label": "Tabs", children: tabs.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `
                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"}
              `, children: tab.label }, tab.id))) }) }), _jsx("div", { className: "mt-6", children: tabs.find(tab => tab.id === activeTab)?.content })] }));
}
