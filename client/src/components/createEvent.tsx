import React, { useState } from "react";
import { useMetaMaskContext } from "../contexts/metaMaskContext";
import { ethers } from "ethers";

const CreateEvent = () => {
  const { eventFactoryContract, account, isInitialized } = useMetaMaskContext();
  const [eventName, setEventName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketSupply, setTicketSupply] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketImage, setTicketImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    if (!eventFactoryContract || !account) {
      alert("Conecteaza-te la MetaMask!");
      return;
    }

    try {
      setLoading(true);
      console.log(eventName, ticketPrice, ticketSupply, ticketDescription, ticketImage);
      const tx = await eventFactoryContract.createEvent(
        eventName,
        ethers.parseEther(ticketPrice),
        ticketSupply,
        ticketDescription,
        ticketImage
      );
      await tx.wait();
      alert("Eveniment creat cu succes!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Eroare la crearea evenimentului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Creeaza un Eveniment
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nume Eveniment"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Pret Bilet (ETH)"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Numar Bilete"
            value={ticketSupply}
            onChange={(e) => setTicketSupply(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Descriere Eveniment"
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
          <input
            type="text"
            placeholder="URL Imagine"
            value={ticketImage}
            onChange={(e) => setTicketImage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {ticketImage && (
            <div className="flex justify-center">
              <img src={ticketImage} alt="Event Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-300" />
            </div>
          )}
          <button
            onClick={handleCreateEvent}
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? "Se proceseaza..." : "Creeaza Eveniment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
