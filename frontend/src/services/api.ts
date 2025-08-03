const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface TestResult {
  testId?: string;
  timestamp?: string;
  userId?: string;
  testType: 'quickTest' | 'detailedAnalysis' | 'manualTest';
  networkData?: any;
  mediaData?: any;
  systemData?: any;
  advancedTestsData?: any;
  ipAddress?: string;
  userAgent?: string;
  location?: any;
  deviceInfo?: any;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  testType?: 'quickTest' | 'detailedAnalysis' | 'manualTest';
  groupBy?: 'day' | 'week' | 'month' | 'testType' | 'location';
  limit?: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
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
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Test Results API
  async saveTestResult(testResult: TestResult): Promise<{ success: boolean; testId: string; message: string }> {
    return this.request('/test-results', {
      method: 'POST',
      body: JSON.stringify(testResult),
    });
  }

  async getTestResults(filters?: {
    testType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{ success: boolean; count: number; results: TestResult[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    return this.request(`/test-results?${params.toString()}`);
  }

  async getRecentTestResults(limit: number = 20): Promise<{ success: boolean; count: number; results: TestResult[] }> {
    return this.request(`/test-results/recent?limit=${limit}`);
  }

  async getTestResultsByUser(userId: string, limit: number = 50): Promise<{ success: boolean; userId: string; count: number; results: TestResult[] }> {
    return this.request(`/test-results/user/${userId}?limit=${limit}`);
  }

  async getTestResultsByType(testType: string, limit: number = 50): Promise<{ success: boolean; testType: string; count: number; results: TestResult[] }> {
    return this.request(`/test-results/type/${testType}?limit=${limit}`);
  }

  async getTestResult(testId: string): Promise<{ success: boolean; result: TestResult }> {
    return this.request(`/test-results/${testId}`);
  }

  async deleteTestResult(testId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/test-results/${testId}`, {
      method: 'DELETE',
    });
  }

  async getTestStatistics(): Promise<{ success: boolean; stats: any }> {
    return this.request('/test-results/stats/summary');
  }

  // Analytics API
  async getPerformanceAnalytics(filters?: AnalyticsFilters): Promise<{ success: boolean; data: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    return this.request(`/analytics/performance?${params.toString()}`);
  }

  async getTrendAnalytics(filters?: AnalyticsFilters): Promise<{ success: boolean; data: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    return this.request(`/analytics/trends?${params.toString()}`);
  }

  async getComparisonAnalytics(filters?: AnalyticsFilters): Promise<{ success: boolean; data: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    return this.request(`/analytics/comparison?${params.toString()}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.request('/health');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService; 