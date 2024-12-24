// UserContext.js is used to store login userNo data
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userNo, setUserNo] = useState(() => {
    const storedUserNo = localStorage.getItem("loginUserNo");
    return storedUserNo ? JSON.parse(storedUserNo) : null;
  });

  useEffect(() => {
    if (userNo) {
      localStorage.setItem("loginUserNo", JSON.stringify(userNo));
    } else {
      localStorage.removeItem("loginUserNo");
    }
  }, [userNo]);

  return (
    <UserContext.Provider value={{ userNo, setUserNo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
