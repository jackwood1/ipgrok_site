export { 
  generateUUID, 
  getClientUUID, 
  getExistingClientUUID, 
  getClientInfo, 
  getExistingClientInfo, 
  updateClientPublicIP,
  generateSessionId,
  generateTestId,
  addTestResult,
  getTestResults,
  getTestResultsByType,
  checkAndUpdateMetadata
} from './uuid';

export type { ClientInfo, TestResult } from './uuid';
