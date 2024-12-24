import { useEffect, useState } from 'react';
import { API_KEYS } from '@/config/api-keys';

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

export function useGooglePlaces(inputRef: React.RefObject<HTMLInputElement>) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Função que será chamada quando o script do Google Places for carregado
    window.initGooglePlaces = () => {
      setIsLoaded(true);
    };

    // Carrega o script do Google Places se ainda não estiver carregado
    if (!document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS}&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'BR' },
      fields: ['address_components'],
    });

    const handlePlaceSelect = () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let addressData = {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      };

      place.address_components.forEach((component: any) => {
        const types = component.types;

        if (types.includes('route')) {
          addressData.street = component.long_name;
        }
        if (types.includes('street_number')) {
          addressData.number = component.long_name;
        }
        if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
          addressData.neighborhood = component.long_name;
        }
        if (types.includes('administrative_area_level_2')) {
          addressData.city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          addressData.state = component.short_name;
        }
        if (types.includes('postal_code')) {
          addressData.zipCode = component.long_name;
        }
      });

      // Dispara um evento customizado com os dados do endereço
      const event = new CustomEvent('placeSelected', { detail: addressData });
      inputRef.current?.dispatchEvent(event);
    };

    autocomplete.addListener('place_changed', handlePlaceSelect);

    return () => {
      window.google?.maps?.event?.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, inputRef]);

  return { isLoaded };
}
