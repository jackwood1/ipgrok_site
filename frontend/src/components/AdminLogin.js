import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Button } from './ui';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Call backend auth endpoint
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                // Store token in localStorage
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', data.username);
                onLogin(data.token);
            }
            else {
                setError(data.message || 'Invalid credentials');
            }
        }
        catch (err) {
            setError('Failed to connect to server');
            console.error('Login error:', err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4", children: _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "\uD83D\uDD10 Admin Login" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "IPGrok Administration Dashboard" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && (_jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsx("p", { className: "text-red-800 dark:text-red-200 text-sm", children: error }) })), _jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Username" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: "Enter username", required: true, autoComplete: "username" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: "Enter password", required: true, autoComplete: "current-password" })] }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", className: "w-full", loading: loading, children: loading ? 'Signing in...' : 'Sign In' })] }), _jsx("div", { className: "mt-6 text-center text-sm text-gray-600 dark:text-gray-400", children: _jsx("p", { children: "Authorized personnel only" }) })] }) }));
}
