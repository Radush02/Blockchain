import React, { useEffect, useState } from "react";
import { useMetaMaskContext } from "../contexts/metaMaskContext";
import { ethers } from "ethers";
import EventABI from "../contracts/Event.json";

const EventList = () => {
  const { eventFactoryContract, signer } = useMetaMaskContext();
  const [events, setEvents] = useState<string[]>([]);
  const [eventNames, setEventNames] = useState<{eveniment:string;detalii:string;}[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (eventFactoryContract) {
        const eventCount = await eventFactoryContract.nextEventId();
        const eventAddresses = [];
        for (let i = 0; i < eventCount; i++) {
          const address = await eventFactoryContract.evenimente(i);
          eventAddresses.push(address);
          const eventContract = new ethers.Contract(address, EventABI.abi, signer);
          eventNames.push({eveniment: await eventContract.eveniment(),detalii: await eventContract.descriere()});
        }
        setEvents(eventAddresses);
        setEventNames(eventNames);
      }
    };

    fetchEvents();
  }, [eventFactoryContract]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Evenimente Disponibile</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{eventNames[index].eveniment}</h3>
              <a 
                href={`/event/${event}`} 
                className="text-blue-500 hover:text-blue-700 transition duration-300">
                {eventNames[index].detalii}
              </a>
            </div>
            <div className="bg-gray-100 p-4 text-center">
              <button 
                onClick={() => window.location.href = `/event/${event}`} 
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                Vizualizeaza
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
