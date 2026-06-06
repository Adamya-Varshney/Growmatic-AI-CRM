import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Image as ImageIcon, Lightbulb, Check, ChevronRight } from 'lucide-react';
import { BusinessProfile } from '../types';

interface CreativeTabProps {
  profile: BusinessProfile;
}

interface CreativeCard {
  id: string;
  name: string;
  type: 'top_performer' | 'standard' | 'add_new';
  gradient: string;
  leads: string;
  cpl: string;
  conversion: string;
  isTopPerformer: boolean;
}

export default function CreativeTab({ profile }: CreativeTabProps) {
  const navigate = useNavigate();
  // 2. State for 4 filter pills
  const [activeFilter, setActiveFilter] = useState<'all' | 'top' | 'uploaded' | 'ai'>('all');
  
  // Interactive notifications & simulation states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Trigger brief floating notifications for interactive actions
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Listen to the custom event triggered from App.tsx header Plus button
  useEffect(() => {
    const handleAddCreativeEvent = () => {
      navigate('/create-campaign');
    };
    window.addEventListener('show-create-creative-modal', handleAddCreativeEvent);
    return () => {
      window.removeEventListener('show-create-creative-modal', handleAddCreativeEvent);
    };
  }, [navigate]);

  const handleCreateNewCampaign = () => {
    navigate('/create-campaign');
  };

  const handleReuse = (cardName: string) => {
    triggerToast(`"${cardName}" linked to active lead generation flow!`);
  };

  const handleCreateWithAI = () => {
    setLoadingAI(true);
    triggerToast("Generating 3 new face-forward creative variants with performance predictions...");
    setTimeout(() => {
      setLoadingAI(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4 font-sans animate-fade-in relative">
      
      {/* 2. Four filter pills below header — All is selected in deep indigo */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`shrink-0 py-2 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('top')}
          className={`shrink-0 py-2 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'top'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
          }`}
        >
          Top Performers
        </button>
        <button
          onClick={() => setActiveFilter('uploaded')}
          className={`shrink-0 py-2 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'uploaded'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
          }`}
        >
          Uploaded
        </button>
        <button
          onClick={() => setActiveFilter('ai')}
          className={`shrink-0 py-2 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'ai'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
          }`}
        >
          AI Generated
        </button>
      </div>

      {/* 3. A new campaign button — full width — teal background — white text */}
      <button 
        onClick={handleCreateNewCampaign}
        className="w-full bg-[#0D9488] hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider"
      >
        <Plus size={15} strokeWidth={2.5} />
        <span>Create New Campaign</span>
      </button>

      {/* Leads dynamic stats banner inside library */}
      <div className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
        Active Media Assets ({activeFilter === 'all' ? '3' : '1'} of 3)
      </div>

      {/* 4. Three creative cards stacked vertically */}
      <div className="flex flex-col gap-4">
        
        {/* Card 1 — Top performer */}
        {(activeFilter === 'all' || activeFilter === 'top' || activeFilter === 'ai') && (
          <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-sm overflow-hidden flex flex-col transition-all">
            {/* Thumbnail banner - 100px tall with gradient */}
            <div className="h-[200px] w-full relative overflow-hidden">
              <img
                src="/posters/poster1.jpg"
                alt="IDALS Online Diploma Program — June Batch"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm font-sans uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                <span>Top Performer</span>
              </div>
              <div className="absolute bottom-2 left-3">
                <span className="text-xs font-black text-white drop-shadow-sm">
                  June Batch · 6 Artists
                </span>
              </div>
            </div>

            {/* Below Thumbnail stats and attributes */}
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h4 className="text-xs font-bold text-gray-900 font-sans">
                  Face-forward · Artist photo
                </h4>
                <p className="text-[10.5px] text-gray-500 leading-normal mt-0.5">
                  Multi-artist face-forward poster · June batch · Sheetal Pery featured · Purple theme
                </p>
              </div>

              {/* Three small metric stat pills with light grey background */}
              <div className="flex items-center gap-1.5">
                <div className="bg-[#FAF9FF] border border-[#F0F0EE] px-2.5 py-1 rounded-lg text-center flex-1">
                  <span className="text-[8px] uppercase font-bold text-gray-400 block leading-tight">Leads</span>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">28 leads</span>
                </div>
                <div className="bg-[#FAF9FF] border border-[#F0F0EE] px-2.5 py-1 rounded-lg text-center flex-1">
                  <span className="text-[8px] uppercase font-bold text-gray-400 block leading-tight">CPL</span>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">₹8 CPL</span>
                </div>
                <div className="bg-[#FAF9FF] border border-[#F0F0EE] px-2.5 py-1 rounded-lg text-center flex-1">
                  <span className="text-[8px] uppercase font-bold text-gray-400 block leading-tight">Conversion</span>
                  <span className="text-[11px] font-bold text-emerald-600 leading-tight">21% conv</span>
                </div>
              </div>

              {/* Reuse button - deep indigo for top performer */}
              <button
                onClick={() => handleReuse("Face-forward · Artist photo")}
                className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Reuse in next campaign
              </button>
            </div>
          </div>
        )}

        {/* Card 2: Standard Creative Card */}
        {(activeFilter === 'all' || activeFilter === 'uploaded') && (
          <div className="bg-white rounded-2xl border border-[#F0F0EE] shadow-2xs overflow-hidden flex flex-col transition-all">
            {/* Thumbnail banner - 100px tall with gradient */}
            <div className="h-[200px] w-full relative overflow-hidden">
              <img
                src="/posters/poster2.png"
                alt="IDALS Online Diploma Program — February Batch"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3">
                <span className="text-xs font-black text-white drop-shadow-sm">
                  February Batch · 6 Artists
                </span>
              </div>
            </div>

            {/* Below Thumbnail stats and attributes */}
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h4 className="text-xs font-bold text-gray-900 font-sans">
                  Lifestyle visual · Group shot
                </h4>
                <p className="text-[10.5px] text-gray-500 leading-normal mt-0.5">
                  Multi-artist group poster · February batch · Pink purple theme · 6 artists featured
                </p>
              </div>

              {/* Three small metric stat pills with light grey background */}
              <div className="flex items-center gap-1.5">
                <div className="bg-[#FAF9FF] border border-[#F0F0EE] px-2.5 py-1 rounded-lg text-center flex-1">
                  <span className="text-[8px] uppercase font-bold text-gray-400 block leading-tight">Leads</span>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">19 leads</span>
                </div>
                <div className="bg-[#FAF9FF] border border-[#F0F0EE] px-2.5 py-1 rounded-lg text-center flex-1">
                  <span className="text-[8px] uppercase font-bold text-gray-400 block leading-tight">CPL</span>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">₹16 CPL</span>
                </div>
                <div className="bg-[#FAF9FF] border border-[#F0F0EE] px-2.5 py-1 rounded-lg text-center flex-1">
                  <span className="text-[8px] uppercase font-bold text-gray-400 block leading-tight">Conversion</span>
                  <span className="text-[11px] font-bold text-gray-650 leading-tight">11% conv</span>
                </div>
              </div>

              {/* Reuse button - outlined grey for standard */}
              <button
                onClick={() => handleReuse("Lifestyle visual · Group shot")}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold py-2 px-3 rounded-xl border border-gray-300 transition-all cursor-pointer text-center"
              >
                Reuse in next campaign
              </button>
            </div>
          </div>
        )}

        {/* Card 3: AI Generator Card */}
        {(activeFilter === 'all' || activeFilter === 'ai') && (
          <div className="bg-[#FAF9FF] rounded-2xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center gap-3.5 transition-all">
            
            {/* Center aligned icon and metadata */}
            <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-full shrink-0">
              <Sparkles size={24} className={loadingAI ? "animate-spin" : "animate-pulse"} />
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-indigo-950 font-sans">
                Generate new creative
              </h4>
              <p className="text-[10.5px] text-gray-500 mt-1 max-w-[260px] mx-auto leading-relaxed">
                AI creates 3 variants with performance predictions based on competitor insights.
              </p>
            </div>

            {/* AI Generator Button in deep indigo */}
            <button
              onClick={handleCreateWithAI}
              disabled={loadingAI}
              className="px-6 py-2 bg-[#4F46E5] hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              {loadingAI ? (
                <>
                  <span className="h-2.5 w-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={11} className="fill-white" />
                  <span>Create with AI</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* 8. An insight banner at the bottom — amber background — bulb icon */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex gap-2.5 shadow-sm mt-1">
        <div className="p-1.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg shrink-0 h-fit">
          <Lightbulb size={15} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[10.5px] font-bold text-amber-950 leading-tight uppercase tracking-wider font-display">
            Creative Guideline
          </p>
          <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed font-sans font-medium">
            Artist face-forward creatives deliver 2x better CPL than lifestyle group shots. Always brief your designer to lead with a single face.
          </p>
        </div>
      </div>

      {/* Floating Interaction Notifications Toast */}
      {toastMessage && (
        <div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xs text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 z-50 flex items-center gap-2 animate-bounce max-w-[280px]">
          <Check size={12} className="text-emerald-500 shrink-0" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
