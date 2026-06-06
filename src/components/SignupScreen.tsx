import React, { useState } from 'react';
import { Zap, User, Building, Mail, ChevronDown, Lock } from 'lucide-react';
import { supabase } from '../supabase';

interface SignupScreenProps {
  onSignupSuccess: (details: { name: string; businessName: string; businessType: string; email: string }) => void;
  onNavigateToLogin: () => void;
}

export default function SignupScreen({ onSignupSuccess, onNavigateToLogin }: SignupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('Online Brand');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    'Salon',
    'Coaching Center',
    'Food Shop',
    'Online Brand',
    'PG Housing',
    'Real Estate',
    'Other'
  ];

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!businessName.trim()) {
      setErrorMsg('Please enter your business name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1 — Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            business_name: businessName,
            business_type: businessType
          }
        }
      });

      if (authError) {
        setErrorMsg(authError.message);
        setIsSubmitting(false);
        return;
      }

      if (authData.user) {
        // Step 2 — Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: email,
            business_name: businessName,
            business_type: businessType,
            plan: 'free'
          });

        if (profileError) {
          // Profile insert failed but auth succeeded
          // Still proceed — profile can be created later
          console.error('Profile insert error:', profileError);
        }

        // Step 3 — Call success callback
        onSignupSuccess({
          name: fullName,
          businessName,
          businessType,
          email
        });
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="signup-container" className="min-h-full bg-[#FAF9F6] flex flex-col justify-between p-6 pb-6 font-sans">
      
      <div className="flex-1 flex flex-col justify-center gap-5 my-auto">
        
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="flex items-center gap-2 text-[#4F46E5]">
            <Zap size={24} className="fill-[#4F46E5] text-[#4F46E5]" strokeWidth={2.5} />
            <span className="text-xl font-black tracking-tight font-display text-[#4F46E5]">
              Growmatic
            </span>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight font-display">
            Create your account
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5 font-medium leading-none">
            Your AI marketing co-pilot starts here
          </p>
        </div>

        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-2.5 text-[10.5px] font-bold text-center leading-snug">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <User size={13} />
              </span>
              <input
                type="text"
                placeholder="Priya Rajesh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-semibold py-2 pl-9 pr-3 rounded-xl outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Business Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <Building size={13} />
              </span>
              <input
                type="text"
                placeholder="IDALS Dance Academy"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-semibold py-2 pl-9 pr-3 rounded-xl outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Business Type
            </label>
            <div className="relative flex items-center">
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-semibold py-2 pl-3.5 pr-8 rounded-xl outline-hidden transition-all text-gray-800 appearance-none cursor-pointer"
              >
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <span className="absolute right-3.5 text-gray-400 pointer-events-none">
                <ChevronDown size={14} />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <Mail size={13} />
              </span>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-semibold py-2 pl-9 pr-3 rounded-xl outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <Lock size={13} />
              </span>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-semibold py-2 pl-9 pr-3 rounded-xl outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4F46E5] hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 px-4 rounded-xl mt-2 transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs pt-1">
          <span className="text-gray-400 font-medium">Already have an account? </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-[#4F46E5] hover:underline cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-gray-400 pt-3 border-t border-gray-100 font-medium leading-relaxed select-none">
        By signing up you agree to our{' '}
        <span className="underline cursor-pointer">Terms</span> and{' '}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </div>

    </div>
  );
}