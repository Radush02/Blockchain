import React, { createContext, useContext } from "react";
import { useMetaMask } from "../hooks/metaMask";

type MetaMaskContextType = ReturnType<typeof useMetaMask>;

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export const MetaMaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const metaMask = useMetaMask();

  return (
    <MetaMaskContext.Provider value={metaMask}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMaskContext = (): MetaMaskContextType => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error("useMetaMaskContext trebuie folosit în interiorul unui MetaMaskProvider");
  }
  return context;
};
