import React, { createContext, useState, useEffect } from "react";
import { subscribeToFeed } from "../components/SubscribeToFeed";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feedItems, setFeedItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  //const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = subscribeToFeed(currentUserId, (message) => {
      //console.log("Received message from FeedChannel>", message);
      setFeedItems((prevItems) => [message, ...prevItems]);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUserId]); // Reconecta cuando el currentUserId cambia

  return (
    <FeedContext.Provider
      value={{ 
        feedItems, 
        setFeedItems, 
        currentUserId, 
        setCurrentUserId
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
