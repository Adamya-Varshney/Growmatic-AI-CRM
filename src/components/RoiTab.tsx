import React, { useState } from 'react';
import { Zap, Clock, Lightbulb, TrendingUp, BarChart3, ArrowUpRight, Award, CheckCircle } from 'lucide-react';

interface RoiTabProps {
  businessCity: string;
}

export default function RoiTab({ businessCity }: RoiTabProps) {
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'all'>('month');
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="flex flex-col gap-4.5 pb-6 animate-fade-in font-sans">
      
      {/* 2. Three filter pills below header - This week, This month selected in deep indigo, All time */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveFilter('week')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeFilter === 'week'
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
          }`}
        >
          This week
        </button>
        <button
          onClick={() => setActiveFilter('month')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeFilter === 'month'
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
          }`}
        >
          This month
        </button>
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeFilter === 'all'
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
          }`}
        >
          All time
        </button>
      </div>

      {/* 3. Two rows of metric cards - 2 cards per row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Row 1, Card 1: Total Spent */}
        <div className="bg-white p-4 rounded-xl border border-[#F0F0EE] shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block leading-none">Total Spent</span>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-[#4F46E5] font-display leading-none">
              ₹2,100
            </div>
            <div className="text-[9px] text-indigo-400 mt-1.5 font-semibold">Active ad spend</div>
          </div>
        </div>

        {/* Row 1, Card 2: Total Leads */}
        <div className="bg-white p-4 rounded-xl border border-[#F0F0EE] shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block leading-none">Total Leads</span>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-[#111827] font-display leading-none">
              47
            </div>
            <div className="text-[9px] text-emerald-600 mt-1.5 font-semibold">Acquired contacts</div>
          </div>
        </div>

        {/* Row 2, Card 1: Conversions */}
        <div className="bg-white p-4 rounded-xl border border-[#F0F0EE] shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block leading-none">Conversions</span>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-emerald-600 font-display leading-none">
              3
            </div>
            <div className="text-[9px] text-emerald-650 mt-1.5 font-semibold">Paying students</div>
          </div>
        </div>

        {/* Row 2, Card 2: ROAS - emerald green text, light green background */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-750 block leading-none">ROAS</span>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-emerald-600 font-display leading-none">
              4.85x
            </div>
            <div className="text-[9px] text-emerald-700 mt-1.5 font-bold">Excellent return</div>
          </div>
        </div>
      </div>

      {/* 4. AI Summary card - full width - deep indigo gradient background - white text */}
      <div className="bg-gradient-to-br from-[#4F46E5] to-[#312E81] rounded-2xl p-4.5 text-white shadow-md relative overflow-hidden">
        {/* Abstract design elements to match Growmatic aesthetic */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none transform translate-x-10 -translate-y-10" />
        
        <div className="flex items-center gap-1.5 text-white/95 font-bold text-[10px] uppercase tracking-wider mb-2.5">
          <Zap size={12} className="fill-white text-white animate-pulse" />
          <span>AI Summary</span>
        </div>

        <p className="text-[13px] text-white/95 leading-relaxed font-medium">
          You spent <span className="font-bold underline decoration-indigo-300">₹2,100</span> this month and got <span className="font-bold text-amber-300">47 leads</span>. Of these, <span className="font-bold">8</span> were high intent and <span className="font-bold text-emerald-300">3</span> converted to paying students. You made <span className="font-bold text-emerald-300">₹4.85</span> for every ₹1 spent.
        </p>
      </div>

      {/* 5. Attribution insight card - amber background - light amber border */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4.5 flex flex-col gap-3.5 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
          <Lightbulb size={13} strokeWidth={2.5} className="text-amber-600" />
          <span>Attribution Insight</span>
        </div>

        <p className="text-xs text-amber-950 font-medium leading-relaxed">
          Your Tuesday campaign with <strong className="text-amber-950 font-bold">Creative A</strong> drove 6 of your 8 high intent leads. Monday campaign drove only 1. Consider pausing Monday campaigns next batch.
        </p>

        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]"
        >
          See campaign breakdown
        </button>

        {showExplanation && (
          <div className="mt-1 bg-amber-100/50 rounded-lg p-2.5 border border-amber-200/50 text-[10px] text-amber-900 leading-normal animate-fade-in font-sans">
            💡 <strong>Historical analysis:</strong> Tuesday cohorts exhibit +240% higher instant reach response times compared to Monday audiences in {businessCity || 'Mumbai'}.
          </div>
        )}
      </div>

      {/* 6. Campaign comparison section below */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pr-1">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Campaign Comparison
          </h2>
          <span className="text-[9px] font-bold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
            Active Batches
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#F0F0EE] shadow-2xs divide-y divide-[#F0F0EE]/65 overflow-hidden">
          {/* Row 1: Batch 5 Tuesday Creative A */}
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-gray-800 font-sans">Batch 5 Tuesday Creative A</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-gray-500">28 leads</span>
                  <span className="text-[10px] text-gray-400 font-medium">•</span>
                  <span className="text-[10px] font-semibold text-gray-500">₹8 CPL</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                Best performing
              </span>
            </div>
            
            {/* 80% Performance Bar */}
            <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: '80%' }} />
            </div>
          </div>

          {/* Row 2: Batch 5 Monday Creative B */}
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-gray-800 font-sans">Batch 5 Monday Creative B</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-gray-500">19 leads</span>
                  <span className="text-[10px] text-gray-400 font-medium">•</span>
                  <span className="text-[10px] font-semibold text-gray-500">₹16 CPL</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                Below average
              </span>
            </div>
            
            {/* 35% Performance Bar */}
            <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
