import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Button({ children, variant = "primary", size = "md", loading = false, disabled, className = "", ...props }) {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        info: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    };
    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };
    return (_jsxs("button", { className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, disabled: disabled || loading, ...props, children: [loading && (_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })), children] }));
}
