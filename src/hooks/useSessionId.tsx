
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage user session ID
 * Creates a persistent session ID that's stored in localStorage
 */
export function useSessionId() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Check if a session ID already exists in localStorage
    const existingSessionId = localStorage.getItem('app_session_id');
    
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      // Generate a new session ID (timestamp + random string)
      const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('app_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Function to manually reset the session ID if needed
  const resetSessionId = () => {
    const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('app_session_id', newSessionId);
    setSessionId(newSessionId);
    return newSessionId;
  };

  return { sessionId, resetSessionId };
}
