import React from "react";
import CreateEvent from "./components/createEvent";
import EventList from "./components/eventList";
import BuyTicket from "./components/buyTicket";
import { MetaMaskProvider, useMetaMaskContext } from "./contexts/metaMaskContext";

const AppContent = () => {
  const { account, connectWallet } = useMetaMaskContext();

  return (
    <div>
      <h1>Event Management</h1>
      {!account ? (
        <button onClick={connectWallet}>Conectează-te la MetaMask</button>
      ) : (
        <>
          <CreateEvent />
          <EventList />
          <BuyTicket eventAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3" />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <MetaMaskProvider>
      <AppContent />
    </MetaMaskProvider>
  );
};

export default App;
