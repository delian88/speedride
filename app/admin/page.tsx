"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, Car, DollarSign, Activity, AlertCircle, Search, MapPin, Check, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBackend } from '../../context/MockBackendContext';
import { UserRole } from '../../types';

const data = [
  { name: 'Mon', rides: 4000, revenue: 2400000 },
  { name: 'Tue', rides: 3000, revenue: 1398000 },
  { name: 'Wed', rides: 2000, revenue: 980000 },
  { name: 'Thu', rides: 2780, revenue: 3908000 },
  { name: 'Fri', rides: 1890, revenue: 4800000 },
  { name: 'Sat', rides: 2390, revenue: 3800000 },
  { name: 'Sun', rides: 3490, revenue: 4300000 },
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'map'>('dashboard');
  const router = useRouter();
  const { logout, user } = useBackend();

  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) {
        router.push('/auth/login');
    }
  }, [user, router]);

  const handleLogout = () => {
      logout();
      router.push('/');
  };

  if (!user) return null;

  const LiveMap = () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] relative bg-slate-100">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
           
           {[...Array(10)].map((_, i) => (
               <div key={i} className="absolute transition-all duration-[5000ms]" style={{ 
                   top: `${Math.random() * 80 + 10}%`, 
                   left: `${Math.random() * 80 + 10}%` 
               }}>
                   <div className="relative group cursor-pointer">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                            Driver #{1000 + i} • On Trip
                        </div>
                   </div>
               </div>
           ))}
      </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-black">S</div>
                Speedride
            </h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
                <Activity size={20} className="mr-3" /> Dashboard
            </button>
            <button 
                 onClick={() => setActiveTab('map')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'map' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
                <MapPin size={20} className="mr-3" /> Live Map
            </button>
            <button 
                 onClick={() => setActiveTab('drivers')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'drivers' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
                <Car size={20} className="mr-3" /> Drivers & Fleet
            </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
            <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-300 text-sm font-bold">
                <LogOut size={16} className="mr-2"/> Sign Out
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                    <input type="text" placeholder="Search user, ride ID..." className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-64" />
                </div>
            </div>
        </header>

        <div className="p-8">
            {activeTab === 'dashboard' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                                    <h3 className="text-3xl font-bold mt-1">₦4,829,000</h3>
                                </div>
                                <div className="bg-green-100 p-2 rounded-lg text-green-600"><DollarSign size={24}/></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Active Rides</p>
                                    <h3 className="text-3xl font-bold mt-1">1,432</h3>
                                </div>
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Car size={24}/></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-6">Revenue Analytics</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip formatter={(value) => `₦${value}`} />
                                        <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-6">Ride Volume</h3>
                             <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: '#f9fafb'}} />
                                        <Bar dataKey="rides" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'drivers' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="font-bold text-lg">Verification Queue</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Driver Name</th>
                                <th className="px-6 py-4">Vehicle Info</th>
                                <th className="px-6 py-4">Documents</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1,2,3].map((i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                                        <span className="font-medium">John Doe {i}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Toyota Prius • GH-56{i}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Review License</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200"><Check size={16}/></button>
                                            <button className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"><X size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'map' && <LiveMap />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;