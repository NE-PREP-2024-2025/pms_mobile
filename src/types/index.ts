export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  image: string;
  fuelType: FuelType;
  seatingCapacity: number;
  location: string;
  hourlyRate: number;
  rating: number;
  available: boolean;
  description: string;
  features: string[];
}

export type VehicleType = 'SUV' | 'Sedan' | 'Hatchback' | 'Convertible' | 'Truck' | 'Van';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';

export interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  totalCost: number;
  status: BookingStatus;
  createdAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface FilterOptions {
  vehicleType?: VehicleType | null;
  fuelType?: FuelType | null;
  seatingCapacity?: number | null;
  location?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sortBy?: 'price' | 'rating' | 'availability' | null;
  sortOrder?: 'asc' | 'desc' | null;
}