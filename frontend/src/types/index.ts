// Type for speed test results
export type TestResults = {
  download: string;
  upload: string;
  latency: number;
  jitter: number;
  error?: string;
}; 