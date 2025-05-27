import { Vehicle } from '@/types';

export const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Tesla Model 3',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Electric',
    seatingCapacity: 5,
    location: 'San Francisco',
    hourlyRate: 25,
    rating: 4.8,
    available: true,
    description: "Experience the future of driving with Tesla's Model 3. This all-electric sedan offers impressive range, cutting-edge technology, and a sleek design.",
    features: ['Autopilot', 'Premium Sound System', 'Heated Seats', 'Supercharger Access']
  },
  {
    id: '2',
    name: 'Toyota RAV4',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Hybrid',
    seatingCapacity: 5,
    location: 'Los Angeles',
    hourlyRate: 18,
    rating: 4.5,
    available: true,
    description: "The Toyota RAV4 Hybrid combines efficiency with versatility. Perfect for city driving or weekend getaways with ample cargo space.",
    features: ['Backup Camera', 'Apple CarPlay', 'Android Auto', 'Lane Departure Warning']
  },
  {
    id: '3',
    name: 'BMW 5 Series',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Petrol',
    seatingCapacity: 5,
    location: 'New York',
    hourlyRate: 30,
    rating: 4.7,
    available: false,
    description: "Luxury meets performance in the BMW 5 Series. Enjoy premium comfort, advanced technology, and the ultimate driving experience.",
    features: ['Leather Seats', 'Navigation System', 'Sunroof', 'Parking Sensors']
  },
  {
    id: '4',
    name: 'Ford F-150',
    type: 'Truck',
    image: 'https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Diesel',
    seatingCapacity: 6,
    location: 'Dallas',
    hourlyRate: 22,
    rating: 4.6,
    available: true,
    description: "America's favorite truck, the Ford F-150 offers unmatched capability, durability, and comfort for work or play.",
    features: ['Towing Package', '4x4 Capability', 'Bed Liner', 'Trailer Backup Assist']
  },
  {
    id: '5',
    name: 'Honda Civic',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Petrol',
    seatingCapacity: 5,
    location: 'Chicago',
    hourlyRate: 15,
    rating: 4.4,
    available: true,
    description: "The reliable Honda Civic offers excellent fuel economy, a comfortable ride, and modern features at an affordable price.",
    features: ['Bluetooth Connectivity', 'Backup Camera', 'USB Ports', 'Cruise Control']
  },
  {
    id: '6',
    name: 'Jeep Wrangler',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Petrol',
    seatingCapacity: 4,
    location: 'Denver',
    hourlyRate: 24,
    rating: 4.6,
    available: true,
    description: "Adventure awaits with the iconic Jeep Wrangler. Built for off-road exploration with legendary capability and open-air freedom.",
    features: ['4x4 Capability', 'Removable Top', 'Off-Road Tires', 'Trail Rated']
  },
  {
    id: '7',
    name: 'Chevrolet Bolt',
    type: 'Hatchback',
    image: 'https://images.unsplash.com/photo-1566443280617-2684998eec9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Electric',
    seatingCapacity: 5,
    location: 'Seattle',
    hourlyRate: 20,
    rating: 4.3,
    available: false,
    description: "The all-electric Chevrolet Bolt offers impressive range and versatility in a compact package. Perfect for eco-conscious city driving.",
    features: ['DC Fast Charging', 'One-Pedal Driving', 'Regen on Demand', 'Apple CarPlay']
  },
  {
    id: '8',
    name: 'Mazda MX-5 Miata',
    type: 'Convertible',
    image: 'https://images.unsplash.com/photo-1566023497365-c8dacf929e11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    fuelType: 'Petrol',
    seatingCapacity: 2,
    location: 'Miami',
    hourlyRate: 28,
    rating: 4.9,
    available: true,
    description: "The Mazda MX-5 Miata delivers pure driving joy with its perfect balance, responsive handling, and open-top experience.",
    features: ['Convertible Top', 'Bose Sound System', 'Leather Seats', 'Sport Mode']
  }
];

export const locations = [
  'San Francisco',
  'Los Angeles',
  'New York',
  'Dallas',
  'Chicago',
  'Denver',
  'Seattle',
  'Miami'
];

export const vehicleTypes = [
  'SUV',
  'Sedan',
  'Hatchback',
  'Convertible',
  'Truck',
  'Van'
];

export const fuelTypes = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid'
];