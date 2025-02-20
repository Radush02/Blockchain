import React, { useEffect, useState } from "react";
import { useMetaMaskContext } from "../contexts/metaMaskContext";

const EventList = () => {
  const { eventFactoryContract } = useMetaMaskContext();
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (eventFactoryContract) {
        const eventCount = await eventFactoryContract.nextEventId();
        const eventAddresses = [];
        for (let i = 0; i < eventCount; i++) {
          const address = await eventFactoryContract.evenimente(i);
          eventAddresses.push(address);
        }
        setEvents(eventAddresses);
      }
    };

    fetchEvents();
  }, [eventFactoryContract]);

  return (
    <div>
      <h2>Evenimente Disponibile</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <a href={`/event/${event}`}>
              Eveniment #{index + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;