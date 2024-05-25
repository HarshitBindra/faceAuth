import React, { createContext, useState, useEffect } from 'react';

export const initialUserData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  profileImage: null
};

export const UserDataContext = createContext();

export const UserDataProvider = (props) => {
  const [userData, setUserData] = useState(() => {
    // Retrieve userData from localStorage if available, or use initialUserData
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : initialUserData;
  });
  
  useEffect(() => {
    // Store userData in localStorage whenever it changes
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);
  
  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      { props.children }
    </UserDataContext.Provider>
  );
};
