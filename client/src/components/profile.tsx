import React, { useEffect, useState } from "react";
import { useMetaMaskContext } from "../contexts/metaMaskContext";
import { ethers } from "ethers";
import EventABI from "../contracts/Event.json";
import BiletNFTABI from "../contracts/BiletNFT.json";

const Profile = () => {
  const { account, balance, signer, eventFactoryContract, isInitialized } = useMetaMaskContext();
  interface Ticket {
    eventName: string;
    eventAddress: string;
    ticketId: number;
  }
  
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!isInitialized || !signer || !eventFactoryContract || !account) return;

    const fetchUserTickets = async () => {
      try {
        const eventCount = await eventFactoryContract.nextEventId();
        const userTickets = [];

        for (let i = 0; i < eventCount; i++) {
          const eventAddress = await eventFactoryContract.evenimente(i);
          const eventContract = new ethers.Contract(eventAddress, EventABI.abi, signer);
          const biletAddress = await eventContract.bilet();
          
          const biletContract = new ethers.Contract(biletAddress, BiletNFTABI.abi, signer);
          const balance = await biletContract.balanceOf(account);

          for (let j = 0; j < balance; j++) {
            const ticketId = await biletContract.tokenOfOwnerByIndex(account, j);
            userTickets.push({ eventName: await eventContract.eveniment(), eventAddress, ticketId: Number(ticketId) });
          }
        }

        setUserTickets(userTickets);
      } catch (error) {
        console.error("Eroare la incarcarea biletelor utilizatorului:", error);
      }
    };

    fetchUserTickets();
  }, [signer, account, eventFactoryContract, isInitialized]);

  if (!isInitialized) return <p>Se încarca...</p>;

  return (
    <div>
      <h2>Profil Utilizator</h2>
      <p><strong>Adresa Wallet:</strong> {account}</p>
      <p><strong>Balanta:</strong> {balance} ETH</p>

      <h3>Biletele tale</h3>
      {userTickets.length > 0 ? (
        <ul>
          {userTickets.map(({ eventName, ticketId }) => (
            <li key={eventName}>
              <p><strong>Eveniment:</strong> {eventName}</p>
              <p><strong>ID Bilet:</strong> {ticketId}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu detii bilete la niciun eveniment.</p>
      )}
    </div>
  );
};

export default Profile;
