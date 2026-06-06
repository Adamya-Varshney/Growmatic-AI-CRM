import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Upload, Lock, Check, Smartphone, Trash2 } from 'lucide-react';

interface CreateCampaignScreenProps {
  onCampaignComplete?: () => void;
}

export default function CreateCampaignScreen({ onCampaignComplete }: CreateCampaignScreenProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Screen 1 States
  const [campaignGoal, setCampaignGoal] = useState<'lead' | 'brand' | 'retarget'>('lead');
  const [creationPath, setCreationPath] = useState<'ai' | 'upload'>('ai');
  const [monthlyBudget, setMonthlyBudget] = useState('1,500');

  // Screen 2 States
  const [promoting, setPromoting] = useState('IDALS Online Dance Diploma · Batch 5');
  const [idealStudent, setIdealStudent] = useState('Dance enthusiasts aged 18 to 34 across Maharashtra');
  const [callToAction, setCallToAction] = useState<'telegram' | 'website' | 'call'>('telegram');

  // Screen 3 States
  const [selectedCreative, setSelectedCreative] = useState<'A' | 'B' | 'C'>('A');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger floating notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/creative');
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleContinueFromStep1 = () => {
    if (creationPath === 'ai') {
      setStep(2);
    } else {
      triggerToast('Upload feature is disabled in this draft. Proceeding with AI Generator!');
      setTimeout(() => {
        setStep(2);
      }, 1500);
    }
  };

  const handleGenerateStep2 = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
      triggerToast('AI generated 3 matching creatives with copy drafts successfully!');
    }, 1500);
  };

  const handleDeployCampaign = () => {
    triggerToast(`Creative ${selectedCreative} has been successfully deployed to active Facebook & Instagram ad pools!`);
    setTimeout(() => {
      if (onCampaignComplete) {
        onCampaignComplete();
      }
      navigate('/creative');
    }, 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    triggerToast('Synthesizing alternative visuals and copy variations...');
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-[#FAF9F6] flex flex-col justify-between font-sans">
      
      {/* 1. Header (Dynamic based on steps) */}
      <header className="bg-white px-5 py-4 border-b border-[#F0F0EE] flex items-center justify-between shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.02)] z-20 font-sans">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-[#4F46E5] p-1 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
            id="campaign-back-btn"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <span className="text-lg font-bold text-gray-800 tracking-tight font-display">
            {step === 1 && 'Create Campaign'}
            {step === 2 && 'AI Creative Brief'}
            {step === 3 && 'Your 3 Creatives'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 tracking-wider">
            STEP {step}/3
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-5">
        
        {/* Loading Spinner Overlays */}
        {isGenerating && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4 max-w-[280px]">
              <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-full animate-bounce">
                <Sparkles size={32} className="animate-spin text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-display">Analyzing past metrics...</h3>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Synthesizing face-forward templates & crafting contextual copywriting
                </p>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#4F46E5] h-full w-4/5 rounded-full animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        )}

        {/* ------------------ STEP 1: PATH SELECTION ------------------ */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            {/* 2. Campaign goal selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-sans">
                Campaign Goal
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                {/* Lead Generation Goal */}
                <button
                  type="button"
                  onClick={() => setCampaignGoal('lead')}
                  className={`py-2.5 px-1.5 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    campaignGoal === 'lead'
                      ? 'bg-[#4F46E5] text-white shadow-xs font-bold'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span className="text-[10.5px] leading-tight">Lead Gen</span>
                </button>

                {/* Brand Awareness Goal */}
                <button
                  type="button"
                  onClick={() => setCampaignGoal('brand')}
                  className={`py-2.5 px-1.5 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    campaignGoal === 'brand'
                      ? 'bg-[#4F46E5] text-white shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="text-[10.5px] leading-tight">Awareness</span>
                </button>

                {/* Retargeting Goal (with lock icon and v2 text below) */}
                <button
                  type="button"
                  onClick={() => setCampaignGoal('retarget')}
                  className={`py-1 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    campaignGoal === 'retarget'
                      ? 'bg-[#4F46E5] text-white shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-650'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-[10px] leading-tight">Retarget</span>
                    <Lock size={9} className={campaignGoal === 'retarget' ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <span className="text-[8px] font-black tracking-wider text-[#4F46E5] uppercase mt-0.5 leading-none bg-indigo-50 px-1 py-[1.5px] rounded-sm">
                    V2
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Section heading */}
            <div className="mt-1">
              <h3 className="text-xs font-extrabold text-gray-800 tracking-tight leading-snug font-sans uppercase">
                How would you like to create your creative?
              </h3>
            </div>

            {/* 4. Two large selectable cards stacked vertically */}
            <div className="flex flex-col gap-3">
              {/* Card 1 — AI Generates for me */}
              <div
                onClick={() => setCreationPath('ai')}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col gap-2 ${
                  creationPath === 'ai'
                    ? 'bg-indigo-50/70 border-2 border-[#4F46E5] shadow-sm'
                    : 'bg-white border-[#E5E5E0] hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${creationPath === 'ai' ? 'bg-[#4F46E5] text-white' : 'bg-slate-100 text-gray-500'}`}>
                    <Sparkles size={16} className={creationPath === 'ai' ? 'fill-white' : ''} />
                  </div>
                  {/* Radio Indicator */}
                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${creationPath === 'ai' ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300'}`}>
                    {creationPath === 'ai' && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs font-extrabold leading-snug ${creationPath === 'ai' ? 'text-[#4F46E5]' : 'text-gray-800'}`}>
                    AI generates for me
                  </h4>
                  <p className="text-[10.5px] text-gray-500 mt-1 leading-normal font-sans">
                    Answer 3 questions. Get 3 ready-to-use creatives with copy in 60 seconds.
                  </p>
                </div>

                <div className="mt-1.5">
                  <span className="inline-block text-[8px] font-extrabold tracking-wider bg-[#4F46E5] text-white px-2 py-0.5 rounded-md uppercase font-sans">
                    Recommended for beginners
                  </span>
                </div>
              </div>

              {/* Card 2 — Upload my own creative */}
              <div
                onClick={() => setCreationPath('upload')}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col gap-2 ${
                  creationPath === 'upload'
                    ? 'bg-[#FAF9FF] border-2 border-[#4F46E5] shadow-sm'
                    : 'bg-slate-50/60 border-slate-205 border-dashed hover:bg-slate-100/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${creationPath === 'upload' ? 'bg-[#4F46E5] text-white' : 'bg-slate-100 text-gray-450'}`}>
                    <Upload size={16} />
                  </div>
                  {/* Radio Indicator */}
                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${creationPath === 'upload' ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300'}`}>
                    {creationPath === 'upload' && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs font-extrabold leading-snug ${creationPath === 'upload' ? 'text-gray-850' : 'text-gray-600'}`}>
                    Upload my own creative
                  </h4>
                  <p className="text-[10.5px] text-gray-400 mt-1 leading-normal font-sans">
                    Upload your designer poster. AI writes copy and predicts performance.
                  </p>
                </div>

                <div className="mt-1.5">
                  <span className="inline-block text-[8px] font-extrabold tracking-wider bg-[#D97706] text-white px-2 py-0.5 rounded-md uppercase font-sans">
                    Best for experienced users
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Monthly budget input */}
            <div className="flex flex-col gap-1.5 bg-white border border-[#F0F0EE] p-4 rounded-2xl shadow-2xs">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-sans">
                Monthly Budget
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-lg font-black text-[#4F46E5]">₹</span>
                <input
                  type="text"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value.replace(/[^0-9,]/g, ''))}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm font-black py-2.5 pl-7 pr-3 rounded-xl outline-hidden text-[#4F46E5] font-sans"
                />
              </div>
              <p className="text-[9.5px] text-gray-400 font-medium">
                Facebook minimum recommendation: ₹30 per day
              </p>
            </div>

            {/* 6. Continue button */}
            <button
              onClick={handleContinueFromStep1}
              className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl mt-1 transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Continue with AI generation</span>
            </button>
          </div>
        )}

        {/* ------------------ STEP 2: AI BRIEF INPUT ------------------ */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* 2. Light indigo info banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 flex gap-2.5 shadow-3xs">
              <div className="p-1 bg-[#4F46E5]/10 text-[#4F46E5] rounded-lg shrink-0 h-fit mt-0.5">
                <Sparkles size={14} className="fill-[#4F46E5]/10" />
              </div>
              <p className="text-[10.5px] text-gray-700 leading-normal font-sans font-medium">
                Answer 3 quick questions. Growmatic will generate your creatives in under 60 seconds.
              </p>
            </div>

            {/* 3. Three input fields */}
            <div className="flex flex-col gap-4">
              {/* Field 1 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-sans">
                  What are you promoting?
                </label>
                <textarea
                  rows={2}
                  value={promoting}
                  onChange={(e) => setPromoting(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-semibold py-2 px-3 rounded-xl outline-hidden text-gray-800 placeholder:text-gray-400 font-sans"
                  placeholder="e.g. Dance camp, Pilates masterclass..."
                />
              </div>

              {/* Field 2 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-sans">
                  Who is your ideal student?
                </label>
                <textarea
                  rows={2}
                  value={idealStudent}
                  onChange={(e) => setIdealStudent(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E0] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-xs font-semibold py-2 px-3 rounded-xl outline-hidden text-gray-800 placeholder:text-gray-400 font-sans"
                  placeholder="e.g. Beginners looking for weight loss in Bangalore..."
                />
              </div>

              {/* Field 3: What should they do after seeing the ad? */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-sans">
                  What should they do after seeing the ad?
                </label>
                <div className="flex flex-col gap-2">
                  {/* Telegram */}
                  <button
                    type="button"
                    onClick={() => setCallToAction('telegram')}
                    className={`py-3 px-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      callToAction === 'telegram'
                        ? 'bg-indigo-50 border-[#4F46E5] text-[#4F46E5] font-bold'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="text-xs">Message on Telegram</span>
                    {callToAction === 'telegram' && <Check size={14} strokeWidth={3} className="text-[#4F46E5]" />}
                  </button>

                  {/* Visit Website */}
                  <button
                    type="button"
                    onClick={() => setCallToAction('website')}
                    className={`py-3 px-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      callToAction === 'website'
                        ? 'bg-indigo-50 border-[#4F46E5] text-[#4F46E5] font-bold'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="text-xs">Visit website</span>
                    {callToAction === 'website' && <Check size={14} strokeWidth={3} className="text-[#4F46E5]" />}
                  </button>

                  {/* Call us */}
                  <button
                    type="button"
                    onClick={() => setCallToAction('call')}
                    className={`py-3 px-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      callToAction === 'call'
                        ? 'bg-indigo-50 border-[#4F46E5] text-[#4F46E5] font-bold'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="text-xs">Call us</span>
                    {callToAction === 'call' && <Check size={14} strokeWidth={3} className="text-[#4F46E5]" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Generate 3 creatives button */}
            <button
              onClick={handleGenerateStep2}
              className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl mt-3 transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="fill-white" />
              <span>Generate 3 creatives</span>
            </button>
          </div>
        )}

        {/* ------------------ STEP 3: CREATIVE VARIANTS ------------------ */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* 2. Small instruction text */}
            <div className="bg-emerald-50 border border-emerald-100/60 rounded-xl p-3 flex gap-2 items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
              <p className="text-[10.5px] font-bold text-emerald-950 font-sans">
                Tap to select. AI recommends Creative A based on your past data.
              </p>
            </div>

            {/* 3. Three creative cards stacked */}
            <div className="flex flex-col gap-3">
              
              {/* Creative A */}
              <div
                onClick={() => setSelectedCreative('A')}
                className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col ${
                  selectedCreative === 'A'
                    ? 'border-2 border-[#4F46E5] bg-indigo-50/20 shadow-sm'
                    : 'border-[#E5E5E0] bg-white opacity-85 hover:opacity-100'
                }`}
              >
                {/* Indigo to Purple gradient thumbnail */}
                <div className="h-[80px] w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] relative p-3 flex items-end">
                  <div className="absolute top-2 right-2 bg-[#10B981] text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <span>Recommended</span>
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wider drop-shadow-xs select-none">
                    Variant A
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-gray-905">Face-forward with offer</span>
                    <span className="text-[9px] font-extrabold bg-[#D1FAE5] text-[#065F46] px-2 py-[1.5px] rounded-md uppercase">
                      High Click
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 font-sans italic my-0.5 leading-relaxed bg-slate-50 p-2 border border-slate-100 rounded-lg">
                    "Train with India's top artists. Next batch starts soon — limited seats. Message us on Telegram"
                  </p>

                  <p className="text-[10px] text-emerald-600 font-bold leading-normal">
                    ✓ Face-forward creatives perform 2x better for education brands
                  </p>
                </div>
              </div>

              {/* Creative B */}
              <div
                onClick={() => setSelectedCreative('B')}
                className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col ${
                  selectedCreative === 'B'
                    ? 'border-2 border-[#4F46E5] bg-indigo-50/20 shadow-sm'
                    : 'border-[#E5E5E0] bg-white opacity-85 hover:opacity-100'
                }`}
              >
                {/* Teal gradient thumbnail */}
                <div className="h-[80px] w-full bg-gradient-to-r from-teal-500 to-[#0D9488] relative p-3 flex items-end">
                  <span className="text-xs font-black text-white uppercase tracking-wider drop-shadow-xs select-none">
                    Variant B
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-gray-905">Lifestyle visual</span>
                    <span className="text-[9px] font-extrabold bg-[#FEF3C7] text-[#92400E] px-2 py-[1.5px] rounded-md uppercase">
                      Medium Click
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 font-sans italic my-0.5 leading-relaxed bg-slate-50 p-2 border border-slate-100 rounded-lg">
                    "Learn dance from the best. Join our online classes today."
                  </p>
                </div>
              </div>

              {/* Creative C */}
              <div
                onClick={() => setSelectedCreative('C')}
                className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col ${
                  selectedCreative === 'C'
                    ? 'border-2 border-[#4F46E5] bg-indigo-50/20 shadow-sm'
                    : 'border-[#E5E5E0] bg-white opacity-85 hover:opacity-100'
                }`}
              >
                {/* Grey gradient thumbnail */}
                <div className="h-[80px] w-full bg-gradient-to-r from-slate-350 to-slate-500 relative p-3 flex items-end">
                  <span className="text-xs font-black text-white uppercase tracking-wider drop-shadow-xs select-none">
                    Variant C
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-gray-950">Text-heavy banner</span>
                    <span className="text-[9px] font-extrabold bg-[#FEE2E2] text-[#991B1B] px-2 py-[1.5px] rounded-md uppercase">
                      Lower Click
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 font-sans italic my-0.5 leading-relaxed bg-slate-50 p-2 border border-slate-100 rounded-lg">
                    "Enroll now for our upcoming batch — seats filling fast."
                  </p>
                </div>
              </div>

            </div>

            {/* 4. Use Selected Creative button */}
            <button
              onClick={handleDeployCampaign}
              className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl mt-2 transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Check size={14} strokeWidth={3} />
              <span>Use Creative {selectedCreative}</span>
            </button>

            {/* 5. Regenerate all 3 button */}
            <button
              onClick={handleRegenerate}
              className="w-full bg-transparent hover:bg-slate-100 text-gray-550 border border-gray-320 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-center"
            >
              Regenerate all 3
            </button>
          </div>
        )}

      </div>

      {/* Floating notifications */}
      {toastMessage && (
        <div className="fixed bottom-[40px] left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xs text-white text-[10.5px] font-bold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 z-50 flex items-center gap-2 animate-bounce max-w-[280px]">
          <Check size={12} className="text-emerald-500 shrink-0" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
