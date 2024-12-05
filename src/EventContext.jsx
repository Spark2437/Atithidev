import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context for events
const EventContext = createContext();

// Custom hook to access the event context
export const useEvent = () => useContext(EventContext);

// Provider component to wrap around the app and share the event data
export const EventProvider = ({ children }) => {
  // Static eventUUID
  const eventUUID = "1b7d2dcb-623a-4356-933f-10e8c9043c6a"; // Your static UUID

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If needed, you can simulate a loading state or error handling
  useEffect(() => {
    if (!eventUUID) {
      setError('Event UUID is required.');
    } else {
      setLoading(false); // Stop loading once UUID is available
    }
  }, [eventUUID]);

  return (
    <EventContext.Provider value={{ eventUUID, loading, error }}>
      {children}
    </EventContext.Provider>
  );
};
