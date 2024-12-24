import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { loadGoogleMapsScript } from '@/lib/google-maps';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: string) => void;
  className?: string;
  placeholder?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export function AddressAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  className = '',
  placeholder = 'Digite o endereço'
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAutocomplete = async () => {
      try {
        await loadGoogleMapsScript();
        
        if (!mounted || !inputRef.current || !window.google) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'br' },
          types: ['address'],
          fields: ['formatted_address', 'address_components']
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
            onSelect?.(place.formatted_address);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    return () => {
      mounted = false;
      if (autocompleteRef.current) {
        window.google?.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, onSelect]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none ${className}`}
        placeholder={placeholder}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}
