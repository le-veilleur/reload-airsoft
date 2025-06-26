// src/Pages/events/EventDetailPage.tsx

import React from "react";
import EventDetails from "../../Components/Events/EventDetails";

const EventDetailPage: React.FC = () => {
  return (
    <div className="fixed inset-0 top-16 z-10">
      <EventDetails />
    </div>
  );
};

export default EventDetailPage;
