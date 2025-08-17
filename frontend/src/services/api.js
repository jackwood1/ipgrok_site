const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
class ApiService {
    baseUrl;
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    // Test Results API
    async saveTestResult(testResult) {
        return this.request('/test-results', {
            method: 'POST',
            body: JSON.stringify(testResult),
        });
    }
    async getTestResults(filters) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value)
                    params.append(key, value.toString());
            });
        }
        return this.request(`/test-results?${params.toString()}`);
    }
    async getRecentTestResults(limit = 20) {
        return this.request(`/test-results/recent?limit=${limit}`);
    }
    async getTestResultsByUser(userId, limit = 50) {
        return this.request(`/test-results/user/${userId}?limit=${limit}`);
    }
    async getTestResultsByType(testType, limit = 50) {
        return this.request(`/test-results/type/${testType}?limit=${limit}`);
    }
    async getTestResult(testId) {
        return this.request(`/test-results/${testId}`);
    }
    async deleteTestResult(testId) {
        return this.request(`/test-results/${testId}`, {
            method: 'DELETE',
        });
    }
    async getTestStatistics() {
        return this.request('/test-results/stats/summary');
    }
    // Analytics API
    async getPerformanceAnalytics(filters) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value)
                    params.append(key, value.toString());
            });
        }
        return this.request(`/analytics/performance?${params.toString()}`);
    }
    async getTrendAnalytics(filters) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value)
                    params.append(key, value.toString());
            });
        }
        return this.request(`/analytics/trends?${params.toString()}`);
    }
    async getComparisonAnalytics(filters) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value)
                    params.append(key, value.toString());
            });
        }
        return this.request(`/analytics/comparison?${params.toString()}`);
    }
    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}
// Create and export a singleton instance
export const apiService = new ApiService();
// Export the class for testing or custom instances
export default ApiService;
