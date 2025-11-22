"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Clock, Star, Phone, MessageSquare, Shield, CreditCard, Settings, Menu, LogOut, History, Wallet, User as UserIcon, X, Plus, Building, Loader, Copy, Check, Bell, Moon, Globe, Heart, ChevronRight, MessageCircle, CheckCircle } from 'lucide-react';
import { useBackend } from '../../context/MockBackendContext';
import { VEHICLE_OPTIONS, MOCK_DRIVER } from '../../constants';
import { RideStatus, UserRole, ChatMessage } from '../../types';
import MapPlaceholder from '../../components/ui/MapPlaceholder';
import ChatInterface from '../../components/ui/ChatInterface';
import { getTripInsight, getSupportResponse } from '../../services/geminiService';
import { useRouter } from 'next/navigation';

const RiderPage: React.FC = () => {
  const { user, activeRide, requestRide, cancelRide, logout, addFunds, sendMessage } = useBackend();
  const router = useRouter();
  
  // UI State
  const [view, setView] = useState<'MAP' | 'MENU' | 'WALLET' | 'HISTORY' | 'SETTINGS' | 'SUPPORT'>('MAP');
  const [pickup, setPickup] = useState("Current Location");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_OPTIONS[1]);
  const [insight, setInsight] = useState<string>("");
  const [showRating, setShowRating] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Payment State
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpTab, setTopUpTab] = useState<'CARD' | 'BANK'>('CARD');
  const [topUpAmount, setTopUpAmount] = useState<string>('1000');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  // Support Chat State
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>([
      {
          id: 'welcome',
          senderRole: UserRole.ADMIN,
          text: "Hello! I'm the Speedride Support Bot. How can I help you today?",
          timestamp: Date.now(),
          isRead: true
      }
  ]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user || user.role !== UserRole.RIDER) {
        router.push('/auth/login');
    }
  }, [user, router]);

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
        setIsChatOpen(false);
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
      router.push('/');
  };

  const handleTopUp = () => {
      if (!topUpAmount) return;
      setIsProcessingPayment(true);
      
      setTimeout(() => {
          addFunds(parseFloat(topUpAmount));
          setIsProcessingPayment(false);
          setShowTopUp(false);
          setTopUpAmount('1000');
      }, 2000);
  }

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  }

  const handleSupportSend = async (text: string) => {
      const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderRole: UserRole.RIDER,
          text: text,
          timestamp: Date.now(),
          isRead: false
      };
      setSupportMessages(prev => [...prev, newMessage]);

      setTimeout(async () => {
          const responseText = await getSupportResponse(text, `User Name: ${user?.name}, Balance: ${user?.balance}, Current View: ${view}`);
          const botMessage: ChatMessage = {
              id: `msg-${Date.now() + 1}`,
              senderRole: UserRole.ADMIN,
              text: responseText,
              timestamp: Date.now(),
              isRead: false
          };
          setSupportMessages(prev => [...prev, botMessage]);
      }, 1000);
  };

  if (!user) return null;

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
                    <span className="font-bold text-green-400">₦{user?.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
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
                <button onClick={() => setView('SETTINGS')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'SETTINGS' ? 'bg-gray-100 translate-x-2' : 'hover:bg-gray-50 hover:translate-x-1'}`}>
                    <Settings size={20} className="mr-3" /> Settings
                </button>
                <button onClick={() => setView('SUPPORT')} className={`w-full flex items-center p-4 rounded-xl font-medium transition-all ${view === 'SUPPORT' ? 'bg-gray-100 translate-x-2' : 'hover:bg-gray-50 hover:translate-x-1'}`}>
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

  // --- SETTINGS VIEW ---
  const SettingsView = () => (
    <div className="h-screen bg-gray-50 flex flex-col animate-fade-in">
         <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10 border-b">
             <button onClick={() => setView('MAP')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"><ChevronRight className="rotate-180" size={24}/></button>
             <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center">
                 <img src={user?.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full mr-4 border border-gray-100"/>
                 <div className="flex-grow">
                     <h3 className="font-bold text-lg">{user?.name}</h3>
                     <p className="text-gray-500 text-sm">{user?.email}</p>
                     <p className="text-gray-500 text-sm">{user?.phone}</p>
                 </div>
                 <button className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">Edit</button>
             </div>

             <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Saved Places</h3>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                 <div className="p-4 border-b border-gray-50 flex items-center hover:bg-gray-50 cursor-pointer transition-colors">
                     <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-4"><Building size={18}/></div>
                     <div className="flex-grow">
                         <span className="font-bold block text-sm">Home</span>
                         <span className="text-gray-400 text-xs">Add home address</span>
                     </div>
                     <Plus size={18} className="text-gray-400"/>
                 </div>
                 <div className="p-4 flex items-center hover:bg-gray-50 cursor-pointer transition-colors">
                     <div className="bg-orange-100 text-orange-600 p-2 rounded-full mr-4"><Building size={18}/></div>
                     <div className="flex-grow">
                         <span className="font-bold block text-sm">Work</span>
                         <span className="text-gray-400 text-xs">Add work address</span>
                     </div>
                     <Plus size={18} className="text-gray-400"/>
                 </div>
             </div>
             <p className="text-center text-gray-400 text-xs mt-8">Speedride v2.0.1</p>
        </div>
    </div>
  );

  // --- SUPPORT VIEW ---
  const SupportView = () => (
      <div className="h-screen bg-gray-50 flex flex-col animate-fade-in">
         <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10 border-b">
             <button onClick={() => setView('MAP')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"><ChevronRight className="rotate-180" size={24}/></button>
             <h1 className="text-xl font-bold text-gray-900">Help Center</h1>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">How can we help?</h2>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center shadow-sm focus-within:ring-2 focus-within:ring-black transition-all">
                    <Search className="text-gray-400 mr-3" />
                    <input type="text" placeholder="Search help topics..." className="bg-transparent outline-none w-full" />
                </div>
            </div>

            {user?.history && user.history.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-900">Recent Trip</h3>
                        <span className="text-blue-600 text-xs font-bold cursor-pointer">View All</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-400 font-bold">{user.history[0].date}</span>
                            <span className="font-bold text-sm">₦{user.history[0].price.toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-medium truncate mb-4">{user.history[0].destination}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-gray-50 py-2 rounded-lg text-xs font-bold hover:bg-gray-100">Report Issue</button>
                            <button className="flex-1 bg-gray-50 py-2 rounded-lg text-xs font-bold hover:bg-gray-100">Lost Item</button>
                        </div>
                    </div>
                </div>
            )}

            <h3 className="font-bold text-gray-900 mb-4">Common Questions</h3>
            <div className="space-y-3 mb-8">
                {['Review my fares or fees', 'A guide to Speedride', 'Payment options', 'Account and data options'].map((topic, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors">
                        <span className="text-sm font-medium">{topic}</span>
                        <ChevronRight size={16} className="text-gray-400"/>
                    </div>
                ))}
            </div>

            <div className="bg-black text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Still need help?</h3>
                    <p className="text-gray-400 text-sm mb-6">Our AI support team is here to assist you 24/7.</p>
                    <button 
                        onClick={() => setIsSupportChatOpen(true)}
                        className="bg-green-500 text-black px-6 py-3 rounded-full font-bold flex items-center hover:bg-green-400 transition-colors"
                    >
                        <MessageCircle size={18} className="mr-2"/> Chat with Support
                    </button>
                </div>
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-gray-800 rounded-full blur-2xl opacity-50 translate-y-10 translate-x-10"></div>
            </div>
        </div>
      </div>
  );

  // --- TOP UP MODAL ---
  const TopUpModal = () => (
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scale-up">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Add Funds</h2>
                  <button onClick={() => setShowTopUp(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
              </div>

              <div className="mb-6">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Amount</label>
                  <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">₦</span>
                      <input 
                          type="number" 
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 pl-8 pr-4 text-2xl font-bold focus:outline-none focus:border-black transition-colors"
                      />
                  </div>
                  <div className="flex gap-2 mt-3">
                      {['500', '1000', '2000', '5000'].map(amt => (
                          <button 
                            key={amt}
                            onClick={() => setTopUpAmount(amt)}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${topUpAmount === amt ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                              ₦{amt}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                  <button 
                    onClick={() => setTopUpTab('CARD')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${topUpTab === 'CARD' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                  >
                      <CreditCard size={16} className="mr-2"/> Card
                  </button>
                  <button 
                    onClick={() => setTopUpTab('BANK')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${topUpTab === 'BANK' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                  >
                      <Building size={16} className="mr-2"/> Bank Transfer
                  </button>
              </div>

              {topUpTab === 'CARD' ? (
                  <div className="space-y-4 mb-6 animate-fade-in">
                      <div className="space-y-3">
                          <input type="text" placeholder="Card Number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-black" />
                          <div className="flex gap-3">
                              <input type="text" placeholder="MM/YY" className="w-1/2 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-black" />
                              <input type="text" placeholder="CVC" className="w-1/2 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-black" />
                          </div>
                      </div>
                      <button 
                        onClick={handleTopUp}
                        disabled={isProcessingPayment}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center"
                      >
                          {isProcessingPayment ? <Loader className="animate-spin mr-2" /> : 'Pay Securely'}
                      </button>
                  </div>
              ) : (
                  <div className="space-y-4 mb-6 animate-fade-in">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <p className="text-xs font-bold text-blue-600 uppercase mb-4">Bank Details</p>
                          <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                  <span className="text-gray-500 text-sm">Bank Name</span>
                                  <span className="font-bold text-sm">Zenith Bank</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <span className="text-gray-500 text-sm">Account Name</span>
                                  <span className="font-bold text-sm">Speedride Nigeria Ltd</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                                  <span className="text-gray-500 text-sm">Account Number</span>
                                  <div className="flex items-center">
                                      <span className="font-mono font-bold text-lg mr-2">1012345678</span>
                                      <button onClick={() => copyToClipboard('1012345678')} className="p-1 hover:bg-blue-200 rounded transition-colors">
                                          {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} className="text-blue-600"/>}
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="text-xs text-gray-400 text-center px-4">
                          Transfer the exact amount of <b>₦{parseInt(topUpAmount).toLocaleString()}</b>. Funds will be added automatically after verification.
                      </div>
                      <button 
                        onClick={handleTopUp}
                        disabled={isProcessingPayment}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-500 transition-colors flex items-center justify-center shadow-lg shadow-green-900/20"
                      >
                          {isProcessingPayment ? <Loader className="animate-spin mr-2" /> : 'I Have Sent the Money'}
                      </button>
                  </div>
              )}
              <div className="flex items-center justify-center text-xs text-gray-400">
                  <Shield size={12} className="mr-1"/> Secure Payment
              </div>
          </div>
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
                         <h2 className="text-4xl font-bold mb-6">₦{user?.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                         <button onClick={() => setShowTopUp(true)} className="bg-green-500 text-black px-6 py-3 rounded-full font-bold flex items-center hover:bg-green-400 hover:shadow-lg transition-all">
                             <Plus size={20} className="mr-2" /> Top Up
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
                                 {tx.type === 'CREDIT' ? '+' : '-'}₦{Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                             </span>
                         </div>
                     ))}
                 </div>
             </div>
             {showTopUp && <TopUpModal />}
          </div>
      );
  }

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
                            <span className="font-bold">₦{trip.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
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
                    </div>
                ))}
           </div>
        </div>
    );
  }

  if (view === 'SETTINGS') { return <SettingsView />; }
  if (view === 'SUPPORT') { return <SupportView />; }

  return (
    <div className="h-screen relative bg-gray-100 overflow-hidden">
        {view === 'MENU' && <Sidebar />}
        {showTopUp && <TopUpModal />}
        
        {isChatOpen && activeRide && (
            <ChatInterface 
                messages={activeRide.chatHistory}
                currentUserRole={UserRole.RIDER}
                otherUserName={MOCK_DRIVER.name}
                otherUserAvatar={MOCK_DRIVER.avatarUrl}
                onSend={sendMessage}
                onClose={() => setIsChatOpen(false)}
            />
        )}

        {isSupportChatOpen && (
            <ChatInterface 
                messages={supportMessages}
                currentUserRole={UserRole.RIDER}
                otherUserName="Speedride Support"
                onSend={handleSupportSend}
                onClose={() => setIsSupportChatOpen(false)}
            />
        )}

        <div className={`absolute top-4 left-4 z-30 ${view !== 'MAP' ? 'hidden' : ''}`}>
            <button onClick={() => setView('MENU')} className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110 active:scale-95">
                <Menu size={24} />
            </button>
        </div>

        <div className="absolute inset-0 z-0">
            <MapPlaceholder 
                status={activeRide?.status || RideStatus.IDLE} 
                pickup={activeRide?.pickup}
                destination={activeRide?.destination || destination}
                className="w-full h-full"
            />
        </div>

        <div className={`absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] max-h-[85vh] overflow-y-auto animate-slide-up ${isChatOpen || isSupportChatOpen ? 'hidden md:block' : ''}`}>
            {!activeRide && !showRating && (
                <div className="p-6">
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
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="flex items-center mb-4">
                                <button onClick={() => setDestination("")} className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                                <h3 className="font-bold text-lg">Choose a ride</h3>
                            </div>
                            
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
                                        <p className="font-bold text-lg">₦{(v.base * 1.5).toLocaleString(undefined, {minimumFractionDigits: 0})}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleBook} className="w-full bg-green-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-green-400 shadow-lg hover:shadow-green-200 transition-all transform active:scale-95">
                                Select {selectedVehicle.name}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeRide && (
                <div className="p-6 animate-slide-up">
                    {activeRide.status === RideStatus.SEARCHING ? (
                        <div className="text-center py-8">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-xl font-bold mb-2">Connecting to drivers...</h2>
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
                                     </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <button 
                                        onClick={() => setIsChatOpen(true)}
                                        className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-110 transition-all relative"
                                     >
                                        <MessageSquare size={20}/>
                                     </button>
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
                        </>
                    )}
                </div>
            )}
        </div>

        {showRating && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl animate-scale-up">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Rate your trip</h2>
                    <div className="flex justify-center space-x-2 mb-8">
                        {[1,2,3,4,5].map(star => (
                            <Star key={star} size={36} className="text-gray-200 hover:text-yellow-400 hover:fill-yellow-400 cursor-pointer transition-all transform hover:scale-125" />
                        ))}
                    </div>
                    <button onClick={handleRate} className="w-full bg-green-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-green-400 shadow-lg transform active:scale-95 transition-all">Submit</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default RiderPage;