"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Lock, Mail, Loader } from 'lucide-react';
import { useBackend } from '../../../context/MockBackendContext';
import { UserRole } from '../../../types';

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useBackend();
  const [role, setRole] = useState<UserRole>(UserRole.RIDER);
  const [email, setEmail] = useState('demo@speedride.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        login(email, role);
        if (role === UserRole.RIDER) router.push('/rider');
        else if (role === UserRole.DRIVER) router.push('/driver');
        else if (role === UserRole.ADMIN) router.push('/admin');
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-scale-up">
        <div className="p-8 pb-0 text-center">
           <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl text-white mb-4 shadow-lg transform rotate-3">
             <Car size={24} />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 animate-fade-in-up delay-100">Welcome Back</h2>
           <p className="text-gray-500 mt-2 animate-fade-in-up delay-200">Log in to continue to Speedride</p>
        </div>

        <div className="flex justify-center p-6 pb-2 animate-fade-in-up delay-300">
            <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                <button 
                    onClick={() => setRole(UserRole.RIDER)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${role === UserRole.RIDER ? 'bg-white shadow-md text-black scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Rider
                </button>
                <button 
                    onClick={() => setRole(UserRole.DRIVER)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${role === UserRole.DRIVER ? 'bg-white shadow-md text-black scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Driver
                </button>
                 <button 
                    onClick={() => setRole(UserRole.ADMIN)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${role === UserRole.ADMIN ? 'bg-white shadow-md text-black scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Admin
                </button>
            </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 pt-4 space-y-4 animate-fade-in-up delay-500">
            <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-700 uppercase transition-colors group-focus-within:text-black">Email</label>
                <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 group-focus-within:border-black group-focus-within:bg-gray-50 transition-all duration-300">
                    <Mail className="text-gray-400 mr-3 group-focus-within:text-black transition-colors" size={20} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow outline-none bg-transparent font-medium"
                        placeholder="name@example.com"
                    />
                </div>
            </div>
            
            <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-700 uppercase transition-colors group-focus-within:text-black">Password</label>
                <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 group-focus-within:border-black group-focus-within:bg-gray-50 transition-all duration-300">
                    <Lock className="text-gray-400 mr-3 group-focus-within:text-black transition-colors" size={20} />
                    <input 
                        type="password" 
                        className="flex-grow outline-none bg-transparent font-medium"
                        placeholder="••••••••"
                        defaultValue="password"
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 hover:shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center mt-4 transform active:scale-95"
            >
                {isLoading ? <Loader className="animate-spin" /> : 'Log In'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
                New here? <span className="text-black font-bold cursor-pointer hover:underline" onClick={() => router.push('/auth/signup/rider')}>Create an account</span>
            </p>
        </form>
      </div>
    </div>
  );
};

export default Login;