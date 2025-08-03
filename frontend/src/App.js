import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer } from "./components";
import { useDarkMode } from "./hooks/useDarkMode";
import { DarkModeTest } from "./components/DarkModeTest";
import { SimpleDarkTest } from "./components/SimpleDarkTest";
function App() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [permissionsStatus, setPermissionsStatus] = useState(() => localStorage.getItem("mediaPermissions") || "unknown");
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, { darkMode: darkMode, onToggleDarkMode: toggleDarkMode }), _jsxs("main", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Video Call Tester" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Test your internet connection and media devices for optimal video call performance" })] }), _jsxs("div", { className: "space-y-8", children: [_jsx(NetworkTest, { permissionsStatus: permissionsStatus }), _jsx(MediaTest, { permissionsStatus: permissionsStatus, onPermissionsChange: setPermissionsStatus })] })] }), _jsx(Footer, {}), _jsx(DarkModeTest, {}), _jsx(SimpleDarkTest, {})] }));
}
export default App;
