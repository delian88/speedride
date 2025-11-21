import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowRight, Lock, Mail, Loader } from 'lucide-react';
import { useBackend } from '../../context/MockBackendContext';
import { UserRole } from '../../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useBackend();
  const [role, setRole] = useState<UserRole>(UserRole.RIDER);
  const [email, setEmail] = useState('demo@speedride.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
        login(email, role);
        if (role === UserRole.RIDER) navigate('/rider');
        else if (role === UserRole.DRIVER) navigate('/driver');
        else if (role === UserRole.ADMIN) navigate('/admin');
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 pb-0 text-center">
           <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl text-white mb-4">
             <Car size={24} />
           </div>
           <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
           <p className="text-gray-500 mt-2">Log in to continue to Speedride</p>
        </div>

        {/* Role Toggles */}
        <div className="flex justify-center p-6 pb-2">
            <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                <button 
                    onClick={() => setRole(UserRole.RIDER)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === UserRole.RIDER ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                >
                    Rider
                </button>
                <button 
                    onClick={() => setRole(UserRole.DRIVER)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === UserRole.DRIVER ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                >
                    Driver
                </button>
                 <button 
                    onClick={() => setRole(UserRole.ADMIN)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === UserRole.ADMIN ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                >
                    Admin
                </button>
            </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 pt-4 space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase">Email</label>
                <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:border-black focus-within:bg-gray-50 transition-colors">
                    <Mail className="text-gray-400 mr-3" size={20} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow outline-none bg-transparent font-medium"
                        placeholder="name@example.com"
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase">Password</label>
                <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 focus-within:border-black focus-within:bg-gray-50 transition-colors">
                    <Lock className="text-gray-400 mr-3" size={20} />
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
                className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center mt-4"
            >
                {isLoading ? <Loader className="animate-spin" /> : 'Log In'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
                New here? <span className="text-black font-bold cursor-pointer hover:underline" onClick={() => navigate('/signup/rider')}>Create an account</span>
            </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
