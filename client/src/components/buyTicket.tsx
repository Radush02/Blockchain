import React, { useState } from "react";
import { useMetaMaskContext } from "../contexts/metaMaskContext";
import {ethers} from "ethers";
import Event from "../contracts/Event.json";

const BuyTicket = ({ eventAddress }: { eventAddress: string }) => {
  const { signer, account } = useMetaMaskContext();
  const [loading, setLoading] = useState(false);

  const handleBuyTicket = async () => {
    if (!signer || !account) {
      alert("Conectează-te la MetaMask!");
      console.log(signer, account);
      return;
    }

    try {
      setLoading(true);
      const eventContract = new ethers.Contract(eventAddress, Event.abi, signer);
      const tx = await eventContract.cumparaBilet({ value: ethers.parseEther(await eventContract.pretBilet()) });
      await tx.wait();
      alert("Bilet cumpărat cu succes!");
    } catch (error) {
      console.error(error);
      alert("Eroare la cumpărarea biletului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cumpără Bilet</h2>
      <button onClick={handleBuyTicket} disabled={loading}>
        {loading ? "Se procesează..." : "Cumpără Bilet"}
      </button>
    </div>
  );
};

export default BuyTicket;