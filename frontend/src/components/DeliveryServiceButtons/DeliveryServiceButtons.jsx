import React from 'react';
import { getDeliveryServices, openDeliveryService } from '../../utils/deepLinking';

const DeliveryServiceButtons = ({ restaurant, meal = null }) => {
  const deliveryServices = getDeliveryServices();
  
  const handleDeliveryClick = (service) => {
    openDeliveryService(service.id, restaurant, meal);
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Order Delivery</h3>
      <div className="flex flex-wrap gap-2">
        {deliveryServices.map((service) => (
          <button
            key={service.name}
            onClick={() => handleDeliveryClick(service)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img 
              src={`/images/delivery/${service.icon}`} 
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

export default DeliveryServiceButtons;
