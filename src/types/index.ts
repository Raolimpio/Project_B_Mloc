export interface Machine {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  workPhase: string;
  description: string;
  specifications: {
    brand: string;
    model: string;
    year: number;
    power: string;
    weight: string;
  };
  photos: {
    main: string;
    gallery: string[];
  };
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  availability: {
    status: 'available' | 'rented' | 'maintenance';
    location: {
      address: string;
      city: string;
      state: string;
    };
  };
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rental {
  id: string;
  machineId: string;
  renterId: string;
  ownerId: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  period: {
    start: Date;
    end: Date;
  };
  pricing: {
    type: 'hourly' | 'daily' | 'weekly' | 'monthly';
    value: number;
    total: number;
  };
  location: {
    delivery: boolean;
    address: string;
    city: string;
    state: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  machineId: string;
  renterId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}