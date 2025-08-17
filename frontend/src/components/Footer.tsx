import { APP_VERSION } from '../config/version';

interface FooterProps {
  onShowAboutUs: () => void;
  onShowContactUs: () => void;
}

export function Footer({ onShowAboutUs, onShowContactUs }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onShowAboutUs}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              ℹ️ About Us
            </button>
            <button
              onClick={onShowContactUs}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              📧 Contact Us
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} ipgrok.com — All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-400">
            <span>Version</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md font-mono font-medium text-gray-600 dark:text-gray-300">
              {APP_VERSION}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
} 