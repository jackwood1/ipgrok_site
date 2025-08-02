interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b px-6 py-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-semibold">ipgrok — Video Call Tester</h1>
      </div>
      <button onClick={onToggleDarkMode}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
} 