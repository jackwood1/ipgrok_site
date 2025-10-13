import { useState, useEffect } from 'react';
import { Card, Button, Badge } from './ui';
import { apiService } from '../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'analytics'>('overview');

  const adminUser = localStorage.getItem('adminUser') || 'Admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, testsData, perfData] = await Promise.all([
        apiService.getTestStatistics(),
        apiService.getRecentTestResults(20),
        apiService.getPerformanceAnalytics({ limit: 100 })
      ]);

      setStats(statsData.stats);
      setRecentTests(testsData.results);
      setPerformance(perfData.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    onLogout();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatSpeed = (speed: string | number) => {
    const num = typeof speed === 'string' ? parseFloat(speed) : speed;
    return isNaN(num) ? 'N/A' : `${num.toFixed(2)} Mbps`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                📊 IPGrok Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {adminUser}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={loadData} variant="secondary" size="sm">
                🔄 Refresh
              </Button>
              <Button onClick={handleLogout} variant="danger" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: '📈 Overview', icon: '📈' },
            { id: 'tests', label: '🧪 Recent Tests', icon: '🧪' },
            { id: 'analytics', label: '📊 Analytics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <h3 className="text-sm font-medium opacity-90">Total Tests</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalTests || 0}</p>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <h3 className="text-sm font-medium opacity-90">Avg Download</h3>
                <p className="text-4xl font-bold mt-2">
                  {stats.averageDownloadSpeed ? stats.averageDownloadSpeed.toFixed(0) : '0'}
                </p>
                <p className="text-sm opacity-75">Mbps</p>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <h3 className="text-sm font-medium opacity-90">Avg Upload</h3>
                <p className="text-4xl font-bold mt-2">
                  {stats.averageUploadSpeed ? stats.averageUploadSpeed.toFixed(0) : '0'}
                </p>
                <p className="text-sm opacity-75">Mbps</p>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <h3 className="text-sm font-medium opacity-90">Avg Latency</h3>
                <p className="text-4xl font-bold mt-2">
                  {stats.averageLatency ? stats.averageLatency.toFixed(0) : '0'}
                </p>
                <p className="text-sm opacity-75">ms</p>
              </Card>
            </div>

            {/* Test Types Distribution */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Test Types Distribution
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stats.testTypes || {}).map(([type, count]) => (
                  <div
                    key={type}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {count as React.ReactNode}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity (Last 7 Days)
              </h2>
              <div className="space-y-2">
                {Object.entries(stats.recentActivity || {})
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 7)
                  .map(([date, count]) => (
                    <div
                      key={date}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-300">{date}</span>
                      <Badge variant="info">{count as React.ReactNode} tests</Badge>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Top Locations */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Top Locations (by IP)
              </h2>
              <div className="space-y-2">
                {Object.entries(stats.topLocations || {})
                  .slice(0, 10)
                  .map(([ip, count]) => (
                    <div
                      key={ip}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                        {ip}
                      </span>
                      <Badge variant="default">{count as React.ReactNode} tests</Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}

        {/* Recent Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Test Results ({recentTests.length})
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Time</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Type</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Download</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Upload</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Latency</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTests.map((test, index) => {
                      const speedTest = test.networkData?.speedTest || {};
                      return (
                        <tr
                          key={test.testId || index}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(test.timestamp)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={test.testType === 'quickTest' ? 'info' : 'default'}>
                              {test.testType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                            {formatSpeed(speedTest.download)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                            {formatSpeed(speedTest.upload)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {speedTest.latency || 'N/A'} ms
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {test.ipAddress || 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && performance && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Performance Analytics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Download Speeds */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Download Speeds</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {performance.summary?.averageDownloadSpeed || 0} Mbps
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Best</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {performance.summary?.bestDownloadSpeed || 0} Mbps
                    </p>
                  </div>
                </div>

                {/* Upload Speeds */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Upload Speeds</h3>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {performance.summary?.averageUploadSpeed || 0} Mbps
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Best</p>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      {performance.summary?.bestUploadSpeed || 0} Mbps
                    </p>
                  </div>
                </div>

                {/* Latency */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Latency</h3>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {performance.summary?.averageLatency || 0} ms
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lowest</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {performance.summary?.lowestLatency === Infinity ? 'N/A' : `${performance.summary?.lowestLatency || 0} ms`}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Connection Quality Distribution */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Connection Quality Distribution
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(performance.connectionQualities || {}).map(([quality, count]) => (
                  <div
                    key={quality}
                    className="p-4 text-center bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{quality}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {count as React.ReactNode} tests
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Time Series Data */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Tests Over Time
              </h2>
              <div className="space-y-2">
                {Object.entries(performance.timeSeriesData || {})
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 14)
                  .map(([date, data]: [string, any]) => (
                    <div
                      key={date}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-300">{date}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {data.tests} tests
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

