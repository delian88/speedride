import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Smartphone, Mail, User, Check, Loader } from 'lucide-react';
import { useBackend } from '../../context/MockBackendContext';
import { UserRole } from '../../types';

type Step = 'phone' | 'otp' | 'profile';

const RiderSignup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useBackend();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
        // Auto-fill OTP simulation for demo
        setTimeout(() => setOtp(['1', '2', '3', '4']), 1000);
    }, 1000);
  };

  const handleOtpSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setStep('profile');
    }, 1000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        signup(UserRole.RIDER, { name, email, phone });
        navigate('/rider');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header */}
      <div className="p-6 flex items-center">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
        </button>
        <span className="ml-4 font-bold text-xl">Rider Sign up</span>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        
        {step === 'phone' && (
            <div className="w-full animate-fade-in">
                <h2 className="text-2xl font-bold mb-2">What's your number?</h2>
                <p className="text-gray-500 mb-8">We'll send a code to verify your phone.</p>
                
                <form onSubmit={handlePhoneSubmit}>
                    <div className="bg-gray-100 p-4 rounded-xl flex items-center mb-6 border-2 border-transparent focus-within:border-black transition-colors">
                        <div className="flex items-center pr-3 border-r border-gray-300 mr-3">
                            <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-6 h-4 rounded-sm" />
                            <span className="ml-2 font-medium text-gray-700">+1</span>
                        </div>
                        <input 
                            type="tel" 
                            className="bg-transparent flex-grow outline-none font-medium text-lg placeholder-gray-400"
                            placeholder="000 000 0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            autoFocus
                        />
                    </div>

                    <div className="mb-8">
                         <div className="flex items-center gap-4 my-6">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-gray-400 text-sm">Or connect with</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <button type="button" className="p-3 border rounded-xl flex justify-center hover:bg-gray-50 transition-colors">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                            </button>
                            <button type="button" className="p-3 border rounded-xl flex justify-center hover:bg-gray-50 transition-colors">
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-6 h-6" alt="Facebook" />
                            </button>
                            <button type="button" className="p-3 border rounded-xl flex justify-center hover:bg-gray-50 transition-colors">
                                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-6 h-6" alt="Apple" />
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={phone.length < 10 || isLoading}
                        className="w-full bg-black text-white font-bold py-4 rounded-xl flex justify-center items-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <Loader className="animate-spin" /> : <>Continue <ArrowRight size={20} className="ml-2" /></>}
                    </button>
                </form>
            </div>
        )}

        {step === 'otp' && (
            <div className="w-full animate-fade-in">
                 <h2 className="text-2xl font-bold mb-2">Enter the code</h2>
                 <p className="text-gray-500 mb-8">Sent to +1 {phone}</p>
                 
                 <div className="flex justify-between mb-8">
                    {otp.map((digit, idx) => (
                        <input 
                            key={idx}
                            type="text" 
                            value={digit}
                            className="w-16 h-16 text-center text-2xl font-bold bg-gray-100 rounded-xl border-2 border-transparent focus:border-black outline-none"
                            maxLength={1}
                            readOnly
                        />
                    ))}
                 </div>
                 
                 <p className="text-sm text-center text-gray-500 mb-8">Didn't receive it? <button className="text-black font-bold">Resend</button></p>

                 <button 
                    onClick={handleOtpSubmit}
                    disabled={isLoading || otp.some(d => !d)}
                    className="w-full bg-black text-white font-bold py-4 rounded-xl flex justify-center items-center hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                    {isLoading ? <Loader className="animate-spin" /> : 'Verify'}
                </button>
            </div>
        )}

        {step === 'profile' && (
            <div className="w-full animate-fade-in">
                <h2 className="text-2xl font-bold mb-2">Create your profile</h2>
                <p className="text-gray-500 mb-8">Let drivers know who you are.</p>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-xl flex items-center border-2 border-transparent focus-within:border-black transition-colors">
                         <User className="text-gray-400 mr-3" />
                         <input 
                            type="text"
                            placeholder="Full Name"
                            className="bg-transparent flex-grow outline-none font-medium"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                         />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl flex items-center border-2 border-transparent focus-within:border-black transition-colors">
                         <Mail className="text-gray-400 mr-3" />
                         <input 
                            type="email"
                            placeholder="Email Address"
                            className="bg-transparent flex-grow outline-none font-medium"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                         />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                        <h4 className="font-bold text-sm mb-2">Payment Method</h4>
                        <div className="flex items-center text-sm text-gray-600">
                             <div className="w-8 h-5 bg-gray-300 rounded mr-2"></div>
                             Cash (Default)
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={!name || !email || isLoading}
                        className="w-full bg-black text-white font-bold py-4 rounded-xl flex justify-center items-center hover:bg-gray-800 disabled:opacity-50 mt-6 transition-all"
                    >
                        {isLoading ? <Loader className="animate-spin" /> : 'Start Riding'}
                    </button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default RiderSignup;