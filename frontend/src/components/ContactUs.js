import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";
export function ContactUs({ onGoHome }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: "",
        timestamp: Date.now()
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [botChallenge, setBotChallenge] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [challengeCorrect, setChallengeCorrect] = useState(false);
    const formRef = useRef(null);
    const submitAttempts = useRef(0);
    const lastSubmitTime = useRef(0);
    // Bot deterrent: Generate a simple math challenge
    useEffect(() => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() > 0.5 ? "+" : "-";
        const answer = operation === "+" ? num1 + num2 : num1 - num2;
        setBotChallenge(`${num1} ${operation} ${num2} = ?`);
        setFormData(prev => ({ ...prev, timestamp: Date.now() }));
    }, []);
    // Bot deterrent: Rate limiting
    const checkRateLimit = () => {
        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTime.current;
        if (timeSinceLastSubmit < 5000) { // 5 seconds between submissions
            return false;
        }
        if (submitAttempts.current > 3) { // Max 3 attempts per session
            return false;
        }
        return true;
    };
    // Bot deterrent: Validate form data
    const validateForm = (data) => {
        // Check if honeypot field is filled (bots often fill all fields)
        if (data.honeypot.trim() !== "") {
            console.log("Bot detected: honeypot field filled");
            return false;
        }
        // Check if timestamp is reasonable (not too old, not in future)
        const now = Date.now();
        if (data.timestamp < now - 300000 || data.timestamp > now + 60000) { // 5 min old or 1 min future
            console.log("Bot detected: timestamp manipulation");
            return false;
        }
        // Check if user answered the challenge correctly
        if (!challengeCorrect) {
            console.log("Bot detected: challenge not completed");
            return false;
        }
        // Basic validation
        if (!data.name.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) {
            return false;
        }
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }
        return true;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleChallengeAnswer = (e) => {
        const answer = e.target.value;
        setUserAnswer(answer);
        // Check if answer is correct - safer than eval()
        const challengeParts = botChallenge.replace(" = ?", "").split(" ");
        const num1 = parseInt(challengeParts[0]);
        const operation = challengeParts[1];
        const num2 = parseInt(challengeParts[2]);
        const expectedAnswer = operation === "+" ? num1 + num2 : num1 - num2;
        setChallengeCorrect(parseInt(answer) === expectedAnswer);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Bot deterrent: Rate limiting check
        if (!checkRateLimit()) {
            setErrorMessage("Please wait a moment before submitting again.");
            setSubmitStatus("error");
            return;
        }
        // Bot deterrent: Form validation
        if (!validateForm(formData)) {
            setErrorMessage("Please complete all fields correctly and solve the challenge.");
            setSubmitStatus("error");
            submitAttempts.current++;
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus("idle");
        setErrorMessage("");
        try {
            // Simulate API call (in real implementation, this would go to your backend)
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Update rate limiting
            lastSubmitTime.current = Date.now();
            submitAttempts.current++;
            setSubmitStatus("success");
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
                honeypot: "",
                timestamp: Date.now()
            });
            setUserAnswer("");
            setChallengeCorrect(false);
            // Reset form after success
            if (formRef.current) {
                formRef.current.reset();
            }
        }
        catch (error) {
            setSubmitStatus("error");
            setErrorMessage("Failed to send message. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCE7" }), _jsx("h1", { className: "text-4xl font-bold text-gray-900 dark:text-white mb-4", children: "Contact Us" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto", children: "Have questions, need support, or want to share feedback? We'd love to hear from you!" })] }), _jsx(Card, { title: "Get in Touch", subtitle: "Multiple ways to reach our team", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center p-4", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83D\uDCE7" }), _jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Email Support" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2", children: "support@ipgrok.com" }), _jsx(Badge, { variant: "info", children: "24-48 hour response" })] }), _jsxs("div", { className: "text-center p-4", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83D\uDC1B" }), _jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Bug Reports" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2", children: "GitHub Issues" }), _jsx(Badge, { variant: "warning", children: "Immediate tracking" })] }), _jsxs("div", { className: "text-center p-4", children: [_jsx("div", { className: "text-3xl mb-3", children: "\uD83D\uDCA1" }), _jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Feature Requests" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2", children: "Community Forum" }), _jsx(Badge, { variant: "success", children: "Community driven" })] })] }) }), _jsx(Card, { title: "Send us a Message", subtitle: "Fill out the form below and we'll get back to you", children: _jsxs("form", { ref: formRef, onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("div", { className: "absolute left-[-9999px] top-[-9999px]", children: _jsx("input", { type: "text", name: "honeypot", value: formData.honeypot, onChange: handleInputChange, tabIndex: -1, autoComplete: "off" }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Name *" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleInputChange, required: true, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white", placeholder: "Your full name" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Email *" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white", placeholder: "your.email@example.com" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "subject", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Subject *" }), _jsx("input", { type: "text", id: "subject", name: "subject", value: formData.subject, onChange: handleInputChange, required: true, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white", placeholder: "What's this about?" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Message *" }), _jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: handleInputChange, required: true, rows: 5, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white", placeholder: "Tell us more about your inquiry..." })] }), _jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800", children: [_jsxs("label", { htmlFor: "challenge", className: "block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2", children: ["\uD83D\uDD12 Security Check: ", botChallenge] }), _jsx("input", { type: "number", id: "challenge", value: userAnswer, onChange: handleChallengeAnswer, required: true, className: "w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-blue-700 dark:text-white", placeholder: "Enter your answer" }), userAnswer && (_jsx("div", { className: "mt-2", children: challengeCorrect ? (_jsx(Badge, { variant: "success", children: "\u2713 Correct!" })) : (_jsx(Badge, { variant: "danger", children: "\u2717 Incorrect, please try again" })) })), _jsx("p", { className: "text-xs text-blue-600 dark:text-blue-400 mt-2", children: "This helps us verify you're human and not a bot." })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", variant: "primary", size: "lg", disabled: isSubmitting || !challengeCorrect, loading: isSubmitting, children: isSubmitting ? "Sending..." : "Send Message" }) }), submitStatus === "success" && (_jsx("div", { className: "p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: "success", className: "mr-2", children: "\u2713" }), _jsx("span", { className: "text-green-800 dark:text-green-200", children: "Message sent successfully! We'll get back to you soon." })] }) })), submitStatus === "error" && (_jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: "danger", className: "mr-2", children: "\u2717" }), _jsx("span", { className: "text-red-800 dark:text-red-200", children: errorMessage })] }) }))] }) }), _jsx(Card, { title: "Other Ways to Connect", subtitle: "Join our community and stay updated", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Community & Support" }), _jsxs("ul", { className: "space-y-2 text-gray-600 dark:text-gray-400", children: [_jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "text-blue-500 mr-2", children: "\uD83D\uDCDA" }), _jsx("a", { href: "#", className: "hover:text-blue-600 dark:hover:text-blue-400 underline", children: "Documentation & Guides" })] }), _jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "text-green-500 mr-2", children: "\uD83D\uDCAC" }), _jsx("a", { href: "#", className: "hover:text-green-600 dark:hover:text-green-400 underline", children: "Community Discord" })] }), _jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "text-purple-500 mr-2", children: "\uD83D\uDCD6" }), _jsx("a", { href: "#", className: "hover:text-purple-600 dark:hover:text-purple-400 underline", children: "FAQ & Troubleshooting" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Development & Updates" }), _jsxs("ul", { className: "space-y-2 text-gray-600 dark:text-gray-400", children: [_jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "text-orange-500 mr-2", children: "\uD83D\uDE80" }), _jsx("a", { href: "#", className: "hover:text-orange-600 dark:hover:text-orange-400 underline", children: "GitHub Repository" })] }), _jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "text-red-500 mr-2", children: "\uD83D\uDCE2" }), _jsx("a", { href: "#", className: "hover:text-red-600 dark:hover:text-red-400 underline", children: "Release Notes" })] }), _jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "text-yellow-500 mr-2", children: "\uD83D\uDCC5" }), _jsx("a", { href: "#", className: "hover:text-yellow-600 dark:hover:text-yellow-400 underline", children: "Roadmap & Updates" })] })] })] })] }) }), _jsx(Card, { title: "Response Times", subtitle: "What to expect when you contact us", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400 mb-2", children: "24-48h" }), _jsx("div", { className: "text-sm text-green-700 dark:text-green-300", children: "General Inquiries" }), _jsx("div", { className: "text-xs text-green-600 dark:text-green-400 mt-1", children: "Support & Questions" })] }), _jsxs("div", { className: "text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2", children: "2-5 days" }), _jsx("div", { className: "text-sm text-yellow-700 dark:text-yellow-300", children: "Feature Requests" }), _jsx("div", { className: "text-xs text-yellow-600 dark:text-yellow-400 mt-1", children: "Planning & Evaluation" })] }), _jsxs("div", { className: "text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2", children: "Immediate" }), _jsx("div", { className: "text-sm text-blue-700 dark:text-blue-300", children: "Bug Reports" }), _jsx("div", { className: "text-xs text-blue-600 dark:text-blue-400 mt-1", children: "GitHub Issues" })] })] }) }), _jsxs("div", { className: "text-center space-y-4", children: [_jsx(Button, { onClick: onGoHome, variant: "secondary", size: "lg", children: "\uD83C\uDFE0 Back to Home" }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: _jsxs("p", { children: ["Need immediate help? Check our ", _jsx("a", { href: "#", className: "underline hover:text-gray-700 dark:hover:text-gray-300", children: "Help section" }), " or", _jsx("a", { href: "#", className: "underline hover:text-gray-700 dark:hover:text-gray-300", children: " FAQ" }), "."] }) })] })] }));
}
