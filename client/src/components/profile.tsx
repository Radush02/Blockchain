import React, { useEffect, useState } from "react";
import { useMetaMaskContext } from "../contexts/metaMaskContext";
import { ethers } from "ethers";
import EventABI from "../contracts/Event.json";
import BiletNFTABI from "../contracts/BiletNFT.json";

const Profile = () => {
  const { account, balance, signer, eventFactoryContract, isInitialized } = useMetaMaskContext();
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);

  interface Ticket {
    eventName: string;
    eventAddress: string;
    eventImage: string;
    ticketId: number;
  }

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
            userTickets.push({ 
              eventName: await eventContract.eveniment(),
              eventAddress, 
              ticketId: Number(ticketId), 
              eventImage: await eventContract.urlImagine() 
            });
          }
        }

        setUserTickets(userTickets);
      } catch (error) {
        console.error("Eroare la incarcarea biletelor utilizatorului:", error);
      }
    };

    fetchUserTickets();
  }, [signer, account, eventFactoryContract, isInitialized]);

  if (!isInitialized) return <p>Se incarca...</p>;

  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-semibold mb-4">Profil Utilizator</h2>
        <p><strong>Adresa Wallet:</strong> {account}</p>
        <p><strong>Balanta:</strong> {balance} ETH</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Biletele tale</h3>
      {userTickets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTickets.map(({ eventAddress, eventName, ticketId, eventImage }) => (
            <div key={ticketId} className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">{eventName}</h4>
              <p><strong>ID Bilet:</strong> {ticketId}</p>
                <a href={`/event/${eventAddress}`} className="text-blue-500 hover:text-blue-700 transition duration-300">Detalii eveniment</a>
              <img src={eventImage} alt="Event" className="w-full h-auto mt-4 rounded"/>
            </div>
          ))}
        </div>
      ) : (
        <p>Nu detii bilete la niciun eveniment.</p>
      )}
    </div>
  );
};

export default Profile;
