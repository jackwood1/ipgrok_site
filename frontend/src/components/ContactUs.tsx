import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string; // Hidden field to catch bots
  timestamp: number;
}

interface ContactUsProps {
  onGoHome?: () => void;
}

export function ContactUs({ onGoHome }: ContactUsProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
    timestamp: Date.now()
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [botChallenge, setBotChallenge] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [challengeCorrect, setChallengeCorrect] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
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
  const validateForm = (data: ContactFormData): boolean => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChallengeAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have questions, need support, or want to share feedback? We'd love to hear from you!
        </p>
      </div>

      {/* Contact Information */}
      <Card title="Get in Touch" subtitle="Multiple ways to reach our team">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              support@ipgrok.com
            </p>
            <Badge variant="info">24-48 hour response</Badge>
          </div>
          
          <div className="text-center p-4">
            <div className="text-3xl mb-3">🐛</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bug Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              GitHub Issues
            </p>
            <Badge variant="warning">Immediate tracking</Badge>
          </div>
          
          <div className="text-center p-4">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Feature Requests</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Community Forum
            </p>
            <Badge variant="success">Community driven</Badge>
          </div>
        </div>
      </Card>

      {/* Contact Form */}
      <Card title="Send us a Message" subtitle="Fill out the form below and we'll get back to you">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users but visible to bots */}
          <div className="absolute left-[-9999px] top-[-9999px]">
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleInputChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="What's this about?"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          {/* Bot Challenge */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <label htmlFor="challenge" className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              🔒 Security Check: {botChallenge}
            </label>
            <input
              type="number"
              id="challenge"
              value={userAnswer}
              onChange={handleChallengeAnswer}
              required
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-blue-700 dark:text-white"
              placeholder="Enter your answer"
            />
            {userAnswer && (
              <div className="mt-2">
                {challengeCorrect ? (
                  <Badge variant="success">✓ Correct!</Badge>
                ) : (
                  <Badge variant="danger">✗ Incorrect, please try again</Badge>
                )}
              </div>
            )}
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              This helps us verify you're human and not a bot.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting || !challengeCorrect}
              loading={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <Badge variant="success" className="mr-2">✓</Badge>
                <span className="text-green-800 dark:text-green-200">
                  Message sent successfully! We'll get back to you soon.
                </span>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <Badge variant="danger" className="mr-2">✗</Badge>
                <span className="text-red-800 dark:text-red-200">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}
        </form>
      </Card>

      {/* Additional Contact Methods */}
      <Card title="Other Ways to Connect" subtitle="Join our community and stay updated">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Community & Support</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📚</span>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 underline">
                  Documentation & Guides
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">💬</span>
                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 underline">
                  Community Discord
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-purple-500 mr-2">📖</span>
                <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 underline">
                  FAQ & Troubleshooting
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Development & Updates</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">🚀</span>
                <a href="#" className="hover:text-orange-600 dark:hover:text-orange-400 underline">
                  GitHub Repository
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">📢</span>
                <a href="#" className="hover:text-red-600 dark:hover:text-red-400 underline">
                  Release Notes
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">📅</span>
                <a href="#" className="hover:text-yellow-600 dark:hover:text-yellow-400 underline">
                  Roadmap & Updates
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Response Time Expectations */}
      <Card title="Response Times" subtitle="What to expect when you contact us">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">24-48h</div>
            <div className="text-sm text-green-700 dark:text-green-300">General Inquiries</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">Support & Questions</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">2-5 days</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Feature Requests</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Planning & Evaluation</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Immediate</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Bug Reports</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">GitHub Issues</div>
          </div>
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="text-center space-y-4">
        <Button
          onClick={onGoHome}
          variant="secondary"
          size="lg"
        >
          🏠 Back to Home
        </Button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>
            Need immediate help? Check our <a href="#" className="underline hover:text-gray-700 dark:hover:text-gray-300">Help section</a> or 
            <a href="#" className="underline hover:text-gray-700 dark:hover:text-gray-300"> FAQ</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
