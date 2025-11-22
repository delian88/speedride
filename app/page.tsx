"use client";

import React from 'react';
import { Car, ArrowRight, MapPin, Shield, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBackend } from '../context/MockBackendContext';
import { UserRole } from '../types';

const Landing: React.FC = () => {
  const router = useRouter();
  const { login } = useBackend();

  const handleAdminLogin = () => {
    login('admin@speedride.com', UserRole.ADMIN);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md text-white z-50 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-white text-black p-1.5 rounded font-bold">
               <Car size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Speedride</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
             <a href="#" className="hover:text-green-400 transition-colors">Ride</a>
             <a href="#" className="hover:text-green-400 transition-colors">Drive</a>
             <a href="#" className="hover:text-green-400 transition-colors">Business</a>
             <a href="#" className="hover:text-green-400 transition-colors">About</a>
          </div>
          <div className="flex space-x-4">
             <button onClick={() => router.push('/auth/login')} className="hidden md:block hover:text-gray-300 font-medium text-sm transition-colors">Log in</button>
             <button onClick={() => router.push('/auth/signup/rider')} className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105">Sign up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-black text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1494587416117-f102a2ac0fbd?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter animate-fade-in-up">
                    Go anywhere,<br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">get anything.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-lg animate-fade-in-up delay-100">
                    Request a ride, hop in, and go. Experience the smartest way to move around your city with Speedride.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
                    <div className="bg-white text-black p-6 rounded-2xl flex-1 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-pointer group" onClick={() => router.push('/auth/signup/rider')}>
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                            Ride
                            <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0 text-green-600" />
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-black transition-colors">Get a ride in minutes.</p>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm text-white p-6 rounded-2xl flex-1 hover:scale-105 hover:bg-gray-800 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300 cursor-pointer group" onClick={() => router.push('/auth/signup/driver')}>
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                            Drive
                            <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0 text-green-400" />
                        </h3>
                        <p className="text-sm text-gray-400 group-hover:text-white transition-colors">Earn money on your schedule.</p>
                    </div>
                </div>
            </div>
            
            <div className="hidden md:block relative perspective-1000">
                 <div className="absolute top-10 right-10 bg-green-500 w-64 h-64 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                 <div className="animate-float">
                     <img 
                        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop" 
                        alt="App Experience" 
                        className="rounded-[2.5rem] shadow-2xl border-8 border-gray-900 relative z-10 transform rotate-3 hover:rotate-1 hover:scale-105 transition-all duration-700"
                     />
                 </div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center animate-fade-in-up">Why choose Speedride?</h2>
            
            <div className="grid md:grid-cols-3 gap-12">
                <div className="space-y-4 group p-6 rounded-3xl hover:bg-slate-50 transition-colors duration-300">
                    <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                        <Clock size={32} className="text-slate-900 group-hover:text-green-600 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold">Fast & Reliable</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Our AI-powered dispatch system ensures the nearest driver reaches you in minutes.
                    </p>
                </div>
                 <div className="space-y-4 group p-6 rounded-3xl hover:bg-slate-50 transition-colors duration-300">
                    <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                        <Shield size={32} className="text-slate-900 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold">Safety First</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Verified drivers, emergency button, and live ride tracking.
                    </p>
                </div>
                 <div className="space-y-4 group p-6 rounded-3xl hover:bg-slate-50 transition-colors duration-300">
                    <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                        <MapPin size={32} className="text-slate-900 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold">Transparent Pricing</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Know your fare before you ride. No hidden fees.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                 <Car size={24} className="text-green-500" />
                 <span className="text-xl font-bold">Speedride</span>
            </div>
            <div className="flex space-x-8 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <button onClick={handleAdminLogin} className="hover:text-white transition-colors">Admin</button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;