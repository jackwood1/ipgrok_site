import { useEffect, useState } from "react";
export function useDarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage first, then fall back to system preference
        const saved = localStorage.getItem("darkMode");
        console.log("Initial darkMode check - localStorage:", saved);
        if (saved !== null) {
            return saved === "true";
        }
        // Fall back to system preference
        const systemPref = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        console.log("Initial darkMode check - system preference:", systemPref);
        return systemPref;
    });
    useEffect(() => {
        console.log("DarkMode effect - setting darkMode to:", darkMode);
        // Apply the dark mode class immediately
        document.documentElement.classList.toggle("dark", darkMode);
        // Save to localStorage
        localStorage.setItem("darkMode", String(darkMode));
        console.log("DarkMode effect - HTML class is now:", document.documentElement.className);
    }, [darkMode]);
    const toggleDarkMode = () => {
        console.log("toggleDarkMode called, current state:", darkMode);
        setDarkMode(!darkMode);
    };
    return { darkMode, toggleDarkMode };
}
