import React, { useState, useEffect } from 'react';
import { MapPin, Search, Clock, Star, Phone, MessageSquare, Shield, CreditCard, Settings, Menu, LogOut, History, Wallet, User as UserIcon, X, Plus } from 'lucide-react';
import { useBackend } from '../../context/MockBackendContext';
import { VEHICLE_OPTIONS, MOCK_DRIVER } from '../../constants';
import { RideStatus } from '../../types';
import MapPlaceholder from '../../components/ui/MapPlaceholder';
import { getTripInsight } from '../../services/geminiService';
import { useNavigate } from 'react-router-dom';

const RiderHome: React.FC = () => {
  const { user, activeRide, requestRide, cancelRide, logout, addFunds } = useBackend();
  const navigate = useNavigate();
  
  // UI State
  const [view, setView] = useState<'MAP' | 'MENU' | 'WALLET' | 'HISTORY'>('MAP');
  const [pickup, setPickup] = useState("Current Location");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_OPTIONS[1]);
  const [insight, setInsight] = useState<string>("");
  const [showRating, setShowRating] = useState(false);

  // Fetch AI insight
  useEffect(() => {
    if (destination.length > 4) {
      getTripInsight(destination).then(setInsight);
    } else {
      setInsight("");
    }
  }, [destination]);

  // Watch for ride completion
  useEffect(() => {
    if (activeRide?.status === RideStatus.COMPLETED) {
        setShowRating(true);
    }
  }, [activeRide?.status]);

  const handleBook = () => {
    if (!destination) return;
    if (user && user.balance < selectedVehicle.base * 1.5) {
        alert("Insufficient funds! Please top up your wallet.");
        setView('WALLET');
        return;
    }
    requestRide(pickup, destination, selectedVehicle.id, selectedVehicle.base * 1.5);
  };

  const handleRate = () => {
    cancelRide(); 
    setShowRating(false);
    setDestination("");
  };

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  // --- SIDEBAR MENU ---
  const Sidebar = () => (
    <div className="fixed inset-0 z-50 flex">
        <div className="w-80 bg-white shadow-2xl h-full flex flex-col animate-slide-in-left relative z-50">
            <div className="p-6 bg-black text-white">
                <div className="flex items-center mb-6">
                    <img src={user?.avatarUrl} className="w-16 h-16 rounded-full border-2 border-white mr-4 object-cover"/>
                    <div>
                        <h3 className="font-bold text-lg">{user?.name}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                            <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" /> {user?.rating} • Rider
                        </div>
                    </div>
                </div>
                <div className="flex justify-between text-sm bg-gray-800 p-3 rounded-lg">
                    <span>Balance</span>
                    <span className="font-bold text-green-400">${user?.balance.toFixed(2)}</span>
                </div>
            </div>
            
            <nav className="flex-grow p-4 space-y-2">
                <button onClick={() => setView('MAP')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'MAP' ? 'bg-gray-100 translate-x-2' : 'hover:bg-gray-50 hover:translate-x-1'}`}>
                    <MapPin size={20} className="mr-3" /> Map
                </button>
                <button onClick={() => setView('WALLET')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'WALLET' ? 'bg-gray-100 translate-x-2' : 'hover:bg-gray-50 hover:translate-x-1'}`}>
                    <Wallet size={20} className="mr-3" /> Wallet
                </button>
                 <button onClick={() => setView('HISTORY')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'HISTORY' ? 'bg-gray-100 translate-x-2' : 'hover:bg-gray-50 hover:translate-x-1'}`}>
                    <History size={20} className="mr-3" /> Your Trips
                </button>
                <button className="w-full flex items-center p-4 rounded-xl font-medium hover:bg-gray-50 hover:translate-x-1 transition-all">
                    <Settings size={20} className="mr-3" /> Settings
                </button>
                <button className="w-full flex items-center p-4 rounded-xl font-medium hover:bg-gray-50 hover:translate-x-1 transition-all">
                    <Shield size={20} className="mr-3" /> Support
                </button>
            </nav>

            <div className="p-4 border-t">
                <button onClick={handleLogout} className="w-full flex items-center p-4 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut size={20} className="mr-3" /> Log Out
                </button>
            </div>
        </div>
        <div className="flex-grow bg-black/20 backdrop-blur-sm animate-fade-in" onClick={() => setView('MAP')}></div>
    </div>
  );

  // --- WALLET VIEW ---
  if (view === 'WALLET') {
      return (
          <div className="h-screen bg-gray-50 flex flex-col animate-fade-in">
             <div className="bg-white p-6 shadow-sm flex items-center sticky top-0 z-10">
                 <button onClick={() => setView('MAP')} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
                 <h1 className="text-xl font-bold">Wallet</h1>
             </div>
             <div className="p-6 flex-grow overflow-y-auto">
                 <div className="bg-black text-white rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden transform transition-transform hover:scale-[1.02]">
                     <div className="relative z-10">
                         <p className="text-gray-400 mb-2">Total Balance</p>
                         <h2 className="text-4xl font-bold mb-6">${user?.balance.toFixed(2)}</h2>
                         <button onClick={() => addFunds(50)} className="bg-green-500 text-black px-6 py-3 rounded-full font-bold flex items-center hover:bg-green-400 hover:shadow-lg transition-all">
                             <Plus size={20} className="mr-2" /> Top Up $50
                         </button>
                     </div>
                     <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-gray-800 rounded-full opacity-50 blur-3xl animate-pulse"></div>
                 </div>
                 
                 <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
                 <div className="space-y-4">
                     {user?.transactions?.map((tx, idx) => (
                         <div key={tx.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                             <div className="flex items-center">
                                 <div className={`p-3 rounded-full mr-4 ${tx.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                     {tx.type === 'CREDIT' ? <Wallet size={20} /> : <Clock size={20} />}
                                 </div>
                                 <div>
                                     <p className="font-bold">{tx.description}</p>
                                     <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                                 </div>
                             </div>
                             <span className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-black'}`}>
                                 {tx.type === 'CREDIT' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                             </span>
                         </div>
                     ))}
                     {(!user?.transactions || user.transactions.length === 0) && (
                         <p className="text-gray-400 text-center py-8">No transactions yet.</p>
                     )}
                 </div>
             </div>
          </div>
      );
  }

  // --- HISTORY VIEW ---
  if (view === 'HISTORY') {
    return (
        <div className="h-screen bg-gray-50 flex flex-col animate-fade-in">
           <div className="bg-white p-6 shadow-sm flex items-center sticky top-0 z-10">
               <button onClick={() => setView('MAP')} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
               <h1 className="text-xl font-bold">Your Trips</h1>
           </div>
           <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                {user?.history?.map((trip, idx) => (
                    <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{trip.date}</span>
                            <span className="font-bold">${trip.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <div className="flex flex-col items-center mr-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="w-0.5 h-4 bg-gray-200 my-1"></div>
                                <div className="w-2 h-2 bg-black rounded-sm"></div>
                            </div>
                            <div className="text-sm">
                                <p className="truncate w-64">{trip.pickup}</p>
                                <p className="truncate w-64 mt-2">{trip.destination}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t text-sm text-gray-500">
                            <span>Standard Ride</span>
                            <button className="text-blue-600 font-medium hover:underline">Report Issue</button>
                        </div>
                    </div>
                ))}
                 {(!user?.history || user.history.length === 0) && (
                         <p className="text-gray-400 text-center py-8">No rides taken yet.</p>
                 )}
           </div>
        </div>
    );
  }

  // --- MAP / BOOKING VIEW ---
  return (
    <div className="h-screen relative bg-gray-100 overflow-hidden">
        {view === 'MENU' && <Sidebar />}
        
        {/* Top Bar */}
        <div className="absolute top-4 left-4 z-30">
            <button onClick={() => setView('MENU')} className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110 active:scale-95">
                <Menu size={24} />
            </button>
        </div>

        {/* Map Background */}
        <div className="absolute inset-0 z-0">
            <MapPlaceholder 
                status={activeRide?.status || RideStatus.IDLE} 
                pickup={activeRide?.pickup}
                destination={activeRide?.destination || destination}
                className="w-full h-full"
            />
        </div>

        {/* Booking Panel / Active Ride Status */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] max-h-[85vh] overflow-y-auto animate-slide-up">
            
            {/* STATE 1: NO ACTIVE RIDE */}
            {!activeRide && !showRating && (
                <div className="p-6">
                    {/* Input Fields */}
                    {!destination ? (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-6">Where to, {user?.name}?</h2>
                            <div className="bg-gray-100 p-4 rounded-xl flex items-center mb-4 hover:bg-gray-200 transition-colors cursor-pointer focus-within:bg-white focus-within:ring-2 focus-within:ring-black">
                                <Search className="mr-3 text-black" />
                                <input 
                                    type="text" 
                                    placeholder="Enter destination" 
                                    className="bg-transparent w-full outline-none text-lg font-medium placeholder-gray-500"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                <button className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">Home</button>
                                <button className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">Work</button>
                                <button className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">Gym</button>
                            </div>
                        </div>
                    ) : (
                        /* Vehicle Selection */
                        <div className="animate-fade-in">
                            <div className="flex items-center mb-4">
                                <button onClick={() => setDestination("")} className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                                <h3 className="font-bold text-lg">Choose a ride</h3>
                            </div>
                            
                            {/* Trip Info Summary */}
                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-4 text-blue-900 text-sm animate-scale-up">
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2" />
                                    <span>Pickup in 3 min</span>
                                </div>
                                {insight && <span className="text-xs italic opacity-80 border-l border-blue-200 pl-2 ml-2">{insight}</span>}
                            </div>

                            <div className="space-y-2 mb-6">
                                {VEHICLE_OPTIONS.map(v => (
                                    <div 
                                        key={v.id}
                                        onClick={() => setSelectedVehicle(v)}
                                        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.01] ${selectedVehicle.id === v.id ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center">
                                            <img src={v.image} alt={v.name} className="w-14 h-14 object-contain mr-4" />
                                            <div>
                                                <p className="font-bold text-gray-900">{v.name}</p>
                                                <p className="text-xs text-gray-500">3 mins away • 4 seats</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-lg">${(v.base * 1.5).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-4 px-1">
                                <div className="flex items-center text-sm font-bold">
                                    <div className="bg-green-100 p-1.5 rounded mr-2"><CreditCard size={16} className="text-green-600"/></div>
                                    Cash
                                </div>
                                <span className="text-blue-600 font-bold text-sm cursor-pointer hover:underline">Switch</span>
                            </div>

                            <button onClick={handleBook} className="w-full bg-green-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-green-400 shadow-lg hover:shadow-green-200 transition-all transform active:scale-95">
                                Select {selectedVehicle.name}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* STATE 2: ACTIVE RIDE */}
            {activeRide && (
                <div className="p-6 animate-slide-up">
                    {activeRide.status === RideStatus.SEARCHING ? (
                        <div className="text-center py-8">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-xl font-bold mb-2">Connecting to drivers...</h2>
                            <p className="text-gray-500 mb-6">Finding the best ride for you.</p>
                            <button onClick={cancelRide} className="bg-gray-100 text-red-500 font-bold py-3 px-8 rounded-full hover:bg-red-50 transition-colors">Cancel Request</button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6 border-b pb-6 animate-fade-in">
                                <div className="flex items-center">
                                     <img src={MOCK_DRIVER.avatarUrl} className="w-16 h-16 rounded-full border-4 border-gray-100 shadow-md mr-4 object-cover" />
                                     <div>
                                         <h3 className="font-bold text-xl">{MOCK_DRIVER.name}</h3>
                                         <div className="flex items-center text-gray-500 text-sm mt-1">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-black font-mono font-bold mr-2">{MOCK_DRIVER.vehiclePlate}</span>
                                            {MOCK_DRIVER.vehicleModel}
                                         </div>
                                         <div className="flex items-center mt-1 text-yellow-500 text-xs font-bold">
                                             <Star size={12} className="fill-current mr-1" /> {MOCK_DRIVER.rating}
                                         </div>
                                     </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black hover:bg-gray-200 hover:scale-110 transition-all"><Phone size={20}/></button>
                                     <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black hover:bg-gray-200 hover:scale-110 transition-all"><MessageSquare size={20}/></button>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mb-6 animate-fade-in delay-100">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">Status</p>
                                    <p className="text-2xl font-bold text-green-600 animate-pulse">{activeRide.status.replace('_', ' ')}</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">ETA</p>
                                     <p className="text-2xl font-bold">{activeRide.eta}</p>
                                </div>
                            </div>

                            {activeRide.status !== RideStatus.COMPLETED && (
                                <div className="flex gap-3 animate-fade-in delay-200">
                                    <button className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center">
                                        <Shield size={16} className="mr-2"/> Safety
                                    </button>
                                    <button onClick={cancelRide} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
                                        Cancel Ride
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>

        {/* Rating Modal */}
        {showRating && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl animate-scale-up">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Rate your trip</h2>
                    <p className="text-gray-500 mb-6">How was your ride with {MOCK_DRIVER.name}?</p>
                    
                    <div className="flex justify-center space-x-2 mb-8">
                        {[1,2,3,4,5].map(star => (
                            <Star key={star} size={36} className="text-gray-200 hover:text-yellow-400 hover:fill-yellow-400 cursor-pointer transition-all transform hover:scale-125" />
                        ))}
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-xl">${(activeRide?.price || 0).toFixed(2)}</span>
                    </div>

                    <button onClick={handleRate} className="w-full bg-green-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-green-400 shadow-lg transform active:scale-95 transition-all">Submit</button>
                </div>
            </div>
        )}
    </div>
  );
};

// Helper icon import
import { CheckCircle } from 'lucide-react';

export default RiderHome;