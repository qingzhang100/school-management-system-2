import React, { createContext, useState, useContext, useEffect } from "react";
import { getUnreadAnnouncementsCount } from "../services/apiAnnouncements";

const UnreadContext = createContext();

export function useUnreadCount() {
  return useContext(UnreadContext);
}

export function UnreadProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const userNo = localStorage.getItem("loginUserNo");
      if (userNo) {
        try {
          const count = await getUnreadAnnouncementsCount(userNo);
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <UnreadContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  );
}
