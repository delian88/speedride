
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, DollarSign, User, CheckCircle, XCircle, Menu, Star, MessageSquare, Phone, X, Settings, Power, History, Wallet, Shield, LogOut, Bell, ChevronRight, Clock, CreditCard, Car, Building, Loader } from 'lucide-react';
import { useBackend } from '../../context/MockBackendContext';
import { RideStatus, Ride, UserRole } from '../../types';
import MapPlaceholder from '../../components/ui/MapPlaceholder';
import ChatInterface from '../../components/ui/ChatInterface';
import { MOCK_RIDER } from '../../constants';
import { useNavigate } from 'react-router-dom';

const DriverDashboard: React.FC = () => {
  const { user, activeRide, toggleOnline, acceptRide, rejectRide, startTrip, completeRide, logout, sendMessage } = useBackend();
  const navigate = useNavigate();
  
  // View State
  const [view, setView] = useState<'MAP' | 'MENU' | 'WALLET' | 'HISTORY' | 'SETTINGS'>('MAP');
  const [showEarnings, setShowEarnings] = useState(false);
  const [showCashOut, setShowCashOut] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Cash Out State
  const [cashOutAmount, setCashOutAmount] = useState('');
  const [cashOutMethod, setCashOutMethod] = useState<'BANK' | 'CARD'>('BANK');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const driver = user as any; // Type casting for convenience

  useEffect(() => {
      if (!activeRide) {
          setIsChatOpen(false);
      }
  }, [activeRide]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleCashOut = () => {
      if(!cashOutAmount) return;
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setShowCashOut(false);
          setCashOutAmount('');
          alert(`Successfully withdrew ₦${cashOutAmount} to your account.`);
      }, 2000);
  }

  // --- SIDEBAR COMPONENT ---
  const Sidebar = () => (
    <div className="fixed inset-0 z-50 flex">
        <div className="w-80 bg-slate-900 text-white shadow-2xl h-full flex flex-col animate-slide-in-left relative z-50 border-r border-gray-800">
            <div className="p-6 bg-black relative overflow-hidden">
                <div className="relative z-10 flex items-center mb-6">
                    <img src={driver?.avatarUrl} className="w-16 h-16 rounded-full border-2 border-green-500 mr-4 object-cover p-0.5"/>
                    <div>
                        <h3 className="font-bold text-lg text-white">{driver?.name}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                            <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" /> {driver?.rating} • {driver?.vehiclePlate}
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex justify-between text-sm bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                    <span className="text-gray-400">Balance</span>
                    <span className="font-bold text-green-400">₦{driver?.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                {/* Decorative bg */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
            
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                <button onClick={() => setView('MAP')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'MAP' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800 hover:translate-x-1 text-gray-300 hover:text-white'}`}>
                    <MapPin size={20} className="mr-3" /> Dashboard
                </button>
                <button onClick={() => setView('WALLET')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'WALLET' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800 hover:translate-x-1 text-gray-300 hover:text-white'}`}>
                    <Wallet size={20} className="mr-3" /> Earnings & Wallet
                </button>
                 <button onClick={() => setView('HISTORY')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'HISTORY' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800 hover:translate-x-1 text-gray-300 hover:text-white'}`}>
                    <History size={20} className="mr-3" /> Trip History
                </button>
                <button onClick={() => setView('SETTINGS')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'SETTINGS' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800 hover:translate-x-1 text-gray-300 hover:text-white'}`}>
                    <Settings size={20} className="mr-3" /> Preferences
                </button>
                <div className="pt-4 mt-4 border-t border-gray-800">
                    <button className="w-full flex items-center p-4 rounded-xl font-medium hover:bg-gray-800 hover:translate-x-1 text-gray-300 hover:text-white transition-all">
                        <Bell size={20} className="mr-3" /> Notifications <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>
                    </button>
                    <button className="w-full flex items-center p-4 rounded-xl font-medium hover:bg-gray-800 hover:translate-x-1 text-gray-300 hover:text-white transition-all">
                        <Shield size={20} className="mr-3" /> Support Center
                    </button>
                </div>
            </nav>

            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <button onClick={handleLogout} className="w-full flex items-center p-4 text-red-400 font-bold hover:bg-red-900/20 rounded-xl transition-colors">
                    <LogOut size={20} className="mr-3" /> Log Out
                </button>
            </div>
        </div>
        <div className="flex-grow bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setView('MAP')}></div>
    </div>
  );

  // --- CASH OUT MODAL ---
  const CashOutModal = () => (
      <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scale-up">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
                  <button onClick={() => setShowCashOut(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
               </div>
               
               <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-gray-200">
                   <span className="text-gray-500 font-medium">Available</span>
                   <span className="text-xl font-bold text-gray-900">₦{driver?.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
               </div>

               {/* Tabs */}
               <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                  <button 
                    onClick={() => setCashOutMethod('BANK')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${cashOutMethod === 'BANK' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                  >
                      <Building size={16} className="mr-2"/> Bank Transfer
                  </button>
                  <button 
                    onClick={() => setCashOutMethod('CARD')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${cashOutMethod === 'CARD' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                  >
                      <CreditCard size={16} className="mr-2"/> Card
                  </button>
              </div>

               {cashOutMethod === 'BANK' ? (
                   <div className="space-y-4 mb-6 animate-fade-in">
                       <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                           <input 
                                type="number" 
                                value={cashOutAmount}
                                onChange={(e) => setCashOutAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-8 p-4 bg-gray-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-black"
                           />
                       </div>
                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                           <p className="text-xs font-bold text-gray-500 uppercase mb-2">Destination Account</p>
                           <div className="flex items-center justify-between">
                               <div>
                                   <p className="font-bold text-gray-900">GTBank •••• 4592</p>
                                   <p className="text-xs text-gray-500">John Doe</p>
                               </div>
                               <button className="text-blue-600 text-xs font-bold">Change</button>
                           </div>
                       </div>
                   </div>
               ) : (
                    <div className="space-y-4 mb-6 animate-fade-in">
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                           <input 
                                type="number" 
                                value={cashOutAmount}
                                onChange={(e) => setCashOutAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-8 p-4 bg-gray-50 border rounded-xl font-bold outline-none focus:ring-2 focus:ring-black"
                           />
                       </div>
                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                           <p className="text-xs font-bold text-gray-500 uppercase mb-2">Instant Payout Card</p>
                           <div className="flex items-center justify-between">
                               <div>
                                   <p className="font-bold text-gray-900">Visa •••• 4242</p>
                                   <p className="text-xs text-gray-500">Expires 12/25</p>
                               </div>
                               <button className="text-blue-600 text-xs font-bold">Change</button>
                           </div>
                       </div>
                    </div>
               )}

               <button 
                    onClick={handleCashOut}
                    disabled={!cashOutAmount || isProcessing}
                    className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 flex items-center justify-center"
               >
                   {isProcessing ? <Loader className="animate-spin"/> : 'Confirm Withdrawal'}
               </button>
          </div>
      </div>
  );

  // --- WALLET VIEW ---
  const WalletView = () => (
      <div className="h-screen flex flex-col bg-slate-50 animate-fade-in z-40 absolute inset-0">
          <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b">
               <div className="flex items-center">
                   <button onClick={() => setView('MAP')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"><ChevronRight className="rotate-180" size={24}/></button>
                   <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
               </div>
               <button className="text-blue-600 font-bold text-sm">Help</button>
          </div>

          <div className="p-6 overflow-y-auto pb-24">
               {/* Main Balance Card */}
               <div className="bg-black text-white rounded-3xl p-8 mb-6 relative overflow-hidden shadow-xl">
                   <div className="relative z-10">
                       <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Available Balance</p>
                       <h2 className="text-5xl font-bold mb-8">₦{driver?.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                       <div className="flex gap-4">
                           <button onClick={() => setShowCashOut(true)} className="flex-1 bg-green-500 text-black py-3 rounded-xl font-bold hover:bg-green-400 transition-colors shadow-lg shadow-green-900/20">Cash Out</button>
                           <button className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">Details</button>
                       </div>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full opacity-30 blur-3xl -mr-16 -mt-16"></div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                       <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-3">
                           <DollarSign size={20}/>
                       </div>
                       <p className="text-gray-500 text-xs font-bold uppercase">Today</p>
                       <p className="text-2xl font-bold text-gray-900">₦{driver?.todayEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                   </div>
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                       <div className="bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 mb-3">
                           <Navigation size={20}/>
                       </div>
                       <p className="text-gray-500 text-xs font-bold uppercase">Trips</p>
                       <p className="text-2xl font-bold text-gray-900">{driver?.tripsCount}</p>
                   </div>
               </div>

               {/* Recent Transactions */}
               <h3 className="font-bold text-gray-900 mb-4 flex items-center">Recent Activity</h3>
               <div className="space-y-3">
                   {driver?.history?.slice(0, 5).map((trip: any, i: number) => (
                       <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                           <div className="flex items-center">
                               <div className="bg-gray-100 p-2.5 rounded-full mr-3 text-gray-600">
                                   <Car size={20} />
                               </div>
                               <div>
                                   <p className="font-bold text-gray-900 text-sm">Trip Payment</p>
                                   <p className="text-xs text-gray-500">{trip.date} • {trip.id.split('-')[1]}</p>
                               </div>
                           </div>
                           <span className="font-bold text-green-600">+₦{trip.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                       </div>
                   ))}
                   {(!driver?.history || driver.history.length === 0) && (
                       <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                           No trips yet. Go online to start earning!
                       </div>
                   )}
               </div>
          </div>
      </div>
  );

  // --- HISTORY VIEW ---
  const HistoryView = () => (
    <div className="h-screen flex flex-col bg-gray-50 animate-fade-in z-40 absolute inset-0">
         <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b">
             <div className="flex items-center">
                 <button onClick={() => setView('MAP')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"><ChevronRight className="rotate-180" size={24}/></button>
                 <h1 className="text-xl font-bold text-gray-900">Trip History</h1>
             </div>
        </div>
        <div className="p-4 overflow-y-auto pb-24 space-y-4">
             {driver?.history?.map((trip: any, i: number) => (
                 <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-fade-in-up" style={{animationDelay: `${i * 50}ms`}}>
                      <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                          <div>
                              <span className="text-xs font-bold text-gray-400 uppercase">{trip.date}</span>
                              <h3 className="font-bold text-lg mt-1">₦{trip.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                          </div>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Completed</span>
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-start">
                              <div className="mt-1 min-w-[20px] flex flex-col items-center mr-3">
                                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                  <div className="w-0.5 h-6 bg-gray-200 my-1"></div>
                                  <div className="w-2.5 h-2.5 bg-black rounded-sm"></div>
                              </div>
                              <div className="text-sm">
                                  <p className="font-medium text-gray-900 mb-3">Pickup Location</p>
                                  <p className="font-medium text-gray-900">Destination</p>
                              </div>
                          </div>
                      </div>
                      <button className="w-full mt-4 py-2 text-sm font-bold text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">View Receipt</button>
                 </div>
             ))}
             {(!driver?.history || driver.history.length === 0) && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Clock size={48} className="mb-4 opacity-20"/>
                    <p>No trip history available.</p>
                </div>
             )}
        </div>
    </div>
  );

  // --- SETTINGS VIEW ---
  const SettingsView = () => (
    <div className="h-screen flex flex-col bg-gray-50 animate-fade-in z-40 absolute inset-0">
         <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10 border-b">
             <button onClick={() => setView('MAP')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"><ChevronRight className="rotate-180" size={24}/></button>
             <h1 className="text-xl font-bold text-gray-900">Preferences</h1>
        </div>
        <div className="p-6 overflow-y-auto pb-24">
             <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Vehicle & Account</h3>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                 <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                     <div className="flex items-center">
                         <Car size={20} className="text-gray-400 mr-3"/>
                         <span className="font-medium">Vehicle Type</span>
                     </div>
                     <span className="text-gray-500 text-sm">{driver?.vehicleType}</span>
                 </div>
                 <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                     <div className="flex items-center">
                         <CreditCard size={20} className="text-gray-400 mr-3"/>
                         <span className="font-medium">Payout Method</span>
                     </div>
                     <span className="text-gray-500 text-sm">Bank ****4592</span>
                 </div>
                  <div className="p-4 flex justify-between items-center">
                     <div className="flex items-center">
                         <Shield size={20} className="text-gray-400 mr-3"/>
                         <span className="font-medium">Documents</span>
                     </div>
                     <span className="text-green-600 text-sm font-bold flex items-center"><CheckCircle size={14} className="mr-1"/> Verified</span>
                 </div>
             </div>

             <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">App Settings</h3>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                     <span className="font-medium">Auto-Accept Rides</span>
                     <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                     </div>
                 </div>
                 <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                     <span className="font-medium">Navigation App</span>
                     <span className="text-blue-600 text-sm font-bold cursor-pointer">Google Maps</span>
                 </div>
                 <div className="p-4 flex justify-between items-center">
                     <span className="font-medium">Dark Mode</span>
                     <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                     </div>
                 </div>
             </div>
        </div>
    </div>
  );
  
  // --- EARNINGS MODAL ---
  const EarningsModal = () => (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-gray-900 text-white w-full max-w-md rounded-3xl p-6 border border-gray-800 animate-scale-up shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Earnings</h2>
                  <button onClick={() => setShowEarnings(false)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="text-center mb-8">
                  <p className="text-gray-400 uppercase text-sm font-bold tracking-wide mb-2">Total Balance</p>
                  <h1 className="text-5xl font-bold text-green-400 animate-pulse-glow inline-block px-4 py-2 rounded-xl">₦{driver?.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-gray-800 p-4 rounded-xl transform hover:scale-105 transition-transform">
                       <p className="text-gray-400 text-xs mb-1">Today</p>
                       <p className="text-xl font-bold">₦{driver?.todayEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                   </div>
                   <div className="bg-gray-800 p-4 rounded-xl transform hover:scale-105 transition-transform">
                       <p className="text-gray-400 text-xs mb-1">Trips</p>
                       <p className="text-xl font-bold">{driver?.tripsCount}</p>
                   </div>
              </div>
              
              <button onClick={() => setShowCashOut(true)} className="w-full bg-green-500 text-black font-bold py-4 rounded-xl mb-4 hover:bg-green-400 transition-colors hover:shadow-lg hover:shadow-green-900/50">Cash Out</button>
              <p className="text-center text-xs text-gray-500">Automatic payout scheduled for Monday.</p>
          </div>
      </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white relative overflow-hidden font-sans">
      {view === 'MENU' && <Sidebar />}
      {view === 'WALLET' && <WalletView />}
      {view === 'HISTORY' && <HistoryView />}
      {view === 'SETTINGS' && <SettingsView />}
      {showEarnings && <EarningsModal />}
      {showCashOut && <CashOutModal />}

      {/* Chat Overlay */}
      {isChatOpen && activeRide && (
            <ChatInterface 
                messages={activeRide.chatHistory}
                currentUserRole={UserRole.DRIVER}
                otherUserName={MOCK_RIDER.name}
                otherUserAvatar={MOCK_RIDER.avatarUrl}
                onSend={sendMessage}
                onClose={() => setIsChatOpen(false)}
            />
      )}
      
      {/* Top Bar - always visible on map, hidden on sub-views */}
      <header className={`absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-center transition-transform duration-300 ${view !== 'MAP' ? '-translate-y-full' : 'translate-y-0'}`}>
         <button onClick={() => setView('MENU')} className="bg-white p-3 rounded-full text-black shadow-lg hover:bg-gray-100 transition-all hover:scale-110 active:scale-95">
             <Menu size={24} />
         </button>
         
         {/* Status Pill */}
         <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-md border border-white/10 transition-colors ${driver?.isOnline ? 'bg-green-500/90 text-black' : 'bg-red-500/90 text-white'}`}>
             {driver?.isOnline ? 'ONLINE' : 'OFFLINE'}
         </div>
         
         <div className="flex gap-3 pointer-events-auto">
             <button onClick={() => setView('WALLET')} className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-black/60 transition-all hover:scale-110 border border-white/10">
                 <DollarSign size={20} className="text-green-400"/>
             </button>
         </div>
      </header>

      {/* Main Map Area */}
      <div className="flex-grow relative z-0">
        <MapPlaceholder 
            status={activeRide?.status || RideStatus.IDLE} 
            showDriver={true}
            pickup={activeRide?.pickup}
            destination={activeRide?.destination}
            className="w-full h-full rounded-none border-none bg-gray-800 opacity-100"
        />
        
        {/* Online/Offline Toggle Overlay (Bottom) */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-500 ${activeRide || view !== 'MAP' ? 'translate-y-40 opacity-0' : 'translate-y-0 opacity-100'}`}>
             <button 
                onClick={toggleOnline}
                className={`w-20 h-20 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)] border-4 border-white/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center ${driver?.isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
             >
                <Power size={32} className="text-white" />
             </button>
             <p className="text-center mt-4 font-bold text-sm bg-black/50 backdrop-blur px-3 py-1 rounded-full">{driver?.isOnline ? 'TAP TO STOP' : 'TAP TO START'}</p>
        </div>
      </div>

      {/* REQUEST POPUP (Only when OFFERED) - High Z-index to show over map */}
      {activeRide && activeRide.status === RideStatus.OFFERED && (
          <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm pb-8 px-4 animate-fade-in">
              <div className="bg-gray-900 w-full max-w-md rounded-3xl p-6 border border-gray-700 shadow-2xl animate-scale-up">
                  <div className="text-center mb-6">
                      <h2 className="text-4xl font-black text-green-400 mb-1 animate-pulse">₦{activeRide.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                      <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Estimated Earnings</p>
                  </div>

                  <div className="space-y-6 mb-8 bg-gray-800/50 p-4 rounded-2xl">
                      <div className="flex items-center">
                          <div className="w-10 flex flex-col items-center mr-4">
                              <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                              <div className="h-8 w-0.5 bg-gray-700 my-1"></div>
                              <div className="text-xs text-gray-500">4m</div>
                          </div>
                          <div>
                              <p className="text-gray-400 text-xs uppercase font-bold">Pickup</p>
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
                              <p className="text-gray-400 text-xs uppercase font-bold">Dropoff</p>
                              <p className="font-bold text-lg">{activeRide.destination}</p>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <button onClick={rejectRide} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors">
                          Reject
                      </button>
                      <button onClick={acceptRide} className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                          Accept Ride
                      </button>
                  </div>
                  <div className="mt-4">
                     <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 animate-width" style={{width: '100%'}}></div>
                     </div>
                  </div>
              </div>
          </div>
      )}

      {/* ACTIVE RIDE PANEL - Shows when ride is in progress */}
      {activeRide && activeRide.status !== RideStatus.OFFERED && activeRide.status !== RideStatus.COMPLETED && view === 'MAP' && (
         <div className={`absolute bottom-0 left-0 right-0 bg-white text-black rounded-t-3xl p-6 shadow-2xl z-30 animate-slide-up ${isChatOpen ? 'hidden' : ''}`}>
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold">
                     {activeRide.status === RideStatus.ARRIVING ? 'Picking up Rider' : 'Dropping off Rider'}
                 </h2>
                 <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">{activeRide.eta}</span>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between mb-6 border border-gray-100 shadow-sm">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl mr-3 border border-gray-300">
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
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors transform hover:scale-110 relative"
                    >
                        <MessageSquare size={20}/>
                        {activeRide.chatHistory.length > 0 && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>
                    <button className="p-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors transform hover:scale-110"><Phone size={20}/></button>
                </div>
             </div>

             <div className="mb-6">
                 {activeRide.status === RideStatus.ARRIVING ? (
                     <button 
                        onClick={startTrip}
                        className="w-full bg-green-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-green-400 shadow-lg hover:shadow-green-200 transition-all transform active:scale-95"
                     >
                        Slide to Start Trip
                     </button>
                 ) : (
                      <button 
                        onClick={completeRide}
                        className="w-full bg-red-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-600 shadow-lg hover:shadow-red-200 transition-all transform active:scale-95"
                     >
                        Slide to Complete Trip
                     </button>
                 )}
             </div>
             
             <div className="flex justify-between text-sm font-medium text-gray-500">
                 <button onClick={() => {}} className="flex items-center hover:text-blue-600 transition-colors"><Navigation size={16} className="mr-1"/> Waze</button>
                 <button onClick={() => {}} className="flex items-center hover:text-blue-600 transition-colors"><Navigation size={16} className="mr-1"/> Google Maps</button>
                 <button onClick={() => {}} className="text-red-500 hover:text-red-700 transition-colors">Report Problem</button>
             </div>
         </div>
      )}
    </div>
  );
};

export default DriverDashboard;
