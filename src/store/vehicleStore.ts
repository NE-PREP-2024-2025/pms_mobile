import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Booking, FilterOptions, Vehicle } from '@/types';
import { vehicles } from '@/mocks/vehicles';

interface VehicleState {
  // Vehicle browsing
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  
  // Filters and search
  searchQuery: string;
  filterOptions: FilterOptions;
  
  // Bookmarks and history
  bookmarkedVehicles: string[];
  recentlyViewedVehicles: string[];
  
  // Bookings
  bookings: Booking[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  selectVehicle: (vehicleId: string) => void;
  clearSelectedVehicle: () => void;
  toggleBookmark: (vehicleId: string) => void;
  addToRecentlyViewed: (vehicleId: string) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: vehicles,
      filteredVehicles: vehicles,
      selectedVehicle: null,
      
      searchQuery: '',
      filterOptions: {},
      
      bookmarkedVehicles: [],
      recentlyViewedVehicles: [],
      
      bookings: [],
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        const state = get();
        const filtered = applyFiltersAndSearch(state.vehicles, query, state.filterOptions);
        set({ filteredVehicles: filtered });
      },
      
      setFilterOptions: (options) => {
        const newFilterOptions = { ...get().filterOptions, ...options };
        set({ filterOptions: newFilterOptions });
        const filtered = applyFiltersAndSearch(get().vehicles, get().searchQuery, newFilterOptions);
        set({ filteredVehicles: filtered });
      },
      
      resetFilters: () => {
        set({ 
          filterOptions: {},
          searchQuery: '',
          filteredVehicles: get().vehicles
        });
      },
      
      selectVehicle: (vehicleId) => {
        const vehicle = get().vehicles.find(v => v.id === vehicleId) || null;
        set({ selectedVehicle: vehicle });
        if (vehicle) {
          get().addToRecentlyViewed(vehicleId);
        }
      },
      
      clearSelectedVehicle: () => {
        set({ selectedVehicle: null });
      },
      
      toggleBookmark: (vehicleId) => {
        const bookmarkedVehicles = [...get().bookmarkedVehicles];
        const index = bookmarkedVehicles.indexOf(vehicleId);
        
        if (index === -1) {
          bookmarkedVehicles.push(vehicleId);
        } else {
          bookmarkedVehicles.splice(index, 1);
        }
        
        set({ bookmarkedVehicles });
      },
      
      addToRecentlyViewed: (vehicleId) => {
        const recentlyViewed = [vehicleId];
        
        // Add other recently viewed vehicles, excluding the current one
        get().recentlyViewedVehicles.forEach(id => {
          if (id !== vehicleId && recentlyViewed.length < 10) {
            recentlyViewed.push(id);
          }
        });
        
        set({ recentlyViewedVehicles: recentlyViewed });
      },
      
      createBooking: (bookingData) => {
        const newBooking: Booking = {
          ...bookingData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        
        set({ bookings: [newBooking, ...get().bookings] });
      },
      
      cancelBooking: (bookingId) => {
        const bookings = get().bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const } 
            : booking
        );
        
        set({ bookings });
      }
    }),
    {
      name: 'vehicle-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookmarkedVehicles: state.bookmarkedVehicles,
        recentlyViewedVehicles: state.recentlyViewedVehicles,
        bookings: state.bookings
      })
    }
  )
);

// Helper function to apply filters and search
function applyFiltersAndSearch(
  vehicles: Vehicle[],
  searchQuery: string,
  filterOptions: FilterOptions
): Vehicle[] {
  let filtered = [...vehicles];
  
  // Apply search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      vehicle => 
        vehicle.name.toLowerCase().includes(query) || 
        vehicle.type.toLowerCase().includes(query)
    );
  }
  
  // Apply filters
  if (filterOptions.vehicleType) {
    filtered = filtered.filter(v => v.type === filterOptions.vehicleType);
  }
  
  if (filterOptions.fuelType) {
    filtered = filtered.filter(v => v.fuelType === filterOptions.fuelType);
  }
  
  if (filterOptions.seatingCapacity) {
    filtered = filtered.filter(v => v.seatingCapacity >= (filterOptions.seatingCapacity || 0));
  }
  
  if (filterOptions.location) {
    filtered = filtered.filter(v => v.location === filterOptions.location);
  }
  
  if (filterOptions.minPrice !== null && filterOptions.minPrice !== undefined) {
    filtered = filtered.filter(v => v.hourlyRate >= filterOptions.minPrice!);
  }
  
  if (filterOptions.maxPrice !== null && filterOptions.maxPrice !== undefined) {
    filtered = filtered.filter(v => v.hourlyRate <= filterOptions.maxPrice!);
  }
  
  // Apply sorting
  if (filterOptions.sortBy) {
    const sortOrder = filterOptions.sortOrder === 'desc' ? -1 : 1;
    
    filtered.sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'price':
          return sortOrder * (a.hourlyRate - b.hourlyRate);
        case 'rating':
          return sortOrder * (a.rating - b.rating);
        case 'availability':
          return sortOrder * (Number(a.available) - Number(b.available));
        default:
          return 0;
      }
    });
  }
  
  return filtered;
}