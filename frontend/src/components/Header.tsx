import { Button } from "./ui";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              ipgrok
            </h1>
          </div>
          
          <Button
            onClick={onToggleDarkMode}
            variant="secondary"
            size="sm"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>
      </div>
    </header>
  );
} 