
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Check if a session ID already exists in localStorage
    const existingSessionId = localStorage.getItem('chat_session_id');
    
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      // Generate a new session ID with UUID
      const newSessionId = uuidv4();
      localStorage.setItem('chat_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Function to manually reset the session ID if needed
  const resetSessionId = () => {
    const newSessionId = uuidv4();
    localStorage.setItem('chat_session_id', newSessionId);
    setSessionId(newSessionId);
    return newSessionId;
  };

  return { sessionId, resetSessionId };
};
