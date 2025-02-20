import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateEvent from "./components/createEvent";
import EventList from "./components/eventList";
import BuyTicket from "./components/buyTicket";
import Profile from "./components/profile";
import EventDetails from "./components/eventPage";
import { MetaMaskProvider } from "./contexts/metaMaskContext";

const App = () => {
  return (
    <MetaMaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/event/:eventAddress" element={<EventDetails />} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </Router>
    </MetaMaskProvider>
  );
};

export default App;
