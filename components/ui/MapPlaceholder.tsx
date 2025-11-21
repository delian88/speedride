import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Car } from 'lucide-react';
import { RideStatus, Coordinates } from '../../types';

interface MapPlaceholderProps {
  status: RideStatus;
  pickup?: string;
  destination?: string;
  className?: string;
  showDriver?: boolean;
}

// Simple predictable pseudo-random generator for "moving" cars
const getRandomPos = (seed: number) => {
  const x = (Math.sin(seed) * 10000) % 80;
  const y = (Math.cos(seed) * 10000) % 80;
  return { left: `${Math.abs(x) + 10}%`, top: `${Math.abs(y) + 10}%` };
};

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  status, 
  pickup, 
  destination, 
  className = "",
  showDriver = false
}) => {
  const [driverPos, setDriverPos] = useState({ left: '45%', top: '45%' });

  // Simulate driver movement
  useEffect(() => {
    if (status === RideStatus.ARRIVING || status === RideStatus.IN_PROGRESS) {
      const interval = setInterval(() => {
        setDriverPos(prev => ({
          left: `${parseFloat(prev.left) + (Math.random() * 4 - 2)}%`,
          top: `${parseFloat(prev.top) + (Math.random() * 4 - 2)}%`
        }));
      }, 500); // Faster updates for smoother feel
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className={`relative bg-slate-100 overflow-hidden rounded-xl border border-gray-200 ${className}`}>
      {/* Mock Map Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>
      
      {/* Streets (Mock) */}
      <div className="absolute top-1/2 left-0 w-full h-6 bg-white/60 transform -rotate-12 shadow-sm"></div>
      <div className="absolute top-0 left-1/3 h-full w-6 bg-white/60 transform rotate-6 shadow-sm"></div>
      <div className="absolute top-[20%] right-[20%] w-1/2 h-4 bg-white/60 -rotate-45 shadow-sm"></div>
      
      {/* Water / Park areas (Decorative) */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100/50 rounded-full blur-xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-green-100/50 rounded-full blur-xl"></div>

      {/* Nearby Cars (Decorations) */}
      {!destination && (
        <>
          {[1, 2, 3].map(i => (
            <div key={i} className="absolute text-gray-400 transition-all duration-[2000ms] ease-in-out" style={getRandomPos(Date.now() + i)}>
               <Car size={16} className="transform rotate-45 opacity-60" />
            </div>
          ))}
        </>
      )}

      {/* Pickup Pin */}
      {(pickup || status !== RideStatus.IDLE) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600 flex flex-col items-center z-10">
          <div className="bg-white px-3 py-1 text-[10px] font-bold shadow-lg rounded-full whitespace-nowrap mb-1 border border-green-100 animate-fade-in-up">You</div>
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <MapPin size={32} fill="currentColor" className="relative z-10 drop-shadow-lg" />
          </div>
        </div>
      )}

      {/* Destination Pin */}
      {destination && (
        <div className="absolute top-[20%] right-[20%] text-red-600 flex flex-col items-center z-10 animate-fade-in-up delay-200">
           <div className="bg-white px-3 py-1 text-[10px] font-bold shadow-lg rounded-full whitespace-nowrap mb-1 border border-red-100">Dest</div>
          <MapPin size={32} fill="currentColor" className="drop-shadow-lg" />
        </div>
      )}

      {/* Active Driver */}
      {(showDriver || status === RideStatus.ARRIVING || status === RideStatus.IN_PROGRESS) && (
        <div 
          className="absolute text-black z-20 transition-all duration-500 ease-linear"
          style={driverPos}
        >
          <div className="bg-black text-white p-2 rounded-full shadow-xl transform -rotate-12 hover:scale-110 transition-transform">
            <Car size={20} />
          </div>
          {status === RideStatus.ARRIVING && (
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full whitespace-nowrap opacity-80">
                 Arriving
             </div>
          )}
        </div>
      )}

      {/* Route Line (Mock) */}
      {(status === RideStatus.ARRIVING || status === RideStatus.IN_PROGRESS) && (
        <svg className="absolute inset-0 pointer-events-none opacity-50" width="100%" height="100%">
          <path 
            d="M 50% 50% Q 60% 35% 80% 20%" 
            stroke="#2563eb" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray="8,8"
            className="animate-pulse"
          />
        </svg>
      )}
    </div>
  );
};

export default MapPlaceholder;