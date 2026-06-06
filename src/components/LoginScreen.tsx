import React, { useState } from 'react';
import { Zap, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '../supabase';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        onLoginSuccess();
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="login-container" className="min-h-full bg-[#FAF9F6] flex flex-col justify-between p-6 pb-8 font-sans">
      
      <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
        
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2 text-[#4F46E5]">
            <Zap size={28} className="fill-[#4F46E5] text-[#4F46E5]" strokeWidth={2.5} />
            <span className="text-2xl font-black tracking-tight font-display text-[#4F46E5]">
              Growmatic
            </span>
          </div>
          <p className="text-xs text-gray-400 font-semibold tracking-wide uppercase font-sans">
            Your AI marketing co-pilot
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight font-display">
            Welcome back
          </h2>
          <p className="text-[11px] text-gray-400 mt-1 font-medium leading-none">
            Sign in to manage your active lead streams
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-[11px] font-bold text-center leading-snug">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-medium py-2.5 pl-10 pr-3 rounded-xl outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your email!')}
                className="text-[10px] font-bold text-[#4F46E5] hover:underline cursor-pointer leading-none"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <Lock size={14} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-medium py-2.5 pl-10 pr-10 rounded-xl outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4F46E5] hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl mt-2 transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-[#E5E5E0]" />
          <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">OR</span>
          <div className="flex-1 h-[1px] bg-[#E5E5E0]" />
        </div>

        <div className="text-center text-xs">
          <span className="text-gray-400 font-medium">Don't have an account? </span>
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="font-bold text-[#4F46E5] hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-gray-400 font-medium pt-4 select-none">
        🔐 Built with Enterprise Grade Protection
      </div>

    </div>
  );
}