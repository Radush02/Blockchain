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
  const [ticketBuyers, setTicketBuyers] = useState<string[]>([]); 

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
        console.error("Eroare la incarcarea detaliilor evenimentului:", error);
      }
    };

    loadEventDetails();
  }, [signer, eventAddress, isInitialized]);

  useEffect(() => {
    if (!eventContract) return;

    const handleBiletCumparat = (cumparator: string) => {
      setTicketBuyers((prevBuyers) => [...prevBuyers, cumparator]); 
    };
    eventContract.on("BiletCumparatEvent", handleBiletCumparat);
    return () => {
      eventContract.off("BiletCumparatEvent", handleBiletCumparat);
    };
  }, [eventContract]);

  const handleBuyTicket = async () => {
    if (!eventContract || !signer) return;
    
    try {
      setLoading(true);
      const tx = await eventContract.cumparaBilet({ value: ethers.parseEther(ethers.formatEther(await eventContract.pretBilet())) });
      await tx.wait();
      alert("Bilet cumparat cu succes!");
      setTicketsAvailable((prev) => prev - 1);
    } catch (error) {
      console.error("Eroare la cumpararea biletului:", error);
      alert("Eroare la cumpararea biletului.");
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) return <p>Se încarca...</p>;

  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4">Detalii Eveniment</h2>
        <p><strong>Nume:</strong> {eventName}</p>
        <p><strong>Pret Bilet:</strong> {ticketPrice} ETH</p>
        <p><strong>Bilete disponibile:</strong> {ticketsAvailable}</p>
        <p><strong>Descriere:</strong> {ticketDescription}</p>
        <img src={ticketImage} alt="Event" className="w-full h-auto mt-4 rounded"/>
        {ticketsAvailable > 0 ? (
          <button 
            onClick={handleBuyTicket} 
            className={`mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ${loading ? "cursor-not-allowed" : ""}`} 
            disabled={loading}>
            {loading ? "Procesare..." : "Cumpara bilet"}
          </button>
        ) : (
          <p className="text-red-500 mt-4">Nu mai sunt bilete disponibile pentru acest eveniment.</p>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Cumparatori de bilete:</h3>
          {ticketBuyers.length > 0 ? (
            <ul className="list-disc pl-5">
              {ticketBuyers.map((buyer, index) => (
                <li key={index}>Bilet cumparat de: {buyer}</li>
              ))}
            </ul>
          ) : (
            <p>Inca nu au fost cumparate bilete de cand urmaresti pagina.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
