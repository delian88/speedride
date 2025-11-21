export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export enum RideStatus {
  IDLE = 'IDLE',
  CHOOSING = 'CHOOSING',
  SEARCHING = 'SEARCHING',
  OFFERED = 'OFFERED', // For driver to see
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum VehicleType {
  STANDARD = 'Standard',
  ECONOMY = 'Economy',
  BUSINESS = 'Business',
  MOTORBIKE = 'Motorbike',
  PET_FRIENDLY = 'Pet Friendly'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'CREDIT' | 'DEBIT';
  description: string;
}

export interface RideHistoryItem {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  price: number;
  status: RideStatus;
  driverName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  rating?: number;
  phone?: string;
  balance: number;
  transactions?: Transaction[];
  history?: RideHistoryItem[];
}

export interface Driver extends User {
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleModel: string;
  isOnline: boolean;
  location: Coordinates;
  totalEarnings: number;
  todayEarnings: number;
  tripsCount: number;
  documentsVerified: boolean;
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  pickup: string;
  destination: string;
  pickupCoords: Coordinates; // Mock coords for map
  destCoords: Coordinates;   // Mock coords for map
  status: RideStatus;
  vehicleType: VehicleType;
  price: number;
  distance: string;
  eta: string;
  preferences: string[];
  timestamp: number;
}

export interface PricingTier {
  id: VehicleType;
  name: string;
  multiplier: number;
  base: number;
  image: string;
}