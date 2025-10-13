import { Button } from "./ui";
import { APP_VERSION } from '../config/version';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowHelp?: () => void;
  onGoHome?: () => void;
  onShowAbout?: () => void;
  onShowContact?: () => void;
  onShowAdmin?: () => void;
  isAdminAuthenticated?: boolean;
}

export function Header({ darkMode, onToggleDarkMode, onShowHelp, onGoHome, onShowAbout, onShowContact, onShowAdmin, isAdminAuthenticated }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onGoHome}
            title="Click to go home"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                IPGrok
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                v{APP_VERSION}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {onShowAdmin && (
              <Button
                onClick={onShowAdmin}
                variant={isAdminAuthenticated ? "success" : "secondary"}
                size="sm"
              >
                {isAdminAuthenticated ? "🔓 Admin" : "🔐 Admin"}
              </Button>
            )}
            
            {onShowContact && (
              <Button
                onClick={onShowContact}
                variant="secondary"
                size="sm"
              >
                📧 Contact
              </Button>
            )}
            
            {onShowAbout && (
              <Button
                onClick={onShowAbout}
                variant="secondary"
                size="sm"
              >
                ℹ️ About
              </Button>
            )}
            
            {onShowHelp && (
              <Button
                onClick={onShowHelp}
                variant="secondary"
                size="sm"
              >
                📖 Help
              </Button>
            )}
            
            <Button
              onClick={onToggleDarkMode}
              variant="secondary"
              size="sm"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 