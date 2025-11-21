import { VehicleType, PricingTier, User, UserRole, Driver } from './types';

export const VEHICLE_OPTIONS: PricingTier[] = [
  {
    id: VehicleType.ECONOMY,
    name: 'Economy',
    multiplier: 1.0,
    base: 10,
    image: 'https://img.icons8.com/fluency/96/hatchback.png'
  },
  {
    id: VehicleType.STANDARD,
    name: 'Standard',
    multiplier: 1.2,
    base: 15,
    image: 'https://img.icons8.com/fluency/96/sedan.png'
  },
  {
    id: VehicleType.BUSINESS,
    name: 'Business',
    multiplier: 1.8,
    base: 25,
    image: 'https://img.icons8.com/fluency/96/luxury-sedan.png'
  },
  {
    id: VehicleType.MOTORBIKE,
    name: 'Moto',
    multiplier: 0.6,
    base: 5,
    image: 'https://img.icons8.com/fluency/96/motorcycle.png'
  },
  {
    id: VehicleType.PET_FRIENDLY,
    name: 'Pet Friendly',
    multiplier: 1.3,
    base: 18,
    image: 'https://img.icons8.com/fluency/96/dog-paw-print.png'
  }
];

export const MOCK_RIDER: User = {
  id: 'u-rider-01',
  name: 'John Rider',
  email: 'john@example.com',
  role: UserRole.RIDER,
  avatarUrl: 'https://i.pravatar.cc/150?u=rider',
  rating: 4.8,
  balance: 45.50
};

export const MOCK_DRIVER: Driver = {
  id: 'u-driver-01',
  name: 'Sarah Driver',
  email: 'sarah@speedride.com',
  role: UserRole.DRIVER,
  avatarUrl: 'https://i.pravatar.cc/150?u=driver',
  rating: 4.9,
  vehicleType: VehicleType.STANDARD,
  vehicleModel: 'Toyota Camry',
  vehiclePlate: 'ABC-1234',
  isOnline: true,
  location: { lat: 50, lng: 50 }, // Center of mock map
  totalEarnings: 1250.00,
  todayEarnings: 124.50,
  tripsCount: 342,
  documentsVerified: true,
  balance: 150.00
};

export const MOCK_ADMIN: User = {
  id: 'u-admin-01',
  name: 'Super Admin',
  email: 'admin@speedride.com',
  role: UserRole.ADMIN,
  avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  balance: 0
};