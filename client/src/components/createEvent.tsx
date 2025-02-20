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
    <div>
      <h2>Creeaza Eveniment</h2>
      <input
        type="text"
        placeholder="Nume Eveniment"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Pret Bilet (ETH)"
        value={ticketPrice}
        onChange={(e) => setTicketPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Numar Bilete"
        value={ticketSupply}
        onChange={(e) => setTicketSupply(e.target.value)}
      />
      <input
      type="text"
      placeholder="Descriere Eveniment"
      value={ticketDescription}
      onChange={(e) => setTicketDescription(e.target.value)}
      />
      <input
      type="text"
      placeholder="URL Imagine"
      value={ticketImage}
      onChange={(e) => setTicketImage(e.target.value)}
      />
      <button onClick={handleCreateEvent} disabled={loading}>
        {loading ? "Se proceseaza..." : "Creeaza Eveniment"}
      </button>
    </div>
  );
};

export default CreateEvent;