import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Card } from "./ui";
export function EmailResults({ networkData, mediaData, systemData, quickTestData }) {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("Network & Media Test Results");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");
    const emailServices = [
        {
            name: "EmailJS",
            url: "https://www.emailjs.com/",
            description: "Client-side email service with free tier"
        },
        {
            name: "Formspree",
            url: "https://formspree.io/",
            description: "Form handling service with email forwarding"
        },
        {
            name: "Netlify Forms",
            url: "https://docs.netlify.com/forms/setup/",
            description: "Built-in form handling for Netlify deployments"
        }
    ];
    const generateEmailContent = () => {
        const timestamp = new Date().toLocaleString();
        let content = `Network & Media Test Results\n`;
        content += `Generated on: ${timestamp}\n\n`;
        // Network Data
        if (networkData?.speedTest) {
            content += `=== NETWORK TEST RESULTS ===\n`;
            content += `Download Speed: ${networkData.speedTest.download} Mbps\n`;
            content += `Upload Speed: ${networkData.speedTest.upload} Mbps\n`;
            content += `Latency: ${networkData.speedTest.latency}ms\n`;
            content += `Jitter: ${networkData.speedTest.jitter}ms\n`;
            if (networkData.speedTest.connectionQuality) {
                content += `Connection Quality: ${networkData.speedTest.connectionQuality} (${networkData.speedTest.qualityScore}/100)\n`;
            }
            if (networkData.speedTest.bandwidthScore) {
                content += `Bandwidth Score: ${networkData.speedTest.bandwidthScore}/100\n`;
            }
            if (networkData.speedTest.packetLossRate !== undefined) {
                content += `Packet Loss Rate: ${networkData.speedTest.packetLossRate}%\n`;
            }
            if (networkData.speedTest.recommendations) {
                content += `\nRecommendations:\n`;
                networkData.speedTest.recommendations.forEach((rec, index) => {
                    content += `${index + 1}. ${rec}\n`;
                });
            }
            content += `\n`;
        }
        // Ping Test Data
        if (networkData?.pingTest) {
            content += `=== PING TEST RESULTS ===\n`;
            content += `Host: ${networkData.pingTest.host}\n`;
            content += `Success Rate: ${networkData.pingTest.successRate}%\n`;
            content += `Average Time: ${networkData.pingTest.averageTime}ms\n`;
            content += `\n`;
        }
        // Traceroute Data
        if (networkData?.tracerouteTest) {
            content += `=== TRACEROUTE RESULTS ===\n`;
            content += `Host: ${networkData.tracerouteTest.host}\n`;
            content += `Total Hops: ${networkData.tracerouteTest.totalHops}\n`;
            content += `Successful Hops: ${networkData.tracerouteTest.successfulHops}\n`;
            content += `\n`;
        }
        // Media Data
        if (mediaData) {
            content += `=== MEDIA TEST RESULTS ===\n`;
            if (mediaData.devices) {
                content += `Microphone: ${mediaData.devices.microphone}\n`;
                content += `Camera: ${mediaData.devices.camera}\n`;
            }
            if (mediaData.permissions) {
                content += `Permissions: ${mediaData.permissions}\n`;
            }
            if (mediaData.micStats) {
                content += `Average Volume: ${mediaData.micStats.averageVolume}\n`;
                content += `Peak Volume: ${mediaData.micStats.peakVolume}\n`;
            }
            content += `\n`;
        }
        // System Data
        if (systemData) {
            content += `=== SYSTEM INFORMATION ===\n`;
            if (systemData.ipAddress) {
                content += `IP Address: ${systemData.ipAddress}\n`;
            }
            if (systemData.userAgent) {
                content += `User Agent: ${systemData.userAgent}\n`;
            }
            if (systemData.platform) {
                content += `Platform: ${systemData.platform}\n`;
            }
            if (systemData.screenResolution) {
                content += `Screen Resolution: ${systemData.screenResolution}\n`;
            }
            content += `\n`;
        }
        // Quick Test Data
        if (quickTestData) {
            content += `=== QUICK TEST SUMMARY ===\n`;
            content += `Overall Status: ${quickTestData.overallStatus}\n`;
            content += `Network Status: ${quickTestData.networkStatus}\n`;
            content += `Media Status: ${quickTestData.mediaStatus}\n`;
            content += `\n`;
        }
        content += `\n---\n`;
        content += `Generated by ipgrok Network & Media Tester\n`;
        content += `https://ipgrok.com\n`;
        return content;
    };
    const sendEmailViaEmailJS = async () => {
        setLoading(true);
        setError("");
        try {
            // This is a placeholder for EmailJS integration
            // In a real implementation, you would:
            // 1. Sign up for EmailJS (https://www.emailjs.com/)
            // 2. Configure your email template
            // 3. Use their JavaScript SDK
            const emailContent = generateEmailContent();
            // Simulate email sending (replace with actual EmailJS implementation)
            await new Promise(resolve => setTimeout(resolve, 2000));
            // For demonstration, we'll show success
            setEmailSent(true);
            setLoading(false);
            // In real implementation, you would use:
            // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            //   to_email: email,
            //   subject: subject,
            //   message: emailContent
            // });
        }
        catch (err) {
            setError("Failed to send email. Please try again.");
            setLoading(false);
        }
    };
    const sendEmailViaFormspree = async () => {
        setLoading(true);
        setError("");
        try {
            const emailContent = generateEmailContent();
            // Formspree integration
            const formData = new FormData();
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', emailContent);
            // Replace 'YOUR_FORMSPREE_ENDPOINT' with your actual Formspree endpoint
            const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                setEmailSent(true);
            }
            else {
                throw new Error('Failed to send email');
            }
        }
        catch (err) {
            setError("Failed to send email. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const copyToClipboard = async () => {
        try {
            const emailContent = generateEmailContent();
            await navigator.clipboard.writeText(emailContent);
            alert("Email content copied to clipboard!");
        }
        catch (err) {
            setError("Failed to copy to clipboard");
        }
    };
    const downloadEmailContent = () => {
        const emailContent = generateEmailContent();
        const blob = new Blob([emailContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test_results_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const hasData = networkData || mediaData || systemData || quickTestData;
    if (!hasData) {
        return (_jsx(Card, { title: "Email Results", subtitle: "Send test results via email", children: _jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "No test data available to send" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-500", children: "Run some tests first to generate results" })] }) }));
    }
    return (_jsx(Card, { title: "Email Results", subtitle: "Send test results via email", children: emailSent ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "text-green-600 dark:text-green-400 text-4xl mb-4", children: "\u2713" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "Email Sent Successfully!" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: ["Your test results have been sent to ", email] }), _jsx(Button, { onClick: () => {
                        setEmailSent(false);
                        setEmail("");
                        setMessage("");
                    }, variant: "secondary", children: "Send Another Email" })] })) : (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Recipient Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter recipient email address", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Subject" }), _jsx("input", { type: "text", value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Email subject", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Additional Message (Optional)" }), _jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Add any additional comments or context...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Email Service Options" }), _jsx("div", { className: "space-y-3", children: emailServices.map((service) => (_jsx("div", { className: "p-3 border border-gray-200 dark:border-gray-700 rounded-md", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900 dark:text-white", children: service.name }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: service.description })] }), _jsx("a", { href: service.url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 dark:text-blue-400 hover:underline text-sm", children: "Learn More" })] }) }, service.name))) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx(Button, { onClick: sendEmailViaEmailJS, loading: loading, disabled: !email, className: "flex-1", children: "Send via EmailJS (Demo)" }), _jsx(Button, { onClick: sendEmailViaFormspree, loading: loading, disabled: !email, variant: "secondary", className: "flex-1", children: "Send via Formspree" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx(Button, { onClick: copyToClipboard, variant: "info", className: "flex-1", children: "Copy to Clipboard" }), _jsx(Button, { onClick: downloadEmailContent, variant: "secondary", className: "flex-1", children: "Download as Text" })] }), error && (_jsx("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md", children: _jsx("p", { className: "text-red-800 dark:text-red-200 text-sm", children: error }) })), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "Setup Instructions" }), _jsxs("div", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "EmailJS:" }), " Sign up at emailjs.com, create a template, and replace the placeholder code with your service ID and template ID."] }), _jsxs("p", { children: [_jsx("strong", { children: "Formspree:" }), " Create a form at formspree.io and replace 'YOUR_FORMSPREE_ENDPOINT' with your actual endpoint."] }), _jsxs("p", { children: [_jsx("strong", { children: "Netlify Forms:" }), " Add form attributes to your HTML and deploy to Netlify for automatic form handling."] })] })] })] })) }));
}
