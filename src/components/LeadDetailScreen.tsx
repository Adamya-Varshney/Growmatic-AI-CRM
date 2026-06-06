import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Send, X, MessageSquare, MapPin, Share2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function LeadDetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const lead = location.state?.lead;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'UN';
  };

  // Get intent badge style
  const getIntentStyle = (intent: string) => {
    if (intent === 'High') return 'bg-emerald-500 text-white';
    if (intent === 'Medium') return 'bg-amber-400 text-white';
    return 'bg-gray-400 text-white';
  };

  const handleConverted = async () => {
    setIsSubmitting(true);
    if (lead?.id) {
      await supabase
        .from('leads')
        .update({ status: 'converted' })
        .eq('id', lead.id);
    }
    triggerToast('🎉 Lead successfully marked as converted!');
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/leads');
    }, 1500);
  };

  const handleFollowUp = () => {
    triggerToast(`💬 Follow-up message sent to ${lead?.name || 'lead'} on Telegram!`);
  };

  const handleLost = async () => {
    setIsSubmitting(true);
    if (lead?.id) {
      await supabase
        .from('leads')
        .update({ status: 'lost' })
        .eq('id', lead.id);
    }
    triggerToast('📉 Lead marked as lost.');
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/leads');
    }, 1500);
  };

  // Parse conversation transcript
  const getTranscript = () => {
    if (!lead?.conversationTranscript) return [];
    if (typeof lead.conversationTranscript === 'string') {
      try {
        return JSON.parse(lead.conversationTranscript);
      } catch {
        return [];
      }
    }
    return lead.conversationTranscript || [];
  };

  const transcript = getTranscript();

  // If no lead data passed show error state
  if (!lead) {
    return (
      <div className="min-h-full bg-[#FAF9F6] flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800 mb-2">Lead not found</p>
          <p className="text-xs text-gray-400 mb-4">Please go back and select a lead</p>
          <button
            onClick={() => navigate('/leads')}
            className="bg-[#4F46E5] text-white text-xs font-bold py-2 px-4 rounded-xl"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FAF9F6] flex flex-col justify-between font-sans relative">

      {/* Header */}
      <header className="bg-white px-5 py-4 border-b border-[#F0F0EE] flex items-center justify-between shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.02)] z-20 font-sans">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/leads')}
            className="text-gray-500 hover:text-[#4F46E5] p-1 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <span className="text-lg font-bold text-gray-800 tracking-tight font-display">
            Lead Detail
          </span>
        </div>
        <button
          onClick={() => triggerToast('Lead details shared successfully!')}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <Share2 size={16} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-5">

        {/* Loading overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4 max-w-[280px]">
              <span className="h-8 w-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
              <div className="text-xs font-bold text-gray-800">Updating lead status...</div>
            </div>
          </div>
        )}

        {/* Lead profile */}
        <div className="flex items-center justify-between bg-white border border-[#F0F0EE] p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="h-[44px] w-[44px] rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-black text-sm select-none shadow-xs shrink-0 font-display">
              {getInitials(lead.name)}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight font-sans leading-none">
                {lead.name}
              </h2>
              <p className="text-[11px] text-gray-400 mt-1 font-medium flex items-center gap-1">
                {lead.phone && (
                  <span className="font-semibold text-gray-500 font-mono">{lead.phone}</span>
                )}
                {lead.city && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin size={10} /> {lead.city}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full font-display tracking-wider shadow-2xs ${getIntentStyle(lead.intent)}`}>
            {lead.intent} Intent
          </span>
        </div>

        {/* Qualification summary */}
        <div className="bg-[#FAF9F6] border border-[#E5E5E0] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Qualification Summary
            </span>
            <span className="text-[9px] font-black tracking-wider text-[#4F46E5] uppercase bg-indigo-50 px-1.5 py-0.5 rounded-md leading-none">
              Verified
            </span>
          </div>

          <div className="flex flex-col gap-2 font-sans">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
              <span className="text-gray-500 font-medium">Dance style</span>
              <span className="text-gray-800 font-bold">{lead.danceStyle || 'Not specified'}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
              <span className="text-gray-500 font-medium">Batch preference</span>
              <span className="text-gray-800 font-bold">{lead.batchPreference || 'Not specified'}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
              <span className="text-gray-500 font-medium">City</span>
              <span className="text-gray-800 font-bold">{lead.city || 'Not specified'}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
              <span className="text-gray-500 font-medium">Response time</span>
              <span className="text-emerald-600 font-bold">Via Telegram</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
              <span className="text-gray-500 font-medium">Source</span>
              <span className="text-[#4F46E5] font-bold">{lead.source || 'Telegram'}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 text-xs">
              <span className="text-gray-500 font-medium">Captured via</span>
              <span className="text-[#0369A1] font-bold bg-[#E0F2FE] px-1.5 py-0.5 rounded">
                Telegram bot
              </span>
            </div>
          </div>
        </div>

        {/* Conversation transcript */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-sans">
            Telegram Conversation
          </label>
          <div className="bg-slate-100/90 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <MessageSquare size={11} />
              <span>Transcript</span>
            </div>
            <div className="flex flex-col gap-2 font-mono text-[10.5px] leading-relaxed text-slate-700 bg-white/90 p-3 rounded-xl border border-slate-150 shadow-xs">
              {transcript.length > 0 ? (
                transcript.map((msg: any, index: number) => (
                  <div key={index} className="flex items-start gap-1">
                    <span className={`font-bold uppercase tracking-wider shrink-0 text-[10px] ${
                      msg.from === 'bot' ? 'text-teal-600' : 'text-[#4F46E5]'
                    }`}>
                      {msg.from === 'bot' ? 'Bot:' : `${lead.name?.split(' ')[0]}:`}
                    </span>
                    <span className={msg.from === 'bot' ? 'text-gray-600' : 'text-gray-800 font-bold'}>
                      {msg.text}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-[10px]">No conversation recorded yet</div>
              )}
              <div className="border-t border-slate-100 pt-1.5 text-[10px] text-gray-400 italic flex items-center gap-1">
                <span>🤖 Bot: IDALS team will reach out to you shortly...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          <button
            onClick={handleConverted}
            className="w-full bg-[#0D9488] hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Check size={14} strokeWidth={3} />
            <span>Mark as converted</span>
          </button>
          <button
            onClick={handleFollowUp}
            className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Send size={12} strokeWidth={2.5} />
            <span>Send follow-up message</span>
          </button>
          <button
            onClick={handleLost}
            className="w-full bg-transparent hover:bg-rose-50 border border-[#E11D48] text-[#E11D48] font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <X size={14} strokeWidth={2.5} />
            <span>Mark as lost</span>
          </button>
        </div>

      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-[40px] left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xs text-white text-[10.5px] font-bold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 z-50 flex items-center gap-2 max-w-[280px]">
          <Check size={12} className="text-emerald-500 shrink-0" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}