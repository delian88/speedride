
import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { User, UserRole, Ride, RideStatus, Driver, VehicleType, Transaction, RideHistoryItem, ChatMessage } from '../types';
import { MOCK_RIDER, MOCK_DRIVER, MOCK_ADMIN } from '../constants';

interface BackendContextType {
  user: User | Driver | null;
  activeRide: Ride | null;
  login: (email: string, role: UserRole) => void;
  signup: (role: UserRole, details: Partial<User | Driver>) => void;
  logout: () => void;
  
  // Rider Actions
  requestRide: (pickup: string, dest: string, type: VehicleType, price: number) => void;
  cancelRide: () => void;
  
  // Driver Actions
  toggleOnline: () => void;
  acceptRide: () => void;
  rejectRide: () => void;
  startTrip: () => void;
  completeRide: () => void;

  // Shared
  addFunds: (amount: number) => void;
  sendMessage: (text: string) => void;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export const BackendProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | Driver | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  // --- Auth ---
  const login = (email: string, role: UserRole) => {
    // Simulating login by checking role
    if (role === UserRole.RIDER) setUser({ ...MOCK_RIDER });
    if (role === UserRole.DRIVER) setUser({ ...MOCK_DRIVER });
    if (role === UserRole.ADMIN) setUser({ ...MOCK_ADMIN });
  };

  const signup = (role: UserRole, details: Partial<User | Driver>) => {
    const newUser: any = {
      id: `u-${Date.now()}`,
      role,
      name: details.name || 'New User',
      email: details.email || 'user@speedride.com',
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
      rating: 5.0,
      balance: 100,
      transactions: [],
      history: [],
      ...details
    };

    if (role === UserRole.DRIVER) {
        newUser.isOnline = true;
        newUser.todayEarnings = 0;
        newUser.totalEarnings = 0;
        newUser.tripsCount = 0;
        newUser.location = { lat: 50, lng: 50 };
        newUser.documentsVerified = true;
    }

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setActiveRide(null);
  };

  // --- Rider Logic ---
  const requestRide = (pickup: string, destination: string, type: VehicleType, price: number) => {
    if (!user) return;
    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      riderId: user.id,
      pickup,
      destination,
      status: RideStatus.SEARCHING,
      vehicleType: type,
      price,
      distance: '5.2 km',
      eta: '6 min',
      pickupCoords: { lat: 0, lng: 0 },
      destCoords: { lat: 1, lng: 1 },
      preferences: [],
      timestamp: Date.now(),
      chatHistory: []
    };
    setActiveRide(newRide);

    // BOT SIMULATION: If user is RIDER, find a driver automatically
    if (user.role === UserRole.RIDER) {
      setTimeout(() => {
        setActiveRide(prev => prev ? { ...prev, status: RideStatus.ACCEPTED, driverId: MOCK_DRIVER.id } : null);
        setTimeout(() => {
          setActiveRide(prev => prev ? { ...prev, status: RideStatus.ARRIVING, eta: '2 min' } : null);
          // Auto progress to In Progress for demo flow
          setTimeout(() => {
             setActiveRide(prev => prev ? { ...prev, status: RideStatus.IN_PROGRESS, eta: '15 min' } : null);
             // Auto complete
             setTimeout(() => {
                 completeRideInternal(newRide.price);
             }, 30000); // Longer ride for chat demo
          }, 8000);
        }, 4000);
      }, 3000);
    }
  };

  const cancelRide = () => {
    setActiveRide(null);
  };

  // --- Driver Logic ---
  const toggleOnline = () => {
    if (user?.role === UserRole.DRIVER) {
        setUser(prev => prev ? { ...prev, isOnline: !(prev as Driver).isOnline } : null);
    }
  };

  // Driver Bot Simulation: If driver is online and idle, generate a request
  useEffect(() => {
    if (user?.role === UserRole.DRIVER && (user as Driver).isOnline && !activeRide) {
        const randomTime = Math.random() * 5000 + 3000; // 3-8 seconds
        const timeout = setTimeout(() => {
             if (!activeRide) {
                 const mockFare = Math.floor(Math.random() * 30) + 10;
                 const newRide: Ride = {
                    id: `req-${Date.now()}`,
                    riderId: 'mock-rider',
                    pickup: '123 Main St',
                    destination: '456 Market St',
                    status: RideStatus.OFFERED, // Specific status for driver to accept
                    vehicleType: VehicleType.STANDARD,
                    price: mockFare,
                    distance: '3.4 km',
                    eta: 'Pickup in 4 min',
                    pickupCoords: { lat: 0, lng: 0 },
                    destCoords: { lat: 0, lng: 0 },
                    preferences: [],
                    timestamp: Date.now(),
                    chatHistory: []
                 };
                 setActiveRide(newRide);
             }
        }, randomTime);
        return () => clearTimeout(timeout);
    }
  }, [user, activeRide]);


  const acceptRide = () => {
    if (activeRide) {
        setActiveRide({ ...activeRide, status: RideStatus.ARRIVING });
    }
  };

  const rejectRide = () => {
      setActiveRide(null); // Will trigger the useEffect to find another one
  };

  const startTrip = () => {
    if (activeRide) {
        setActiveRide({ ...activeRide, status: RideStatus.IN_PROGRESS });
    }
  };

  const completeRide = () => {
      if (activeRide) {
          completeRideInternal(activeRide.price);
      }
  };

  // Internal helper to finalize ride, update wallet/history
  const completeRideInternal = (price: number) => {
    setActiveRide(prev => prev ? { ...prev, status: RideStatus.COMPLETED } : null);
    
    // Update User Wallet & History
    setUser(prev => {
        if (!prev) return null;
        const transaction: Transaction = {
            id: `tx-${Date.now()}`,
            amount: prev.role === UserRole.DRIVER ? price : -price,
            date: new Date().toISOString(),
            type: prev.role === UserRole.DRIVER ? 'CREDIT' : 'DEBIT',
            description: `Ride Payment`
        };
        const historyItem: RideHistoryItem = {
            id: `h-${Date.now()}`,
            date: new Date().toLocaleDateString(),
            pickup: 'Pickup Location', // In real app would use activeRide data
            destination: 'Destination',
            price: price,
            status: RideStatus.COMPLETED,
            driverName: prev.role === UserRole.RIDER ? MOCK_DRIVER.name : undefined
        };

        if (prev.role === UserRole.DRIVER) {
             const d = prev as Driver;
             return {
                 ...d,
                 balance: d.balance + price,
                 todayEarnings: d.todayEarnings + price,
                 totalEarnings: d.totalEarnings + price,
                 tripsCount: d.tripsCount + 1,
                 transactions: [transaction, ...(d.transactions || [])],
                 history: [historyItem, ...(d.history || [])]
             };
        } else {
             return {
                 ...prev,
                 balance: prev.balance - price,
                 transactions: [transaction, ...(prev.transactions || [])],
                 history: [historyItem, ...(prev.history || [])]
             };
        }
    });
  };

  const addFunds = (amount: number) => {
      setUser(prev => {
          if(!prev) return null;
          return {
              ...prev,
              balance: prev.balance + amount,
              transactions: [{
                  id: `tx-topup-${Date.now()}`,
                  amount,
                  date: new Date().toISOString(),
                  type: 'CREDIT',
                  description: 'Wallet Top-up'
              }, ...(prev.transactions || [])]
          }
      })
  }

  // --- Chat Logic ---
  const sendMessage = (text: string) => {
    if (!activeRide || !user) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: user.role,
      text: text,
      timestamp: Date.now(),
      isRead: false
    };

    // 1. Add User Message
    setActiveRide(prev => prev ? {
      ...prev,
      chatHistory: [...prev.chatHistory, newMessage]
    } : null);

    // 2. Simulate Bot Reply
    const isRider = user.role === UserRole.RIDER;
    const botRole = isRider ? UserRole.DRIVER : UserRole.RIDER;
    
    const botResponses = isRider 
      ? ["I'm on my way!", "Traffic is a bit heavy, be there in 2.", "Okay, noted.", "I've arrived at the pickup point."] // Driver responses
      : ["I'm wearing a red jacket.", "I'm coming down now.", "Please wait a moment.", "Thank you!", "Where exactly are you?"]; // Rider responses

    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderRole: botRole,
        text: randomResponse,
        timestamp: Date.now(),
        isRead: false
      };
      setActiveRide(prev => prev ? {
        ...prev,
        chatHistory: [...prev.chatHistory, botMessage]
      } : null);
    }, 2000 + Math.random() * 2000); // 2-4s delay
  };

  return (
    <BackendContext.Provider value={{ 
      user, 
      activeRide, 
      login,
      signup,
      logout, 
      requestRide, 
      cancelRide,
      toggleOnline,
      acceptRide,
      rejectRide,
      startTrip,
      completeRide,
      addFunds,
      sendMessage
    }}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => {
  const context = useContext(BackendContext);
  if (!context) throw new Error("useBackend must be used within BackendProvider");
  return context;
};
