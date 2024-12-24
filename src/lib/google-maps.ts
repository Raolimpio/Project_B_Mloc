let isLoading = false;
let isLoaded = false;

export function loadGoogleMapsScript(): Promise<void> {
  if (isLoaded) {
    return Promise.resolve();
  }

  if (isLoading) {
    return new Promise((resolve) => {
      const checkIfLoaded = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkIfLoaded);
          resolve();
        }
      }, 100);
    });
  }

  isLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA-3XNbkXX2dSD_zD84HbCPOo4iLDORTPA&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        isLoaded = true;
        isLoading = false;
        resolve();
      };

      script.onerror = () => {
        isLoading = false;
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    } catch (error) {
      isLoading = false;
      reject(error);
    }
  });
}
