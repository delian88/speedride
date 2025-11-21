import React from 'react';
import { Car, ArrowRight, MapPin, Shield, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '../context/MockBackendContext';
import { UserRole } from '../types';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useBackend();

  const handleAdminLogin = () => {
    login('admin@speedride.com', UserRole.ADMIN);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm text-white z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-black p-1.5 rounded font-bold">
               <Car size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Speedride</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
             <a href="#" className="hover:text-gray-300 transition-colors">Ride</a>
             <a href="#" className="hover:text-gray-300 transition-colors">Drive</a>
             <a href="#" className="hover:text-gray-300 transition-colors">Business</a>
             <a href="#" className="hover:text-gray-300 transition-colors">About</a>
          </div>
          <div className="flex space-x-4">
             <button onClick={() => navigate('/signup/rider')} className="hidden md:block hover:text-gray-300 font-medium text-sm">Log in</button>
             <button onClick={() => navigate('/signup/rider')} className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Sign up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           {/* Abstract map background */}
           <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1494587416117-f102a2ac0fbd?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                    Go anywhere,<br/> 
                    <span className="text-green-400">get anything.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-lg">
                    Request a ride, hop in, and go. Experience the smartest way to move around your city with Speedride.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-white text-black p-6 rounded-2xl flex-1 hover:scale-105 transition-transform cursor-pointer group" onClick={() => navigate('/signup/rider')}>
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                            Ride
                            <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                        </h3>
                        <p className="text-sm text-gray-600">Get a ride in minutes.</p>
                    </div>
                    <div className="bg-gray-800 text-white p-6 rounded-2xl flex-1 hover:scale-105 transition-transform cursor-pointer group" onClick={() => navigate('/signup/driver')}>
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                            Drive
                            <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                        </h3>
                        <p className="text-sm text-gray-400">Earn money on your schedule.</p>
                    </div>
                </div>
            </div>
            
            {/* Hero Image/Graphic */}
            <div className="hidden md:block relative">
                 <div className="absolute top-0 right-0 bg-green-400 w-64 h-64 rounded-full blur-[100px] opacity-20"></div>
                 <img 
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop" 
                    alt="App Experience" 
                    className="rounded-3xl shadow-2xl border-8 border-gray-900 relative z-10 transform rotate-3 hover:rotate-0 transition-all duration-500"
                 />
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Why choose Speedride?</h2>
            
            <div className="grid md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <div className="bg-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                        <Clock size={28} className="text-slate-900" />
                    </div>
                    <h3 className="text-2xl font-bold">Fast & Reliable</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Our AI-powered dispatch system ensures the nearest driver reaches you in minutes, not hours.
                    </p>
                </div>
                 <div className="space-y-4">
                    <div className="bg-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                        <Shield size={28} className="text-slate-900" />
                    </div>
                    <h3 className="text-2xl font-bold">Safety First</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Verified drivers, emergency button, and live ride tracking shareable with loved ones.
                    </p>
                </div>
                 <div className="space-y-4">
                    <div className="bg-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                        <MapPin size={28} className="text-slate-900" />
                    </div>
                    <h3 className="text-2xl font-bold">Transparent Pricing</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Know your fare before you ride. No hidden fees, just smooth journeys to your destination.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-black rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to move?</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Join millions of riders and drivers moving the world forward together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                         <button onClick={() => navigate('/signup/rider')} className="bg-green-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-400 transition-colors">
                            Download App
                         </button>
                         <button onClick={() => navigate('/signup/driver')} className="bg-transparent border border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-colors">
                            Become a Driver
                         </button>
                    </div>
                </div>
                {/* Decorative Circle */}
                <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-gray-800 rounded-full opacity-50 blur-3xl"></div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                 <Car size={24} />
                 <span className="text-xl font-bold">Speedride</span>
            </div>
            <div className="flex space-x-8 text-gray-400 text-sm">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Support</a>
                <button onClick={handleAdminLogin} className="hover:text-white">Admin</button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;