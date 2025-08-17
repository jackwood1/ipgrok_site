import { useEffect, useState } from "react";
export function useDarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage first, then fall back to system preference
        const saved = localStorage.getItem("darkMode");
        if (saved !== null) {
            return saved === "true";
        }
        // Fall back to system preference
        const systemPref = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        return systemPref;
    });
    useEffect(() => {
        // Apply the dark mode class immediately
        document.documentElement.classList.toggle("dark", darkMode);
        // Save to localStorage
        localStorage.setItem("darkMode", String(darkMode));
    }, [darkMode]);
    const toggleDarkMode = () => setDarkMode(!darkMode);
    return { darkMode, toggleDarkMode };
}
