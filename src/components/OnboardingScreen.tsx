import React, { useState } from 'react';
import { Zap, Target, DollarSign, Megaphone, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase';

interface OnboardingScreenProps {
  userId: string;
  businessName: string;
  onComplete: () => void;
}

export default function OnboardingScreen({ userId, businessName, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [primaryGoal, setPrimaryGoal] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [currentChannels, setCurrentChannels] = useState<string[]>([]);
  const [avgOrderValue, setAvgOrderValue] = useState('');

  const goals = [
    { value: 'more_leads', label: 'Get more leads', icon: '🎯' },
    { value: 'more_walk_ins', label: 'More walk-ins', icon: '🏪' },
    { value: 'more_sales', label: 'Increase sales', icon: '💰' },
    { value: 'brand_awareness', label: 'Build brand awareness', icon: '📣' }
  ];

  const budgets = [
    { value: 'under_1000', label: 'Under ₹1,000' },
    { value: '1000_3000', label: '₹1,000 – ₹3,000' },
    { value: '3000_10000', label: '₹3,000 – ₹10,000' },
    { value: 'above_10000', label: 'Above ₹10,000' }
  ];

  const channels = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'word_of_mouth', label: 'Word of mouth' },
    { value: 'justdial', label: 'JustDial' },
    { value: 'none', label: 'None yet' }
  ];

  const orderValues = [
    { value: 'under_500', label: 'Under ₹500' },
    { value: '500_2000', label: '₹500 – ₹2,000' },
    { value: '2000_10000', label: '₹2,000 – ₹10,000' },
    { value: 'above_10000', label: 'Above ₹10,000' }
  ];

  const toggleChannel = (value: string) => {
    if (currentChannels.includes(value)) {
      setCurrentChannels(currentChannels.filter(c => c !== value));
    } else {
      setCurrentChannels([...currentChannels, value]);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          primary_goal: primaryGoal,
          monthly_budget: monthlyBudget,
          current_channels: currentChannels,
          avg_order_value: avgOrderValue,
          onboarding_complete: true
        })
        .eq('id', userId);

      if (error) {
        console.error('Onboarding save error:', error);
      }
      onComplete();
    } catch (err) {
      console.error('Onboarding error:', err);
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return primaryGoal !== '';
    if (step === 2) return monthlyBudget !== '';
    if (step === 3) return currentChannels.length > 0;
    if (step === 4) return avgOrderValue !== '';
    return false;
  };

  return (
    <div className="min-h-full bg-[#FAF9F6] flex flex-col p-6 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-[#4F46E5]">
          <Zap size={22} className="fill-[#4F46E5]" strokeWidth={2.5} />
          <span className="text-lg font-black tracking-tight text-[#4F46E5]">Growmatic</span>
        </div>
        <span className="text-xs font-semibold text-gray-400">{step} of 4</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* Welcome text */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
          {step === 1 && `Welcome, ${businessName}! 👋`}
          {step === 2 && 'What is your monthly marketing budget?'}
          {step === 3 && 'How do you currently market your business?'}
          {step === 4 && 'What is your average sale or service value?'}
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          {step === 1 && 'What is your primary marketing goal?'}
          {step === 2 && 'This helps us suggest the right campaigns for you.'}
          {step === 3 && 'Select all that apply.'}
          {step === 4 && 'This helps us calculate your return on ad spend accurately.'}
        </p>
      </div>

      {/* Step 1 — Primary Goal */}
      {step === 1 && (
        <div className="flex flex-col gap-3 flex-1">
          {goals.map(goal => (
            <button
              key={goal.value}
              onClick={() => setPrimaryGoal(goal.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                primaryGoal === goal.value
                  ? 'border-[#4F46E5] bg-[#EEF2FF]'
                  : 'border-[#E5E5E0] bg-white hover:border-indigo-200'
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <span className={`text-sm font-semibold ${
                primaryGoal === goal.value ? 'text-[#4F46E5]' : 'text-gray-700'
              }`}>
                {goal.label}
              </span>
              {primaryGoal === goal.value && (
                <div className="ml-auto w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — Monthly Budget */}
      {step === 2 && (
        <div className="flex flex-col gap-3 flex-1">
          {budgets.map(budget => (
            <button
              key={budget.value}
              onClick={() => setMonthlyBudget(budget.value)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                monthlyBudget === budget.value
                  ? 'border-[#4F46E5] bg-[#EEF2FF]'
                  : 'border-[#E5E5E0] bg-white hover:border-indigo-200'
              }`}
            >
              <span className={`text-sm font-semibold ${
                monthlyBudget === budget.value ? 'text-[#4F46E5]' : 'text-gray-700'
              }`}>
                {budget.label}
              </span>
              {monthlyBudget === budget.value && (
                <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Step 3 — Current Channels */}
      {step === 3 && (
        <div className="flex flex-col gap-3 flex-1">
          {channels.map(channel => (
            <button
              key={channel.value}
              onClick={() => toggleChannel(channel.value)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                currentChannels.includes(channel.value)
                  ? 'border-[#4F46E5] bg-[#EEF2FF]'
                  : 'border-[#E5E5E0] bg-white hover:border-indigo-200'
              }`}
            >
              <span className={`text-sm font-semibold ${
                currentChannels.includes(channel.value) ? 'text-[#4F46E5]' : 'text-gray-700'
              }`}>
                {channel.label}
              </span>
              {currentChannels.includes(channel.value) && (
                <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Step 4 — Average Order Value */}
      {step === 4 && (
        <div className="flex flex-col gap-3 flex-1">
          {orderValues.map(ov => (
            <button
              key={ov.value}
              onClick={() => setAvgOrderValue(ov.value)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                avgOrderValue === ov.value
                  ? 'border-[#4F46E5] bg-[#EEF2FF]'
                  : 'border-[#E5E5E0] bg-white hover:border-indigo-200'
              }`}
            >
              <span className={`text-sm font-semibold ${
                avgOrderValue === ov.value ? 'text-[#4F46E5]' : 'text-gray-700'
              }`}>
                {ov.label}
              </span>
              {avgOrderValue === ov.value && (
                <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-col gap-3">
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="w-full bg-[#4F46E5] disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider transition-all cursor-pointer"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={!canProceed() || isSubmitting}
            className="w-full bg-[#0D9488] disabled:bg-teal-300 text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up your dashboard...</span>
              </>
            ) : (
              <span>Get started →</span>
            )}
          </button>
        )}
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-center text-xs font-semibold text-gray-400 hover:text-gray-600 py-2 transition-all cursor-pointer"
          >
            ← Back
          </button>
        )}
        {step < 4 && (
          <button
            onClick={() => {
              if (step === 4) {
                handleComplete();
              } else {
                setStep(step + 1);
              }
            }}
            className="w-full text-center text-xs font-semibold text-gray-400 hover:text-gray-600 py-1 transition-all cursor-pointer"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}