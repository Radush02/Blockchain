import React, { useEffect, useState } from "react";
import { useMetaMaskContext } from "../contexts/metaMaskContext";
import { ethers } from "ethers";
import EventABI from "../contracts/Event.json";
const EventList = () => {
  const { eventFactoryContract,signer} = useMetaMaskContext();
  const [events, setEvents] = useState<string[]>([]);
  const [eventNames, setEventNames] = useState<string[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      if (eventFactoryContract) {
        const eventCount = await eventFactoryContract.nextEventId();
        const eventAddresses = [];
        for (let i = 0; i < eventCount; i++) {
          const address = await eventFactoryContract.evenimente(i);
          eventAddresses.push(address);
          const eventContract = new ethers.Contract(address, EventABI.abi, signer);
          eventNames.push(await eventContract.eveniment());
        }
        setEvents(eventAddresses);
        setEventNames(eventNames);
      }
    };

    fetchEvents();
  }, [eventFactoryContract]);

  return (
    <div>
      <button onClick={() => window.location.href = '/create'}>
        Creaza event
      </button>
      <button onClick={() => window.location.href = '/profile'}>
        Profil
      </button>
      <h2>Evenimente Disponibile</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <a href={`/event/${event}`}>
              Eveniment: {eventNames[index]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;