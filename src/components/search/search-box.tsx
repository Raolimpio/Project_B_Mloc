import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import type { Machine } from '@/types';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  photoUrl?: string;
}

export function SearchBox() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMachines = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const machinesRef = collection(db, 'machines');
        const searchTermLower = searchTerm.toLowerCase();
        
        const q = query(
          machinesRef,
          orderBy('name'),
          limit(5)
        );
        
        const snapshot = await getDocs(q);
        const searchResults = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Machine))
          .filter(machine => 
            machine.name.toLowerCase().includes(searchTermLower) ||
            machine.category.toLowerCase().includes(searchTermLower) ||
            machine.subcategory.toLowerCase().includes(searchTermLower)
          )
          .map(({ id, name, category, imageUrl, photoUrl }) => ({
            id,
            name,
            category,
            imageUrl,
            photoUrl,
          }));

        setResults(searchResults);
      } catch (error) {
        console.error('Error searching machines:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchMachines, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    navigate(`/machines/${result.id}`);
    setShowResults(false);
    setSearchTerm('');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== DEFAULT_CATEGORY_IMAGE) {
      target.src = DEFAULT_CATEGORY_IMAGE;
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Buscar máquinas..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {showResults && (searchTerm || results.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border bg-white py-2 shadow-lg">
          {results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li
                  key={result.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <img
                        src={result.imageUrl || result.photoUrl || DEFAULT_CATEGORY_IMAGE}
                        alt={result.name}
                        className="h-full w-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-500">{result.category}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm ? (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              Nenhum resultado encontrado
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}