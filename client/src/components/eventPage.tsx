import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMetaMaskContext } from "../contexts/metaMaskContext";
import { ethers } from "ethers";
import EventABI from "../contracts/Event.json";

const EventPage = () => {
  const { eventAddress } = useParams<{ eventAddress: string }>();
  const { signer, isInitialized } = useMetaMaskContext();
  const [eventName, setEventName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketsAvailable, setTicketsAvailable] = useState(0);
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketImage, setTicketImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventContract, setEventContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!isInitialized || !signer || !eventAddress) return;

    const loadEventDetails = async () => {
      try {
        const contract = new ethers.Contract(eventAddress, EventABI.abi, signer);
        setEventContract(contract);

        const name = await contract.eveniment();
        const price = await contract.pretBilet();
        const ticketsAvailable = await contract.bileteRamase();
        const description = await contract.descriere();
        const image = await contract.urlImagine();

        setEventName(name);
        setTicketPrice(ethers.formatEther(price));
        setTicketsAvailable(Number(ticketsAvailable));
        setTicketDescription(description);
        setTicketImage(image);
      } catch (error) {
        console.error("Eroare la încărcarea detaliilor evenimentului:", error);
      }
    };

    loadEventDetails();
  }, [signer, eventAddress, isInitialized]);

  const handleBuyTicket = async () => {
    if (!eventContract || !signer) return;
    
    try {
      setLoading(true);
      const tx = await eventContract.cumparaBilet({ value: ethers.parseEther(ethers.formatEther(await eventContract.pretBilet())) });
      await tx.wait();
      alert("Bilet cumpărat cu succes!");
      setTicketsAvailable((prev) => prev - 1);
    } catch (error) {
      console.error("Eroare la cumpărarea biletului:", error);
      alert("Eroare la cumpărarea biletului.");
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) return <p>Se încarcă...</p>;

  return (
    <div>
      <h2>Detalii Eveniment</h2>
      <p><strong>Nume:</strong> {eventName}</p>
      <p><strong>Pret Bilet:</strong> {ticketPrice} ETH</p>
      <p><strong>Bilete disponibile:</strong> {ticketsAvailable}</p>
     <p><strong>Descriere:</strong> {ticketDescription}</p>
     <p><strong>Imagine:</strong> {ticketImage}</p>
      {ticketsAvailable > 0 ? (
        <button onClick={handleBuyTicket} disabled={loading}>
          {loading ? "Se procesează..." : `Cumpără bilet (${ticketPrice} ETH)`}
        </button>
      ) : (
        <p>Nu mai sunt bilete disponibile.</p>
      )}
    </div>
  );
};

export default EventPage;
