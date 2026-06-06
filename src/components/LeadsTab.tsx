import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, Check } from 'lucide-react';
import { BusinessProfile } from '../types';
import { supabase } from '../supabase';

interface LeadsTabProps {
  profile: BusinessProfile;
}

interface VisualLead {
  id: string;
  name: string;
  intent: 'High' | 'Medium' | 'Archived';
  danceStyle: string;
  batchPreference: string;
  city?: string;
  source: string;
  timeAgo: string;
  initials: string;
  statusTag?: string;
  phone?: string;
  conversationTranscript?: string;
  createdAt?: string;
}

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}min ago`;
  if (diffHours < 24) return `${diffHours}hr ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const DEMO_LEADS = [
  {
    name: 'Priya Rajesh',
    phone: '+91 98451 22354',
    city: 'Mumbai',
    interest: 'Hip-hop',
    batch_preference: 'Weekend',
    intent_score: 'High',
    status: 'inquired',
    source: 'Telegram',
    creative_source: 'Via Creative A',
    conversation_transcript: [
      { from: 'bot', text: 'Which dance style interests you?' },
      { from: 'user', text: 'Hip-hop! I have wanted to learn for a long time.' },
      { from: 'bot', text: 'Weekday or weekend batches?' },
      { from: 'user', text: 'Weekends work best.' },
      { from: 'bot', text: 'Which city are you in?' },
      { from: 'user', text: 'Mumbai' }
    ]
  },
  {
    name: 'Sneha K.',
    phone: '+91 91223 74652',
    city: 'Thane',
    interest: 'Hip-hop',
    batch_preference: 'Weekend',
    intent_score: 'High',
    status: 'inquired',
    source: 'Telegram',
    creative_source: 'Via Creative A',
    conversation_transcript: [
      { from: 'bot', text: 'Which dance style interests you?' },
      { from: 'user', text: 'Hip-hop please!' },
      { from: 'bot', text: 'Weekday or weekend batches?' },
      { from: 'user', text: 'Weekend.' },
      { from: 'bot', text: 'Which city are you in?' },
      { from: 'user', text: 'Thane' }
    ]
  },
  {
    name: 'Amit M.',
    phone: '+91 97423 55812',
    city: 'Pune',
    interest: 'Bollywood',
    batch_preference: 'Weekday',
    intent_score: 'Medium',
    status: 'following_up',
    source: 'Telegram',
    creative_source: 'Via Creative B',
    conversation_transcript: [
      { from: 'bot', text: 'Which dance style interests you?' },
      { from: 'user', text: 'Bollywood I think.' },
      { from: 'bot', text: 'Weekday or weekend batches?' },
      { from: 'user', text: 'Weekday.' },
      { from: 'bot', text: 'Which city are you in?' },
      { from: 'user', text: 'Pune' }
    ]
  },
  {
    name: 'Rahul K.',
    phone: '+91 94235 63219',
    city: '',
    interest: 'No response',
    batch_preference: '',
    intent_score: 'Low',
    status: 'archived',
    source: 'Telegram',
    creative_source: 'Via Creative A',
    conversation_transcript: [
      { from: 'bot', text: 'Which dance style interests you?' }
    ]
  }
];

export default function LeadsTab({ profile }: LeadsTabProps) {
  const navigate = useNavigate();
  const seededRef = React.useRef(false);
  const [leadsList, setLeadsList] = useState<VisualLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'All' | 'High Intent' | 'Follow Up'>('All');
  const [nudgeSent, setNudgeSent] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    const fetchOrSeedLeads = async () => {
      // Prevent double seeding in React strict mode
      if (seededRef.current) return;
      seededRef.current = true;

      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      const user = session.user;

      // Check if user already has leads
      const { count, error: countError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!countError && count && count > 0) {
        // User already has leads — just fetch them
        const { data: existingLeads } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (existingLeads) {
          mapAndSetLeads(existingLeads);
          setNewLeadsCount(
            existingLeads.filter(l => l.intent_score === 'High').length
          );
        }
      } else {
        // No leads exist — seed demo leads
        const leadsToInsert = DEMO_LEADS.map(lead => ({
          user_id: user.id,
          name: lead.name,
          phone: lead.phone,
          city: lead.city,
          interest: lead.interest,
          batch_preference: lead.batch_preference,
          intent_score: lead.intent_score,
          status: lead.status,
          source: lead.source,
          telegram_chat_id: null,
          conversation_transcript: lead.conversation_transcript
        }));

        const { data: seededLeads, error: seedError } = await supabase
          .from('leads')
          .insert(leadsToInsert)
          .select();

        if (!seedError && seededLeads) {
          mapAndSetLeads(seededLeads);
          setNewLeadsCount(
            seededLeads.filter(l => l.intent_score === 'High').length
          );
        }
      }

      setLoading(false);
    };

    fetchOrSeedLeads();
  }, []);

  const mapAndSetLeads = (leads: any[]) => {
    const mapped: VisualLead[] = leads.map(lead => {
      const intentMap: { [key: string]: 'High' | 'Medium' | 'Archived' } = {
        'High': 'High',
        'Medium': 'Medium',
        'Low': 'Archived',
        'Archived': 'Archived'
      };

      const isFollowUp = lead.status === 'following_up';

      return {
        id: lead.id,
        name: lead.name || 'Unknown',
        intent: intentMap[lead.intent_score] || 'Medium',
        danceStyle: lead.interest || 'Not specified',
        batchPreference: lead.batch_preference || '',
        city: lead.city || '',
        source: 'Via Telegram',
        timeAgo: lead.created_at ? getTimeAgo(lead.created_at) : 'Recently',
        initials: getInitials(lead.name || 'UN'),
        statusTag: isFollowUp ? 'Follow up due' : undefined,
        phone: lead.phone,
        conversationTranscript: lead.conversation_transcript,
        createdAt: lead.created_at
      };
    });
    setLeadsList(mapped);
  };

  const filteredLeads = leadsList.filter(lead => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'High Intent') return lead.intent === 'High';
    if (activeFilter === 'Follow Up') return lead.intent === 'Medium';
    return true;
  });

  const handleSendNudge = () => {
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <span className="h-6 w-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-400 font-medium">Loading your leads...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 font-sans">

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['All', 'High Intent', 'Follow Up'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              activeFilter === filter
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'bg-white text-gray-500 border border-[#F0F0EE] hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* New lead alert banner */}
      <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl p-3 flex items-center gap-2.5 shadow-xs">
        <div className="p-1.5 bg-[#4F46E5]/10 text-[#4F46E5] rounded-lg shrink-0">
          <Zap size={15} className="fill-[#4F46E5]" strokeWidth={2.5} />
        </div>
        <p className="text-[11px] font-bold text-indigo-950 font-sans tracking-tight">
          {newLeadsCount} high intent leads in your pipeline
        </p>
      </div>

      {/* Lead Cards */}
      <div className="flex flex-col gap-3">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#F0F0EE] p-6 text-center">
            <p className="text-xs text-gray-400 font-medium">No leads in this category yet</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            let leftBorderColor = 'border-l-gray-400';
            let dotColor = 'bg-gray-400';
            let badgeStyle = 'bg-gray-100 text-gray-600 border border-gray-200';
            let cardStyle = 'bg-white border border-[#F0F0EE] shadow-xs rounded-xl p-4 flex flex-col gap-2.5 transition-all relative';

            if (lead.intent === 'High') {
              leftBorderColor = 'border-l-emerald-500';
              dotColor = 'bg-emerald-500';
              badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            } else if (lead.intent === 'Medium') {
              leftBorderColor = 'border-l-[#F59E0B]';
              dotColor = 'bg-[#F59E0B]';
              badgeStyle = 'bg-amber-50 text-amber-700 border border-amber-100';
            }

            if (lead.intent === 'Archived') {
              cardStyle += ' opacity-60 grayscale-[15%]';
            }

            return (
              <div
                key={lead.id}
                onClick={() => navigate('/lead-detail', { state: { lead } })}
                className={`${cardStyle} border-l-4 ${leftBorderColor} hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] font-bold text-xs uppercase flex items-center justify-center font-display shrink-0 shadow-xs">
                      {lead.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900 font-sans">{lead.name}</span>
                        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {lead.danceStyle}
                        {lead.batchPreference ? ` • ${lead.batchPreference}` : ''}
                        {lead.city ? ` • ${lead.city}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${badgeStyle} font-display tracking-wider`}>
                    {lead.intent}
                  </span>
                </div>

                <div className="flex items-center gap-2 border-t border-[#F0F0EE]/60 pt-2 text-[10px]">
                  <span className="bg-slate-50 border border-slate-100 text-gray-400 font-semibold px-2 py-0.5 rounded-md">
                    {lead.source}
                  </span>
                  <span className="bg-slate-50 border border-slate-100 text-gray-400 font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock size={10} className="text-gray-400" />
                    {lead.timeAgo}
                  </span>
                  {lead.statusTag && (
                    <span className="bg-amber-50 border border-amber-100 text-[#F59E0B] font-bold px-2 py-0.5 rounded-md ml-auto text-[9px] uppercase tracking-wider">
                      {lead.statusTag}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Follow up reminder banner */}
      {leadsList.some(l => l.intent === 'Medium') && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xs mt-2">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg mt-0.5 shrink-0">
              <Clock size={15} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-950 font-display uppercase tracking-wider leading-none">
                Inquiry Pending
              </p>
              <p className="text-[10px] text-amber-900 mt-1 leading-snug font-medium font-sans">
                {leadsList.find(l => l.intent === 'Medium')?.name} has not replied in 24 hours. Send a nudge.
              </p>
            </div>
          </div>
          {nudgeSent ? (
            <button className="bg-emerald-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shrink-0">
              <Check size={11} strokeWidth={3} />
              <span>Sent</span>
            </button>
          ) : (
            <button
              onClick={handleSendNudge}
              className="bg-[#F59E0B] hover:bg-amber-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all font-sans shrink-0 cursor-pointer shadow-sm"
            >
              Send nudge
            </button>
          )}
        </div>
      )}

    </div>
  );
}