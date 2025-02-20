import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import EventFactory from "../contracts/EventFactory.json";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const useMetaMask = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [eventFactoryContract, setEventFactoryContract] = useState<ethers.Contract | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  console.log(account);
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const balance = await provider.getBalance(account);

        console.log("Provider:", provider);
        console.log("Signer:", signer);
        console.log("Account:", account);
        console.log("Balance:", balance);

        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setBalance(ethers.formatEther(balance));

        const eventFactory = new ethers.Contract(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3", 
          EventFactory.abi,
          signer
        );
        setEventFactoryContract(eventFactory);

        setIsInitialized(true);
      } catch (error) {
        console.error("Eroare la conectarea la MetaMask:", error);
        alert("Eroare la conectarea la MetaMask.");
      }
    } else {
      alert("Te rog instaleaza MetaMask!");
    }
  };


  useEffect(() => {
    console.log("Se verifica conexiunea la MetaMask...");
    const checkConnection = async () => {
      if (window.ethereum && !account) {
        console.log("Niciun cont activ, verific conexiunea...");
        const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[] | undefined;
        if (accounts && accounts.length > 0) {
          console.log("Se apeleaza connectWallet()");
          await connectWallet();
        }
      }
    };
  
    checkConnection();
  }, [account]);
  
  return { provider, signer, account, balance, eventFactoryContract, connectWallet, isInitialized };
};