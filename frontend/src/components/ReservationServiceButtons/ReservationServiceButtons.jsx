import React from 'react';
import { getReservationServices, openReservationService } from '../../utils/deepLinking';

const ReservationServiceButtons = ({ restaurant }) => {
  const reservationServices = getReservationServices();
  
  const handleReservationClick = (service) => {
    openReservationService(service.id, restaurant);
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Make a Reservation</h3>
      <div className="flex flex-wrap gap-2">
        {reservationServices.map((service) => (
          <button
            key={service.name}
            onClick={() => handleReservationClick(service)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img 
              src={`/images/reservations/${service.icon}`} 
              alt={service.name} 
              className="w-6 h-6 mr-2" 
            />
            <span>{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReservationServiceButtons;
