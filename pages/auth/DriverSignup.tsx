
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Upload, CheckCircle, Check, Loader, FileText } from 'lucide-react';
import { useBackend } from '../../context/MockBackendContext';
import { UserRole, VehicleType } from '../../types';

type Step = 'info' | 'vehicle' | 'docs';

const DriverSignup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useBackend();
  const [step, setStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      city: 'Lagos', // Default to a Nigerian city
      vehicleType: VehicleType.STANDARD,
      vehicleModel: '',
      vehiclePlate: '',
      docs: {
          license: false,
          insurance: false,
          reg: false
      }
  });

  const handleChange = (field: string, value: any) => {
      setFormData(prev => ({...prev, [field]: value}));
  };

  const handleNext = () => {
      if (step === 'info') setStep('vehicle');
      else if (step === 'vehicle') setStep('docs');
      else {
          setIsLoading(true);
          setTimeout(() => {
              signup(UserRole.DRIVER, {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone, // Include phone
                  vehicleType: formData.vehicleType,
                  vehicleModel: formData.vehicleModel,
                  vehiclePlate: formData.vehiclePlate,
              });
              navigate('/driver');
          }, 2000);
      }
  };

  const toggleDoc = (doc: 'license' | 'insurance' | 'reg') => {
      setFormData(prev => ({
          ...prev,
          docs: { ...prev.docs, [doc]: !prev.docs[doc] }
      }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {/* Sidebar - Value Prop */}
        <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Home
                </button>
                <h1 className="text-4xl font-bold mb-4">Drive with Speedride</h1>
                <p className="text-gray-400 text-lg">Earn good money, be your own boss, and drive when you want.</p>
             </div>

             <div className="relative z-10 space-y-6 mt-12 md:mt-0">
                <div className="flex items-start">
                    <div className="bg-green-500/20 p-2 rounded-lg mr-4">
                        <CheckCircle className="text-green-400" size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold">Reliable Earnings</h4>
                        <p className="text-sm text-gray-400">Weekly payouts and instant cashout options.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                        <CheckCircle className="text-blue-400" size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold">Flexible Schedule</h4>
                        <p className="text-sm text-gray-400">No minimum hours. You decide when you drive.</p>
                    </div>
                </div>
             </div>
             
             {/* Background Graphic */}
             <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
                 <Car size={300} />
             </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-grow flex flex-col justify-center p-6 md:p-12">
            <div className="max-w-lg mx-auto w-full">
                {/* Progress Indicator */}
                <div className="flex mb-8">
                    {['info', 'vehicle', 'docs'].map((s, idx) => {
                        const isActive = s === step;
                        const isPast = (step === 'vehicle' && idx === 0) || (step === 'docs' && idx < 2);
                        return (
                            <div key={s} className="flex-1 h-2 mx-1 rounded-full transition-all duration-300 bg-gray-200 relative">
                                {(isActive || isPast) && (
                                    <div className={`absolute inset-0 rounded-full ${isPast ? 'bg-green-500' : 'bg-black'}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <h2 className="text-2xl font-bold mb-6 capitalize">
                    {step === 'info' ? 'Personal Details' : step === 'vehicle' ? 'Vehicle Information' : 'Required Documents'}
                </h2>

                {step === 'info' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" className="p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-black" 
                                value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                            <input type="text" placeholder="City" className="p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-black" 
                                value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
                        </div>
                        <input type="email" placeholder="Email Address" className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-black" 
                            value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                         
                         {/* Nigeria Phone Input */}
                         <div className="w-full bg-white border rounded-xl flex items-center focus-within:ring-2 focus-within:ring-black focus-within:border-transparent p-1 transition-all">
                             <div className="flex items-center pl-3 pr-2 border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-l-lg py-3">
                                 <img src="https://flagcdn.com/w40/ng.png" alt="NG" className="w-6 h-4 rounded-sm shadow-sm mr-2" />
                                 <span className="font-bold text-gray-700 text-sm">+234</span>
                             </div>
                             <input 
                                type="tel" 
                                placeholder="800 000 0000" 
                                className="flex-grow p-3 outline-none font-medium"
                                value={formData.phone} 
                                onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))} 
                             />
                         </div>
                    </div>
                )}

                {step === 'vehicle' && (
                    <div className="space-y-4 animate-fade-in">
                        <select className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                            value={formData.vehicleType} onChange={(e) => handleChange('vehicleType', e.target.value)}
                        >
                            <option value={VehicleType.STANDARD}>Standard Sedan</option>
                            <option value={VehicleType.ECONOMY}>Economy Hatchback</option>
                            <option value={VehicleType.BUSINESS}>Business / Luxury</option>
                            <option value={VehicleType.MOTORBIKE}>Motorbike (Okada/Dispatch)</option>
                        </select>
                        <input type="text" placeholder="Vehicle Model (e.g. Toyota Camry 2015)" className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-black" 
                            value={formData.vehicleModel} onChange={(e) => handleChange('vehicleModel', e.target.value)} />
                        <input type="text" placeholder="License Plate Number (e.g. LND-123-XY)" className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-black uppercase font-mono" 
                            value={formData.vehiclePlate} onChange={(e) => handleChange('vehiclePlate', e.target.value)} />
                    </div>
                )}

                {step === 'docs' && (
                    <div className="space-y-4 animate-fade-in">
                        <p className="text-sm text-gray-500 mb-4">Click to simulate uploading documents.</p>
                        
                        {['license', 'insurance', 'reg'].map((docType) => (
                            <div 
                                key={docType}
                                onClick={() => toggleDoc(docType as any)}
                                className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${formData.docs[docType as keyof typeof formData.docs] ? 'bg-green-50 border-green-500' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.docs[docType as keyof typeof formData.docs] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {formData.docs[docType as keyof typeof formData.docs] ? <Check size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold capitalize">{docType === 'reg' ? 'Vehicle Registration' : `Driver ${docType}`}</p>
                                        <p className="text-xs text-gray-500">{formData.docs[docType as keyof typeof formData.docs] ? 'Uploaded successfully' : 'Tap to upload'}</p>
                                    </div>
                                </div>
                                {formData.docs[docType as keyof typeof formData.docs] ? <span className="text-green-600 text-sm font-bold">Ready</span> : <Upload size={18} className="text-gray-400"/>}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t">
                    <button 
                        onClick={handleNext}
                        disabled={isLoading}
                        className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <Loader className="animate-spin" /> : (step === 'docs' ? 'Submit Application' : 'Continue')}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DriverSignup;
