/**
 * Deep linking utility for food delivery and reservation services
 */

// Delivery service deep links
const deliveryServices = {
  // UberEats deep links
  ubereats: {
    name: 'Uber Eats',
    icon: 'ubereats-icon.png',
    generateLink: (restaurant, meal = null) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Mobile app deep link
      const appLink = `ubereats://search?q=${encodedName}`;
      // Web fallback
      const webLink = `https://www.ubereats.com/search?q=${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // DoorDash deep links
  doordash: {
    name: 'DoorDash',
    icon: 'doordash-icon.png',
    generateLink: (restaurant, meal = null) => {
      const encodedName = encodeURIComponent(restaurant.name);
      const encodedAddress = encodeURIComponent(restaurant.address || '');
      // Mobile app deep link
      const appLink = `doordash://store/${encodedName}`;
      // Web fallback
      const webLink = `https://www.doordash.com/search/store/${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // GrubHub deep links
  grubhub: {
    name: 'Grubhub',
    icon: 'grubhub-icon.png',
    generateLink: (restaurant, meal = null) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Mobile app deep link
      const appLink = `grubhub://restaurants?q=${encodedName}`;
      // Web fallback
      const webLink = `https://www.grubhub.com/search?queryText=${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // Postmates deep links
  postmates: {
    name: 'Postmates',
    icon: 'postmates-icon.png',
    generateLink: (restaurant, meal = null) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Mobile app deep link
      const appLink = `postmates://search?q=${encodedName}`;
      // Web fallback
      const webLink = `https://postmates.com/search?query=${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // Seamless deep links
  seamless: {
    name: 'Seamless',
    icon: 'seamless-icon.png',
    generateLink: (restaurant, meal = null) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Mobile app deep link
      const appLink = `seamless://restaurants?q=${encodedName}`;
      // Web fallback
      const webLink = `https://www.seamless.com/search?queryText=${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // Caviar deep links
  caviar: {
    name: 'Caviar',
    icon: 'caviar-icon.png',
    generateLink: (restaurant, meal = null) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Mobile app deep link
      const appLink = `caviar://search?q=${encodedName}`;
      // Web fallback
      const webLink = `https://www.trycaviar.com/search?query=${encodedName}`;
      return { appLink, webLink };
    }
  }
};

// Reservation service deep links
const reservationServices = {
  // OpenTable deep links
  opentable: {
    name: 'OpenTable',
    icon: 'opentable-icon.png',
    generateLink: (restaurant) => {
      const encodedName = encodeURIComponent(restaurant.name);
      const encodedLocation = encodeURIComponent(restaurant.address || '');
      // Mobile app deep link
      const appLink = `opentable://restaurants?name=${encodedName}`;
      // Web fallback
      const webLink = `https://www.opentable.com/s?term=${encodedName}&metroId=`;
      return { appLink, webLink };
    }
  },
  
  // Resy deep links
  resy: {
    name: 'Resy',
    icon: 'resy-icon.png',
    generateLink: (restaurant) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Mobile app deep link
      const appLink = `resy://search?query=${encodedName}`;
      // Web fallback
      const webLink = `https://resy.com/cities?query=${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // Tock deep links
  tock: {
    name: 'Tock',
    icon: 'tock-icon.png',
    generateLink: (restaurant) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Mobile app deep link
      const appLink = `tock://search?query=${encodedName}`;
      // Web fallback
      const webLink = `https://www.exploretock.com/search?query=${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // Yelp Reservations deep links
  yelp: {
    name: 'Yelp',
    icon: 'yelp-icon.png',
    generateLink: (restaurant) => {
      const encodedName = encodeURIComponent(restaurant.name);
      const yelpId = restaurant.yelpId || '';
      // Mobile app deep link
      const appLink = yelpId 
        ? `yelp://business_details?biz_id=${yelpId}` 
        : `yelp://search?terms=${encodedName}`;
      // Web fallback
      const webLink = yelpId 
        ? `https://www.yelp.com/biz/${yelpId}` 
        : `https://www.yelp.com/search?find_desc=${encodedName}`;
      return { appLink, webLink };
    }
  },
  
  // Toast Tables deep links
  toast: {
    name: 'Toast Tables',
    icon: 'toast-icon.png',
    generateLink: (restaurant) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Web link (Toast doesn't have a well-documented deep link scheme)
      const webLink = `https://www.toasttab.com/search?q=${encodedName}`;
      return { appLink: webLink, webLink };
    }
  },
  
  // Eat App deep links
  eatapp: {
    name: 'Eat App',
    icon: 'eatapp-icon.png',
    generateLink: (restaurant) => {
      const encodedName = encodeURIComponent(restaurant.name);
      // Web link (Eat App doesn't have a well-documented deep link scheme)
      const webLink = `https://eatapp.co/search?query=${encodedName}`;
      return { appLink: webLink, webLink };
    }
  }
};

/**
 * Open a deep link with fallback to web
 * @param {Object} linkData - Object with appLink and webLink properties
 */
function openDeepLink(linkData) {
  const { appLink, webLink } = linkData;
  
  // Try to open the app first
  const now = Date.now();
  const timeoutDuration = 1000; // 1 second
  
  // Create an iframe to try opening the app
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = appLink;
  document.body.appendChild(iframe);
  
  // Set a timeout to check if the app opened
  setTimeout(() => {
    document.body.removeChild(iframe);
    // If the page is still visible after the timeout, the app didn't open
    if (Date.now() - now < timeoutDuration + 100) {
      // App didn't open, use web fallback
      window.open(webLink, '_blank', 'noopener,noreferrer');
    }
  }, timeoutDuration);
  
  // Also provide a direct link to the web version
  return webLink;
}

/**
 * Get all available delivery services
 * @returns {Array} Array of delivery service objects
 */
function getDeliveryServices() {
  return Object.values(deliveryServices);
}

/**
 * Get all available reservation services
 * @returns {Array} Array of reservation service objects
 */
function getReservationServices() {
  return Object.values(reservationServices);
}

/**
 * Open a delivery service app or website
 * @param {string} service - Service key (e.g., 'ubereats', 'doordash')
 * @param {Object} restaurant - Restaurant object with name and address
 * @param {Object} meal - Optional meal object
 * @returns {string} Web fallback URL
 */
function openDeliveryService(service, restaurant, meal = null) {
  if (!deliveryServices[service]) {
    console.error(`Delivery service ${service} not supported`);
    return null;
  }
  
  const linkData = deliveryServices[service].generateLink(restaurant, meal);
  return openDeepLink(linkData);
}

/**
 * Open a reservation service app or website
 * @param {string} service - Service key (e.g., 'opentable', 'resy')
 * @param {Object} restaurant - Restaurant object with name and address
 * @returns {string} Web fallback URL
 */
function openReservationService(service, restaurant) {
  if (!reservationServices[service]) {
    console.error(`Reservation service ${service} not supported`);
    return null;
  }
  
  const linkData = reservationServices[service].generateLink(restaurant);
  return openDeepLink(linkData);
}

export {
  getDeliveryServices,
  getReservationServices,
  openDeliveryService,
  openReservationService,
  deliveryServices,
  reservationServices
};