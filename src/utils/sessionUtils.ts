
/**
 * Gets the current session ID from localStorage
 */
export const getSessionId = (): string => {
  return localStorage.getItem('app_session_id') || '';
};

/**
 * Checks if the current session is active (exists and is not expired)
 */
export const isSessionActive = (): boolean => {
  const sessionId = getSessionId();
  if (!sessionId) return false;
  
  // Optional: Check if the session is expired
  // This example assumes sessions are valid for 24 hours
  // You can modify this logic based on your requirements
  
  // Extract timestamp from session ID (assuming format: timestamp-randomstring)
  const timestamp = parseInt(sessionId.split('-')[0], 10);
  const now = Date.now();
  const sessionAge = now - timestamp;
  
  // Session expires after 24 hours (86400000 ms)
  return sessionAge < 86400000;
};

/**
 * Clears the current session
 */
export const clearSession = (): void => {
  localStorage.removeItem('app_session_id');
};
