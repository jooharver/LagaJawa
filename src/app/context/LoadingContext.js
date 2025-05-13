// src/context/LoadingContext.js

import React, { createContext, useContext, useState } from 'react';

// Membuat konteks untuk loading
const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext); // Hook untuk mengakses loading state
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
