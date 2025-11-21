import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, DollarSign, User, CheckCircle, XCircle, Menu, Star, MessageSquare, Phone, X, Settings, Power } from 'lucide-react';
import { useBackend } from '../../context/MockBackendContext';
import { RideStatus, Ride } from '../../types';
import MapPlaceholder from '../../components/ui/MapPlaceholder';
import { MOCK_RIDER } from '../../constants';
import { useNavigate } from 'react-router-dom';

const DriverDashboard: React.FC = () => {
  const { user, activeRide, toggleOnline, acceptRide, rejectRide, startTrip, completeRide, logout } = useBackend();
  const navigate = useNavigate();
  const [showEarnings, setShowEarnings] = useState(false);
  const driver = user as any; // type casting for convenience

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- EARNINGS MODAL ---
  const EarningsModal = () => (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-gray-900 text-white w-full max-w-md rounded-3xl p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Earnings</h2>
                  <button onClick={() => setShowEarnings(false)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"><X size={20}/></button>
              </div>
              
              <div className="text-center mb-8">
                  <p className="text-gray-400 uppercase text-sm font-bold tracking-wide mb-2">Total Balance</p>
                  <h1 className="text-5xl font-bold text-green-400">${driver?.balance.toFixed(2)}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-gray-800 p-4 rounded-xl">
                       <p className="text-gray-400 text-xs mb-1">Today</p>
                       <p className="text-xl font-bold">${driver?.todayEarnings.toFixed(2)}</p>
                   </div>
                   <div className="bg-gray-800 p-4 rounded-xl">
                       <p className="text-gray-400 text-xs mb-1">Trips</p>
                       <p className="text-xl font-bold">{driver?.tripsCount}</p>
                   </div>
              </div>
              
              <button className="w-full bg-green-500 text-black font-bold py-4 rounded-xl mb-4">Cash Out</button>
              <p className="text-center text-xs text-gray-500">Automatic payout scheduled for Monday.</p>
          </div>
      </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white relative overflow-hidden">
      {showEarnings && <EarningsModal />}
      
      {/* Top Bar */}
      <header className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
         <div className="flex items-center bg-black/40 backdrop-blur-md p-2 rounded-full pr-6">
            <div className="bg-yellow-400 text-black p-2 rounded-full mr-3 font-bold">
                {driver?.rating}
            </div>
            <div>
                <h1 className="font-bold text-sm">{driver?.name}</h1>
                <p className="text-xs text-gray-300 uppercase">{driver?.vehiclePlate}</p>
            </div>
         </div>
         
         <div className="flex gap-3">
             <button onClick={() => setShowEarnings(true)} className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-black/60">
                 <DollarSign size={20} className="text-green-400"/>
             </button>
             <button onClick={handleLogout} className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-red-900/60 text-red-400">
                 <Power size={20}/>
             </button>
         </div>
      </header>

      {/* Map */}
      <div className="flex-grow relative">
        <MapPlaceholder 
            status={activeRide?.status || RideStatus.IDLE} 
            showDriver={true}
            pickup={activeRide?.pickup}
            destination={activeRide?.destination}
            className="w-full h-full rounded-none border-none bg-gray-800 opacity-100"
        />
        
        {/* Online/Offline Toggle Overlay */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
             {!activeRide && (
                 <button 
                    onClick={toggleOnline}
                    className={`px-8 py-4 rounded-full font-bold text-xl shadow-xl transition-all transform active:scale-95 flex items-center ${driver?.isOnline ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-green-500 text-black hover:bg-green-400'}`}
                 >
                    {driver?.isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                 </button>
             )}
        </div>
      </div>

      {/* REQUEST POPUP (Only when OFFERED) */}
      {activeRide && activeRide.status === RideStatus.OFFERED && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm pb-8 px-4">
              <div className="bg-gray-900 w-full max-w-md rounded-3xl p-6 border border-gray-700 shadow-2xl animate-slide-up">
                  <div className="text-center mb-6">
                      <h2 className="text-3xl font-black text-green-400 mb-1">${activeRide.price.toFixed(2)}</h2>
                      <p className="text-gray-400 text-sm">Estimated Earnings</p>
                  </div>

                  <div className="space-y-6 mb-8">
                      <div className="flex items-center">
                          <div className="w-10 flex flex-col items-center mr-4">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="h-8 w-0.5 bg-gray-700 my-1"></div>
                              <div className="text-xs text-gray-500">4m</div>
                          </div>
                          <div>
                              <p className="text-gray-400 text-xs uppercase">Pickup</p>
                              <p className="font-bold text-lg">{activeRide.pickup}</p>
                          </div>
                      </div>
                      <div className="flex items-center">
                           <div className="w-10 flex flex-col items-center mr-4">
                               <div className="w-3 h-3 bg-white rounded-sm"></div>
                               <div className="h-8 w-0.5 bg-transparent my-1"></div>
                               <div className="text-xs text-gray-500">15m</div>
                           </div>
                           <div>
                              <p className="text-gray-400 text-xs uppercase">Dropoff</p>
                              <p className="font-bold text-lg">{activeRide.destination}</p>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <button onClick={rejectRide} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors">
                          Reject
                      </button>
                      <button onClick={acceptRide} className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-colors">
                          Accept Ride
                      </button>
                  </div>
                  <div className="mt-4">
                     <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 w-3/4 animate-[width_10s_linear]"></div>
                     </div>
                  </div>
              </div>
          </div>
      )}

      {/* ACTIVE RIDE PANEL */}
      {activeRide && activeRide.status !== RideStatus.OFFERED && activeRide.status !== RideStatus.COMPLETED && (
         <div className="absolute bottom-0 left-0 right-0 bg-white text-black rounded-t-3xl p-6 shadow-2xl z-30">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold">
                     {activeRide.status === RideStatus.ARRIVING ? 'Picking up Rider' : 'Dropping off Rider'}
                 </h2>
                 <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">{activeRide.eta}</span>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between mb-6 border border-gray-100">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl mr-3">
                        {MOCK_RIDER.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-lg">{MOCK_RIDER.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <Star size={12} className="fill-black text-black mr-1"/> 4.9
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"><MessageSquare size={20}/></button>
                    <button className="p-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"><Phone size={20}/></button>
                </div>
             </div>

             <div className="mb-6">
                 {activeRide.status === RideStatus.ARRIVING ? (
                     <button 
                        onClick={startTrip}
                        className="w-full bg-green-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-green-400 shadow-lg"
                     >
                        Slide to Start Trip
                     </button>
                 ) : (
                      <button 
                        onClick={completeRide}
                        className="w-full bg-red-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-600 shadow-lg"
                     >
                        Slide to Complete Trip
                     </button>
                 )}
             </div>
             
             <div className="flex justify-between text-sm font-medium text-gray-500">
                 <button onClick={() => {}} className="flex items-center"><Navigation size={16} className="mr-1"/> Waze</button>
                 <button onClick={() => {}} className="flex items-center"><Navigation size={16} className="mr-1"/> Google Maps</button>
                 <button onClick={() => {}} className="text-red-500">Report Problem</button>
             </div>
         </div>
      )}
    </div>
  );
};

export default DriverDashboard;