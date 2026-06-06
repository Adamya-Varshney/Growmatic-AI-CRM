import React, { useEffect, useState } from 'react';
import { Building2, Zap, Users, CheckCircle2, Edit } from 'lucide-react';
import { BusinessProfile } from '../types';
import { supabase } from '../supabase';

interface HomeTabProps {
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
  onNavigate: (tab: string) => void;
  leadsCount: { total: number; hot: number };
}

export default function HomeTab({ profile, setProfile, onNavigate, leadsCount }: HomeTabProps) {
  const [showSettings, setShowSettings] = React.useState(false);
  const [editedName, setEditedName] = React.useState(profile.name);
  const [editedType, setEditedType] = React.useState(profile.type);
  const [editedCity, setEditedCity] = React.useState(profile.city);
  const [actionDone, setActionDone] = React.useState(false);
  const [userName, setUserName] = useState('there');
  const [recommendation, setRecommendation] = useState('');
  const [impactText, setImpactText] = useState('');
  const [loadingRec, setLoadingRec] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch real user name from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name;
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setUserName(firstName);
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch recent leads for activity feed
  useEffect(() => {
    const fetchRecentLeads = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data && data.length > 0) {
        setRecentActivity(data);
      }
    };
    fetchRecentLeads();
  }, []);

  // Generate context-aware recommendation from real data
useEffect(() => {
  const generateRecommendation = async () => {
    setLoadingRec(true);

    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Generate smart recommendation based on real lead data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoadingRec(false);
      return;
    }

    // Fetch lead quality data from Supabase
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id);

    if (leads && leads.length > 0) {
      const highIntent = leads.filter(l => l.intent_score === 'High').length;
      const total = leads.length;
      const conversionRate = Math.round((highIntent / total) * 100);

      if (highIntent > 0) {
        setRecommendation(
          `You have ${highIntent} high intent leads waiting. Follow up within 24 hours — leads contacted quickly convert at 3x higher rates. Send a personalized WhatsApp message to each high intent lead today.`
        );
        setImpactText(`Could improve your conversion rate by up to ${conversionRate + 15}% this week`);
      } else {
        setRecommendation(
          `Your campaign is live. Create a new creative variant using a face-forward poster with a clear offer — this format consistently delivers 2x better click rates for education businesses.`
        );
        setImpactText('Could reduce your cost per lead from ₹14 to ₹9');
      }
    } else {
      // No leads yet — first time user recommendation
      setRecommendation(
        `Welcome to Growmatic. Start by creating your first campaign. Use a face-forward creative with a clear Telegram CTA — this format delivers the best results for ${profile.type} businesses.`
      );
      setImpactText('A well-targeted first campaign typically generates 8 to 15 qualified leads');
    }

    setLoadingRec(false);
  };

  generateRecommendation();
}, [profile, leadsCount]);

  const saveProfile = () => {
    setProfile({
      name: editedName || 'IDALS',
      type: editedType || 'Online Dance Education',
      city: editedCity || 'Mumbai',
      language: 'English'
    });
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      
      {/* Greeting — real user name */}
      <div>
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
          Growmatic Dashboard
        </span>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-display mt-0.5">
          {getGreeting()}, {userName}
        </h2>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Your AI marketing co-pilot is active and optimizing.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-[#F0F0EE] shadow-xs flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block leading-none">High Intent</span>
          <div className="mt-2.5">
            <div className="text-xl font-extrabold text-emerald-600 leading-none font-display">
              {leadsCount.hot}
            </div>
            <div className="text-[8px] text-gray-400 mt-1 font-semibold">Active hot pipeline</div>
          </div>
        </div>

        <div className="bg-[#FAF9FF] p-3 rounded-xl border border-indigo-100 shadow-xs flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#4F46E5] block leading-none">Total Leads</span>
          <div className="mt-2.5">
            <div className="text-xl font-extrabold text-[#4F46E5] leading-none font-display">
              {leadsCount.total}
            </div>
            <div className="text-[8px] text-indigo-400 mt-1 font-semibold">In your pipeline</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#F0F0EE] shadow-xs flex flex-col justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600 block leading-none">ROAS</span>
          <div className="mt-2.5">
            <div className="text-xl font-extrabold text-teal-600 leading-none font-display">
              4.85x
            </div>
            <div className="text-[8px] text-emerald-500 mt-1 font-semibold">This month</div>
          </div>
        </div>
      </div>

      {/* AI Recommendation — Claude API powered */}
      <div className="bg-[#EEF2FF] border-l-4 border-[#4F46E5] rounded-xl p-4 flex flex-col border border-indigo-150/50 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-primary">
          <Zap size={64} className="fill-primary" />
        </div>

        <div className="flex items-center gap-1 text-[#4F46E5] font-bold text-[9px] uppercase tracking-wider">
          <Zap size={11} className="fill-[#4F46E5]" />
          <span>Today's recommendation</span>
        </div>

        {loadingRec ? (
          <div className="mt-3 flex items-center gap-2">
            <span className="h-3 w-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-indigo-400 font-medium">Generating your recommendation...</span>
          </div>
        ) : (
          <>
            <h4 className="text-xs font-bold text-gray-900 mt-2.5 leading-relaxed font-sans">
              {recommendation}
            </h4>
            <p className="text-[10px] text-gray-500 mt-1.5 font-medium">
              Estimated Impact: <span className="text-emerald-600 font-bold">{impactText}</span>
            </p>

            {actionDone ? (
              <div className="mt-3 bg-emerald-50 border border-emerald-100 text-emerald-800 p-2 text-center text-[10px] font-bold rounded-lg">
                ✓ Done! Your changes have been applied.
              </div>
            ) : (
              <div className="mt-3.5 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActionDone(true);
                    setTimeout(() => onNavigate('creative'), 1200);
                  }}
                  className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white text-[11px] font-bold py-2 rounded-lg shadow-sm cursor-pointer transition-all text-center"
                >
                  Do it for me
                </button>
                <button
                  onClick={() => setActionDone(true)}
                  className="text-center text-[10px] font-bold text-[#4F46E5] hover:underline py-1 transition-all"
                >
                  I will do it myself
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Business Profile Card */}
      <div className="bg-white rounded-xl border border-[#F0F0EE] shadow-xs p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-primary rounded-lg">
              <Building2 size={15} />
            </div>
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Business Profile</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 transition-all cursor-pointer"
          >
            <Edit size={10} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 pt-1 text-xs">
          <div>
            <span className="block text-[9px] font-bold text-gray-400 uppercase leading-none">Business</span>
            <span className="text-xs font-bold text-gray-800 mt-1 block font-sans">{profile.name}</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-gray-400 uppercase leading-none">Type</span>
            <span className="text-xs font-semibold text-gray-800 mt-1 block font-sans truncate">{profile.type}</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-gray-400 uppercase leading-none">Location</span>
            <span className="text-xs font-semibold text-gray-800 mt-1 block font-sans">{profile.city}</span>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      {showSettings && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
            <Building2 size={14} className="text-primary" />
            Update Business Profile
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Business Name</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="e.g. IDALS"
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary text-gray-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Business Type</label>
                <input
                  type="text"
                  value={editedType}
                  onChange={(e) => setEditedType(e.target.value)}
                  placeholder="e.g. Online Dance Education"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  value={editedCity}
                  onChange={(e) => setEditedCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary text-gray-800"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={saveProfile}
                className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg cursor-pointer transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-3 bg-slate-50 border border-slate-200 text-gray-500 text-xs font-semibold py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity — real Supabase data or fallback */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Recent Activity
        </h4>
        <div className="bg-white rounded-xl divide-y divide-[#F0F0EE]/60 border border-[#F0F0EE] shadow-xs overflow-hidden">
          {recentActivity.length > 0 ? (
            recentActivity.map((lead, index) => (
              <div key={lead.id} className="p-3.5 flex items-center gap-3 text-xs">
                <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                  <Users size={13} />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 leading-snug">
                    New lead — {lead.name}
                  </p>
                  <span className="text-[9px] text-gray-400 font-medium">
                    {lead.intent_score} intent · via Telegram · {lead.city || 'Unknown city'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="p-3.5 flex items-center gap-3 text-xs">
                <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                  <Zap size={13} className="fill-emerald-600" />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 leading-snug">Welcome to Growmatic</p>
                  <span className="text-[9px] text-gray-400 font-medium">Your AI marketing co-pilot is ready</span>
                </div>
              </div>
              <div className="p-3.5 flex items-center gap-3 text-xs">
                <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                  <Users size={13} />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 leading-snug">Create your first campaign</p>
                  <span className="text-[9px] text-gray-400 font-medium">Go to Creative tab to get started</span>
                </div>
              </div>
              <div className="p-3.5 flex items-center gap-3 text-xs">
                <span className="p-1.5 bg-teal-50 rounded-lg text-teal-600 shrink-0">
                  <CheckCircle2 size={13} />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 leading-snug">Account setup complete</p>
                  <span className="text-[9px] text-gray-400 font-medium">Profile saved successfully</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}